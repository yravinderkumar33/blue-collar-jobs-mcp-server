
export interface Job {
  _id: string;
  jobId: string;
  title: string;
  description: string;
  category: string;
  jobType: 'full_time' | 'part_time' | 'contract' | 'temporary';
  company: {
    name: string;
    description: string;
    industry: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  requirements: {
    experienceInYears: number;
    gender?: string;
    education: string[];
    certifications: string[];
    skills: string[];
    languages: string[];
    assetsRequired: string[];
  };
  responsibilities: string[];
  salary: {
    amount: number;
    currency: string;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  schedule: {
    shiftType: string;
    hoursPerWeek: number;
    daysOfWeek: string[];
    startTime: string;
    endTime: string;
    overtimeAvailable: boolean;
    weekendWork: boolean;
  };
  benefits: string[];
  postedDate: string;
  validUntil: string;
  metadata: {
    tags: string[];
  };
}

export interface JobApplication {
  _id: string;
  application_id: string;
  job_id: string;
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
  submitted_on: string;
  documents_uploaded: string[];
  status: 'PENDING' | 'REVIEWED' | 'INTERVIEWED' | 'HIRED' | 'REJECTED';
}
