import React, { useState } from "react";
import { useTasks } from "../contexts/TasksContext";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { SubjectNavigator } from "./SubjectNavigator"; // Asumimos que creaste este archivo

export function TasksView() {
  const { tasks, addTask, toggleComplete, deleteTask, updateTask } = useTasks();

  // Estado del formulario (para tareas sueltas)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [materia, setMateria] = useState(""); // Ya no se usa aquí
  const [fechaEntrega, setFechaEntrega] = useState("");
  // Prioridad eliminada
  // const [prioridad, setPrioridad] = useState<"alta" | "media" | "baja">("media");

  // Para edición
  const [editingId, setEditingId] = useState<string | null>(null);

  // Nuevo estado de vista
  const [viewMode, setViewMode] = useState<"loose" | "subjects">("loose");

 const handleAddOrUpdate = () => {
    if (!title.trim()) return;

    if (editingId) {
      // Update logic remains the same (it calls updateTask, not addTask)
      updateTask(editingId, {
        title,
        description,
        materia: undefined, // Tarea suelta
        fechaEntrega: fechaEntrega || undefined,
      });
      setEditingId(null);
    } else {
      // --- CORRECTION for adding NEW tasks ---
      // Create the object with ONLY the allowed properties
      const taskDataForContext = {
        title,
        description: description.trim() || undefined,
        materia: undefined, // Tarea suelta
        fechaEntrega: fechaEntrega || undefined,
        // Do NOT include 'id', 'completada', or 'points' here
        // (unless setting optional points/completada status)
      };
      // --- END CORRECTION ---

      // Pass the correctly typed object to addTask
      addTask(taskDataForContext);
    }

    // limpiar
    setTitle("");
    setDescription("");
    setFechaEntrega("");
  };

  const handleEdit = (id: string) => {
    const t = tasks.find((task) => task.id === id);
    if (t) {
      setTitle(t.title);
      setDescription(t.description || "");
      // setMateria(t.materia || ""); // No se edita aquí
      setFechaEntrega(t.fechaEntrega || "");
      // setPrioridad(t.prioridad || "media"); // Eliminado
      setEditingId(t.id);
    }
  };
  
  // Filtramos solo tareas sueltas (sin materia)
  const tasksSueltas = tasks.filter(t => !t.materia || t.materia.trim() === "");

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">
          Gestión de Tareas
        </h1>

        {/* Botones de modo */}
        <div className="flex gap-2">
           <Button variant={viewMode === 'loose' ? 'default' : 'outline'} onClick={() => setViewMode('loose')}>
             Tareas Sueltas
           </Button>
           <Button variant={viewMode === 'subjects' ? 'default' : 'outline'} onClick={() => setViewMode('subjects')}>
             Por Materia
           </Button>
        </div>

        {viewMode === 'loose' ? (
          <>
            {/* Formulario para tareas sueltas */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Editar tarea suelta" : "Nueva tarea suelta"}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Título"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="sm:col-span-2"
                />
                <Input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
                
                {/* Select de Prioridad Eliminado */}
              </div>

              <Textarea
                placeholder="Descripción..."
                className="mt-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex gap-3 mt-4">
                <Button onClick={handleAddOrUpdate}>
                  {editingId ? "Guardar cambios" : "Agregar tarea"}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>

            {/* Lista de tareas sueltas */}
            <div className="space-y-3">
              {tasksSueltas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay tareas sueltas creadas aún.
                </p>
              ) : (
              tasksSueltas.map((t) => (
                <TaskCard
                  key={t.id}
                  {...t}
                  onComplete={() => toggleComplete(t.id)}
                  onEdit={() => handleEdit(t.id)}
                  onDelete={() => deleteTask(t.id)} 
                />
              ))
              )}
            </div>
          </>
        ) : (
          // Vista de navegación por materias
          <SubjectNavigator />
        )}
      </div>
    </div>
  );
}