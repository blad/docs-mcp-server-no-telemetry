import fs from "node:fs/promises";
import path from "node:path";
import type { FastifyInstance } from "fastify";
import type { ScrapeTool } from "../../../tools/ScrapeTool";
import { ValidationError } from "../../../tools/errors";
import type { AppConfig } from "../../../utils/config";
import { logger } from "../../../utils/logger";
import { resolveStorePath } from "../../../utils/paths";
import AddJobButton from "../../components/AddJobButton";
import Alert from "../../components/Alert";

/**
 * Registers the file upload route for indexing local files.
 * Accepts multipart/form-data with a single file and library metadata.
 * Uploaded files are stored in {storePath}/uploads/ and processed via the
 * internal `stored://` URL scheme — no file:// paths are used.
 *
 * Not supported when using an external worker: the uploads directory exists on
 * the web server's filesystem, which a remote worker cannot access.
 */
export function registerUploadJobRoute(
  server: FastifyInstance,
  scrapeTool: ScrapeTool,
  appConfig: AppConfig,
  externalWorkerUrl?: string,
): void {
  server.post("/web/jobs/upload", async (request, reply) => {
    reply.type("text/html");

    if (externalWorkerUrl) {
      reply.status(400);
      return (
        <Alert
          type="error"
          title="Not supported:"
          message="File upload is not available when using an external worker."
        />
      );
    }

    try {
      let fileBuffer: Buffer | undefined;
      let fileName = "upload";
      const fields: Record<string, string> = {};

      // Iterate all parts: collect file buffer and text fields
      for await (const part of request.parts()) {
        if (part.type === "file") {
          fileBuffer = await part.toBuffer();
          fileName = part.filename || "upload";
        } else {
          fields[part.fieldname] = part.value as string;
        }
      }

      const library = fields.library?.trim();
      const rawVersion = fields.version?.trim();

      if (!fileBuffer || fileBuffer.length === 0) {
        reply.status(400);
        return <Alert type="error" title="Validation Error:" message="No file was uploaded." />;
      }

      if (!library) {
        reply.status(400);
        return (
          <Alert type="error" title="Validation Error:" message="Library Name is required." />
        );
      }

      // Save to {storePath}/uploads/ — a known, stable location the scraper trusts
      const uploadsDir = path.join(resolveStorePath(appConfig.app.storePath), "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Sanitize filename: keep alphanumeric, dots, dashes, underscores
      const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
      const storedFilename = `${Date.now()}-${safeName}`;
      await fs.writeFile(path.join(uploadsDir, storedFilename), fileBuffer);

      const normalizedVersion =
        !rawVersion || rawVersion.toLowerCase() === "latest" ? null : rawVersion;

      // Use the internal stored:// scheme — no file:// URLs
      const result = await scrapeTool.execute({
        url: `stored:///${storedFilename}`,
        library,
        version: normalizedVersion,
        waitForCompletion: false,
      });

      if ("jobId" in result) {
        const versionDisplay = normalizedVersion || "latest";
        reply.header(
          "HX-Trigger",
          JSON.stringify({
            toast: {
              message: `Indexing started for ${library}@${versionDisplay}`,
              type: "success",
            },
          }),
        );
        return <AddJobButton />;
      }

      return <Alert type="warning" message="Job finished unexpectedly quickly." />;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(`❌ Upload job submission failed: ${error}`);

      if (error instanceof ValidationError) {
        reply.status(400);
      } else {
        reply.status(500);
      }

      return (
        <Alert
          type="error"
          title="Error:"
          message={<span safe>{errorMessage}</span>}
        />
      );
    }
  });
}
