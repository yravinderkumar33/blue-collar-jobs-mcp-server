#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Sample data store
const notes: Record<string, { content: string; created: Date }> = {};
const todos: Array<{ id: number; task: string; completed: boolean }> = [];
let nextTodoId = 1;

// Create server instance
const server = new Server(
  {
    name: "sample-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
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
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_note": {
      const { title, content } = args as { title: string; content: string };
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
      const { task } = args as { task: string };
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
      const { id } = args as { id: number };
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
      const { location } = args as { location: string };
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
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
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
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
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
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sample MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});