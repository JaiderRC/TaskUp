// src/contexts/TasksContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'; // Added useEffect
import { toast } from "sonner"; // Added toast for potential errors

// Interface for Task
export interface Task {
  id: string;
  title: string;
  description?: string;
  materia?: string;
  fechaEntrega?: string; // YYYY-MM-DD
  completada: boolean;
  points: number;
  groupId?: string;
}

// Interface for Context
interface TasksContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'completada' | 'points'> & Partial<Pick<Task, 'completada' | 'points'>>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// --- KEY FOR LOCAL STORAGE ---
const LOCAL_STORAGE_KEY = 'taskup_tasks_v1'; // Use a consistent key

// Initial mock data (only used if localStorage is empty or fails)
const initialMockTasks: Task[] = [
  { id: "t1_mock", title: "Tarea suelta de ejemplo", description: "Esta es una tarea sin materia", fechaEntrega: "2025-10-25", completada: false, points: 50 },
  { id: "t2_mock", title: "Entregar ensayo de Cálculo", description: "Mínimo 5 páginas", materia: "Cálculo", fechaEntrega: "2025-10-28", completada: false, points: 100 },
];

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // --- REVISED LOADING LOGIC ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    console.log(`Intentando cargar tareas desde localStorage con la clave: ${LOCAL_STORAGE_KEY}`);
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks && storedTasks !== "[]") {
        console.log("Datos encontrados en localStorage:", storedTasks);
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          console.log("Tareas cargadas exitosamente desde localStorage:", parsedTasks);
          return parsedTasks; // Load saved tasks
        } else {
          console.warn("Los datos de tareas guardados no son un array. Usando datos iniciales.");
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clean up corrupted data
          return initialMockTasks;
        }
      } else {
         console.log("No se encontraron tareas guardadas o estaban vacías. Usando datos iniciales.");
         return initialMockTasks; // Use initial mocks if nothing is saved
      }
    } catch (error) {
      console.error("Error al parsear tareas desde localStorage:", error);
      toast.error("Error al cargar tareas guardadas.");
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clean up potentially corrupted data
      return initialMockTasks; // Fallback to initial mocks
    }
  });
  // --- END LOADING LOGIC ---


  // --- USE EFFECT FOR SAVING ---
  useEffect(() => {
    try {
      console.log("Guardando tareas en localStorage:", tasks);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error guardando tareas en localStorage:", error);
      toast.error("Error al guardar las tareas.");
    }
  }, [tasks]); // This runs every time the 'tasks' state changes
  // --- END SAVING LOGIC ---


  // addTask function (explicit properties)
  const addTask = (taskData: Omit<Task, 'id' | 'completada' | 'points'> & Partial<Pick<Task, 'completada' | 'points'>>) => {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: taskData.title,
      description: taskData.description,
      materia: taskData.materia,
      fechaEntrega: taskData.fechaEntrega,
      groupId: taskData.groupId,
      completada: taskData.completada ?? false,
      points: taskData.points ?? 50,
    };
    // This state update will trigger the useEffect above to save
    setTasks(prevTasks => [...prevTasks, newTask]);
    console.log("Nueva tarea añadida (estado actualizado):", newTask);
  };

  // deleteTask function
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    // State update triggers save
  };

  // toggleComplete function
  const toggleComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completada: !task.completada } : task
      )
    );
    // State update triggers save
  };

  // updateTask function
  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    // State update triggers save
  };

  const value = { tasks, addTask, deleteTask, toggleComplete, updateTask };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};