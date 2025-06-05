import React, { useState } from 'react';
import Header from '../components/Header';
import { JobApplication } from '../types/Job';
import { User, Mail, Phone, Calendar, FileText, Eye, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchApplications } from '../lib/api';
import { mockJobs } from '../data/jobsData';

const Applications = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications
  });

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      REVIEWED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reviewed' },
      INTERVIEWED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interviewed' },
      HIRED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };
    
    // const config = statusConfig[status as keyof typeof statusConfig];
    const config = statusConfig.PENDING
    return (
      <span className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {config.label}
      </span>
    );
  };

  const updateApplicationStatus = (applicationId: string, newStatus: string) => {
    console.log(`Updating application ${applicationId} to status: ${newStatus}`);
  };

  const getJobTitle = (jobId: string) => {
    const job = mockJobs.find(j => j.jobId === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">Manage and review candidate applications</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Applications ({applications.length})
            </button>
            {/* Dynamically render status filter buttons */}
            {Array.from(new Set(applications.map(app => app.status || "PENDING"))).map((status) => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div key={application._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {application.applicant.full_name}
                  </h3>
                  <p className="text-blue-600 font-medium">{getJobTitle(application.job_id)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{application.applicant.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{application.applicant.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Applied {formatDate(application.submitted_on)}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{application.applicant.address.city}, {application.applicant.address.state}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Languages:</strong> {application.applicant.languages_spoken.join(', ')}
                </div>
                {application.applicant.identification.driving_license && (
                  <div className="text-sm text-gray-600">
                    <strong>Driving License:</strong> {application.applicant.identification.driving_license}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Gender: {application.applicant.gender} • Age: {new Date().getFullYear() - new Date(application.applicant.date_of_birth).getFullYear()} years
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No applications found.</p>
            <p className="text-gray-400 mt-2">Applications will appear here when candidates apply for jobs.</p>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedApplication.applicant.full_name}
                    </h2>
                    <p className="text-blue-600 font-medium">{getJobTitle(selectedApplication.job_id)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedApplication.applicant.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedApplication.applicant.phone_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-gray-900">{formatDate(selectedApplication.applicant.date_of_birth)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <p className="text-gray-900">{selectedApplication.applicant.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                      <p className="text-gray-900">{formatDate(selectedApplication.submitted_on)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
                      <p className="text-gray-900">{selectedApplication.application_id}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {selectedApplication.applicant.address.street}<br/>
                        {selectedApplication.applicant.address.city}, {selectedApplication.applicant.address.state}<br/>
                        {selectedApplication.applicant.address.postal_code}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedApplication.applicant.languages_spoken.join(', ')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Identification</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p className="text-gray-700"><strong>Aadhaar:</strong> {selectedApplication.applicant.identification.aadhaar_number}</p>
                      {selectedApplication.applicant.identification.driving_license && (
                        <p className="text-gray-700"><strong>Driving License:</strong> {selectedApplication.applicant.identification.driving_license}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedApplication.applicant.email}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
