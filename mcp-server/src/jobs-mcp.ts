#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Types for job platform
interface JobLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface JobCompany {
  name: string;
  description: string;
  industry: string;
}

interface JobRequirements {
  experienceInYears: number;
  gender: string;
  education: string[];
  certifications: string[];
  skills: string[];
  languages: string[];
  assetsRequired: string[];
}

interface JobSalary {
  amount: number;
  currency: string;
  frequency: string;
}

interface JobSchedule {
  shiftType: string;
  hoursPerWeek: number;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  overtimeAvailable: boolean;
  weekendWork: boolean;
}

interface Job {
  _id: string;
  jobId: string;
  title: string;
  description: string;
  category: string;
  jobType: string;
  company: JobCompany;
  location: JobLocation;
  requirements: JobRequirements;
  responsibilities: string[];
  salary: JobSalary;
  schedule: JobSchedule;
  benefits: string[];
  postedDate: string;
  validUntil: string;
  metadata: {
    tags: string[];
  };
}

interface JobSearchResponse {
  id: string;
  ver: string;
  ets: number;
  params: {
    msgid: string;
    err: string;
    status: string;
    errmsg: string;
  };
  responseCode: string;
  result: {
    jobs: Job[];
  };
}

interface JobViewResponse {
  id: string;
  ver: string;
  ets: number;
  params: {
    msgid: string;
    err: string;
    status: string;
    errmsg: string;
  };
  responseCode: string;
  result: {
    job: Job;
  };
}

interface ApplicationData {
  application_id?: string;
  job_id: string;
  submitted_on?: string;
  applicant: {
    full_name: string;
    phone_number: string;
    email: string;
    date_of_birth: string;
    gender: string;
    languages_spoken: string[];
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
    };
    identification: {
      aadhaar_number: string;
      driving_license?: string;
    };
  };
  documents_uploaded?: string[];
}

interface JobApplicationResponse {
  id: string;
  ver: string;
  ets: number;
  params: {
    msgid: string;
    err: string;
    status: string;
    errmsg: string;
  };
  responseCode: string;
  result: {
    application: {
      application_id: string;
      job_id: string;
      status: string;
      applied_at: string;
    };
  };
}

const BASE_URL = 'http://localhost:3000/api/jobs';

