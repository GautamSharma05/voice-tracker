import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Task } from "../api";

// Define Zod schema for validation
const taskSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(5, "Title must be at least 5 characters long"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  due_date: z.string().optional(),
});

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<Task> | null;
  onSave: (task: Partial<Task>) => void;
}

const defaultFormData: Partial<Task> = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  due_date: undefined,
};

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...defaultFormData, ...initialData });
      } else {
        setFormData(defaultFormData);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      taskSchema.parse(formData);
      setErrors({});
      onSave(formData);
      setFormData(defaultFormData);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, { message: string }> = {};
        err.issues.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = { message: error.message };
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          className="card-header flex-between"
          style={{ paddingBottom: "1rem" }}
        >
          <h2 className="font-bold text-lg">
            {initialData?.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              fontSize: "1.5rem",
              lineHeight: 1,
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
            }}
          >
            &times;
          </button>
        </div>

        <div className="card-content" style={{ overflowY: "auto" }}>
          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div className="flex-col gap-2">
              <label
                htmlFor="title"
                className="text-sm font-bold text-muted-foreground"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="input"
                style={{
                  borderColor: errors.title ? "var(--destructive)" : undefined,
                }}
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="e.g. Buy groceries"
                autoFocus
              />
              {errors.title && (
                <span
                  className="text-sm"
                  style={{ color: "var(--destructive)" }}
                >
                  {errors.title.message}
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="flex-col gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex-col gap-2">
                <label
                  htmlFor="priority"
                  className="text-sm font-bold text-muted-foreground"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="flex-col gap-2">
              <label
                htmlFor="due_date"
                className="text-sm font-bold text-muted-foreground"
              >
                Due Date
              </label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                className="input"
                value={
                  formData.due_date
                    ? new Date(formData.due_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </div>

            <div className="flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-bold text-muted-foreground"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Add details about your task..."
                value={formData.description || ""}
                onChange={handleChange}
                style={{ minHeight: "100px", resize: "vertical" }}
              />
            </div>

            <div className="flex-between mt-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
