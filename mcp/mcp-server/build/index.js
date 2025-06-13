#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const jobs_api_1 = require("./api/jobs-api");
const index_1 = require("./resources/index");
const index_2 = require("./tools/index");
const index_3 = require("./prompts/index");
async function main() {
    // Initialize the Jobs API client
    const jobsAPI = new jobs_api_1.JobsAPI(process.env.BACKEND_URL || 'http://localhost:6000');
    // Create the MCP server
    const server = new mcp_js_1.McpServer({
        name: "blue-collar-jobs-mcp",
        version: "1.0.0"
    });
    // Register all components
    console.error("Registering MCP server components...");
    // Resources - for browsing data
    (0, index_1.registerResources)(server, jobsAPI);
    console.error("✓ Resources registered");
    // Tools - for taking actions
    (0, index_2.registerTools)(server, jobsAPI);
    console.error("✓ Tools registered");
    // Prompts - for reusable templates
    (0, index_3.registerPrompts)(server);
    console.error("✓ Prompts registered");
    // Connect to stdio transport
    const transport = new stdio_js_1.StdioServerTransport();
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
