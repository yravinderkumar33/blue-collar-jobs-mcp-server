import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  jobId: string;
  [key: string]: any;
}

const JobSchema: Schema = new Schema(
  {
    jobId: { type: String, required: true, unique: true },
  },
  { strict: false }
);

export default mongoose.model<IJob>('Job', JobSchema); 