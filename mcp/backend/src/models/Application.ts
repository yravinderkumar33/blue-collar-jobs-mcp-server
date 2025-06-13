import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  application_id: string;
  source_id: string;
  [key: string]: any;
}

const ApplicationSchema: Schema = new Schema(
  {
    application_id: { type: String, required: true, unique: true },
    source_id: { type: String, required: true },
  },
  { strict: false }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);