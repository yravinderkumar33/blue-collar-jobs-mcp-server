"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTools = registerTools;
const zod_1 = require("zod");
function registerTools(server, jobsAPI) {
    // Search Jobs Tool - Main job search functionality
    server.tool("search-jobs", "Search for all the jobs available in the database", {
        filters: zod_1.z.object({}).optional(),
        options: zod_1.z.object({}).optional()
    }, async ({ filters, options }) => {
        try {
            const searchRequest = { filters: filters || {}, options: options || {} };
            const response = await jobsAPI.searchJobs(searchRequest);
            if (response.result.jobs.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: `No jobs found. Check if there are jobs in the database.`
                        }]
                };
            }
            const resultText = `
      # Job Search Results

Found ${response.result.jobs.length} jobs:

${JSON.stringify(response.result.jobs)}
---
**Tips:**
- Use \`get-job-details\` tool with a specific Job ID to get full job information
- Use \`apply-for-job\` tool to submit applications
- Adjust filters to narrow down results`;
            return {
                content: [{
                        type: "text",
                        text: resultText
                    }]
            };
        }
        catch (error) {
            console.error('Search jobs error:', error);
            return {
                content: [{
                        type: "text",
                        text: `❌ Error searching for jobs: ${error instanceof Error ? error.message : 'Unknown error'}`
                    }]
            };
        }
    });
    // Get Job Details Tool - Detailed view of a specific job
    server.tool("get-job-details", "Get detailed information about a specific job", {
        jobId: zod_1.z.string().describe("The job ID to get detailed information for")
    }, async ({ jobId }) => {
        try {
            // Get job details
            const response = await jobsAPI.getJob(jobId);
            const job = response.result.job;
            const jobDetails = jobsAPI.formatJobForDisplay(job);
            return {
                content: [{
                        type: "text",
                        text: `# Job Details

${jobDetails}

**Next Steps:**
- Use \`apply-for-job\` tool with this Job ID to submit an application
- Use \`search-jobs\` tool to find similar opportunities`
                    }]
            };
        }
        catch (error) {
            console.error('Get job details error:', error);
            return {
                content: [{
                        type: "text",
                        text: `❌ Error getting job details for ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`
                    }]
            };
        }
    });
    // Apply for Job Tool - Submit job application
    server.tool("apply-for-job", "Apply for a specific job", {
        jobId: zod_1.z.string().describe("The job ID to apply for"),
        applicant: zod_1.z.object({
            full_name: zod_1.z.string().describe("Full name of the applicant"),
            phone_number: zod_1.z.string().describe("Phone number with country code (e.g., +91-9876543210)"),
            email: zod_1.z.string().email().describe("Email address of the applicant")
        }).describe("Applicant details")
    }, async ({ jobId, applicant }) => {
        try {
            // Prepare application data
            const application = {
                job_id: jobId,
                applicant,
                status: "PENDING"
            };
            // Submit application
            const response = await jobsAPI.applyForJob(jobId, application);
            const successMessage = `# Application Submitted Successfully! ✅

**Application Details:**
- Application ID: ${response.result.application.application_id}
- Job ID: ${response.result.application.job_id}
- Status: ${response.result.application.status}
- Applied At: ${new Date(response.result.application.applied_at).toLocaleString()}

**Applicant Information:**
- Name: ${applicant.full_name}
- Phone: ${applicant.phone_number}
- Email: ${applicant.email}

**What's Next:**
1. You will receive confirmation at ${applicant.email}
2. The employer will review your application
3. You may be contacted for interview or further steps
4. Keep your phone accessible for potential employer calls

**Tips:**
- Keep your application ID (${response.result.application.application_id}) for reference
- Prepare for potential interview questions
- Research the company and role thoroughly`;
            return {
                content: [{
                        type: "text",
                        text: successMessage
                    }]
            };
        }
        catch (error) {
            console.error('Apply for job error:', error);
            return {
                content: [{
                        type: "text",
                        text: `❌ Error applying for job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`
                    }]
            };
        }
    });
    server.tool("get-application-status", "Get the status of a specific application", {
        applicationId: zod_1.z.string().describe("The application ID to get the status for")
    }, async ({ applicationId }) => {
        const response = await jobsAPI.getApplicationStatus(applicationId);
        return {
            content: [
                {
                    type: "text",
                    text: `The status of application ${applicationId} is ${response.result.application.status}`
                }
            ]
        };
    });
}
