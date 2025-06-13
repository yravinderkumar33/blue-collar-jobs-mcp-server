"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplications = exports.applyToJob = exports.viewJob = exports.searchJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const response_1 = require("../utils/response");
const integrationsMapping = {
    "company-a": {
        "url": process.env.company_a_url || "http://localhost:3000"
    },
    "company-b": {
        "url": process.env.company_b_url || "http://localhost:4000"
    }
};
// 1. Search Jobs with Filters
const searchJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filters = {}, options = {} } = req.body.request || {};
        // For now, filters are directly mapped to MongoDB query
        const jobs = yield Job_1.default.find(filters, null, options).lean();
        res.json((0, response_1.buildResponsePayload)({
            id: 'api.jobs.search',
            result: { jobs },
            responseCode: 'OK',
            params: {
                status: 'SUCCESSFUL',
                err: '',
                errmsg: ''
            }
        }));
    }
    catch (err) {
        res.status(500).json((0, response_1.buildResponsePayload)({
            id: 'api.jobs.search',
            result: { jobs: [] },
            responseCode: 'INTERNAL_ERROR',
            params: {
                status: 'FAILED',
                err: 'INTERNAL_ERROR',
                errmsg: err.message
            }
        }));
    }
});
exports.searchJobs = searchJobs;
// 2. View Job Detail
const viewJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { job_id } = req.params;
        const job = yield Job_1.default.findOne({ jobId: job_id }).lean();
        if (!job) {
            res.status(404).json((0, response_1.buildResponsePayload)({
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
        res.json((0, response_1.buildResponsePayload)({
            id: 'api.jobs.view',
            result: { job },
            responseCode: 'OK',
            params: {
                status: 'SUCCESSFUL',
                err: '',
                errmsg: ''
            }
        }));
    }
    catch (err) {
        res.status(500).json((0, response_1.buildResponsePayload)({
            id: 'api.jobs.view',
            result: { job: {} },
            responseCode: 'INTERNAL_ERROR',
            params: {
                status: 'FAILED',
                err: 'INTERNAL_ERROR',
                errmsg: err.message
            }
        }));
    }
});
exports.viewJob = viewJob;
// 3. Apply to a Job
const applyToJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { job_id } = req.params;
        const job = yield Job_1.default.findOne({ jobId: job_id });
        if (!job) {
            console.log("Job not found");
            res.status(404).json((0, response_1.buildResponsePayload)({
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
        const sourceId = (_a = job.toJSON().metadata) === null || _a === void 0 ? void 0 : _a.source_id;
        if (!(sourceId in integrationsMapping)) {
            console.log("Invalid sourceId", sourceId);
            return res.status(400).json((0, response_1.buildResponsePayload)({
                id: 'api.jobs.apply',
                result: { application: {} },
                responseCode: 'BAD_REQUEST',
                params: {
                    status: 'FAILED',
                    err: 'INVALID_SOURCE',
                    errmsg: `Invalid or unsupported job source: ${sourceId}`
                }
            }));
            ;
        }
        const backend = integrationsMapping[sourceId];
        const response = yield fetch(`${backend.url}/api/jobs/${job_id}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Blue-Collar-Jobs-Backend/1.0'
            },
            body: JSON.stringify(Object.assign(Object.assign({}, req.body), { job_id })),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }
        const data = yield response.json();
        const application = new Application_1.default({
            application_id: data.result.application.application_id,
            source_id: sourceId,
        });
        yield application.save();
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
exports.applyToJob = applyToJob;
// 4. Get All Job Applications
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { application_id } = req.params;
        const application = yield Application_1.default.findOne({ application_id }).lean();
        if (!application) {
            return res.status(404).json((0, response_1.buildResponsePayload)({
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
        const sourceId = application.source_id;
        if (!(sourceId in integrationsMapping)) {
            console.log("Invalid sourceId", sourceId);
            return res.status(400).json((0, response_1.buildResponsePayload)({
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
        const backend = integrationsMapping[sourceId];
        const response = yield fetch(`${backend.url}/api/jobs/applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        }
        const data = yield response.json();
        const applications = data.result.applications || [];
        const myApplication = applications.find((app) => app.application_id === application_id);
        if (!myApplication) {
            return res.status(404).json((0, response_1.buildResponsePayload)({
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
        res.json((0, response_1.buildResponsePayload)({
            id: 'api.applications.list',
            result: { application: myApplication },
            responseCode: 'OK',
            params: {
                status: 'SUCCESSFUL',
                err: '',
                errmsg: ''
            }
        }));
    }
    catch (err) {
        res.status(500).json((0, response_1.buildResponsePayload)({
            id: 'api.applications.list',
            result: { applications: [] },
            responseCode: 'INTERNAL_ERROR',
            params: {
                status: 'FAILED',
                err: 'INTERNAL_ERROR',
                errmsg: err.message
            }
        }));
    }
});
exports.getAllApplications = getAllApplications;
