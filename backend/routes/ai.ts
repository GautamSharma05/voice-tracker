import express from "express";
import multer from "multer";
import AIController from "../controllers/AIController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/transcribe", upload.single("audio"), AIController.transcribe);

export default router;
