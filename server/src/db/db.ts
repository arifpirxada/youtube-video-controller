import mongoose from 'mongoose';

const connectDatabase = async () => {
  const URI = process.env.MONGO_URI;
  if (!URI) throw new Error('Database URI not defined');

  try {
    await mongoose.connect(URI);
    console.info('Database connected');
  } catch (error) {
    console.error('Database not connected:', error);
    throw error;
  }
};

export default connectDatabase;
