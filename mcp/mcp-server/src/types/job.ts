import { z } from 'zod';

// Job search filters schema
export const JobFiltersSchema = z.object({});

// Job search request schema
export const JobSearchRequestSchema = z.object({
  filters: JobFiltersSchema.optional(),
  options: z.object({}).optional()
});

// Job application schema
export const JobApplicationSchema = z.object({
  job_id: z.string().describe("The job ID to apply for"),
  applicant: z.object({
    full_name: z.string().describe("Full name of the applicant"),
    phone_number: z.string().describe("Phone number with country code"),
    email: z.string().email().describe("Email address of the applicant")
  }),
  status: z.string().default("PENDING").describe("Application status")
});

// Type exports
export type JobFilters = z.infer<typeof JobFiltersSchema>;
export type JobSearchRequest = z.infer<typeof JobSearchRequestSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;

// Job data types based on API responses
export interface JobRequirements {
  education: string[];
  experience: string;
  skills: string[];
  gender: string;
  languages: string[];
  assetsRequired: string[];
  physicalRequirements?: string[];
  documentsRequired?: string[];
  otherRequirements?: string[];
  age?: number | null;
}

export interface JobCompensation {
  currency: string;
  min_amount: number;
  max_amount: number | null;
  incentive: boolean;
  bonus: boolean;
}

export interface JobLocation {
  city: string;
  state: string;
  country: string;
  postal_code: string;
  complete_address: string;
}

export interface JobCompany {
  name: string;
  website: string | null;
}

export interface JobDetails {
  title: string;
  description: string;
  requirements: JobRequirements;
  responsibilities: string[];
  benefits: string[];
  employment_type: string;
  posted_at: string;
  expires_at: string;
  status: string | null;
}

export interface Job {
  _id: string;
  jobId: string;
  job: JobDetails;
  company: JobCompany;
  compensation: JobCompensation;
  location: JobLocation;
  metadata: {
    source_id: string;
    ingested_at: string;
    original_event: any;
  };
  __v: number;
}

export interface JobSearchResponse {
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

export interface JobViewResponse {
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

export interface JobApplicationResponse {
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