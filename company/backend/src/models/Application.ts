import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export interface IApplication extends Document {
  job_id: string;
  applicant: { [key: string]: any };
  [key: string]: any;
}

const ApplicationSchema: Schema = new Schema(
  {
    application_id: { type: String, default: uuidv4(), required: true, unique: true },
    job_id: { type: String, required: true },
    applicant: { type: Map, of: Schema.Types.Mixed, required: true },
  },
  { strict: false }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema); 