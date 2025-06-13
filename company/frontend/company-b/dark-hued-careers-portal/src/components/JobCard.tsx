import { Job } from '@/services/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, IndianRupee } from 'lucide-react';

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

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow job-card-hover"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                {job.company?.name?.charAt(0) || 'J'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 leading-tight">
                  {job.title || 'Job Title'}
                </h3>
                <p className="text-primary font-semibold mb-2">{job.company?.name || 'Company'}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
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

        <p className="text-card-foreground mb-4 line-clamp-2 leading-relaxed">{job.description || 'No description available'}</p>

        <div className="flex flex-wrap gap-2">
          {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={skill || index} variant="secondary" className="bg-secondary text-secondary-foreground border-border">
              {skill}
            </Badge>
          )) || []}
          {(job.requirements?.skills?.length || 0) > 3 && (
            <Badge variant="outline" className="border-border text-muted-foreground">
              +{(job.requirements?.skills?.length || 0) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
