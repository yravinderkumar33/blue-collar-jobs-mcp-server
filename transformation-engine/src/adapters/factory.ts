import { BaseJobProviderAdapter } from "./base";
import { GenericJobProviderAdapter } from "./generic";
import { CompanyConfig } from "../models/config";

export class AdapterFactory {
    private static adapterMap: Record<string, new (config: CompanyConfig, normalizedSchema?: any) => BaseJobProviderAdapter> = {};

    static createAdapter(companyConfig: CompanyConfig, normalizedSchema?: any): BaseJobProviderAdapter {
        const AdapterClass = this.adapterMap[companyConfig.id];
        
        if (AdapterClass) {
            return new AdapterClass(companyConfig, normalizedSchema);
        }
        
        console.log(`No specific adapter found for ${companyConfig.id}, using generic adapter`);
        return new GenericJobProviderAdapter(companyConfig, normalizedSchema);
    }

    static registerAdapter(companyId: string, adapterClass: new (config: CompanyConfig, normalizedSchema?: any) => BaseJobProviderAdapter): void {
        this.adapterMap[companyId] = adapterClass;
    }

    static getRegisteredAdapters(): string[] {
        return Object.keys(this.adapterMap);
    }

    static createAllAdapters(companies: CompanyConfig[], normalizedSchema?: any): Map<string, BaseJobProviderAdapter> {
        const adapters = new Map<string, BaseJobProviderAdapter>();
        
        for (const company of companies) {
            try {
                const adapter = this.createAdapter(company, normalizedSchema);
                adapters.set(company.id, adapter);
            } catch (error) {
                console.error(`Failed to create adapter for ${company.id}:`, error);
            }
        }
        
        return adapters;
    }
} 