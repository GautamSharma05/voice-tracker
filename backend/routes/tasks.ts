import express from "express";
import TaskController from "../controllers/TaskController";

const router = express.Router();

router.get("/", TaskController.getAll.bind(TaskController));
router.post("/", TaskController.create.bind(TaskController));
router.put("/:id", TaskController.update.bind(TaskController));
router.delete("/:id", TaskController.delete.bind(TaskController));

export default router;
