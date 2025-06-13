import axios from 'axios';
import {
  JobSearchRequest,
  Job,
  JobSearchResponse,
  JobViewResponse,
  JobApplication,
  JobApplicationResponse
} from '../types/job';

export class JobsAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:6000') {
    this.baseUrl = baseUrl;
    // Configure axios defaults
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  /**
   * Search for jobs with optional filters and pagination
   */
  async searchJobs(request: JobSearchRequest): Promise<JobSearchResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/jobs/search`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to search jobs:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to search jobs: ${error.response?.status} ${error.response?.statusText || error.message}`);
      }
      throw new Error(`Failed to search jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed information about a specific job
   */
  async getJob(jobId: string): Promise<JobViewResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/jobs/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get job ${jobId}:`, error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get job details: ${error.response?.status} ${error.response?.statusText || error.message}`);
      }
      throw new Error(`Failed to get job details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Apply for a specific job
   */
  async applyForJob(jobId: string, application: JobApplication): Promise<JobApplicationResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/jobs/${jobId}/apply`,
        application,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to apply for job ${jobId}:`, error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to apply for job: ${error.response?.status} ${error.response?.statusText || error.message}`);
      }
      throw new Error(`Failed to apply for job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get formatted job listing for display
   */
  formatJobForDisplay(job: Job): string {
    const compensation = job.compensation.max_amount
      ? `${job.compensation.currency} ${job.compensation.min_amount.toLocaleString()} - ${job.compensation.max_amount.toLocaleString()}`
      : `${job.compensation.currency} ${job.compensation.min_amount.toLocaleString()}`;

    return `**${job.job.title}** at ${job.company.name}
📍 Location: ${job.location.complete_address}
💰 Salary: ${compensation}
📅 Employment Type: ${job.job.employment_type}
⏰ Posted: ${new Date(job.job.posted_at).toLocaleDateString()}
⏳ Expires: ${new Date(job.job.expires_at).toLocaleDateString()}

**Description:**
${job.job.description}

**Requirements:**
• Experience: ${job.job.requirements.experience}
• Education: ${job.job.requirements.education.join(', ')}
• Skills: ${job.job.requirements.skills.join(', ')}
• Languages: ${job.job.requirements.languages.join(', ')}
• Assets Required: ${job.job.requirements.assetsRequired.join(', ')}

**Responsibilities:**
${job.job.responsibilities.map(r => `• ${r}`).join('\n')}

**Benefits:**
${job.job.benefits.map(b => `• ${b.replace(/_/g, ' ')}`).join('\n')}

---
Job ID: ${job.jobId}
`;
  }

  /**
   * Get formatted job summary for lists
   */
  formatJobSummary(job: Job): string {
    const compensation = job.compensation.max_amount
      ? `${job.compensation.currency} ${job.compensation.min_amount.toLocaleString()} - ${job.compensation.max_amount.toLocaleString()}`
      : `${job.compensation.currency} ${job.compensation.min_amount.toLocaleString()}`;

    return `**${job.job.title}** (${job.jobId})
🏢 ${job.company.name} | 📍 ${job.location.city}, ${job.location.state}
💰 ${compensation} | ⏰ ${job.job.employment_type}
📋 Skills: ${job.job.requirements.skills.slice(0, 3).join(', ')}${job.job.requirements.skills.length > 3 ? '...' : ''}`;
  }

  async getApplicationStatus(applicationId: string): Promise<JobApplicationResponse> {
    try {
      
      const response = await axios.get(`${this.baseUrl}/api/jobs/applications/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get application status ${applicationId}:`, error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get application status: ${error.response?.status} ${error.response?.statusText || error.message}`);
      }
      throw new Error(`Failed to get application status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 