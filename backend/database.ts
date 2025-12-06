import mongoose from "mongoose";

// dotenv config removed

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/voice-task-tracker";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
