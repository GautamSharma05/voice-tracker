import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./database";
import tasksRoutes from "./routes/tasks";
import aiRoutes from "./routes/ai";

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/tasks", tasksRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Voice Task Tracker API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
