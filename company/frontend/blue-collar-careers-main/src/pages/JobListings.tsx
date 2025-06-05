import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import SearchAndFilters from '../components/SearchAndFilters';
import { TrendingUp, MapPin, Users, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '../lib/api';

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !locationFilter || 
                             job.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
                             job.location.state.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || 
                             job.category === categoryFilter;
      const matchesType = typeFilter === 'All Types' || 
                         job.jobType === typeFilter;
      return matchesSearch && matchesLocation && matchesCategory && matchesType;
    });
  }, [jobs, searchTerm, locationFilter, categoryFilter, typeFilter]);

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'blue' },
    { label: 'Companies', value: new Set(jobs.map(job => job.company.name)).size, icon: Users, color: 'green' },
    { label: 'Cities', value: new Set(jobs.map(job => job.location.city)).size, icon: MapPin, color: 'purple' },
    { label: 'This Week', value: jobs.filter(job => {
      const jobDate = new Date(job.postedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return jobDate >= weekAgo;
    }).length, icon: TrendingUp, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Next 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover opportunities in logistics, construction, manufacturing, and more. 
            Your perfect blue-collar career awaits.
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className={`inline-flex p-2 rounded-lg mb-2 bg-${stat.color}-100`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
            </h2>
            {(searchTerm || locationFilter || categoryFilter !== 'All Categories' || typeFilter !== 'All Types') && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                Filtered
              </span>
            )}
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm">
            <option>Sort by: Most Recent</option>
            <option>Sort by: Salary High to Low</option>
            <option>Sort by: Salary Low to High</option>
            <option>Sort by: Company Name</option>
          </select>
        </div>
        {isLoading ? (
          <div className="text-center py-16 text-lg text-gray-500">Loading jobs...</div>
        ) : isError ? (
          <div className="text-center py-16 text-lg text-red-500">Failed to load jobs.</div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
        {filteredJobs.length === 0 && !isLoading && !isError && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 text-lg mb-6">No jobs match your current search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setCategoryFilter('All Categories');
                setTypeFilter('All Types');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListings;
