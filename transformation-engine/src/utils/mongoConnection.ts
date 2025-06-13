import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as mongoose.ConnectOptions);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}; 