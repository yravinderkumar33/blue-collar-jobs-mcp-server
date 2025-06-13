import { config } from 'dotenv';
import { DataTransformationEngine } from './engine/transformation-engine';
import { AdapterFactory } from './adapters/factory';
import configuration from './config';
import fs from 'fs';

config();

function createEngineWithAdapters(): DataTransformationEngine {
    const engine = new DataTransformationEngine(configuration);
    const adapters = AdapterFactory.createAllAdapters(
        configuration.companies,
        configuration.normalized_data?.schema
    );

    for (const [companyId, adapter] of adapters) {
        engine.registerAdapter(companyId, adapter);
    }

    return engine;
}

function writeResultsToJSONLFile(results: any[], filePath: string) {
    const outputStream = fs.createWriteStream(filePath);
    results.forEach(result => {
        outputStream.write(JSON.stringify(result) + '\n');
    });
    outputStream.end();
}

async function main() {
    try {
        console.log('🚀 Starting Blue-Collar Jobs Data Transformation Engine');

        const engine = createEngineWithAdapters();
        const adapters = AdapterFactory.createAllAdapters(configuration.companies);
        console.log(`📋 Created adapters for ${adapters.size} companies: ${Array.from(adapters.keys()).join(', ')}`);

        console.log('\n🔄 Processing all companies...');

        const results = await engine.processAllCompanies();
        writeResultsToJSONLFile(results, 'output.json');
    } catch (error) {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}
