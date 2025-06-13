import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import JobDetail from "@/components/JobDetail";
import { Job } from "@/services/types";
import { getJobDetail } from "@/services/jobApi";

const JobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getJobDetail(id);
        setJob(response.result.job);
        setError(null);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleBack = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-destructive bg-destructive/10 p-4 rounded-lg border border-border">
            {error || 'Job not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in-up">
          <JobDetail job={job} onBack={handleBack} />
        </div>
      </div>
    </div>
  );
};

export default JobView;
