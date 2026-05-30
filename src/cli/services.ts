import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppServer } from "../app";
import type { IPipeline } from "../pipeline";
import type { IDocumentManagement } from "../store/trpc/interfaces";

// Module-level variables for active services
let activeAppServer: AppServer | null = null;
let activeMcpStdioServer: McpServer | null = null;
let activeDocService: IDocumentManagement | null = null;
let activePipelineManager: IPipeline | null = null;

export interface GlobalServices {
  appServer?: AppServer;
  mcpStdioServer?: McpServer;
  docService?: IDocumentManagement;
  pipeline?: IPipeline;
}

/**
 * Registers global services for shutdown handling
 */
export function registerGlobalServices(services: GlobalServices): void {
  if (services.appServer) activeAppServer = services.appServer;
  if (services.mcpStdioServer) activeMcpStdioServer = services.mcpStdioServer;
  if (services.docService) activeDocService = services.docService;
  if (services.pipeline) activePipelineManager = services.pipeline;
}

export function getActiveAppServer(): AppServer | null {
  return activeAppServer;
}

export function setActiveAppServer(server: AppServer | null): void {
  activeAppServer = server;
}

export function getActiveMcpStdioServer(): McpServer | null {
  return activeMcpStdioServer;
}

export function setActiveMcpStdioServer(server: McpServer | null): void {
  activeMcpStdioServer = server;
}

export function getActiveDocService(): IDocumentManagement | null {
  return activeDocService;
}

export function setActiveDocService(service: IDocumentManagement | null): void {
  activeDocService = service;
}

export function getActivePipelineManager(): IPipeline | null {
  return activePipelineManager;
}

export function setActivePipelineManager(pipeline: IPipeline | null): void {
  activePipelineManager = pipeline;
}
