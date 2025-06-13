import { BaseJobProviderAdapter } from "../adapters/base";
import { NormalizedJob } from "../models/adapter";
import { CompanyConfig } from "../models/config";

export interface TransformationResult {
    companyId: string;
    data?: NormalizedJob[];
}

export class DataTransformationEngine {
    
    private adapters: Map<string, BaseJobProviderAdapter> = new Map();
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    registerAdapter(companyId: string, adapter: BaseJobProviderAdapter): void {
        this.adapters.set(companyId, adapter);
    }

    async processCompany(companyConfig: CompanyConfig, params: Record<string, any> = {}): Promise<TransformationResult> {
        let result: TransformationResult = { companyId: companyConfig.id, data: [] };

        try {
            const adapter = this.adapters.get(companyConfig.id);

            if (!adapter) {
                throw new Error(`No adapter registered for company: ${companyConfig.id}`);
            }

            console.log(`🔄 Processing ${companyConfig.id} using adapter...`);
            const jobs = await adapter.searchJobs(params);
            const normalizedJobs = await adapter.normalizeJob(jobs);
            result = { data: normalizedJobs, companyId: companyConfig.id };
        } catch (error) {
            console.error(`❌ Failed to process company ${companyConfig.id}:`, error);
        }

        return result;
    }

    async processAllCompanies(params: Record<string, any> = {}): Promise<TransformationResult[]> {
        const results: TransformationResult[] = [];

        for (const companyConfig of this.config.companies) {
            const result = await this.processCompany(companyConfig, params);
            results.push(result);
        }

        return results;
    }

} 