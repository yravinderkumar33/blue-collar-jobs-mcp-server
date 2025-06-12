import api from '@/lib/api';
import { Job, SearchFilters, SearchResponse, JobDetailResponse, ApplicationData, ApplicationResponse, Application } from '@/services/types';

export const getAllJobs = async (): Promise<SearchResponse> => {
  const response = await api.post('/jobs/search', { request: {} });
  return response.data;
};

export const searchJobs = async (filters: SearchFilters): Promise<SearchResponse> => {
  const response = await api.post('/jobs/search', {
    request: {
      filters,
      options: {
        sort: { postedDate: -1 },
        limit: 10
      }
    }
  });
  return response.data;
};

export const getJobDetail = async (jobId: string): Promise<JobDetailResponse> => {
  const response = await api.get(`/jobs/${jobId}`);
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