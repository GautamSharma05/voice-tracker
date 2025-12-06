import React from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { TaskListProps } from "../types";

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "In Progress":
        return "status-inprogress";
      case "Done":
        return "status-done";
      default:
        return "status-todo"; 
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "var(--color-critical)";
      case "High":
        return "var(--color-high)";
      case "Medium":
        return "var(--color-medium)";
      case "Low":
        return "var(--color-low)";
      default:
        return "inherit";
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "visible",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "0.5rem",
          border: "1px solid var(--border)",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: "140px" }}>Status</th>
              <th>Title</th>
              <th style={{ width: "120px" }}>Priority</th>
              <th style={{ width: "140px" }}>Due Date</th>
              <th style={{ width: "100px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "var(--muted-foreground)",
                  }}
                >
                  No tasks found. Create one or try a different search.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span
                      className={`badge-outline ${getStatusBadgeClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    {task.title}
                  </td>
                  <td>
                    <div
                      className="flex-center gap-2"
                      style={{
                        justifyContent: "flex-start",
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      <AlertCircle size={14} />
                      <span style={{ fontSize: "0.8rem" }}>
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  <td>
                    {task.due_date ? (
                      <div
                        className="flex-center gap-2"
                        style={{
                          justifyContent: "flex-start",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        <Calendar size={14} />
                        <span style={{ fontSize: "0.8rem" }}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      className="flex-center"
                      style={{ justifyContent: "flex-end", gap: "0.25rem" }}
                    >
                      <button
                        className="btn-ghost"
                        onClick={() => onEdit(task)}
                        title="Edit"
                        style={{ padding: "0.4rem", borderRadius: "0.25rem" }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => onDelete(task.id)}
                        title="Delete"
                        style={{
                          padding: "0.4rem",
                          borderRadius: "0.25rem",
                          color: "var(--destructive)",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
