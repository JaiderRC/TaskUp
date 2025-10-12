import React, { useState } from "react";
import { useTasks } from "../contexts/TasksContext";
import { TaskCard } from "./TaskCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function TasksView() {
  const { tasks, addTask, toggleComplete, deleteTask, updateTask } = useTasks();

  // Estado del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materia, setMateria] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [prioridad, setPrioridad] = useState<"alta" | "media" | "baja">("media");

  // Para edición
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = () => {
    if (!title.trim()) return;

    if (editingId) {
      updateTask(editingId, {
        title,
        description,
        materia,
        fechaEntrega,
        prioridad,
      });
      setEditingId(null);
    } else {
      addTask({
        id: crypto.randomUUID(),
        title,
        description,
        materia,
        fechaEntrega,
        prioridad,
        completada: false,
        points: 50,
      });
    }

    // limpiar
    setTitle("");
    setDescription("");
    setMateria("");
    setFechaEntrega("");
  };

  const handleEdit = (id: string) => {
    const t = tasks.find((task) => task.id === id);
    if (t) {
      setTitle(t.title);
      setDescription(t.description || "");
      setMateria(t.materia || "");
      setFechaEntrega(t.fechaEntrega || "");
      setPrioridad(t.prioridad || "media");
      setEditingId(t.id);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4">
          {editingId ? "Editar Tarea" : "Gestión de Tareas"}
        </h1>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Modificar tarea existente" : "Nueva tarea"}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            />
            <Input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
            />
            <select
              value={prioridad}
              onChange={(e) =>
                setPrioridad(e.target.value as "alta" | "media" | "baja")
              }
              className="border rounded-md px-3 py-2"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
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

        {/* Lista de tareas */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay tareas creadas aún.
            </p>
          ) : (
           tasks.map((t) => (
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
      </div>
    </div>
  );
}
