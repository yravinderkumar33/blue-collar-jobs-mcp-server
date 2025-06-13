export interface JobLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface JobSalary {
  amount: number;
  currency: string;
  frequency: string;
}

export interface JobSchedule {
  shiftType: string;
  hoursPerWeek: number;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  overtimeAvailable: boolean;
  weekendWork: boolean;
}

export interface JobRequirements {
  experienceInYears: number;
  gender?: string;
  education: string[];
  certifications: string[];
  skills: string[];
  languages: string[];
  assetsRequired: string[];
}

export interface JobCompany {
  name: string;
  description: string;
  industry: string;
}

export interface Job {
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

export interface SearchFilters {
  category?: string;
  location?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: number;
  skills?: string[];
  searchTerm?: string;
}

export interface SearchResponse {
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

export interface JobDetailResponse {
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

export interface ApplicationData {
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
  documents_uploaded: string[];
}

export interface ApplicationResponse {
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

export interface Application {
  _id: string;
  application_id: string;
  job_id: string;
  applicant: {
    full_name: string;
    phone_number: string;
    email: string;
  };
  status: 'PENDING' | 'REVIEWED' | 'INTERVIEWED' | 'HIRED' | 'REJECTED';
  submitted_on: string;
  __v?: number;
} 