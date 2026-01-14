import { z } from "zod";

/**
 * Task Management Type Definitions
 * Chapter 4: High-Performance CRUD with Optimistic UI
 */

// Enums
export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export const TaskPriority = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

// Type definitions
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assignee_id: number;
  assignee_name: string;
  assignee_avatar?: string;
  due_date: string; // ISO 8601 string
  created_at: string;
  updated_at: string;
}

// Zod Schemas
export const PrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);
export const StatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  priority: PrioritySchema,
  assignee_id: z.number(),
  due_date: z.string().refine((date) => {
    try {
      const dueDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate >= today;
    } catch {
      return false;
    }
  }, "Ngày hết hạn phải từ hôm nay trở đi"),
});

export type CreateTaskPayload = z.infer<typeof CreateTaskSchema>;

export const UpdateStatusSchema = z.object({
  id: z.number(),
  status: StatusSchema,
});

export type UpdateStatusPayload = z.infer<typeof UpdateStatusSchema>;

export type TaskFilter = "ALL" | "MY_TASKS" | "IMPORTANT";

// Repository interface
export interface ITaskRepository {
  getTasks(filter?: TaskFilter): Promise<Task[]>;
  createTask(payload: CreateTaskPayload): Promise<Task>;
  updateStatus(id: number, status: TaskStatusType): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}
