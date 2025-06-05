
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building, Calendar, ChevronRight } from 'lucide-react';
import { Job } from '../types/Job';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = (salary: Job['salary']) => {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Logistics': 'bg-blue-50 text-blue-700 border-blue-200',
      'Construction': 'bg-orange-50 text-orange-700 border-orange-200',
      'Warehouse': 'bg-purple-50 text-purple-700 border-purple-200',
      'Security': 'bg-green-50 text-green-700 border-green-200',
      'Manufacturing': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <Link
      to={`/job/${job.jobId}`}
      className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-3">
            <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
              <Building className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800">{job.company.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getCategoryColor(job.category)}`}>
            {job.category}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-gray-600">
          <div className="bg-gray-100 p-1.5 rounded-lg mr-3">
            <MapPin className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium">{job.location.city}, {job.location.state}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <div className="bg-green-100 p-1.5 rounded-lg mr-3">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm font-bold text-green-700">{formatSalary(job.salary)}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <div className="bg-purple-100 p-1.5 rounded-lg mr-3">
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <span className="text-sm">{formatJobType(job.jobType)} • {job.requirements.experienceInYears}+ years</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <div className="bg-gray-100 p-1.5 rounded-lg mr-3">
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-sm">{formatDate(job.postedDate)}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {job.requirements.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">
              {skill}
            </span>
          ))}
          {job.requirements.skills.length > 2 && (
            <span className="text-xs text-gray-500">+{job.requirements.skills.length - 2} more</span>
          )}
        </div>
        <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
          View Details
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
