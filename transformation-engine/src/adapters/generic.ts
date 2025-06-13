import axios from "axios";
import { BaseJobProviderAdapter } from "./base";
import { NormalizedJob } from "../models/adapter";
import { CompanyConfig } from "../models/config";
import transformationChain from "../runnables";
import Job from '../models/Job';
import { connectToMongoDB } from '../utils/mongoConnection';

connectToMongoDB();

export class GenericJobProviderAdapter extends BaseJobProviderAdapter {
    readonly providerId: string;

    constructor(companyConfig: CompanyConfig, normalizedSchema?: any) {
        super(companyConfig, normalizedSchema);
        this.providerId = companyConfig.id;
    }

    async searchJobs(params: Record<string, any> = {}): Promise<any[]> {
        try {
            console.log(`📡 Fetching data from ${this.config.name || this.providerId}...`);
            const response = await axios(this.config.search.api);
            const jobs: any[] = response.data.result.jobs;
            return jobs;
        } catch (error) {
            console.error(`❌ Error searching jobs from ${this.config.name || this.providerId}:`, error);
            throw error;
        }
    }

    async normalizeJob(jobs: Record<string, any>[]): Promise<NormalizedJob[]> {
        const output: NormalizedJob[] = [];

        for (const job of jobs) {
            try {

                const transformedJob = await transformationChain.invoke({
                    data: JSON.stringify(job),
                    inputSchema: JSON.stringify(this.config.search.schema),
                    outputSchema: JSON.stringify(this.normalizedSchema || this.config.search.schema)
                });

                const payload = {
                    ...JSON.parse(transformedJob),
                    metadata: {
                        source_id: this.providerId,
                        ingested_at: new Date().toISOString(),
                        original_event: job
                    }
                }

                console.log(JSON.stringify(payload));

                const jobDocument = new Job(payload);
                await jobDocument.save();
                console.log('Job saved to MongoDB:', jobDocument);

                output.push(payload);
            } catch (transformError) {
                console.error(`⚠️  Error transforming job from ${this.providerId}:`, transformError);
            }
        }

        console.log(`✨ Successfully transformed ${output.length} jobs from ${this.config.name || this.providerId}`);
        return output;
    }
} 