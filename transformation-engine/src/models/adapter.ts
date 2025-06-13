

export interface NormalizedJob {
    [key: string]: any;
}

export interface JobProviderAdapter {
    readonly providerId?: string;
    searchJobs(params: Record<string, any>): Promise<NormalizedJob[]>;
}
