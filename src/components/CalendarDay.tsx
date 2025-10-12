import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";

interface CalendarTask {
  id: string;
  title: string;
  materia: string;
  prioridad: "alta" | "media" | "baja";
  completada: boolean;
}

interface CalendarDayProps {
  date: Date;
  isToday?: boolean;
  isSelected?: boolean;
  isOtherMonth?: boolean;
  tasks: CalendarTask[];
  onDateClick: (date: Date) => void;
  onTaskDrop?: (taskId: string, date: Date) => void;
}

export function CalendarDay({ 
  date, 
  isToday, 
  isSelected, 
  isOtherMonth, 
  tasks, 
  onDateClick,
  onTaskDrop 
}: CalendarDayProps) {
  const day = date.getDate();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (onTaskDrop && taskId) {
      onTaskDrop(taskId, date);
    }
  };

  const prioridadColors = {
    alta: "bg-red-500",
    media: "bg-yellow-500",
    baja: "bg-green-500"
  };

  return (
    <div
      className={cn(
        "min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50",
        isToday && "bg-blue-50 border-blue-300",
        isSelected && "bg-blue-100 border-blue-500",
        isOtherMonth && "text-gray-400 bg-gray-50"
      )}
      onClick={() => onDateClick(date)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={cn(
          "text-sm font-medium",
          isToday && "text-blue-600 font-bold"
        )}>
          {day}
        </span>
        {tasks.length > 0 && (
          <Badge variant="outline" className="text-xs h-5">
            {tasks.length}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={cn(
              "text-xs p-1 rounded truncate cursor-grab",
              task.completada ? "bg-gray-200 text-gray-500 line-through" : "bg-white border text-gray-700",
              !task.completada && "hover:shadow-sm"
            )}
            draggable={!task.completada}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", task.id);
            }}
          >
            <div className="flex items-center gap-1">
              <div 
                className={cn("w-2 h-2 rounded-full", prioridadColors[task.prioridad])}
              />
              <span className="truncate">{task.title}</span>
            </div>
          </div>
        ))}
        
        {tasks.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{tasks.length - 3} más
          </div>
        )}
      </div>
    </div>
  );
}