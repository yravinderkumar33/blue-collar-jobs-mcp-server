# Jobs MCP Server

A Model Context Protocol (MCP) server for a blue-collar jobs platform. This server provides resources, tools, and prompts to help users search for jobs, view job details, apply for positions, and get career advice.

## Features

### Resources
- **Job Search Results** (`jobs://search-results`): Latest search results with job listings
- **Job Categories** (`jobs://categories`): Available job categories with statistics
- **Job Locations** (`jobs://locations`): Available job locations with statistics

### Tools
- **search_jobs**: Search for jobs with filters (category, location, job type, experience level, salary range)
- **view_job**: Get detailed information about a specific job by job ID
- **apply_for_job**: Submit a job application with complete applicant information
- **analyze_job_match**: Analyze how well a candidate profile matches a specific job

### Prompts
- **job_search_assistant**: Interactive help for job searching based on user preferences
- **job_application_helper**: Step-by-step guidance through the job application process
- **career_advisor**: Career advice based on available jobs and user profile
- **job_comparison**: Compare multiple jobs side-by-side

## Backend API Integration

The MCP server integrates with a backend API running on `http://localhost:3000` with the following endpoints:

- `POST /api/jobs/search` - Search for jobs
- `GET /api/jobs/{jobId}` - View specific job details
- `POST /api/jobs/{jobId}/apply` - Apply for a job

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Make sure your backend API server is running on port 3000

## Usage

### Running the MCP Server

Run the server directly with ts-node:
```bash
npm run jobs-mcp
```

Or build and run the compiled version:
```bash
npm run build:jobs-mcp
node dist/jobs-mcp.js
```

### Using with MCP Clients

The server runs on stdio, making it suitable for use with MCP-compatible clients like Claude Desktop, IDEs, or other MCP clients.

#### Example MCP Client Configuration

For Claude Desktop, add this to your configuration:

```json
{
  "mcpServers": {
    "jobs-platform": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/dist/jobs-mcp.js"]
    }
  }
}
```

### Example Usage

#### 1. Search for Jobs
```javascript
// Use the search_jobs tool
{
  "filters": {
    "category": "Logistics",
    "location": "Bengaluru",
    "jobType": "full_time"
  }
}
```

#### 2. View Job Details
```javascript
// Use the view_job tool
{
  "jobId": "JOB-1001-DEL"
}
```

#### 3. Apply for a Job
```javascript
// Use the apply_for_job tool
{
  "jobId": "JOB-1001-DEL",
  "applicant": {
    "full_name": "John Doe",
    "phone_number": "+91-9876543210",
    "email": "john.doe@example.com",
    "date_of_birth": "1995-01-15",
    "gender": "Male",
    "languages_spoken": ["Hindi", "English"],
    "address": {
      "street": "123 Main Street",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postal_code": "560001"
    },
    "identification": {
      "aadhaar_number": "XXXX-XXXX-1234",
      "driving_license": "KA1234567890123"
    }
  }
}
```

#### 4. Analyze Job Match
```javascript
// Use the analyze_job_match tool
{
  "jobId": "JOB-1001-DEL",
  "candidateProfile": {
    "experience": 2,
    "skills": ["Driving", "Customer Service", "Navigation"],
    "education": "XII",
    "languages": ["Hindi", "English", "Kannada"],
    "location": "Bengaluru"
  }
}
```

### Accessing Resources

#### Job Search Results
```
Resource URI: jobs://search-results
```
Returns the latest job search results in JSON format.

#### Job Categories
```
Resource URI: jobs://categories
```
Returns available job categories with count and percentage statistics.

#### Job Locations
```
Resource URI: jobs://locations
```
Returns available job locations with count and percentage statistics.

### Using Prompts

#### Job Search Assistant
```javascript
// Prompt: job_search_assistant
{
  "user_preferences": "Looking for delivery jobs in Bangalore with good salary"
}
```

#### Job Application Helper
```javascript
// Prompt: job_application_helper
{
  "job_id": "JOB-1001-DEL"
}
```

#### Career Advisor
```javascript
// Prompt: career_advisor
{
  "user_profile": "2 years experience in logistics, knows Hindi and English"
}
```

#### Job Comparison
```javascript
// Prompt: job_comparison
{
  "job_ids": "JOB-1001-DEL,JOB-1002-WHS,JOB-1003-DRI"
}
```

## API Response Format

All API responses follow a consistent format:

```json
{
  "id": "api.jobs.search",
  "ver": "1.0",
  "ets": 1749049264400,
  "params": {
    "msgid": "unique-message-id",
    "err": "",
    "status": "SUCCESSFUL",
    "errmsg": ""
  },
  "responseCode": "OK",
  "result": {
    // Result data here
  }
}
```

## Job Data Structure

Each job contains comprehensive information:

- **Basic Info**: ID, title, description, category, job type
- **Company**: Name, description, industry
- **Location**: Full address with coordinates
- **Requirements**: Experience, education, skills, languages, assets
- **Responsibilities**: List of job duties
- **Compensation**: Salary amount, currency, frequency
- **Schedule**: Shift type, hours, days, overtime availability
- **Benefits**: Health insurance, PTO, tools, training, etc.
- **Metadata**: Tags, posting date, validity period

## Error Handling

The server handles various error conditions:

- Invalid job IDs
- Missing required parameters
- API connection failures
- Malformed requests

All errors are returned with appropriate MCP error codes and descriptive messages.

## Development

### Prerequisites
- Node.js 16+
- TypeScript 5+
- Backend API server running on port 3000

### Project Structure
```
src/
  jobs-mcp.ts          # Main MCP server implementation
package.json           # Dependencies and scripts
tsconfig.json         # TypeScript configuration
README.md             # This file
```

### Building
```bash
npm run build
```

### Testing
Ensure your backend API is running and test with an MCP client or by running:
```bash
npm run jobs-mcp
```

## License

ISC 