class JobsMCPServer {
  private server: Server;
  private lastSearchResults: Job[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'jobs-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.setupResourceHandlers();
    this.setupToolHandlers();
    this.setupPromptHandlers();
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'jobs://search-results',
            mimeType: 'application/json',
            name: 'Job Search Results',
            description: 'Latest job search results from the platform',
          },
          {
            uri: 'jobs://categories',
            mimeType: 'application/json',
            name: 'Job Categories',
            description: 'Available job categories and statistics',
          },
          {
            uri: 'jobs://locations',
            mimeType: 'application/json',
            name: 'Job Locations',
            description: 'Available job locations and statistics',
          },
        ],
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'jobs://search-results':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  total_jobs: this.lastSearchResults.length,
                  jobs: this.lastSearchResults,
                  last_updated: new Date().toISOString(),
                }, null, 2),
              },
            ],
          };

        case 'jobs://categories':
          const categories = this.getJobCategories();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(categories, null, 2),
              },
            ],
          };

        case 'jobs://locations':
          const locations = this.getJobLocations();
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(locations, null, 2),
              },
            ],
          };

        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${uri}`);
      }
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_jobs',
            description: 'Search for jobs on the platform',
            inputSchema: {
              type: 'object',
              properties: {
                filters: {
                  type: 'object',
                  properties: {
                    category: { type: 'string', description: 'Job category filter' },
                    location: { type: 'string', description: 'Location filter' },
                    jobType: { type: 'string', description: 'Job type (full_time, part_time)' },
                    experienceLevel: { type: 'string', description: 'Experience level filter' },
                    salaryRange: { type: 'string', description: 'Salary range filter' },
                  },
                  description: 'Search filters for jobs',
                },
              },
            },
          },
          {
            name: 'view_job',
            description: 'Get detailed information about a specific job',
            inputSchema: {
              type: 'object',
              properties: {
                jobId: { 
                  type: 'string', 
                  description: 'The job ID to view details for',
                },
              },
              required: ['jobId'],
            },
          },
          {
            name: 'apply_for_job',
            description: 'Apply for a job with applicant information',
            inputSchema: {
              type: 'object',
              properties: {
                jobId: { 
                  type: 'string', 
                  description: 'The job ID to apply for',
                },
                applicant: {
                  type: 'object',
                  properties: {
                    full_name: { type: 'string', description: 'Full name of applicant' },
                    phone_number: { type: 'string', description: 'Phone number with country code' },
                    email: { type: 'string', description: 'Email address' },
                    date_of_birth: { type: 'string', description: 'Date of birth (YYYY-MM-DD)' },
                    gender: { type: 'string', description: 'Gender' },
                    languages_spoken: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Languages spoken by applicant',
                    },
                    address: {
                      type: 'object',
                      properties: {
                        street: { type: 'string', description: 'Street address' },
                        city: { type: 'string', description: 'City' },
                        state: { type: 'string', description: 'State' },
                        postal_code: { type: 'string', description: 'Postal code' },
                      },
                      required: ['street', 'city', 'state', 'postal_code'],
                    },
                    identification: {
                      type: 'object',
                      properties: {
                        aadhaar_number: { type: 'string', description: 'Aadhaar number' },
                        driving_license: { type: 'string', description: 'Driving license number (if applicable)' },
                      },
                      required: ['aadhaar_number'],
                    },
                  },
                  required: ['full_name', 'phone_number', 'email', 'date_of_birth', 'gender', 'languages_spoken', 'address', 'identification'],
                },
              },
              required: ['jobId', 'applicant'],
            },
          },
          {
            name: 'analyze_job_match',
            description: 'Analyze how well a candidate matches a job based on their profile',
            inputSchema: {
              type: 'object',
              properties: {
                jobId: { 
                  type: 'string', 
                  description: 'The job ID to analyze match for',
                },
                candidateProfile: {
                  type: 'object',
                  properties: {
                    experience: { type: 'number', description: 'Years of experience' },
                    skills: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Skills possessed by candidate',
                    },
                    education: { type: 'string', description: 'Educational qualification' },
                    languages: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Languages known by candidate',
                    },
                    location: { type: 'string', description: 'Candidate location' },
                  },
                  required: ['experience', 'skills'],
                },
              },
              required: ['jobId', 'candidateProfile'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_jobs':
            return await this.searchJobs(args?.filters || {});

          case 'view_job':
            if (!args?.jobId || typeof args.jobId !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Job ID is required');
            }
            return await this.viewJob(args.jobId);

          case 'apply_for_job':
            if (!args?.jobId || typeof args.jobId !== 'string' || !args?.applicant) {
              throw new McpError(ErrorCode.InvalidParams, 'Job ID and applicant information are required');
            }
            return await this.applyForJob(args.jobId, args.applicant);

          case 'analyze_job_match':
            if (!args?.jobId || typeof args.jobId !== 'string' || !args?.candidateProfile) {
              throw new McpError(ErrorCode.InvalidParams, 'Job ID and candidate profile are required');
            }
            return await this.analyzeJobMatch(args.jobId, args.candidateProfile);

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private setupPromptHandlers() {
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'job_search_assistant',
            description: 'Help users search for jobs based on their preferences and qualifications',
            arguments: [
              {
                name: 'user_preferences',
                description: 'User preferences for job search',
                required: false,
              },
            ],
          },
          {
            name: 'job_application_helper',
            description: 'Guide users through the job application process',
            arguments: [
              {
                name: 'job_id',
                description: 'ID of the job to apply for',
                required: true,
              },
            ],
          },
          {
            name: 'career_advisor',
            description: 'Provide career advice based on available jobs and user profile',
            arguments: [
              {
                name: 'user_profile',
                description: 'User profile including skills, experience, and preferences',
                required: false,
              },
            ],
          },
          {
            name: 'job_comparison',
            description: 'Compare multiple jobs to help users make informed decisions',
            arguments: [
              {
                name: 'job_ids',
                description: 'Comma-separated list of job IDs to compare',
                required: true,
              },
            ],
          },
        ],
      };
    });

    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'job_search_assistant':
          return {
            description: 'Job Search Assistant',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `I'm looking for a job. ${args?.user_preferences ? `My preferences: ${args.user_preferences}` : 'Please help me find suitable opportunities.'}

