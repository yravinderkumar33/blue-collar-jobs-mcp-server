import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, SearchFilters } from '@/services/types';
import { getAllJobs, searchJobs } from '@/services/jobApi';
import { JobCard } from '@/components/JobCard';
import { SearchFilters as JobSearchFilters } from '@/components/SearchFilters';
import JobDetail from '@/components/JobDetail';
import Header from '@/components/Header';

const Search = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Helper function to validate job data
  const isValidJob = (job: any): job is Job => {
    return job && 
           job.jobId && 
           job.title && 
           job.company && 
           job.company.name && 
           job.location && 
           job.location.city && 
           job.location.state && 
           job.salary && 
           job.salary.amount && 
           job.requirements;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getAllJobs();
        console.log('API Response:', response);
        
        // Filter out invalid jobs
        const validJobs = (response.result?.jobs || []).filter(isValidJob);
        console.log('Valid jobs:', validJobs.length, 'out of', response.result?.jobs?.length || 0);
        
        setJobs(validJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    try {
      // Only show loading state for filter changes, not search term changes
      if (Object.keys(filters).length > 1 || !filters.searchTerm) {
        setLoading(true);
      }
      const response = await searchJobs(filters);
      console.log('Search API Response:', response);
      
      // Filter out invalid jobs
      const validJobs = (response.result?.jobs || []).filter(isValidJob);
      console.log('Valid search results:', validJobs.length, 'out of', response.result?.jobs?.length || 0);
      
      setJobs(validJobs);
      setError(null);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleBackToSearch = () => {
    setSelectedJob(null);
  };

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-fade-in-up">
            <JobDetail job={selectedJob} onBack={handleBackToSearch} />
          </div>
        </div>
      </div>
    );
  }

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Perfect Job</h1>
          <p className="text-muted-foreground">Search through thousands of blue collar opportunities</p>
        </div>

        <div className="mb-8">
          <JobSearchFilters onSearch={handleSearch} />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {jobs.length} Jobs Found
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sort by:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="h-8 w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading && !isInitialLoad ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} onClick={() => handleJobSelect(job)} />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No jobs found matching your criteria</div>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
