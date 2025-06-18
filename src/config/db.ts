import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const dbUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cryptoalerts";
    await mongoose.connect(dbUri, {});
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
