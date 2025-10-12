// src/contexts/TasksContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

export type Task = {
  id: string;
  title: string;
  description?: string;
  materia?: string;
  fechaEntrega?: string;
  tiempoEstimado?: number;
  prioridad?: "alta" | "media" | "baja";
  completada?: boolean;
  points?: number;
};

type TasksContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void; // 👈 nuevo
};

const STORAGE_KEY = "taskup_tasks_v1";
const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => setTasks((prev) => [...prev, task]);

  const toggleComplete = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const updateTask = (id: string, updates: Partial<Task>) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleComplete, deleteTask, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks debe usarse dentro de <TasksProvider>");
  return ctx;
};
