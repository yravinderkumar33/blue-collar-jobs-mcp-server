import express, { RequestHandler } from 'express';
import * as jobsController from '../controllers/jobsController';

const router = express.Router();

// 1. Search Jobs with Filters
router.post(
  '/search',
  jobsController.searchJobs as RequestHandler
);

// 4. Get All Job Applications
router.get(
  '/applications/:application_id',
  jobsController.getAllApplications as RequestHandler
);

// 2. View Job Detail
router.get(
  '/:job_id',
  jobsController.viewJob as RequestHandler
);

// 3. Apply to a Job
router.post(
  '/:job_id/apply',
  jobsController.applyToJob as RequestHandler
);

export default router; 