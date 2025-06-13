import { AxiosRequestConfig } from "axios";

export interface CompanyConfig {
    id: string;
    name?: string;
    metadata?: Record<string, any>;
    search: SearchConfig;
}

export interface SearchConfig {
    api: AxiosRequestConfig;
    responseSchema?: Record<string, any>;
    schema?: Record<string, any>;
}