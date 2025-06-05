
import { Job, JobApplication } from '../types/Job';

export const mockJobs: Job[] = [
  {
    "_id": "68405f8a368701dcb24c8f7f",
    "jobId": "JOB-1001-DEL",
    "title": "Delivery Executive (Two-Wheeler Required)",
    "description": "We are hiring delivery executives to deliver parcels across Bengaluru city. Applicants must own a two-wheeler and a valid driving license.",
    "category": "Logistics",
    "jobType": "full_time",
    "company": {
      "name": "SwiftDeliver Pvt Ltd",
      "description": "SwiftDeliver is a fast-growing hyperlocal logistics startup providing 2-hour delivery across metros.",
      "industry": "Logistics"
    },
    "location": {
      "address": "7th Main, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560038",
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "requirements": {
      "experienceInYears": 2,
      "gender": "male",
      "education": ["XII"],
      "certifications": [],
      "skills": ["Driving", "Navigation", "Customer Interaction"],
      "languages": ["Hindi", "Kannada", "Basic English"],
      "assetsRequired": ["Two-wheeler", "Smartphone", "Valid DL"]
    },
    "responsibilities": [
      "Pick up and deliver packages as per route plan",
      "Collect COD payments from customers",
      "Maintain delivery logs via mobile app"
    ],
    "salary": {
      "amount": 18000,
      "currency": "INR",
      "frequency": "monthly"
    },
    "schedule": {
      "shiftType": "day",
      "hoursPerWeek": 40,
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
      "startTime": "07:00",
      "endTime": "15:30",
      "overtimeAvailable": true,
      "weekendWork": false
    },
    "benefits": [
      "health_insurance",
      "dental_insurance",
      "paid_time_off",
      "workers_compensation",
      "tools_provided",
      "uniform_provided",
      "training_provided",
      "career_advancement"
    ],
    "postedDate": "2025-06-01T10:00:00Z",
    "validUntil": "2025-06-15T23:59:59Z",
    "metadata": {
      "tags": ["delivery", "bike", "fresher_friendly", "bangalore"]
    }
  },
  {
    "_id": "68405f8a368701dcb24c8f80",
    "jobId": "JOB-1002-CON",
    "title": "Construction Worker - Building Projects",
    "description": "Seeking experienced construction workers for residential and commercial building projects. Must have knowledge of basic construction tools and safety protocols.",
    "category": "Construction",
    "jobType": "full_time",
    "company": {
      "name": "BuildMax Construction",
      "description": "BuildMax is a leading construction company specializing in residential and commercial projects across Karnataka.",
      "industry": "Construction"
    },
    "location": {
      "address": "Electronics City Phase 1",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560100",
      "latitude": 12.8456,
      "longitude": 77.6603
    },
    "requirements": {
      "experienceInYears": 3,
      "education": ["X", "XII"],
      "certifications": ["Safety Training Certificate"],
      "skills": ["Masonry", "Concrete Work", "Tool Operation", "Blueprint Reading"],
      "languages": ["Hindi", "Kannada", "Tamil"],
      "assetsRequired": ["Basic Hand Tools", "Safety Equipment"]
    },
    "responsibilities": [
      "Perform construction tasks as per project requirements",
      "Operate hand and power tools safely",
      "Follow safety protocols and wear protective equipment",
      "Assist in material handling and site preparation"
    ],
    "salary": {
      "amount": 25000,
      "currency": "INR",
      "frequency": "monthly"
    },
    "schedule": {
      "shiftType": "day",
      "hoursPerWeek": 48,
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      "startTime": "06:00",
      "endTime": "14:00",
      "overtimeAvailable": true,
      "weekendWork": true
    },
    "benefits": [
      "health_insurance",
      "workers_compensation",
      "tools_provided",
      "uniform_provided",
      "training_provided",
      "performance_bonus"
    ],
    "postedDate": "2025-06-02T08:00:00Z",
    "validUntil": "2025-06-20T23:59:59Z",
    "metadata": {
      "tags": ["construction", "building", "experienced", "bangalore"]
    }
  },
  {
    "_id": "68405f8a368701dcb24c8f81",
    "jobId": "JOB-1003-WAR",
    "title": "Warehouse Associate - Night Shift",
    "description": "Looking for warehouse associates to handle inventory management, packing, and loading operations during night shift. No prior experience required.",
    "category": "Warehouse",
    "jobType": "full_time",
    "company": {
      "name": "LogiHub Warehousing",
      "description": "LogiHub provides comprehensive warehousing and distribution services for e-commerce and retail businesses.",
      "industry": "Logistics"
    },
    "location": {
      "address": "Hosur Road, Bommanahalli",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560068",
      "latitude": 12.9141,
      "longitude": 77.6011
    },
    "requirements": {
      "experienceInYears": 0,
      "education": ["X"],
      "certifications": [],
      "skills": ["Physical Fitness", "Basic Computer Skills", "Attention to Detail"],
      "languages": ["Hindi", "Kannada", "English"],
      "assetsRequired": []
    },
    "responsibilities": [
      "Receive and process incoming inventory",
      "Pick and pack orders accurately",
      "Load and unload delivery vehicles",
      "Maintain warehouse cleanliness and organization"
    ],
    "salary": {
      "amount": 16000,
      "currency": "INR",
      "frequency": "monthly"
    },
    "schedule": {
      "shiftType": "night",
      "hoursPerWeek": 40,
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday"],
      "startTime": "22:00",
      "endTime": "06:00",
      "overtimeAvailable": true,
      "weekendWork": false
    },
    "benefits": [
      "health_insurance",
      "night_shift_allowance",
      "transportation_provided",
      "paid_time_off",
      "career_advancement"
    ],
    "postedDate": "2025-06-03T12:00:00Z",
    "validUntil": "2025-06-18T23:59:59Z",
    "metadata": {
      "tags": ["warehouse", "night_shift", "fresher_friendly", "bangalore"]
    }
  },
  {
    "_id": "68405f8a368701dcb24c8f82",
    "jobId": "JOB-1004-SEC",
    "title": "Security Guard - Commercial Complex",
    "description": "Hiring security guards for 24/7 security services at commercial complexes. Must be physically fit and have clean background verification.",
    "category": "Security",
    "jobType": "full_time",
    "company": {
      "name": "SecureShield Services",
      "description": "SecureShield provides professional security services for commercial and residential properties across South India.",
      "industry": "Security Services"
    },
    "location": {
      "address": "MG Road, Central Business District",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560001",
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "requirements": {
      "experienceInYears": 1,
      "gender": "male",
      "education": ["X", "XII"],
      "certifications": ["Security Guard License"],
      "skills": ["Physical Fitness", "Vigilance", "Communication", "First Aid"],
      "languages": ["Hindi", "Kannada", "English"],
      "assetsRequired": []
    },
    "responsibilities": [
      "Monitor premises through patrols and surveillance",
      "Control access to buildings and parking areas",
      "Respond to alarms and emergency situations",
      "Maintain security logs and incident reports"
    ],
    "salary": {
      "amount": 15000,
      "currency": "INR",
      "frequency": "monthly"
    },
    "schedule": {
      "shiftType": "rotating",
      "hoursPerWeek": 48,
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      "startTime": "08:00",
      "endTime": "20:00",
      "overtimeAvailable": true,
      "weekendWork": true
    },
    "benefits": [
      "health_insurance",
      "uniform_provided",
      "training_provided",
      "paid_time_off",
      "shift_allowance"
    ],
    "postedDate": "2025-06-04T09:00:00Z",
    "validUntil": "2025-06-25T23:59:59Z",
    "metadata": {
      "tags": ["security", "guard", "commercial", "bangalore"]
    }
  },
  {
    "_id": "68405f8a368701dcb24c8f83",
    "jobId": "JOB-1005-MAN",
    "title": "Factory Production Operator",
    "description": "Seeking production operators for manufacturing unit. Will be responsible for operating machinery and ensuring quality standards in production line.",
    "category": "Manufacturing",
    "jobType": "full_time",
    "company": {
      "name": "TechManufacturing Pvt Ltd",
      "description": "TechManufacturing specializes in precision engineering and component manufacturing for automotive and electronics industries.",
      "industry": "Manufacturing"
    },
    "location": {
      "address": "Peenya Industrial Area",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": "560058",
      "latitude": 13.0280,
      "longitude": 77.5175
    },
    "requirements": {
      "experienceInYears": 2,
      "education": ["XII", "ITI"],
      "certifications": ["Machine Operation Certificate"],
      "skills": ["Machine Operation", "Quality Control", "Safety Protocols", "Basic Maintenance"],
      "languages": ["Hindi", "Kannada", "English"],
      "assetsRequired": []
    },
    "responsibilities": [
      "Operate production machinery according to specifications",
      "Monitor product quality and report defects",
      "Perform routine maintenance of equipment",
      "Follow safety procedures and quality standards"
    ],
    "salary": {
      "amount": 22000,
      "currency": "INR",
      "frequency": "monthly"
    },
    "schedule": {
      "shiftType": "day",
      "hoursPerWeek": 48,
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      "startTime": "08:00",
      "endTime": "16:00",
      "overtimeAvailable": true,
      "weekendWork": true
    },
    "benefits": [
      "health_insurance",
      "provident_fund",
      "performance_bonus",
      "training_provided",
      "career_advancement",
      "canteen_facility"
    ],
    "postedDate": "2025-06-05T07:00:00Z",
    "validUntil": "2025-06-30T23:59:59Z",
    "metadata": {
      "tags": ["manufacturing", "production", "machinery", "bangalore"]
    }
  }
];

export const mockApplications: JobApplication[] = [
  {
    "_id": "68405fc29aab725b5fff179d",
    "application_id": "APP-856828-0F4B",
    "job_id": "JOB-1004-SEC",
    "applicant": {
      "full_name": "Arun Kumar",
      "phone_number": "+91-9876543211",
      "email": "arunkumar89@example.com",
      "date_of_birth": "1998-04-15",
      "gender": "Male",
      "languages_spoken": ["Hindi", "Kannada", "English"],
      "address": {
        "street": "3rd Cross, BTM Layout",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560076"
      },
      "identification": {
        "aadhaar_number": "XXXX-XXXX-1234",
        "driving_license": "KA1234567890123"
      }
    },
    "submitted_on": "2025-06-04T15:01:22.142Z",
    "documents_uploaded": [],
    "status": "PENDING"
  },
  {
    "_id": "68405fc29aab725b5fff179e",
    "application_id": "APP-856829-1G5C",
    "job_id": "JOB-1001-DEL",
    "applicant": {
      "full_name": "Rajesh Sharma",
      "phone_number": "+91-9876543212",
      "email": "rajesh.sharma@example.com",
      "date_of_birth": "1995-08-22",
      "gender": "Male",
      "languages_spoken": ["Hindi", "English"],
      "address": {
        "street": "12th Main, Koramangala",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560034"
      },
      "identification": {
        "aadhaar_number": "XXXX-XXXX-5678",
        "driving_license": "KA5678901234567"
      }
    },
    "submitted_on": "2025-06-03T11:30:15.542Z",
    "documents_uploaded": ["resume.pdf", "license_copy.jpg"],
    "status": "REVIEWED"
  },
  {
    "_id": "68405fc29aab725b5fff179f",
    "application_id": "APP-856830-2H6D",
    "job_id": "JOB-1002-CON",
    "applicant": {
      "full_name": "Murugan S",
      "phone_number": "+91-9876543213",
      "email": "murugan.s@example.com",
      "date_of_birth": "1990-12-10",
      "gender": "Male",
      "languages_spoken": ["Tamil", "Kannada", "Hindi"],
      "address": {
        "street": "5th Block, Jayanagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560041"
      },
      "identification": {
        "aadhaar_number": "XXXX-XXXX-9012"
      }
    },
    "submitted_on": "2025-06-02T14:20:30.123Z",
    "documents_uploaded": ["experience_certificate.pdf"],
    "status": "INTERVIEWED"
  },
  {
    "_id": "68405fc29aab725b5fff17a0",
    "application_id": "APP-856831-3I7E",
    "job_id": "JOB-1003-WAR",
    "applicant": {
      "full_name": "Priya Devi",
      "phone_number": "+91-9876543214",
      "email": "priya.devi@example.com",
      "date_of_birth": "2000-03-18",
      "gender": "Female",
      "languages_spoken": ["Hindi", "Kannada"],
      "address": {
        "street": "2nd Stage, BTM Layout",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560076"
      },
      "identification": {
        "aadhaar_number": "XXXX-XXXX-3456"
      }
    },
    "submitted_on": "2025-06-01T16:45:12.987Z",
    "documents_uploaded": ["id_proof.jpg"],
    "status": "HIRED"
  },
  {
    "_id": "68405fc29aab725b5fff17a1",
    "application_id": "APP-856832-4J8F",
    "job_id": "JOB-1005-MAN",
    "applicant": {
      "full_name": "Vinay Kumar",
      "phone_number": "+91-9876543215",
      "email": "vinay.kumar@example.com",
      "date_of_birth": "1992-07-25",
      "gender": "Male",
      "languages_spoken": ["Kannada", "English", "Hindi"],
      "address": {
        "street": "4th Cross, Malleshwaram",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postal_code": "560003"
      },
      "identification": {
        "aadhaar_number": "XXXX-XXXX-7890",
        "driving_license": "KA7890123456789"
      }
    },
    "submitted_on": "2025-06-05T10:15:45.321Z",
    "documents_uploaded": ["iti_certificate.pdf", "experience_letter.pdf"],
    "status": "PENDING"
  }
];
