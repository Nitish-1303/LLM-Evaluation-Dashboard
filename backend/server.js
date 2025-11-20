import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import tasksRouter from './routes/tasks.js';
import statsRouter from './routes/stats.js';
import feedbackRouter from './routes/feedback.js';
import detectRouter from './routes/detect.js';
import adminRouter from './routes/admin.js';
import analysisRouter from './routes/analysis.js';
import trendsRouter from './routes/trends.js';
import leaderboardRouter from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/stats', statsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/detect', detectRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/leaderboard', leaderboardRouter);

// MongoDB connection with in-memory fallback
async function connectDB() {
  try {
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('your_mongodb_uri')) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('Starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB at:', uri);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
