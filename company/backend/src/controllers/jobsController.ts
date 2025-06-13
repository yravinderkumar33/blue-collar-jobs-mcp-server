import { Request, Response } from 'express';
import Job from '../models/Job';
import Application from '../models/Application';
import { v4 as uuidv4 } from 'uuid';
import { buildResponsePayload } from '../utils/response';

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

    const application_id = `APP-${Math.floor(Math.random() * 1000000)}-${uuidv4().slice(0, 4).toUpperCase()}`;
    
    const submitted_on = new Date();
    
    const application = new Application({
      ...req.body,
      application_id,
      job_id,
      submitted_on
    });
    await application.save();
    
    res.json(buildResponsePayload({
      id: 'api.jobs.apply',
      result: {
        application: {
          application_id,
          job_id,
          status: 'submitted',
          applied_at: submitted_on.toISOString()
        }
      },
      responseCode: 'OK',
      params: {
        status: 'SUCCESSFUL',
        err: '',
        errmsg: ''
      }
    }));
  } catch (err) {
    next(err);
  }
};

// 4. Get All Job Applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find().lean();
    res.json(buildResponsePayload({
      id: 'api.applications.list',
      result: { applications },
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