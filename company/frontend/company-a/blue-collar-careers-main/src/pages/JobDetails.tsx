import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Calendar, Mail, Phone, User } from 'lucide-react';
import Header from '../components/Header';
// import { mockJobs } from '../data/jobsData';
import { toast } from '@/hooks/use-toast';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  // const job = mockJobs.find(j => j.jobId === id);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    languages_spoken: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    aadhaar_number: '',
    driving_license: ''
  });

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Job Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatSalary = (salary: typeof job.salary) => {
    return `₹${salary.amount.toLocaleString()} per ${salary.frequency}`;
  };

  const formatJobType = (jobType: string) => {
    return jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatBenefit = (benefit: string) => {
    return benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent successfully. We'll be in touch soon.",
    });
    setShowApplicationForm(false);
    setApplicationData({
      full_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      gender: '',
      languages_spoken: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      aadhaar_number: '',
      driving_license: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Job Listings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Job Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building className="h-5 w-5 mr-2" />
                      <span className="text-lg font-medium">{job.company.name}</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location.city}, {job.location.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium text-green-600">{formatSalary(job.salary)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{formatJobType(job.jobType)}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {formatDate(job.postedDate)} • {job.requirements.experienceInYears}+ years experience required
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Company:</strong> {job.company.description}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Education & Experience</h3>
                    <ul className="space-y-1 text-gray-700">
                      <li>• {job.requirements.experienceInYears}+ years experience</li>
                      {job.requirements.education.map((edu, index) => (
                        <li key={index}>• {edu} qualification</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Skills Required</h3>
                    <ul className="space-y-1 text-gray-700">
                      {job.requirements.skills.map((skill, index) => (
                        <li key={index}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
                    <ul className="space-y-1 text-gray-700">
                      {job.requirements.languages.map((lang, index) => (
                        <li key={index}>• {lang}</li>
                      ))}
                    </ul>
                  </div>
                  {job.requirements.assetsRequired.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Assets Required</h3>
                      <ul className="space-y-1 text-gray-700">
                        {job.requirements.assetsRequired.map((asset, index) => (
                          <li key={index}>• {asset}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{formatBenefit(benefit)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p><strong>Shift Type:</strong> {job.schedule.shiftType}</p>
                    <p><strong>Hours per Week:</strong> {job.schedule.hoursPerWeek}</p>
                    <p><strong>Working Hours:</strong> {job.schedule.startTime} - {job.schedule.endTime}</p>
                  </div>
                  <div>
                    <p><strong>Working Days:</strong> {job.schedule.daysOfWeek.join(', ')}</p>
                    <p><strong>Overtime Available:</strong> {job.schedule.overtimeAvailable ? 'Yes' : 'No'}</p>
                    <p><strong>Weekend Work:</strong> {job.schedule.weekendWork ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this job</h3>
              
              {!showApplicationForm ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Ready to take the next step in your career? Apply now!
                  </p>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicationData.full_name}
                        onChange={(e) => setApplicationData({...applicationData, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicationData.email}
                        onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicationData.phone_number}
                        onChange={(e) => setApplicationData({...applicationData, phone_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={applicationData.date_of_birth}
                        onChange={(e) => setApplicationData({...applicationData, date_of_birth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={applicationData.gender}
                        onChange={(e) => setApplicationData({...applicationData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="XXXX-XXXX-XXXX"
                        value={applicationData.aadhaar_number}
                        onChange={(e) => setApplicationData({...applicationData, aadhaar_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {job.requirements.assetsRequired.some(asset => asset.toLowerCase().includes('license')) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driving License
                        </label>
                        <input
                          type="text"
                          value={applicationData.driving_license}
                          onChange={(e) => setApplicationData({...applicationData, driving_license: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{job.company.name}</p>
                  <p className="text-sm text-gray-600">{job.company.industry}</p>
                </div>
                <p className="text-sm text-gray-700">{job.company.description}</p>
                <div className="text-sm text-gray-600">
                  <p><strong>Location:</strong> {job.location.address}, {job.location.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