Please help me:
1. Search for relevant jobs based on my criteria
2. Understand job requirements and responsibilities  
3. Identify jobs that match my skills and experience
4. Get advice on improving my profile for better matches

What information do you need from me to get started?`,
                },
              },
            ],
          };

        case 'job_application_helper':
          return {
            description: 'Job Application Helper',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `I want to apply for job ID: ${args?.job_id}

Please help me:
1. Review the job details and requirements
2. Understand what information I need to provide
3. Guide me through the application process
4. Tips for a successful application

Can you first show me the job details and then guide me through the application?`,
                },
              },
            ],
          };

        case 'career_advisor':
          return {
            description: 'Career Advisor',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `I need career advice. ${args?.user_profile ? `My profile: ${args.user_profile}` : ''}

Please help me:
1. Identify career opportunities that match my background
2. Understand market trends and in-demand skills
3. Suggest ways to improve my employability
4. Provide guidance on career growth paths

Based on available jobs in the platform, what career advice would you give me?`,
                },
              },
            ],
          };

        case 'job_comparison':
          return {
            description: 'Job Comparison',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `I want to compare these jobs: ${args?.job_ids}

Please help me compare them based on:
1. Salary and benefits
2. Work schedule and requirements
3. Career growth potential
4. Company and location
5. Match with my profile

