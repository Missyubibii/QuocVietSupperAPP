import {
  Task,
  CreateTaskPayload,
  TaskFilter,
  ITaskRepository,
  TaskStatusType,
  TaskPriorityType,
} from "./task.types";

/**
 * Task Mock Repository with CHAOS TESTING
 *
 * Features:
 * - 20% random failure rate
 * - Real ID generation (different from temp IDs)
 * - Realistic network delays
 * - Error simulation
 */

// Generate 20 mock tasks with varied data
const MOCK_TASKS: Task[] = Array.from({ length: 20 }, (_, index) => {
  const priorities: TaskPriorityType[] = ["HIGH", "MEDIUM", "LOW"];
  const statuses: TaskStatusType[] = ["TODO", "IN_PROGRESS", "DONE"];

  // Mix of past, today, and future dates
  const daysOffset = index % 3 === 0 ? -2 : index % 3 === 1 ? 0 : index + 1;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysOffset);

  const taskTitles = [
    "Hoàn thiện báo cáo tháng",
    "Review code module authentication",
    "Họp với khách hàng về dự án mới",
    "Cập nhật tài liệu hướng dẫn",
    "Test tính năng thanh toán",
    "Sửa lỗi giao diện mobile",
    "Tối ưu hiệu năng database",
    "Viết unit test cho API",
    "Deploy lên môi trường staging",
    "Phân tích yêu cầu khách hàng",
  ];

  return {
    id: index + 1,
    title: `${taskTitles[index % taskTitles.length]} #${index + 1}`,
    description:
      index % 3 === 0
        ? `Chi tiết công việc số ${
            index + 1
          }. Cần hoàn thành trong thời gian quy định.`
        : undefined,
    status: statuses[index % 3],
    priority: priorities[index % 3],
    assignee_id: 1001 + (index % 5),
    assignee_name: `Nhân viên ${(index % 5) + 1}`,
    assignee_avatar: `https://i.pravatar.cc/150?img=${(index % 10) + 1}`,
    due_date: dueDate.toISOString(),
    created_at: new Date(
      Date.now() - index * 24 * 60 * 60 * 1000
    ).toISOString(),
    updated_at: new Date().toISOString(),
  };
});

export class TaskMockRepository implements ITaskRepository {
  private tasks: Task[] = [...MOCK_TASKS];
  private currentUserId = 1001;

  /**
   * CHAOS SIMULATION: 20% chance of random failure
   * Tests error handling in production-like conditions
   */
  private simulateChaos(operation: string): void {
    if (Math.random() < 0.2) {
      // 20% failure rate
      const errors = [
        "NETWORK_ERROR: Connection timeout",
        "SERVER_ERROR: 500 Internal Server Error",
        "RATE_LIMIT: Too many requests",
        "VALIDATION_ERROR: Invalid request data",
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];

      if (__DEV__) {
        console.warn(`🎲 [CHAOS] ${operation} failed: ${randomError}`);
      }

      throw new Error(randomError);
    }
  }

  async getTasks(filter: TaskFilter = "ALL"): Promise<Task[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // CHAOS: Random failure
    this.simulateChaos("getTasks");

    let filtered = this.tasks;

    switch (filter) {
      case "MY_TASKS":
        filtered = this.tasks.filter(
          (t) => t.assignee_id === this.currentUserId
        );
        break;
      case "IMPORTANT":
        filtered = this.tasks.filter((t) => t.priority === "HIGH");
        break;
    }

    // Sort: Overdue first, then by due date
    return filtered.sort((a, b) => {
      const now = new Date();
      const aOverdue = new Date(a.due_date) < now && a.status !== "DONE";
      const bOverdue = new Date(b.due_date) < now && b.status !== "DONE";

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // CHAOS: Random failure
    this.simulateChaos("createTask");

    // Generate REAL ID (different from temp IDs client uses)
    // Real IDs are in range 999000-999999
    const realId = 999000 + Math.floor(Math.random() * 1000);

    const newTask: Task = {
      id: realId, // Server-generated ID
      ...payload,
      status: "TODO",
      assignee_name: "Current User",
      assignee_avatar: "https://i.pravatar.cc/150?img=5",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.tasks = [newTask, ...this.tasks];

    if (__DEV__) {
      console.log(`✅ [TaskMock] Created task with ID: ${realId}`);
    }

    return newTask;
  }

  async updateStatus(id: number, status: TaskStatusType): Promise<Task> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // CHAOS: Random failure
    this.simulateChaos("updateStatus");

    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.status = status;
    task.updated_at = new Date().toISOString();

    if (__DEV__) {
      console.log(`✅ [TaskMock] Updated task ${id} status to ${status}`);
    }

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // CHAOS: Random failure
    this.simulateChaos("deleteTask");

    this.tasks = this.tasks.filter((t) => t.id !== id);

    if (__DEV__) {
      console.log(`✅ [TaskMock] Deleted task ${id}`);
    }
  }
}

// Singleton instance
export const taskMockRepo = new TaskMockRepository();
