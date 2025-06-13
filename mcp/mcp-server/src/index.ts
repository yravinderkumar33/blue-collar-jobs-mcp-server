#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { JobsAPI } from './api/jobs-api';
import { registerResources } from './resources/index';
import { registerTools } from './tools/index';
import { registerPrompts } from './prompts/index';

async function main() {
  // Initialize the Jobs API client
  const jobsAPI = new JobsAPI(process.env.BACKEND_URL || 'http://localhost:6000');

  // Create the MCP server
  const server = new McpServer({
    name: "blue-collar-jobs-mcp",
    version: "1.0.0"
  });

  // Register all components
  console.error("Registering MCP server components...");
  
  // Resources - for browsing data
  registerResources(server, jobsAPI);
  console.error("✓ Resources registered");

  // Tools - for taking actions
  registerTools(server, jobsAPI);
  console.error("✓ Tools registered");

  // Prompts - for reusable templates
  registerPrompts(server);
  console.error("✓ Prompts registered");

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  
  console.error("Starting Blue-Collar Jobs MCP Server...");
  console.error("Server capabilities:");
  console.error("- Resources: API status, job listings, job categories");
  console.error("- Tools: search-jobs, get-job-details, apply-for-job, job-application-guide");
  console.error("- Prompts: blue-collar-assistant, interview-prep, career-development");
  console.error("Backend API: http://localhost:6000");
  console.error("Server ready and waiting for connections...");

  await server.connect(transport);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error("\nShutting down Blue-Collar Jobs MCP Server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("\nShutting down Blue-Collar Jobs MCP Server...");
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
}); 