import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building, Calendar, ChevronRight } from 'lucide-react';
import { Job } from '@/services/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, IndianRupee } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  // Defensive checks to prevent undefined errors
  if (!job || !job.company || !job.location || !job.salary || !job.requirements) {
    console.warn('Invalid job data:', job);
    return null;
  }

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
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${job.title} at ${job.company?.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {job.company?.name?.charAt(0) || 'J'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                  {job.title || 'Job Title'}
                </h3>
                <p className="text-blue-600 font-semibold mb-2">{job.company?.name || 'Company'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location?.city || 'City'}, {job.location?.state || 'State'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.category || 'Category'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.jobType?.replace('_', ' ') || 'Job Type'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-1 text-lg font-bold">
                <IndianRupee className="h-4 w-4" />
                {job.salary?.amount?.toLocaleString() || '0'}
              </div>
              <p className="text-xs opacity-90">per {job.salary?.frequency || 'month'}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{job.description || 'No description available'}</p>

        <div className="flex flex-wrap gap-2">
          {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={skill || index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              {skill}
            </Badge>
          )) || []}
          {(job.requirements?.skills?.length || 0) > 3 && (
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              +{(job.requirements?.skills?.length || 0) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
