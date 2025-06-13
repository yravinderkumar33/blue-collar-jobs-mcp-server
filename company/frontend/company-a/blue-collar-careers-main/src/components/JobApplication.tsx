import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { applyToJob } from '@/services/jobApi';
import { type Job, type ApplicationData } from '@/services/types';

interface JobApplicationProps {
  job: Job;
  onBack: () => void;
  onSuccess: () => void;
}

const JobApplication: React.FC<JobApplicationProps> = ({ job, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{phone?: string, aadhaar?: string, email?: string}>({});
  const [formData, setFormData] = useState<ApplicationData>({
    applicant: {
      full_name: '',
      phone_number: '',
      email: '',
      date_of_birth: '',
      gender: '',
      languages_spoken: [],
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: ''
      },
      identification: {
        aadhaar_number: '',
        driving_license: ''
      }
    },
    documents_uploaded: []
  });

  const handleInputChange = (field: string, value: string, nested?: string) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          applicant: {
            ...prev.applicant,
            [nested]: {
              ...(prev.applicant as any)[nested],
              [field]: value
            }
          }
        };
      }
      return {
        ...prev,
        applicant: {
          ...prev.applicant,
          [field]: value
        }
      };
    });
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        languages_spoken: checked 
          ? [...prev.applicant.languages_spoken, language]
          : prev.applicant.languages_spoken.filter(lang => lang !== language)
      }
    }));
  };

  const validate = () => {
    const errs: {phone?: string, aadhaar?: string, email?: string} = {};
    if (!/^\+?\d{10,15}$/.test(formData.applicant.phone_number)) {
      errs.phone = 'Enter a valid phone number';
    }
    if (formData.applicant.identification.aadhaar_number && !/^\d{4}-\d{4}-\d{4}$/.test(formData.applicant.identification.aadhaar_number)) {
      errs.aadhaar = 'Aadhaar must be in XXXX-XXXX-XXXX format';
    }
    if (formData.applicant.email && !/^\S+@\S+\.\S+$/.test(formData.applicant.email)) {
      errs.email = 'Enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await applyToJob(job.jobId, formData);
      if (response.responseCode === 'OK') {
        toast({
          title: "Application Submitted Successfully!",
          description: `Your application ID is ${response.result.application.application_id}`,
        });
        setSubmitted(true);
        onSuccess();
      } else {
        throw new Error('Application failed');
      }
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const availableLanguages = ['Hindi', 'English', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati'];

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
          Back to Job
        </Button>
      </div>

      {/* Job Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-primary font-medium">{job.company.name}</p>
              <p className="text-sm text-gray-600">{job.location.city}, {job.location.state}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">
                ₹{job.salary.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">per {job.salary.frequency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <div className="text-green-700 text-lg font-semibold">Application submitted!</div>
          </div>
        ) : (
          <>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      required
                      value={formData.applicant.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      required
                      value={formData.applicant.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+91-9876543210"
                      type="tel"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.applicant.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      required
                      value={formData.applicant.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages Spoken *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {availableLanguages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.applicant.languages_spoken.includes(language)}
                          onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      required
                      value={formData.applicant.address.street}
                      onChange={(e) => handleInputChange('street', e.target.value, 'address')}
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.applicant.address.city}
                      onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.applicant.address.state}
                      onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Postal Code *</Label>
                    <Input
                      id="postal_code"
                      required
                      value={formData.applicant.address.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value, 'address')}
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identification */}
            <Card>
              <CardHeader>
                <CardTitle>Identification Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaar_number">Aadhaar Number *</Label>
                    <Input
                      id="aadhaar_number"
                      required
                      value={formData.applicant.identification.aadhaar_number}
                      onChange={(e) => handleInputChange('aadhaar_number', e.target.value, 'identification')}
                      placeholder="XXXX-XXXX-XXXX"
                      className={errors.aadhaar ? 'border-red-500' : ''}
                    />
                    {errors.aadhaar && <div className="text-red-500 text-xs mt-1">{errors.aadhaar}</div>}
                  </div>
                  <div>
                    <Label htmlFor="driving_license">Driving License</Label>
                    <Input
                      id="driving_license"
                      value={formData.applicant.identification.driving_license}
                      onChange={(e) => handleInputChange('driving_license', e.target.value, 'identification')}
                      placeholder="DL Number (if applicable)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Documents Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload your documents</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Support formats: PDF, JPG, PNG (Max 5MB each)
                  </p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="gradient-accent text-white px-8 flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Submitting Application...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Submit Application
                  </div>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default JobApplication; 