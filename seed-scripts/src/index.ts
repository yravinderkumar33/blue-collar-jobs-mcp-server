import mongoose from 'mongoose';
import Job from './model';
import fs from 'fs';
import path from 'path';

function printUsageAndExit() {
  console.log('Usage: ts-node src/utils/seed.ts <data-file.json> <db-name>');
  console.log('Example: ts-node src/utils/seed.ts company-a.json jobs_test');
  process.exit(1);
}

async function seed() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    printUsageAndExit();
  }

  let [dataFile, dbName] = args;

  const dataFilePath = path.join(__dirname, '../data', dataFile);

  if (!fs.existsSync(dataFilePath)) {
    console.error(`Data file not found: ${dataFilePath}`);
    process.exit(1);
  }

  // Read and parse jobs from file (one JSON object per line)
  let jobs = [];

  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    jobs = fileContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  } catch (err) {
    console.error('Error reading or parsing data file:', err);
    process.exit(1);
  }

  const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/${dbName}`;

  try {
    await mongoose.connect(MONGO_URI);
    await Job.deleteMany({});
    await Job.insertMany(jobs);
    console.log(`Seeded ${jobs.length} jobs from ${dataFile} into database '${dbName}'!`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed(); 