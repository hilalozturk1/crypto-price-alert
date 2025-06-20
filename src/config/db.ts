import mongoose from "mongoose";
import Redis from "ioredis";

import { logger } from "../utils/logger";
import { config } from "./index";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB connected successfully!");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const redisClient = new Redis(config.redisUrl);

redisClient.on("connect", () => {
  logger.info("Redis connected successfully!");
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
