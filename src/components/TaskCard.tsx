import React, { useState } from "react";
import { CheckCircle, Edit3, Trash2 } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./ui/button";

export type TaskCardProps = {
  id: string;
  title: string;
  description?: string;
  materia?: string;
  fechaEntrega?: string;
  tiempoEstimado?: number;
  prioridad?: "alta" | "media" | "baja";
  completada?: boolean;
  points?: number;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  materia,
  fechaEntrega,
  tiempoEstimado,
  prioridad,
  completada = false,
  points,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [justCompleted, setJustCompleted] = useState(false);

  const handleComplete = () => {
    onComplete?.(id);
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 1800);
  };

  const prioridadColor =
    prioridad === "alta"
      ? "bg-red-100 text-red-700"
      : prioridad === "media"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div
      className={cn(
        "p-4 border rounded-xl bg-white flex justify-between items-start transition-all duration-300 shadow-sm",
        completada && "opacity-70 border-green-400",
        justCompleted && "ring-2 ring-green-400"
      )}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-semibold text-lg", completada && "line-through text-gray-500")}>
            {title}
          </h3>
          {fechaEntrega && (
            <span className="text-sm text-gray-500">
              📅 {new Date(fechaEntrega).toLocaleDateString()}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          {materia && (
            <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700">
              {materia}
            </span>
          )}
          {prioridad && (
            <span className={cn("px-2 py-1 rounded-md", prioridadColor)}>
              {prioridad.toUpperCase()}
            </span>
          )}
          {typeof tiempoEstimado === "number" && (
            <span className="text-gray-500">⏱ {tiempoEstimado} min</span>
          )}
          {points && (
            <span className="text-yellow-600 font-medium">⭐ {points} pts</span>
          )}
        </div>

        {justCompleted && (
          <p className="text-green-600 text-sm mt-2 animate-pulse">
            🎉 ¡Tarea completada con éxito!
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onEdit?.(id)}
        >
          <Edit3 className="w-4 h-4" />
          Editar
        </Button>

        <Button
          size="sm"
          variant={completada ? "secondary" : "default"}
          className="flex items-center gap-2"
          onClick={handleComplete}
        >
          <CheckCircle className="w-4 h-4" />
          {completada ? "Deshacer" : "Completar"}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-2"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </Button>
      </div>
    </div>
  );
};
