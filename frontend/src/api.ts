import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High" | "Critical";
  due_date?: string;
  created_at?: string;
  original_transcript?: string;
}

export const fetchTasks = async (
  filters: { status?: string; search?: string } = {}
): Promise<Task[]> => {
  const params: any = {};
  if (filters.status) params.status = filters.status;
  if (filters.search) params.search = filters.search;

  const response = await API.get("/tasks", { params });
  return response.data.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await API.post("/tasks", task);
  return response.data.data;
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<Task> => {
  const response = await API.put(`/tasks/${id}`, updates);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export const parseVoiceInput = async (
  transcript: string
): Promise<{ data: Partial<Task> }> => {
  const response = await API.post("/ai/parse", { transcript });
  return response.data;
};

export const transcribeAudio = async (
  audioFile: File
): Promise<{ data: Partial<Task> }> => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await API.post("/ai/transcribe", formData);
  return response.data;
};
