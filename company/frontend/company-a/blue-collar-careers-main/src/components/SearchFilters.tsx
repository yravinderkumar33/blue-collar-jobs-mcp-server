import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '@/services/types';

interface SearchFiltersProps {
  onSearch: (filters: SearchFiltersType) => void;
}

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && searchTerm.length >= 2) {
        console.log('inside searchTerm in useEffect')
        setIsSearching(true);
        handleSearch();
      } else if (searchTerm.length === 0) {
        // If search term is cleared, reset the search
        handleSearch();
      }
    }, 1000); // Increased debounce time to 1 second

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = () => {
    // Remove empty values from filters
    console.log('inside handleSearch function')

    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        acc[key] = value;
      }
      console.log('acc',acc)
      return acc;

    }, {} as SearchFiltersType);

    // Always include searchTerm in the request if it exists
    const searchFilters = {
      ...cleanedFilters,
      searchTerm: searchTerm || undefined
    };

    console.log('Sending search request with filters:', searchFilters);
    onSearch(searchFilters);
    setIsSearching(false);
  };

  const handleFilterChange = (key: keyof SearchFiltersType, value: string | number | string[] | undefined) => {
    setFilters(prev => {
      // If value is empty, remove the filter
      if (value === undefined || value === '' || value === null) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }

      // Handle different types of values
      let processedValue = value;
      if (key === 'salaryMin') {
        processedValue = parseInt(value as string);
      } else if (key === 'skills') {
        // For skills, maintain an array of unique values
        const currentSkills = prev.skills || [];
        console.log('printing currentskill',currentSkills)

        const newSkill = value as string;
        if (!currentSkills.includes(newSkill)) {
          processedValue = [...currentSkills, newSkill];
          console.log('if block printing processedValue',processedValue)
        } else {
          // If skill already exists, remove it
          
          processedValue = currentSkills.filter(skill => skill !== newSkill);
          console.log('else block printing processedValue',processedValue)
        }
      }

      return {
        ...prev,
        [key]: processedValue
      };
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onSearch({});
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Perfect Job
          </h3>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by job title, skills, or company... (min. 2 characters)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="h-12 px-4 text-base"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </Button>
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search Jobs'}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Filter Jobs</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Select onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Accounts">Accounts</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('jobType', value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('location', value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(value) => handleFilterChange('experienceLevel', parseInt(value))}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Fresher</SelectItem>
                  <SelectItem value="1">1 Year</SelectItem>
                  <SelectItem value="2">2 Years</SelectItem>
                  <SelectItem value="3">3+ Years</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('salaryMin', value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Min Salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9000">₹9,000</SelectItem>
                  <SelectItem value="12000">₹12,000</SelectItem>
                  <SelectItem value="15000">₹15,000</SelectItem>
                  <SelectItem value="18000">₹18,000</SelectItem>
                  <SelectItem value="20000">₹20,000+</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('skills', value)}>
                <SelectTrigger className="h-11 border-2 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Driving">Driving</SelectItem>
                  <SelectItem value="Navigation">Navigation</SelectItem>
                  <SelectItem value="Customer Interaction">Customer Interaction</SelectItem>
                  <SelectItem value="Inventory Management">Inventory Management</SelectItem>
                  <SelectItem value="Teamwork">Teamwork</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Problem Solving">Problem Solving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilters; 