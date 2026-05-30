/**
 * Main CLI setup and command registration using Yargs.
 */

import yargs, { type Argv } from "yargs";
import { hideBin } from "yargs/helpers";
import { EventBusService } from "../events";
import { loadConfig } from "../utils/config";
import { resolveStorePath } from "../utils/paths";
// Commands
import { createConfigCommand } from "./commands/config";
import { createDefaultAction } from "./commands/default";
import { createFetchUrlCommand } from "./commands/fetchUrl";
import { createFindVersionCommand } from "./commands/findVersion";
import { createListCommand } from "./commands/list";
import { createMcpCommand } from "./commands/mcp";
import { createRefreshCommand } from "./commands/refresh";
import { createRemoveCommand } from "./commands/remove";
import { createScrapeCommand } from "./commands/scrape";
import { createSearchCommand } from "./commands/search";
import { createWebCommand } from "./commands/web";
import { createWorkerCommand } from "./commands/worker";
import { applyGlobalCliOutputMode, registerGlobalOutputOptions } from "./output";
import { registerGlobalServices } from "./services";

/**
 * Creates and configures the main CLI program with all commands.
 */

/**
 * Creates and configures the main CLI program with all commands.
 */
export function createCli(argv: string[]): Argv {
  // Global service instances
  let globalEventBus: EventBusService | null = null;

  const cli = registerGlobalOutputOptions(yargs(hideBin(argv)))
    .scriptName("docs-mcp-server")
    .strict()
    .usage("Usage: $0 <command> [options]")
    .version(__APP_VERSION__)
    // Global Options
    .option("verbose", {
      type: "boolean",
      description: "Enable verbose (debug) logging",
      default: false,
    })
    .option("quiet", {
      type: "boolean",
      description: "Disable all logging except errors",
      default: false,
      alias: ["silent"],
    })
    .option("store-path", {
      type: "string",
      description: "Custom path for data storage directory",
      alias: "storePath",
    })
    .option("config", {
      type: "string",
      description: "Path to configuration file",
    })
    .option("logo", {
      type: "boolean",
      description: "Show ASCII art logo on startup",
      default: true,
    })
    // Middleware for Global Setup (similar to preAction)
    .middleware(async (argv) => {
      // 0. Validate Options
      if (argv.verbose && argv.quiet) {
        throw new Error("Arguments verbose and quiet are mutually exclusive");
      }

      // 1. Load Config & Resolve Paths
      const rawStorePath = (argv.storePath as string) || process.env.DOCS_MCP_STORE_PATH;
      const resolvedStorePath = resolveStorePath(rawStorePath);

      // Mutate argv to use resolved path
      argv.storePath = resolvedStorePath;

      const appConfig = loadConfig(argv, {
        configPath: argv.config as string,
        searchDir: resolvedStorePath,
      });

      // 2. Setup Logging
      applyGlobalCliOutputMode({
        verbose: argv.verbose as boolean,
        quiet: argv.quiet as boolean,
      });

      // 3. Init Services
      if (!globalEventBus) {
        globalEventBus = new EventBusService();
      }

      // 4. Attach to argv context
      // This makes global services available to all commands
      argv._eventBus = globalEventBus;
    })
    .alias("help", "h")
    .showHelpOnFail(true);

  // Register Commands
  createConfigCommand(cli);
  createDefaultAction(cli);
  createFetchUrlCommand(cli);
  createFindVersionCommand(cli);
  createListCommand(cli);
  createMcpCommand(cli);
  createRefreshCommand(cli);
  createRemoveCommand(cli);
  createScrapeCommand(cli);
  createSearchCommand(cli);
  createWebCommand(cli);
  createWorkerCommand(cli);

  return cli;
}
