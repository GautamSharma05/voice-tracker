import React, { useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, Calendar } from "lucide-react";
import { TaskBoardProps } from "../types";
import { Task } from "../api";

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onStatusChange,
  onEdit,
}) => {
  const columns = useMemo(
    () => ({
      "To Do": tasks.filter((t) => t.status === "To Do"),
      "In Progress": tasks.filter((t) => t.status === "In Progress"),
      Done: tasks.filter((t) => t.status === "Done"),
    }),
    [tasks]
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    if (result.source.droppableId !== newStatus) {
      onStatusChange(draggableId, newStatus);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critical":
        return { text: "Critical", class: "pill-red" };
      case "High":
        return { text: "High", class: "pill-purple" };
      case "Medium":
        return { text: "Medium", class: "pill-orange" };
      case "Low":
        return { text: "Low", class: "pill-blue" };
      default:
        return { text: priority, class: "pill-blue" };
    }
  };

  const getHeaderDotColor = (status: string) => {
    if (status === "To Do") return "#6366f1"; // Indigo
    if (status === "In Progress") return "#f59e0b"; // Amber
    if (status === "Done") return "#22c55e"; // Green
    return "#ccc";
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="task-board-grid" style={{ gap: "2rem" }}>
        {(Object.keys(columns) as Array<keyof typeof columns>).map((status) => (
          <div key={status} className="task-column">
            {/* Column Header */}
            <div className="column-header-rich">
              <div className="header-left">
                <div
                  className="header-dot"
                  style={{ backgroundColor: getHeaderDotColor(status) }}
                />
                <span className="header-title">{status}</span>
                <span className="header-count">({columns[status].length})</span>
              </div>
            </div>

            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="task-list-scrollable"
                  style={{ padding: "0.5rem 0.25rem" }}
                >
                  <div className="flex-col gap-4">
                    {columns[status].map((task: Task, index: number) => {
                      const priorityStyle = getPriorityStyle(task.priority);
                      const formattedDate = formatDueDate(task.due_date);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onEdit(task)}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="card-rich">
                                {/* Priority Badge */}
                                <div>
                                  <span
                                    className={`pill-tag ${priorityStyle.class}`}
                                  >
                                    {priorityStyle.text}
                                  </span>
                                </div>

                                {/* Title */}
                                <h4
                                  style={{
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    lineHeight: 1.4,
                                    margin: "0.5rem 0",
                                  }}
                                >
                                  {task.title}
                                </h4>

                                {/* Description */}
                                {task.description && (
                                  <p
                                    style={{
                                      fontSize: "0.875rem",
                                      color: "#71717a",
                                      margin: "0 0 0.75rem 0",
                                      lineHeight: 1.5,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {task.description}
                                  </p>
                                )}

                                {/* Due Date */}
                                {formattedDate && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.375rem",
                                      fontSize: "0.75rem",
                                      color: "#71717a",
                                      marginTop: "0.5rem",
                                    }}
                                  >
                                    <Calendar size={14} />
                                    <span>{formattedDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
