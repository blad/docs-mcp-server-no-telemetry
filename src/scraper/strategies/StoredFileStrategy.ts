import fs from "node:fs/promises";
import path from "node:path";
import type { AppConfig } from "../../utils/config";
import { logger } from "../../utils/logger";
import { MimeTypeUtils } from "../../utils/mimeTypeUtils";
import { resolveStorePath } from "../../utils/paths";
import { FileFetcher } from "../fetcher";
import { FetchStatus, type RawContent } from "../fetcher/types";
import { PipelineFactory } from "../pipelines/PipelineFactory";
import type { ContentPipeline, PipelineResult } from "../pipelines/types";
import type { QueueItem, ScraperOptions } from "../types";
import { BaseScraperStrategy, type ProcessItemResult } from "./BaseScraperStrategy";

/**
 * StoredFileStrategy handles indexing of files uploaded via the web UI.
 *
 * Files are stored under {storePath}/uploads/ and addressed using the private
 * `stored://` URL scheme (e.g. `stored:///1234567890-readme.md`). This scheme
 * is never exposed to end users — it is only generated internally by the upload
 * route and consumed here.
 */
export class StoredFileStrategy extends BaseScraperStrategy {
  private readonly uploadsDir: string;
  private readonly pipelines: ContentPipeline[];
  private readonly fileFetcher: FileFetcher;

  constructor(config: AppConfig) {
    super(config);
    this.uploadsDir = path.join(resolveStorePath(config.app.storePath), "uploads");
    this.pipelines = PipelineFactory.createStandardPipelines(config);
    this.fileFetcher = new FileFetcher(config.scraper);
  }

  canHandle(url: string): boolean {
    return url.startsWith("stored://");
  }

  async processItem(
    item: QueueItem,
    options: ScraperOptions,
    _signal?: AbortSignal,
  ): Promise<ProcessItemResult> {
    // Extract filename from stored:///filename path
    const parsed = new URL(item.url);
    const filename = parsed.pathname.slice(1); // strip leading "/"

    if (!filename) {
      logger.warn(`⚠️  Invalid stored:// URL (no filename): ${item.url}`);
      return { url: item.url, links: [], status: FetchStatus.NOT_FOUND };
    }

    const filePath = path.join(this.uploadsDir, filename);

    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      logger.warn(`⚠️  Uploaded file not found: ${filePath}`);
      return { url: item.url, links: [], status: FetchStatus.NOT_FOUND };
    }

    const mimeType =
      MimeTypeUtils.detectMimeTypeFromPath(filename) || "application/octet-stream";

    const rawContent: RawContent = {
      source: item.url,
      content: fileBuffer,
      mimeType,
      status: FetchStatus.SUCCESS,
      lastModified: new Date().toISOString(),
      etag: undefined,
    };

    let processed: PipelineResult | undefined;
    for (const pipeline of this.pipelines) {
      if (pipeline.canProcess(rawContent.mimeType, rawContent.content)) {
        logger.debug(
          `Selected ${pipeline.constructor.name} for content type "${mimeType}" (${filename})`,
        );
        processed = await pipeline.process(rawContent, options, this.fileFetcher);
        break;
      }
    }

    if (!processed) {
      logger.warn(
        `⚠️  Unsupported content type "${mimeType}" for uploaded file ${filename}. Skipping.`,
      );
      return { url: item.url, links: [], status: FetchStatus.SUCCESS };
    }

    for (const err of processed.errors ?? []) {
      logger.warn(`⚠️  Processing error for ${filename}: ${err.message}`);
    }

    const title = processed.title?.trim() || path.basename(filename) || null;

    return {
      url: item.url,
      title,
      sourceContentType: mimeType,
      contentType: processed.contentType || mimeType,
      content: processed,
      links: [],
      status: FetchStatus.SUCCESS,
    };
  }

  async cleanup(): Promise<void> {
    await Promise.allSettled(this.pipelines.map((p) => p.close()));
  }
}
