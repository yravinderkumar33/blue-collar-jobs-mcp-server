import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { JobsAPI } from '../api/jobs-api';

export function registerResources(server: McpServer, jobsAPI: JobsAPI) {

  // Sample Job Listings Resource - Provides recent job postings
  server.resource(
    "job-listings",
    "blue-collar://job-listings",
    { description: "Recent job listings from the blue-collar jobs platform" },
    async () => {
      try {

        const response = await jobsAPI.searchJobs({
          filters: {},
          options: {}
        });

        const jobs = response.result.jobs;

        if (jobs.length === 0) {
          return {
            contents: [{
              uri: "blue-collar://job-listings",
              mimeType: "text/plain",
              text: "No jobs found in the database. Please add some job postings first."
            }]
          };
        }

        const content =`
# Recent Blue-Collar Job Listings
Found ${jobs.length} recent job postings:
---
Jobs:
${JSON.stringify(jobs)}
---
Last updated: ${new Date().toLocaleString()}
`;

        return {
          contents: [{
            uri: "blue-collar://job-listings",
            mimeType: "text/markdown",
            text: content
          }]
        };

      } catch (error) {
        console.error('Error fetching job listings resource:', error);
        return {
          contents: [{
            uri: "blue-collar://job-listings",
            mimeType: "text/plain",
            text: `❌ Error fetching job listings: ${error instanceof Error ? error.message : 'Unknown error'}`
          }]
        };
      }
    }
  );
} 