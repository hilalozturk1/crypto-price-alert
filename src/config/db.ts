import mongoose from "mongoose";
import Redis from 'ioredis';

import { config } from './index';

export const connectMongoDB = async () => {
  try {
    const dbUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cryptoalerts";
    await mongoose.connect(dbUri, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const redisClient = new Redis(config.redisUrl);

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});
