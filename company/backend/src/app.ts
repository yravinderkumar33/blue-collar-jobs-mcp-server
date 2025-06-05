import express from 'express';
import mongoose from 'mongoose';
import jobsRouter from './routes/jobs';
import { buildResponsePayload } from './utils/response';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

// MongoDB connection (update URI as needed)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mount job-related routes
app.use('/api/jobs', jobsRouter);

// Centralized error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json(buildResponsePayload({
    id: 'api.error',
    result: {},
    responseCode: err.status ? 'ERROR' : 'INTERNAL_ERROR',
    params: {
      status: 'FAILED',
      err: err.name || 'INTERNAL_ERROR',
      errmsg: err.message || 'Internal Server Error'
    }
  }));
});

export default app; 