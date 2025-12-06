import { useState, useCallback } from "react";
import { List, Kanban, Search } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import TaskList from "./components/TaskList";
import TaskBoard from "./components/TaskBoard";
import ReviewModal from "./components/ReviewModal";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Task } from "./api";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "./hooks/useTasks";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const [view, setView] = useState<"board" | "list">("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const filters = { search: debouncedSearch, status: "" };

  const { data: tasks = [], isLoading, isError, error } = useTasks(filters);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleCreate = useCallback(() => {
    setCurrentTask({});
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(
    async (taskData: Partial<Task>) => {
      try {
        if (taskData.id) {
          await updateTaskMutation.mutateAsync({
            id: taskData.id,
            updates: taskData,
          });
          toast.success("Task updated successfully");
        } else {
          await createTaskMutation.mutateAsync(taskData);
          toast.success("Task created successfully");
        }
        setIsModalOpen(false);
      } catch (error: any) {
        toast.error("Error saving task: " + error.message);
      }
    },
    [createTaskMutation, updateTaskMutation]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        try {
          await deleteTaskMutation.mutateAsync(id);
          toast.success("Task deleted successfully");
        } catch (error: any) {
          toast.error("Error deleting task: " + error.message);
        }
      }
    },
    [deleteTaskMutation]
  );

  const onVoiceParsed = useCallback((parsedData: Partial<Task>) => {
    setCurrentTask(parsedData);
    setIsModalOpen(true);
    toast.success("Voice input parsed successfully");
  }, []);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: string) => {
      try {
        await updateTaskMutation.mutateAsync({
          id: taskId,
          updates: { status: newStatus as Task["status"] },
        });
        toast.success(`Task moved to ${newStatus}`);
      } catch (error: any) {
        toast.error("Failed to move task: " + error.message);
      }
    },
    [updateTaskMutation]
  );

  if (isError) {
    return (
      <ErrorPage
        error={error as Error}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
            borderRadius: "var(--radius)",
          },
        }}
      />
      <Layout onVoiceParsed={onVoiceParsed} onCreateOpen={handleCreate}>
        <div
          className="flex-between"
          style={{ marginBottom: "2rem", alignItems: "center" }}
        >
          {/* View Toggle (Segmented Control) */}
          <div className="segmented-control">
            <button
              onClick={() => setView("board")}
              className={view === "board" ? "active" : ""}
            >
              <Kanban size={16} /> Board
            </button>
            <button
              onClick={() => setView("list")}
              className={view === "list" ? "active" : ""}
            >
              <List size={16} /> List
            </button>
          </div>

          {/* Search Bar */}
          <div className="input-search-wrapper">
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted-foreground)",
                pointerEvents: "none",
              }}
            />
            <input
              className="input-search"
              placeholder="Filter tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="view-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : view === "board" ? (
            <TaskBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
            />
          ) : (
            <div className="task-list-container">
              <TaskList
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>

        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={currentTask}
          onSave={handleSave}
        />
      </Layout>
    </>
  );
}

export default App;