Can you retrieve details for these jobs and provide a comprehensive comparison?`,
                },
              },
            ],
          };

        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown prompt: ${name}`);
      }
    });
  }

  private async searchJobs(filters: any) {
    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request: filters }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JobSearchResponse = await response.json();
      this.lastSearchResults = data.result.jobs;

      return {
        content: [
          {
            type: 'text',
            text: `Found ${data.result.jobs.length} jobs matching your criteria:\n\n${data.result.jobs.map(job => 
              `**${job.title}** (${job.jobId})\n` +
              `Company: ${job.company.name}\n` +
              `Location: ${job.location.city}, ${job.location.state}\n` +
              `Salary: ₹${job.salary.amount} ${job.salary.frequency}\n` +
              `Type: ${job.jobType}\n` +
              `Experience: ${job.requirements.experienceInYears} years\n` +
              `Posted: ${new Date(job.postedDate).toLocaleDateString()}\n` +
              `---`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Failed to search jobs: ${error}`);
    }
  }

  private async viewJob(jobId: string) {
    try {
      const response = await fetch(`${BASE_URL}/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JobViewResponse = await response.json();
      const job = data.result.job;

      return {
        content: [
          {
            type: 'text',
            text: `**Job Details for ${job.jobId}**\n\n` +
              `**Title:** ${job.title}\n` +
              `**Company:** ${job.company.name}\n` +
              `**Industry:** ${job.company.industry}\n` +
              `**Description:** ${job.description}\n\n` +
              `**Location:**\n` +
              `${job.location.address}, ${job.location.city}, ${job.location.state} - ${job.location.postalCode}\n\n` +
              `**Requirements:**\n` +
              `- Experience: ${job.requirements.experienceInYears} years\n` +
              `- Education: ${job.requirements.education.join(', ')}\n` +
              `- Skills: ${job.requirements.skills.join(', ')}\n` +
              `- Languages: ${job.requirements.languages.join(', ')}\n` +
              `- Assets Required: ${job.requirements.assetsRequired.join(', ')}\n\n` +
              `**Responsibilities:**\n${job.responsibilities.map(r => `- ${r}`).join('\n')}\n\n` +
              `**Salary:** ₹${job.salary.amount} ${job.salary.frequency}\n\n` +
              `**Schedule:**\n` +
              `- Shift: ${job.schedule.shiftType}\n` +
              `- Hours/Week: ${job.schedule.hoursPerWeek}\n` +
              `- Time: ${job.schedule.startTime} - ${job.schedule.endTime}\n` +
              `- Days: ${job.schedule.daysOfWeek.join(', ')}\n` +
              `- Overtime: ${job.schedule.overtimeAvailable ? 'Available' : 'Not Available'}\n\n` +
              `**Benefits:** ${job.benefits.join(', ')}\n\n` +
              `**Valid Until:** ${new Date(job.validUntil).toLocaleDateString()}`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Failed to view job: ${error}`);
    }
  }

  private async applyForJob(jobId: string, applicant: any) {
    try {
      const applicationData: ApplicationData = {
        job_id: jobId,
        applicant: applicant,
        documents_uploaded: [],
      };

      const response = await fetch(`${BASE_URL}/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JobApplicationResponse = await response.json();
      const application = data.result.application;

      return {
        content: [
          {
            type: 'text',
            text: `**Job Application Submitted Successfully!**\n\n` +
              `**Application ID:** ${application.application_id}\n` +
              `**Job ID:** ${application.job_id}\n` +
              `**Status:** ${application.status}\n` +
              `**Applied At:** ${new Date(application.applied_at).toLocaleString()}\n\n` +
              `Your application has been submitted and is under review. You will be contacted if your profile matches the requirements.\n\n` +
              `**Next Steps:**\n` +
              `- Keep your phone available for interview calls\n` +
              `- Prepare relevant documents\n` +
              `- Review the job requirements and prepare for potential interviews`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Failed to apply for job: ${error}`);
    }
  }

  private async analyzeJobMatch(jobId: string, candidateProfile: any) {
    try {
      // First get job details
      const jobResponse = await fetch(`${BASE_URL}/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!jobResponse.ok) {
        throw new Error(`HTTP error! status: ${jobResponse.status}`);
      }

      const jobData: JobViewResponse = await jobResponse.json();
      const job = jobData.result.job;

      // Analyze match
      const analysis = this.calculateJobMatch(job, candidateProfile);

      return {
        content: [
          {
            type: 'text',
            text: `**Job Match Analysis for ${job.title}**\n\n` +
              `**Overall Match Score: ${analysis.overallScore}%**\n\n` +
              `**Detailed Analysis:**\n\n` +
              `**Experience Match:** ${analysis.experienceMatch}%\n` +
              `- Required: ${job.requirements.experienceInYears} years\n` +
              `- Your Experience: ${candidateProfile.experience} years\n` +
              `- ${analysis.experienceNote}\n\n` +
              `**Skills Match:** ${analysis.skillsMatch}%\n` +
              `- Required Skills: ${job.requirements.skills.join(', ')}\n` +
              `- Your Skills: ${candidateProfile.skills.join(', ')}\n` +
              `- Matching Skills: ${analysis.matchingSkills.join(', ')}\n` +
              `- Missing Skills: ${analysis.missingSkills.join(', ')}\n\n` +
              `**Education Match:** ${analysis.educationMatch}%\n` +
              `- Required: ${job.requirements.education.join(' or ')}\n` +
              `- Your Education: ${candidateProfile.education || 'Not specified'}\n\n` +
              `**Language Match:** ${analysis.languageMatch}%\n` +
              `- Required: ${job.requirements.languages.join(', ')}\n` +
              `- Your Languages: ${candidateProfile.languages?.join(', ') || 'Not specified'}\n\n` +
              `**Location Compatibility:** ${analysis.locationMatch}%\n` +
              `- Job Location: ${job.location.city}, ${job.location.state}\n` +
              `- Your Location: ${candidateProfile.location || 'Not specified'}\n\n` +
              `**Recommendations:**\n${analysis.recommendations.map(r => `- ${r}`).join('\n')}\n\n` +
              `**Application Advice:**\n${analysis.applicationAdvice}`,
          },
        ],
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Failed to analyze job match: ${error}`);
    }
  }

  private calculateJobMatch(job: Job, candidateProfile: any) {
    // Experience match
    const experienceScore = candidateProfile.experience >= job.requirements.experienceInYears ? 100 : 
      Math.max(0, (candidateProfile.experience / job.requirements.experienceInYears) * 100);
    
    const experienceNote = candidateProfile.experience >= job.requirements.experienceInYears ? 
      'Perfect match!' : 
      candidateProfile.experience === 0 && job.requirements.experienceInYears <= 1 ? 
        'Entry level position - good for beginners' : 
        'You may need more experience for this role';

    // Skills match
    const requiredSkills = job.requirements.skills.map(s => s.toLowerCase());
    const candidateSkills = candidateProfile.skills.map((s: string) => s.toLowerCase());
    const matchingSkills = requiredSkills.filter(skill => 
      candidateSkills.some((cSkill: string) => cSkill.includes(skill) || skill.includes(cSkill))
    );
    const missingSkills = requiredSkills.filter(skill => 
      !candidateSkills.some((cSkill: string) => cSkill.includes(skill) || skill.includes(cSkill))
    );
    const skillsScore = requiredSkills.length > 0 ? (matchingSkills.length / requiredSkills.length) * 100 : 100;

    // Education match (simplified)
    const educationScore = candidateProfile.education ? 100 : 50;

    // Language match
    const languageScore = candidateProfile.languages && candidateProfile.languages.length > 0 ? 
      job.requirements.languages.some((lang: string) => 
        candidateProfile.languages.some((cLang: string) => 
          cLang.toLowerCase().includes(lang.toLowerCase())
        )
      ) ? 100 : 50 : 50;

    // Location match (simplified)
    const locationScore = candidateProfile.location && 
      candidateProfile.location.toLowerCase().includes(job.location.city.toLowerCase()) ? 100 : 70;

    // Overall score
    const overallScore = Math.round(
      (experienceScore * 0.3 + skillsScore * 0.3 + educationScore * 0.2 + languageScore * 0.1 + locationScore * 0.1)
    );

    // Generate recommendations
    const recommendations = [];
    if (skillsScore < 70) {
      recommendations.push(`Consider developing skills in: ${missingSkills.join(', ')}`);
    }
    if (experienceScore < 70) {
      recommendations.push('Gain more relevant experience or highlight transferable skills');
    }
    if (locationScore < 100) {
      recommendations.push('Consider relocation or remote work options if available');
    }
    if (overallScore >= 80) {
      recommendations.push('Excellent match! You should definitely apply for this position');
    } else if (overallScore >= 60) {
      recommendations.push('Good match with some areas for improvement');
    } else {
      recommendations.push('Consider improving your profile before applying');
    }

    const applicationAdvice = overallScore >= 80 ? 
      'Strong candidate - apply with confidence!' :
      overallScore >= 60 ?
        'Good potential - highlight your strengths in your application' :
        'Focus on building relevant skills and experience before applying';

    return {
      overallScore,
      experienceMatch: Math.round(experienceScore),
      experienceNote,
      skillsMatch: Math.round(skillsScore),
      matchingSkills: job.requirements.skills.filter(skill => 
        candidateProfile.skills.some((cSkill: string) => 
          cSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(cSkill.toLowerCase())
        )
      ),
      missingSkills: job.requirements.skills.filter(skill => 
        !candidateProfile.skills.some((cSkill: string) => 
          cSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(cSkill.toLowerCase())
        )
      ),
      educationMatch: Math.round(educationScore),
      languageMatch: Math.round(languageScore),
      locationMatch: Math.round(locationScore),
      recommendations,
      applicationAdvice,
    };
  }

  private getJobCategories() {
    const categoryCounts: { [key: string]: number } = {};
    this.lastSearchResults.forEach(job => {
      categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
    });

    return {
      categories: Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        percentage: this.lastSearchResults.length > 0 ? 
          Math.round((count / this.lastSearchResults.length) * 100) : 0,
      })),
      total_categories: Object.keys(categoryCounts).length,
      last_updated: new Date().toISOString(),
    };
  }

  private getJobLocations() {
    const locationCounts: { [key: string]: number } = {};
    this.lastSearchResults.forEach(job => {
      const location = `${job.location.city}, ${job.location.state}`;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return {
      locations: Object.entries(locationCounts).map(([location, count]) => ({
        location,
        count,
        percentage: this.lastSearchResults.length > 0 ? 
          Math.round((count / this.lastSearchResults.length) * 100) : 0,
      })),
      total_locations: Object.keys(locationCounts).length,
      last_updated: new Date().toISOString(),
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Jobs MCP server running on stdio');
  }
}

const server = new JobsMCPServer();
server.run().catch(console.error);
