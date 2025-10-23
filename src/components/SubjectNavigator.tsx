// src/components/SubjectNavigator.tsx
import React, { useState, useEffect } from "react";
import { useTasks } from "../contexts/TasksContext";
import { TaskCard } from "./TaskCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea"; // <-- 1. IMPORTAR TEXTAREA

export const SubjectNavigator: React.FC = () => {
  const { tasks, addTask, toggleComplete, deleteTask } = useTasks();
  
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // --- 2. AÑADIR ESTADOS (igual que en Tareas Sueltas) ---
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  // Carga las materias existentes desde las tareas al inicio
  useEffect(() => {
    const s = new Set<string>();
    tasks.forEach(t => {
      if (t.materia) s.add(t.materia);
    });
    setSubjects(Array.from(s).sort());
  }, [tasks]);

  // Filtra las tareas que se deben mostrar
  const tasksForSubject = tasks.filter(t => t.materia === selectedSubject);

  // Lógica para AÑADIR materias
  const handleAddSubject = () => {
    const trimmedSubject = newSubject.trim();
    if (!trimmedSubject || subjects.includes(trimmedSubject)) {
      setNewSubject("");
      return;
    }
    const updatedSubjects = [...subjects, trimmedSubject].sort();
    setSubjects(updatedSubjects);
    setSelectedSubject(trimmedSubject);
    setNewSubject("");
  };

  // --- 3. ACTUALIZAR LÓGICA (igual que en Tareas Sueltas) ---
 const handleAddTaskToSubject = () => {
    // Solo requerimos el título
    if (!newTaskTitle.trim() || !selectedSubject) return;

    // --- CORRECTION ---
    // Create the object with ONLY the allowed properties
    const taskDataForContext = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      fechaEntrega: newTaskDate || undefined,
      materia: selectedSubject,
      // Do NOT include 'id', 'completada', or 'points' here unless
      // you explicitly want non-default values from the Partial<> part
      // points: 100 // Example if you wanted custom points
    };
    // --- END CORRECTION ---

    // Pass the correctly typed object to addTask
    addTask(taskDataForContext);

    // Limpiar todos los campos
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDate("");
  };


  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Lista de Materias */}
      <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Materias</h2>
        <div className="flex gap-2 mb-3">
          <Input 
            placeholder="Nueva materia..." 
            value={newSubject} 
            onChange={e => setNewSubject(e.target.value)}
          />
          <Button size="icon" onClick={handleAddSubject}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="space-y-2">
          {subjects.map(subject => (
            <button
              key={subject}
              className={`w-full p-3 text-left rounded-lg ${selectedSubject === subject ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50'}`}
              onClick={() => setSelectedSubject(subject)}
            >
              <div className="font-medium">{subject}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tareas de la Materia */}
      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
        {!selectedSubject ? (
          <p className="text-slate-500">Selecciona o crea una materia para ver sus tareas.</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{selectedSubject}</h2>
            
            {/* --- 4. ACTUALIZAR FORMULARIO (igual que en Tareas Sueltas) --- */}
            <div className="flex flex-col gap-3 mb-6 p-4 border rounded-lg bg-slate-50">
              <h3 className="text-lg font-medium">Agregar Tarea a "{selectedSubject}"</h3>
              
              <Input 
                placeholder="Título de la tarea..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
              />
              
              <Input 
                type="date"
                value={newTaskDate}
                onChange={e => setNewTaskDate(e.target.value)}
              />
              
              <Textarea
                placeholder="Descripción (opcional)..."
                value={newTaskDescription}
                onChange={e => setNewTaskDescription(e.target.value)}
              />
              
              <Button onClick={handleAddTaskToSubject} className="self-start">
                <Plus className="w-4 h-4 mr-1" /> Agregar Tarea
              </Button>
            </div>
            {/* --- FIN DEL FORMULARIO --- */}

            <h3 className="text-lg font-medium mb-3">Tareas Pendientes</h3>
            <div className="space-y-3 mt-4">
              {tasksForSubject.length === 0 ? (
                <p className="text-sm text-slate-500">No hay tareas para esta materia.</p>
              ) : (
                tasksForSubject.map(task => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onComplete={() => toggleComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    // onEdit requeriría un modal aquí
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};