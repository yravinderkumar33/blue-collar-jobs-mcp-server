import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  application_id: string;
  job_id: string;
  applicant: { [key: string]: any };
  [key: string]: any;
}

const ApplicationSchema: Schema = new Schema(
  {
    application_id: { type: String, required: true, unique: true },
    job_id: { type: String, required: true },
    applicant: { type: Map, of: Schema.Types.Mixed, required: true },
  },
  { strict: false }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema); 