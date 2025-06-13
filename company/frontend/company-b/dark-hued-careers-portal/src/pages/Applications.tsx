import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Application } from '@/services/types';
import { User, Mail, Phone, Calendar, FileText, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications, getJobDetail } from '@/services/jobApi';

const Applications = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [jobTitles, setJobTitles] = useState<{ [jobId: string]: string }>({});

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  useEffect(() => {
    const fetchJobTitles = async () => {
      const uniqueJobIds = Array.from(new Set(applications.map(app => app.job_id)));
      const titles: { [jobId: string]: string } = {};
      await Promise.all(uniqueJobIds.map(async (jobId: string) => {
        try {
          const response = await getJobDetail(jobId);
          titles[jobId] = response.result.job.title;
        } catch {
          titles[jobId] = 'Unknown Position';
        }
      }));
      setJobTitles(titles);
    };
    if (applications.length > 0) {
      fetchJobTitles();
    }
  }, [applications]);

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
      REVIEWED: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Reviewed' },
      INTERVIEWED: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Interviewed' },
      HIRED: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hired' },
      REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
            Failed to load applications. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Applications</h1>
          <p className="text-muted-foreground">Manage and review candidate applications</p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All Applications ({applications.length})
            </button>
            {/* Dynamically render status filter buttons */}
            {Array.from(new Set(applications.map(app => app.status || "PENDING"))).map((status: string) => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    selectedStatus === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {status.toLowerCase()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <div key={application._id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {application.applicant.full_name}
                  </h3>
                  <p className="text-primary font-medium">Position: {jobTitles[application.job_id] || "Loading..."}</p>
                  <div className="mt-2">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{application.applicant.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{application.applicant.phone_number}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Applied {formatDate(application.submitted_on)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground text-lg">No applications found.</p>
            <p className="text-muted-foreground mt-2">Applications will appear here when candidates apply for jobs.</p>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {selectedApplication.applicant.full_name}
                    </h2>
                    <p className="text-primary font-medium">Position: {jobTitles[selectedApplication.job_id] || "Loading..."}</p>
                    <div className="mt-2">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-muted-foreground hover:text-foreground text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                      <p className="text-foreground">{selectedApplication.applicant.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                      <p className="text-foreground">{selectedApplication.applicant.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                      <p className="text-foreground">{selectedApplication.applicant.phone_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Applied Date</label>
                      <p className="text-foreground">{formatDate(selectedApplication.submitted_on)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Application ID</label>
                      <p className="text-foreground">{selectedApplication.application_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Job ID</label>
                      <p className="text-foreground">{selectedApplication.job_id}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-foreground"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedApplication.applicant.email}`}
                    className="px-4 py-2 gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Contact Applicant
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications; 