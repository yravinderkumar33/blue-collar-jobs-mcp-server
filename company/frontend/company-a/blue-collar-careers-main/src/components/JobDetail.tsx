import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Clock, 
  IndianRupee, 
  Calendar,
  Users,
  GraduationCap,
  Award,
  Languages,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Job } from '@/services/types';
import JobApplication from './JobApplication';

interface JobDetailProps {
  job: Job;
  onBack: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onBack }) => {
  const [showApplication, setShowApplication] = useState(false);

  const formatSalary = (salary: { amount: number; currency: string; frequency: string }) => {
    return `₹${salary.amount.toLocaleString()} per ${salary.frequency}`;
  };

  const getBenefitLabel = (benefit: string) => {
    const labels: { [key: string]: string } = {
      health_insurance: 'Health Insurance',
      dental_insurance: 'Dental Insurance',
      paid_time_off: 'Paid Time Off',
      workers_compensation: 'Workers Compensation',
      tools_provided: 'Tools Provided',
      uniform_provided: 'Uniform Provided',
      training_provided: 'Training Provided',
      career_advancement: 'Career Advancement'
    };
    return labels[benefit] || benefit.replace('_', ' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (showApplication) {
    return (
      <JobApplication 
        job={job} 
        onBack={() => setShowApplication(false)}
        onSuccess={() => {
          setShowApplication(false);
          // Could add a success toast here
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>

      {/* Job Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <h2 className="text-xl text-primary font-semibold mb-3">{job.company.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location.address}, {job.location.city}, {job.location.state}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.category}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.jobType.replace('_', ' ')}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted: {formatDate(job.postedDate)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-2xl font-bold text-green-600 mb-1">
                <IndianRupee className="h-6 w-6" />
                {job.salary.amount.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">per {job.salary.frequency}</p>
              <Badge variant="outline" className="mt-2">
                Valid until: {formatDate(job.validUntil)}
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="gradient-accent text-white px-8"
              onClick={() => setShowApplication(true)}
            >
              Apply Now
            </Button>
            <Button variant="outline">Save Job</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Key Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{job.company.description}</p>
              <Badge variant="secondary">Industry: {job.company.industry}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experience
                </h4>
                <p className="text-sm text-gray-600">
                  {job.requirements.experienceInYears} years minimum
                </p>
              </div>

              {job.requirements.education.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.education.map((edu) => (
                      <Badge key={edu} variant="outline" className="text-xs">
                        {edu}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements.languages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements.assetsRequired.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Required Assets
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.assetsRequired.map((asset) => (
                      <Badge key={asset} variant="destructive" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shift:</span>
                <span className="text-sm font-medium">{job.schedule.shiftType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hours/Week:</span>
                <span className="text-sm font-medium">{job.schedule.hoursPerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <span className="text-sm font-medium">
                  {job.schedule.startTime} - {job.schedule.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overtime:</span>
                <span className="text-sm font-medium">
                  {job.schedule.overtimeAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Weekend Work:</span>
                <span className="text-sm font-medium">
                  {job.schedule.weekendWork ? 'Required' : 'Not Required'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {job.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{getBenefitLabel(benefit)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 