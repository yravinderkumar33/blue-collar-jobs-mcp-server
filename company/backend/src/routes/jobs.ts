import express from 'express';
import * as jobsController from '../controllers/jobsController';

const router = express.Router();

// 1. Search Jobs with Filters
router.post(
  '/search',
  jobsController.searchJobs
);

// 2. View Job Detail
router.get(
  '/:job_id',
  jobsController.viewJob
);

// 3. Apply to a Job
router.post(
  '/:job_id/apply',
  jobsController.applyToJob
);

export default router; 