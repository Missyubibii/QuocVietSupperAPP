import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task, TaskStatusType } from "./task.types";
import { TaskMockRepository } from "./task.mock";

// 1. Định nghĩa lại kiểu bộ lọc
export type FilterType = 'ALL' | 'MINE' | 'IMPORTANT' | TaskStatusType;

interface TaskState {
  tasks: Task[];
  currentFilter: FilterType;
  isLoading: boolean;
  error: string | null;

  setFilter: (status: FilterType) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => void;
  deleteTasks: (ids: string[]) => void;
  clearError: () => void;
}

const api = new TaskMockRepository();

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentFilter: "ALL",
      isLoading: false,
      error: null,

      setFilter: (status) => set({ currentFilter: status }),

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.getTasks();
          set({ tasks: data, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      addTask: (task) => {
        set((state) => ({ tasks: [task, ...state.tasks] }));
        api.syncLocalTask(task);
      },

      deleteTasks: (ids: string[]) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => !ids.includes(t.id)),
        }));
        api.syncDeleteTasks(ids);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
