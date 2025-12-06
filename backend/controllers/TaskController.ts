import { Request, Response } from "express";
import Task from "../models/Task";
import mongoose from "mongoose";

class TaskController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, search } = req.query;
      let query: any = {};

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const tasks = await Task.find(query).sort({ created_at: -1 });
      res.json({ data: tasks });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, status, priority, due_date } = req.body;

      if (!title) {
        res.status(400).json({ error: "Title is required" });
        return;
      }

      const task = new Task({
        title,
        description,
        status,
        priority,
        due_date,
      });
      const savedTask = await task.save();
      res.json({ message: "success", data: savedTask });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid Task ID" });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ message: "success", data: updatedTask });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid Task ID" });
      }

      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ message: "deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new TaskController();
