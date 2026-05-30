import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ListLibrariesTool } from "../../tools/ListLibrariesTool";
import type { SearchTool } from "../../tools/SearchTool";
import { ValidationError } from "../../tools/errors";
import { logger } from "../../utils/logger";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";

/**
 * Registers the standalone search/retrieval page.
 * GET  /search       — full page with library dropdown and query form
 * POST /search/results — HTMX partial; runs the query and returns result cards
 */
export function registerSearchRoute(
  server: FastifyInstance,
  searchTool: SearchTool,
  listLibrariesTool: ListLibrariesTool,
): void {
  // Full page
  server.get("/search", async (_request, reply) => {
    reply.type("text/html");
    try {
      const { libraries } = await listLibrariesTool.execute();
      const libraryNames = libraries.map((lib) => lib.name);

      return (
        "<!DOCTYPE html>" +
        (
          <Layout title="MCP Docs – Search">
            <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Search Documentation
            </h2>
            <SearchForm libraries={libraryNames} />
            <div id="search-results" class="mt-6" />
          </Layout>
        )
      );
    } catch (error) {
      logger.error(`❌ Failed to load search page: ${error}`);
      reply.status(500);
      return (
        "<!DOCTYPE html>" +
        (
          <Layout title="MCP Docs – Search">
            <Alert type="error" title="Error:" message="Failed to load library list." />
          </Layout>
        )
      );
    }
  });

  // HTMX partial — returns only the results fragment
  server.post(
    "/search/results",
    async (
      request: FastifyRequest<{
        Body: {
          library?: string;
          version?: string;
          query?: string;
          limit?: string;
        };
      }>,
      reply,
    ) => {
      reply.type("text/html");
      try {
        const library = request.body.library?.trim() ?? "";
        const version = request.body.version?.trim() || undefined;
        const query = request.body.query?.trim() ?? "";
        const limit = request.body.limit ? Number.parseInt(request.body.limit, 10) : 5;

        const { results } = await searchTool.execute({ library, version, query, limit });
        return <SearchResults results={results} />;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.error(`❌ Search failed: ${error}`);
        reply.status(error instanceof ValidationError ? 400 : 500);
        return <Alert type="error" title="Search error:" message={<span safe>{message}</span>} />;
      }
    },
  );
}
