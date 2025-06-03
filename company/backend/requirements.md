# Blue Collar Jobs MCP Server POC Implementation Design

## API Design

### Sample Job Post Structure

```json
{
  "jobId": "JOB-2391-DEL",
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
    "education": [
      "XII"
    ],
    "certifications": [],
    "skills": [
      "Driving",
      "Navigation",
      "Customer Interaction"
    ],
    "languages": [
      "Hindi",
      "Kannada",
      "Basic English"
    ],
    "assetsRequired": [
      "Two-wheeler",
      "Smartphone",
      "Valid DL"
    ]
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
    "daysOfWeek": [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday"
    ],
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
    "tags": [
      "delivery",
      "bike",
      "fresher_friendly",
      "bangalore"
    ]
  }
}
```

---

## API Endpoints

The following section describes the available API endpoints.

### 1. Search Jobs with Filters

**HTTP Method:** `POST`

**URL:** `/api/jobs/search`

#### Request Body

```json
{
  "request": {
    "filters": {},
    "options": {}
  }
}
```

#### Response Body

```json
{
  "id": "api.jobs.search",
  "ver": "1.0",
  "ets": 1634371946769,
  "params": {
    "msgid": "d51e6e6a-027d-4a42-84bb-2ce00e31d993",
    "err": "",
    "status": "SUCCESSFUL",
    "errmsg": ""
  },
  "responseCode": "OK",
  "result": {
    "jobs": []
  }
}
```

---

### 2. View Job Detail

Retrieves the detailed information for a specific job using its `job_id`.

**HTTP Method:** `GET`

**URL:** `/api/jobs/{job_id}`

**Path Parameters:**
- `job_id` (string, required): The unique identifier of the job to retrieve.

#### Response Body

```json
{
  "id": "api.jobs.view",
  "ver": "1.0",
  "ets": 1634371946769,
  "params": {
    "msgid": "d51e6e6a-027d-4a42-84bb-2ce00e31d993",
    "err": "",
    "status": "SUCCESSFUL",
    "errmsg": ""
  },
  "responseCode": "OK",
  "result": {
    "job": {}
  }
}
```

---

### 3. Apply to a Job

Allows a user to submit an application for a specific job.

**HTTP Method:** `POST`

**URL:** `/api/jobs/{job_id}/apply`

**Path Parameters:**
- `job_id` (string, required): The unique identifier of the job to apply for.

#### Request Body
The request body includes the application details such as applicant information.

```json
{
  "application_id": "APP-784532",
  "job_id": "JOB-2391-DEL",
  "submitted_on": "2025-06-02T14:32:00Z",
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
  "documents_uploaded": []
}
```

#### Response Body

```json
{
  "id": "api.jobs.apply",
  "ver": "1.0",
  "ets": 1634371946769,
  "params": {
    "msgid": "d51e6e6a-027d-4a42-84bb-2ce00e31d993",
    "err": "",
    "status": "SUCCESSFUL",
    "errmsg": ""
  },
  "responseCode": "OK",
  "result": {
    "application": {
      "application_id": "APP-9876-XYZ",
      "job_id": "JOB-2391-DEL",
      "status": "submitted",
      "applied_at": "2025-06-02T14:30:00Z"
    }
  }
}
```



