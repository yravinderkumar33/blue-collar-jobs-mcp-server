import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import JobApplication from "@/components/JobApplication";
import { Job } from "@/services/types";
import { getJobDetail } from "@/services/jobApi";

const Apply = () => {
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
    if (id) {
      navigate(`/job/${id}`);
    } else {
      navigate('/search');
    }
  };

  const handleSuccess = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            {error || 'Job not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in-up">
          <JobApplication 
            job={job} 
            onBack={handleBack}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Apply;
