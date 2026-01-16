import {
  Task,
  CreateTaskPayload,
  ITaskRepository,
  TaskStatusType,
  TaskPriorityType,
} from "./task.types";

/**
 * Task Mock Repository
 * Features: Stable ID (String), No Chaos Error
 */

// Generate Mock Data with STRING IDs
const MOCK_TASKS: Task[] = Array.from({ length: 10 }, (_, index) => {
  const priorities: TaskPriorityType[] = ["HIGH", "MEDIUM", "LOW"];
  const statuses: TaskStatusType[] = ["TODO", "IN_PROGRESS", "DONE"];

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (index % 5));

  return {
    id: (index + 1000).toString(), // 🔴 ID dạng chuỗi "1000", "1001"...
    title: `Công việc mẫu số ${index + 1}`,
    description: "Mô tả chi tiết công việc cần thực hiện trong dự án...",
    status: statuses[index % 3],
    priority: priorities[index % 3],
    assignee_id: 1,
    assignee_name: "Nguyễn Văn A",
    assignee_avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
    due_date: dueDate.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
});

export class TaskMockRepository implements ITaskRepository {
  private tasks: Task[] = [...MOCK_TASKS];

  // Tắt chế độ lỗi để App chạy mượt
  private async simulateDelay() {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  async getTasks(): Promise<Task[]> {
    await this.simulateDelay();
    return [...this.tasks];
  }

  syncLocalTask(task: Task) {
    this.tasks = [task, ...this.tasks];
  }

  syncDeleteTasks(ids: string[]) {
    this.tasks = this.tasks.filter(t => !ids.includes(t.id));
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    await this.simulateDelay();

    const newTask: Task = {
      id: Date.now().toString(),
      ...payload,
      status: "TODO",
      assignee_name: "Tôi (Current User)",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks = [newTask, ...this.tasks];
    return newTask;
  }

  async updateStatus(id: string, status: TaskStatusType): Promise<Task> {
    await this.simulateDelay();

    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);

    task.status = status;
    task.updated_at = new Date().toISOString();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.simulateDelay();
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
