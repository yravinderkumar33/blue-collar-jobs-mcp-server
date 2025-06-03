#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
// Sample data store
const notes = {};
const todos = [];
let nextTodoId = 1;
// Create server instance
const server = new index_js_1.Server({
    name: "sample-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        tools: [
            {
                name: "create_note",
                description: "Create a new note with given content",
                inputSchema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "Title of the note",
                        },
                        content: {
                            type: "string",
                            description: "Content of the note",
                        },
                    },
                    required: ["title", "content"],
                },
            },
            {
                name: "list_notes",
                description: "List all available notes",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "add_todo",
                description: "Add a new todo item",
                inputSchema: {
                    type: "object",
                    properties: {
                        task: {
                            type: "string",
                            description: "The task to add to the todo list",
                        },
                    },
                    required: ["task"],
                },
            },
            {
                name: "complete_todo",
                description: "Mark a todo item as completed",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "ID of the todo item to complete",
                        },
                    },
                    required: ["id"],
                },
            },
            {
                name: "get_weather",
                description: "Get current weather for a location (mock implementation)",
                inputSchema: {
                    type: "object",
                    properties: {
                        location: {
                            type: "string",
                            description: "City name to get weather for",
                        },
                    },
                    required: ["location"],
                },
            },
        ],
    };
}));
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, arguments: args } = request.params;
    switch (name) {
        case "create_note": {
            const { title, content } = args;
            notes[title] = {
                content,
                created: new Date(),
            };
            return {
                content: [
                    {
                        type: "text",
                        text: `Note "${title}" created successfully!`,
                    },
                ],
            };
        }
        case "list_notes": {
            const noteList = Object.keys(notes).map(title => {
                const note = notes[title];
                return `• ${title} (created: ${note.created.toLocaleString()})`;
            });
            return {
                content: [
                    {
                        type: "text",
                        text: noteList.length > 0
                            ? `Available notes:\n${noteList.join('\n')}`
                            : "No notes available.",
                    },
                ],
            };
        }
        case "add_todo": {
            const { task } = args;
            const todo = {
                id: nextTodoId++,
                task,
                completed: false,
            };
            todos.push(todo);
            return {
                content: [
                    {
                        type: "text",
                        text: `Todo added: "${task}" (ID: ${todo.id})`,
                    },
                ],
            };
        }
        case "complete_todo": {
            const { id } = args;
            const todo = todos.find(t => t.id === id);
            if (!todo) {
                throw new Error(`Todo with ID ${id} not found`);
            }
            todo.completed = true;
            return {
                content: [
                    {
                        type: "text",
                        text: `Todo "${todo.task}" marked as completed!`,
                    },
                ],
            };
        }
        case "get_weather": {
            const { location } = args;
            // Mock weather data
            const weatherConditions = ["sunny", "cloudy", "rainy", "snowy"];
            const temp = Math.floor(Math.random() * 30) + 10; // 10-40°C
            const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
            return {
                content: [
                    {
                        type: "text",
                        text: `Weather in ${location}: ${temp}°C, ${condition}`,
                    },
                ],
            };
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}));
// List available resources
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        resources: [
            {
                uri: "notes://all",
                mimeType: "application/json",
                name: "All Notes",
                description: "Collection of all stored notes",
            },
            {
                uri: "todos://list",
                mimeType: "application/json",
                name: "Todo List",
                description: "Current todo list with completion status",
            },
        ],
    };
}));
// Handle resource reads
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { uri } = request.params;
    switch (uri) {
        case "notes://all":
            return {
                contents: [
                    {
                        uri,
                        mimeType: "application/json",
                        text: JSON.stringify(notes, null, 2),
                    },
                ],
            };
        case "todos://list":
            return {
                contents: [
                    {
                        uri,
                        mimeType: "application/json",
                        text: JSON.stringify(todos, null, 2),
                    },
                ],
            };
        default:
            throw new Error(`Unknown resource: ${uri}`);
    }
}));
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
        console.error("Sample MCP Server running on stdio");
    });
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
