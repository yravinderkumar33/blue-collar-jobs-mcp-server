import api from '@/lib/api';
import { Job, SearchFilters, SearchResponse, JobDetailResponse, ApplicationData, ApplicationResponse, Application } from '@/services/types';

// --- Mapping function: backend job (company-b.json) -> frontend Job type ---
function mapBackendJobToFrontendJob(backendJob: any): Job {
  return {
    jobId: backendJob.jobId,
    title: backendJob.position?.name || '',
    description: backendJob.position?.summary || '',
    category: backendJob.position?.department || '',
    jobType: backendJob.position?.type || '',
    company: {
      name: backendJob.organization?.companyName || '',
      description: backendJob.organization?.about || '',
      industry: backendJob.organization?.sector || '',
    },
    location: {
      address: backendJob.workplace?.street || '',
      city: backendJob.workplace?.city || '',
      state: backendJob.workplace?.region || '',
      country: backendJob.workplace?.nation || '',
      postalCode: backendJob.workplace?.zipCode || '',
      latitude: backendJob.workplace?.geo?.lat,
      longitude: backendJob.workplace?.geo?.lng,
    },
    requirements: {
      experienceInYears: backendJob.qualifications?.minExperienceYears || 0,
      gender: backendJob.qualifications?.preferredGender || '',
      education: backendJob.qualifications?.degrees || [],
      certifications: backendJob.qualifications?.requiredCertificates || [],
      skills: backendJob.qualifications?.keySkills || [],
      languages: backendJob.qualifications?.spokenLanguages || [],
      assetsRequired: backendJob.qualifications?.mustHaveAssets || [],
    },
    responsibilities: backendJob.tasks || [],
    salary: {
      amount: backendJob.compensation?.value || 0,
      currency: backendJob.compensation?.currencyCode || '',
      frequency: backendJob.compensation?.payPeriod || '',
    },
    schedule: {
      shiftType: backendJob.workSchedule?.shift || '',
      hoursPerWeek: backendJob.workSchedule?.weeklyHours || 0,
      daysOfWeek: backendJob.workSchedule?.workingDays || [],
      startTime: backendJob.workSchedule?.start || '',
      endTime: backendJob.workSchedule?.end || '',
      overtimeAvailable: backendJob.workSchedule?.overtime || false,
      weekendWork: backendJob.workSchedule?.includesWeekend || false,
    },
    benefits: backendJob.perks || [],
    postedDate: backendJob.dates?.posted || '',
    validUntil: backendJob.dates?.expiry || '',
    metadata: {
      tags: backendJob.extra?.keywords || [],
    },
  };
}

export const getAllJobs = async (): Promise<SearchResponse> => {
  const response = await api.post('/jobs/search', {
    request: {
      filters: {},
      options: {
        sort: { postedDate: -1 },
        limit: 100
      }
    }
  });
  if (response.data?.result?.jobs) {
    response.data.result.jobs = response.data.result.jobs.map(mapBackendJobToFrontendJob);
  }
  return response.data;
};

export const searchJobs = async (filters: SearchFilters): Promise<SearchResponse> => {
  const response = await api.post('/jobs/search', {
    request: {
      filters,
      options: {
        sort: { postedDate: -1 },
        limit: 100
      }
    }
  });
  if (response.data?.result?.jobs) {
    response.data.result.jobs = response.data.result.jobs.map(mapBackendJobToFrontendJob);
  }
  return response.data;
};

export const getJobDetail = async (jobId: string): Promise<JobDetailResponse> => {
  const response = await api.get(`/jobs/${jobId}`);
  if (response.data?.result?.job) {
    response.data.result.job = mapBackendJobToFrontendJob(response.data.result.job);
  }
  return response.data;
};

export const applyToJob = async (jobId: string, applicationData: ApplicationData): Promise<ApplicationResponse> => {
  const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
  return response.data;
};

// Additional function for the Applications page
export const fetchApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get('/jobs/applications');
    return response.data?.result?.applications || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

// Export types for compatibility
export type { Job, ApplicationData, Application } from '@/services/types';
