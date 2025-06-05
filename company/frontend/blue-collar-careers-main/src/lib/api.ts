import { Job, JobApplication } from '../types/Job';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE_URL}/api/jobs/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request: {} })
  });
  if (!res.ok) throw new Error('Failed to fetch jobs');
  const data = await res.json();
  return data.result.jobs;
}

export async function fetchApplications(): Promise<JobApplication[]> {
  const res = await fetch(`${API_BASE_URL}/api/jobs/applications`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  const data = await res.json();
  return data.result.applications;
} 