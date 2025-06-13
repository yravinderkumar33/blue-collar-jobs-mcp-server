"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationSchema = exports.JobSearchRequestSchema = exports.JobFiltersSchema = void 0;
const zod_1 = require("zod");
// Job search filters schema
exports.JobFiltersSchema = zod_1.z.object({});
// Job search request schema
exports.JobSearchRequestSchema = zod_1.z.object({
    filters: exports.JobFiltersSchema.optional(),
    options: zod_1.z.object({}).optional()
});
// Job application schema
exports.JobApplicationSchema = zod_1.z.object({
    job_id: zod_1.z.string().describe("The job ID to apply for"),
    applicant: zod_1.z.object({
        full_name: zod_1.z.string().describe("Full name of the applicant"),
        phone_number: zod_1.z.string().describe("Phone number with country code"),
        email: zod_1.z.string().email().describe("Email address of the applicant")
    }),
    status: zod_1.z.string().default("PENDING").describe("Application status")
});
