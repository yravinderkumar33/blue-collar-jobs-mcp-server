import { Request, Response } from 'express';
import Job from '../models/Job';
import Application from '../models/Application';
import { buildResponsePayload } from '../utils/response';

const integrationsMapping = {
  "company-a": {
    "url": process.env.company_a_url || "http://localhost:3000"
  },
  "company-b": {
    "url": process.env.company_b_url || "http://localhost:4000"
  }
}

// 1. Search Jobs with Filters
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { filters = {}, options = {} } = req.body.request || {};
    // For now, filters are directly mapped to MongoDB query
    const jobs = await Job.find(filters, null, options).lean();
    res.json(buildResponsePayload({
      id: 'api.jobs.search',
      result: { jobs },
      responseCode: 'OK',
      params: {
        status: 'SUCCESSFUL',
        err: '',
        errmsg: ''
      }
    }));
  } catch (err) {
    res.status(500).json(buildResponsePayload({
      id: 'api.jobs.search',
      result: { jobs: [] },
      responseCode: 'INTERNAL_ERROR',
      params: {
        status: 'FAILED',
        err: 'INTERNAL_ERROR',
        errmsg: (err as Error).message
      }
    }));
  }
};

// 2. View Job Detail
export const viewJob = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    const job = await Job.findOne({ jobId: job_id }).lean();
    if (!job) {
      res.status(404).json(buildResponsePayload({
        id: 'api.jobs.view',
        result: { job: {} },
        responseCode: 'NOT_FOUND',
        params: {
          status: 'FAILED',
          err: 'NOT_FOUND',
          errmsg: 'Job not found'
        }
      }));
      return;
    }
    res.json(buildResponsePayload({
      id: 'api.jobs.view',
      result: { job },
      responseCode: 'OK',
      params: {
        status: 'SUCCESSFUL',
        err: '',
        errmsg: ''
      }
    }));
  } catch (err) {
    res.status(500).json(buildResponsePayload({
      id: 'api.jobs.view',
      result: { job: {} },
      responseCode: 'INTERNAL_ERROR',
      params: {
        status: 'FAILED',
        err: 'INTERNAL_ERROR',
        errmsg: (err as Error).message
      }
    }));
  }
};

// 3. Apply to a Job
export const applyToJob = async (req: Request, res: Response, next: any) => {
  try {
    const { job_id } = req.params;
    const job = await Job.findOne({ jobId: job_id });

    if (!job) {
      console.log("Job not found");
      res.status(404).json(buildResponsePayload({
        id: 'api.jobs.apply',
        result: { application: {} },
        responseCode: 'NOT_FOUND',
        params: {
          status: 'FAILED',
          err: 'NOT_FOUND',
          errmsg: 'Job not found'
        }
      }));
      return;
    }

    const sourceId = job.toJSON().metadata?.source_id;

    if (!(sourceId in integrationsMapping)) {
      console.log("Invalid sourceId", sourceId);
      res.status(400).json(buildResponsePayload({
        id: 'api.jobs.apply',
        result: { application: {} },
        responseCode: 'BAD_REQUEST',
        params: {
          status: 'FAILED',
          err: 'INVALID_SOURCE',
          errmsg: `Invalid or unsupported job source: ${sourceId}`
        }
      }));
      return;
    }
    const backend = integrationsMapping[sourceId as keyof typeof integrationsMapping];

    const response = await fetch(`${backend.url}/api/jobs/${job_id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Blue-Collar-Jobs-Backend/1.0'
      },
      body: JSON.stringify({
        ...req.body,
        job_id
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }

    const data = await response.json();

    const application = new Application({
      application_id: data.result.application.application_id,
      source_id: sourceId,
    });

    await application.save();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// 4. Get All Job Applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { application_id } = req.params;

    const application = await Application.findOne({ application_id }).lean();

    if (!application) {
      res.status(404).json(buildResponsePayload({
        id: 'api.applications.list',
        result: { application: {} },
        responseCode: 'NOT_FOUND',
        params: {
          status: 'FAILED',
          err: 'NOT_FOUND',
          errmsg: 'Application not found'
        }
      }));
      return;
    }

    const sourceId = application.source_id;

    if (!(sourceId in integrationsMapping)) {
      console.log("Invalid sourceId", sourceId);

      return res.status(400).json(buildResponsePayload({
        id: 'api.jobs.apply',
        result: { application: {} },
        responseCode: 'BAD_REQUEST',
        params: {
          status: 'FAILED',
          err: 'INVALID_SOURCE',
          errmsg: `Invalid or unsupported job source: ${sourceId}`
        }
      }));
    }

    const backend = integrationsMapping[sourceId as keyof typeof integrationsMapping];

    const response = await fetch(`${backend.url}/api/jobs/applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }

    const data = await response.json();

    const applications = data.result.applications || [];
    const myApplication = applications.find((app: any) => app.application_id === application_id);

    if (!myApplication) {
      return res.status(404).json(buildResponsePayload({
        id: 'api.applications.list',
        result: { application: {} },
        responseCode: 'NOT_FOUND',
        params: {
          status: 'FAILED',
          err: 'NOT_FOUND',
          errmsg: 'Application not found'
        }
      }));
    }
    // Return the application details

    res.json(buildResponsePayload({
      id: 'api.applications.list',
      result: { application: myApplication },
      responseCode: 'OK',
      params: {
        status: 'SUCCESSFUL',
        err: '',
        errmsg: ''
      }
    }));

  } catch (err) {
    res.status(500).json(buildResponsePayload({
      id: 'api.applications.list',
      result: { applications: [] },
      responseCode: 'INTERNAL_ERROR',
      params: {
        status: 'FAILED',
        err: 'INTERNAL_ERROR',
        errmsg: (err as Error).message
      }
    }));
  }
}; 