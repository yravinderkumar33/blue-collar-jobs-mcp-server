import { JobProviderAdapter, NormalizedJob } from "../models/adapter";
import { CompanyConfig } from "../models/config";

export abstract class BaseJobProviderAdapter implements JobProviderAdapter {
    abstract readonly providerId?: string;
    protected normalizedSchema?: any;

    constructor(public config: CompanyConfig, normalizedSchema?: any) {
        this.config = config;
        this.normalizedSchema = normalizedSchema;
    }

    abstract searchJobs(params?: Record<string, any>): Promise<NormalizedJob[]>;
    abstract normalizeJob(jobs: Record<string, any>[]): Promise<NormalizedJob[]>;
}