# Model Context Protocol (MCP) Core Concepts

This document explains the core concepts of the Model Context Protocol TypeScript SDK and how they're implemented in your blue-collar jobs MCP server.

## Core Components

### 1. McpServer vs Server
Your current implementation uses the low-level `Server` class, while the modern approach uses the high-level `McpServer` interface.

**Current Implementation (Low-Level):**
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server(
  {
    name: 'blue-collar-jobs-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  }
);

// Manual handler setup
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [searchJobsTool] };
});
```

**Modern Implementation (High-Level):**
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "blue-collar-jobs-mcp",
  version: "1.0.0"
});

// Automatic capability detection and cleaner API
server.tool("search-jobs", /* schema */, /* handler */);
```

### 2. Resources - Data Exposure

Resources are like GET endpoints in a REST API - they provide data but shouldn't perform significant computation or have side effects.

**Your Current Resources:**
- `blue-collar://job-listing` - Provides sample job data and API status

**Resource Pattern:**
```typescript
// Static resource
server.resource(
  "api-status",
  "blue-collar://api-status",
  async () => ({
    contents: [{
      uri: "blue-collar://api-status",
      mimeType: "application/json",
      text: JSON.stringify({ status: "healthy" })
    }]
  })
);

// Dynamic resource with external data
server.resource(
  "job-listings", 
  "blue-collar://job-listings",
  async () => {
    const jobs = await JobsAPI.searchJobs({ request: { limit: 5 } });
    return {
      contents: [{
        uri: "blue-collar://job-listings",
        mimeType: "application/json", 
        text: JSON.stringify(jobs)
      }]
    };
  }
);
```

### 3. Tools - Actions and Computations

Tools let LLMs take actions through your server. Unlike resources, tools are expected to perform computation and have side effects.

**Your Current Tools:**
- `search_jobs` - Searches for jobs with filters and pagination

**Tool Pattern:**
```typescript
// Simple tool
server.tool(
  "search-jobs",
  "Search for blue-collar jobs with optional filters",
  async (args) => {
    const response = await JobsAPI.searchJobs({
      request: {
        filters: args.filters || {},
        limit: args.limit || 50,
        offset: args.offset || 0
      }
    });
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(response.result.jobs, null, 2)
      }]
    };
  }
);

// Tool with validation (modern approach)
server.tool(
  "job-application-guide",
  {
    jobId: z.string().describe("The job ID to get guidance for"),
    profile: z.object({
      experience: z.string().optional(),
      skills: z.array(z.string()).optional()
    }).optional()
  },
  async ({ jobId, profile }) => {
    // Personalized guidance logic
    return { content: [{ type: "text", text: guidance }] };
  }
);
```

### 4. Prompts - Reusable Templates

Prompts are reusable templates that help LLMs interact with your server effectively.

**Your Current Prompts:**
- `blue_collar_assistant` - System prompt for helping job seekers

**Prompt Pattern:**
```typescript
// Basic prompt
server.prompt(
  "blue-collar-assistant",
  "System prompt for helping blue-collar job seekers",
  () => ({
    messages: [{
      role: "system",
      content: {
        type: "text",
        text: "You are a helpful assistant for blue-collar job seekers in India..."
      }
    }]
  })
);

// Parameterized prompt (advanced)
server.prompt(
  "interview-prep",
  { jobTitle: z.string(), experience: z.string().optional() },
  ({ jobTitle, experience }) => ({
    messages: [{
      role: "system", 
      content: {
        type: "text",
        text: `Help prepare for a ${jobTitle} interview. ${experience ? `Candidate has ${experience} experience.` : ''}`
      }
    }]
  })
);
```

## Running Your Server

### Current Working Server
```bash
npm run jobs-mcp
```

### Testing Tools
```bash
npm run test
```

### Key Differences

| Aspect | Current (Low-Level) | Modern (High-Level) |
|--------|-------------------|-------------------|
| Setup | Manual handler registration | Automatic capability detection |
| Type Safety | Manual JSON schemas | Zod schema integration |
| Code Clarity | Verbose request handlers | Clean, functional approach |
| Error Handling | Manual error responses | Built-in error handling |
| Validation | Custom validation logic | Automatic Zod validation |

## Your Server's Capabilities

### Resources Available:
1. **API Status** (`blue-collar://api-status`) - Health check and capabilities
2. **Job Listings** (`blue-collar://job-listings`) - Sample job data

### Tools Available:
1. **search-jobs** - Search jobs with filters (city, state, jobType, experience, skills)
2. **job-application-guide** - Get application guidance for jobs

### Prompts Available:
1. **blue-collar-assistant** - System prompt for job assistance
2. **interview-prep** - Interview preparation guidance

## Data Flow

```
1. LLM calls tool → search-jobs with filters
2. Tool validates parameters
3. Tool calls JobsAPI.searchJobs() → localhost:6000
4. API returns job data
5. Tool formats and returns results to LLM
6. LLM uses data to help user
```

## Your External API Integration

Your server connects to a transformation engine at `localhost:6000` with endpoints:
- `/health` - Health check
- `/api/jobs/search` - Job search with filters

The JobsAPI class handles:
- Health checks before operations
- Error handling for network issues
- Data transformation for MCP responses

## Best Practices Demonstrated

1. **Resource vs Tool Distinction**: Resources for data browsing, tools for actions
2. **Error Handling**: Graceful degradation when API unavailable
3. **Data Formatting**: User-friendly job data presentation
4. **Health Checks**: Proactive API availability checking
5. **Modular Design**: Separated concerns (types, API, resources, tools, prompts)

## Next Steps

1. **Enhance Validation**: Add more robust parameter validation
2. **Add More Tools**: Job application submission, employer contact
3. **Dynamic Resources**: User-specific job recommendations
4. **Enhanced Prompts**: Context-aware prompts based on user location/profile
5. **Caching**: Add caching layer for frequently accessed job data 