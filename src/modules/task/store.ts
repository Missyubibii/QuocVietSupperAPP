import { create } from "zustand";
import {
  Task,
  TaskFilter,
  CreateTaskPayload,
  TaskStatusType,
} from "./task.types";
import { taskMockRepo } from "./task.mock";

/**
 * Task Store with Optimistic UI & Rollback
 *
 * Features:
 * - Optimistic updates (instant UI feedback)
 * - Automatic rollback on errors
 * - Temp ID → Real ID swapping
 * - Comprehensive error handling
 */

interface TaskStore {
  tasks: Task[];
  currentFilter: TaskFilter;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFilter: (filter: TaskFilter) => void;
  fetchTasks: () => Promise<void>;
  createTaskOptimistic: (payload: CreateTaskPayload) => Promise<void>;
  updateStatusOptimistic: (id: number, status: TaskStatusType) => Promise<void>;
  deleteTaskOptimistic: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentFilter: "ALL",
  isLoading: false,
  error: null,

  setFilter: (filter) => {
    set({ currentFilter: filter });
    get().fetchTasks();
  },

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskMockRepo.getTasks(get().currentFilter);
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Failed to load tasks",
      });

      if (__DEV__) {
        console.error("[TaskStore] Fetch error:", error);
      }
    }
  },

  /**
   * OPTIMISTIC CREATE
   * 1. Add temp task immediately (UI updates)
   * 2. Call API
   * 3. On success: Replace temp ID with real ID
   * 4. On error: Remove temp task (ROLLBACK)
   */
  createTaskOptimistic: async (payload) => {
    // Generate temp ID (negative number to avoid conflicts with real IDs)
    const tempId = -Date.now();

    const tempTask: Task = {
      id: tempId,
      ...payload,
      status: "TODO",
      assignee_name: "Current User",
      assignee_avatar: "https://i.pravatar.cc/150?img=5",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Step 1: Add to UI immediately (OPTIMISTIC)
    set((state) => ({
      tasks: [tempTask, ...state.tasks],
      error: null,
    }));

    if (__DEV__) {
      console.log(`⚡ [Optimistic] Created temp task with ID: ${tempId}`);
    }

    try {
      // Step 2: Call API
      const realTask = await taskMockRepo.createTask(payload);

      // Step 3: SUCCESS - Replace temp with real
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === tempId ? realTask : t)),
      }));

      if (__DEV__) {
        console.log(
          `✅ [Optimistic] Swapped temp ID ${tempId} → real ID ${realTask.id}`
        );
      }
    } catch (error: any) {
      // Step 4: ERROR - ROLLBACK (remove temp task)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
        error: error.message || "Failed to create task",
      }));

      if (__DEV__) {
        console.error(
          `❌ [Optimistic] Rollback temp ID ${tempId}:`,
          error.message
        );
      }

      throw error; // Re-throw for UI to show alert
    }
  },

  /**
   * OPTIMISTIC UPDATE STATUS
   * 1. Update UI immediately
   * 2. Call API
   * 3. On error: Revert to old status (ROLLBACK)
   */
  updateStatusOptimistic: async (id, newStatus) => {
    // Save old status for rollback
    const oldTask = get().tasks.find((t) => t.id === id);
    if (!oldTask) return;

    const oldStatus = oldTask.status;

    // Step 1: Update UI immediately
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
          : t
      ),
      error: null,
    }));

    if (__DEV__) {
      console.log(
        `⚡ [Optimistic] Updated task ${id}: ${oldStatus} → ${newStatus}`
      );
    }

    try {
      // Step 2: Call API
      await taskMockRepo.updateStatus(id, newStatus);

      if (__DEV__) {
        console.log(`✅ [Optimistic] Confirmed status update for task ${id}`);
      }
    } catch (error: any) {
      // Step 3: ERROR - ROLLBACK to old status
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, status: oldStatus } : t
        ),
        error: error.message || "Failed to update status",
      }));

      if (__DEV__) {
        console.error(
          `❌ [Optimistic] Rollback status for task ${id}:`,
          error.message
        );
      }

      throw error;
    }
  },

  /**
   * OPTIMISTIC DELETE
   * 1. Remove from UI immediately
   * 2. Call API
   * 3. On error: Re-add task (ROLLBACK)
   */
  deleteTaskOptimistic: async (id) => {
    // Save task for rollback
    const deletedTask = get().tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    // Step 1: Remove from UI immediately
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      error: null,
    }));

    if (__DEV__) {
      console.log(`⚡ [Optimistic] Deleted task ${id}`);
    }

    try {
      // Step 2: Call API
      await taskMockRepo.deleteTask(id);

      if (__DEV__) {
        console.log(`✅ [Optimistic] Confirmed delete for task ${id}`);
      }
    } catch (error: any) {
      // Step 3: ERROR - ROLLBACK (re-add task)
      set((state) => ({
        tasks: [deletedTask, ...state.tasks],
        error: error.message || "Failed to delete task",
      }));

      if (__DEV__) {
        console.error(
          `❌ [Optimistic] Rollback delete for task ${id}:`,
          error.message
        );
      }

      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
