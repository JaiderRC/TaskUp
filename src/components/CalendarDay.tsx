// src/components/CalendarDay.tsx
import { cn } from "./ui/utils"; // Make sure cn is imported
import { Badge } from "./ui/badge";
import { Users } from 'lucide-react';

// Exporting the interface so CalendarView can import it
export interface CalendarTask {
  id: string;
  title: string;
  materia?: string;
  completada: boolean;
  groupId?: string;
  groupName?: string; // Optional group name passed from CalendarView
}

interface CalendarDayProps {
  date: Date;
  isToday?: boolean;
  isSelected?: boolean;
  isOtherMonth?: boolean;
  tasks: CalendarTask[];
  onDateClick: (date: Date) => void;
  onTaskDrop?: (taskId: string, date: Date) => void;
  className?: string; // Accept className from parent
}

export function CalendarDay({
  date,
  isToday,
  isSelected,
  isOtherMonth,
  tasks,
  onDateClick,
  onTaskDrop,
  className // Receive className prop
}: CalendarDayProps) {
  const day = date.getDate();

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (onTaskDrop && taskId) { onTaskDrop(taskId, date); }
  };

  return (
    // Apply passed className (e.g., borders) using cn()
    <div
      className={cn(
        "min-h-[100px] p-2 border-transparent cursor-pointer transition-colors hover:bg-gray-50", // Base styles
        isToday && "bg-blue-50",
        isSelected && "bg-blue-100",
        isOtherMonth && "text-gray-400 bg-gray-50/50",
        className // Apply className from CalendarView here
      )}
      onClick={() => onDateClick(date)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Day Header */}
      <div className="flex justify-between items-center mb-2">
        <span className={cn("text-sm font-medium", isToday && "text-blue-600 font-bold")}>{day}</span>
        {tasks.length > 0 && (<Badge variant="secondary" className="text-xs h-5 px-1.5">{tasks.length}</Badge>)}
      </div>

      {/* Task List */}
      <div className="space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={cn(
              "text-xs p-1 rounded truncate cursor-grab flex items-center gap-1.5",
              task.completada ? "bg-gray-100 text-gray-400 line-through opacity-70" : "bg-white border text-gray-700 shadow-xs",
              !task.completada && "hover:shadow-sm hover:border-gray-300"
            )}
            draggable={!task.completada}
            onDragStart={(e) => { e.dataTransfer.setData("text/plain", task.id); }}
            // Optional: Tooltip for the whole task div if needed
            // title={task.groupName ? `${task.title} (Grupo: ${task.groupName})` : task.title}
          >
            {/* --- CORRECTED ICON WRAPPER --- */}
            {task.groupId && (
              // Wrap the icon in a span and add the title there
              <span title={`Grupo: ${task.groupName || '?'}`}>
                <Users className="w-3 h-3 text-blue-500 shrink-0" />
              </span>
            )}
            {/* --- END CORRECTION --- */}

            <span className="truncate flex-1" title={task.title}>{task.title}</span> {/* Add title for truncation */}
          </div>
        ))}
        {/* "+X more tasks" message */}
        {tasks.length > 3 && (<div className="text-xs text-gray-500 text-center pt-0.5">+{tasks.length - 3} más</div>)}
      </div>
    </div>
  );
}