import { Task } from "./api";

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, status: string) => void;
  onEdit: (task: Task) => void;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<Task> | null;
  onSave: (task: Partial<Task>) => void;
}

export interface VoiceRecorderProps {
  onParsed: (data: Partial<Task>) => void;
}
