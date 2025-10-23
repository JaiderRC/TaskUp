// src/components/CalendarView.tsx
// src/components/CalendarView.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CalendarDay } from "./CalendarDay"; // Make sure CalendarDay's root element fits in a grid
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "./ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Users
} from "lucide-react";
import { useTasks, Task } from "../contexts/TasksContext";
import { useGroups, Group } from "../contexts/GroupsContext";
import { CalendarTask } from "./CalendarDay"; // Import CalendarTask if defined and exported in CalendarDay
import { cn } from "./ui/utils"; // Import cn if used in CalendarDay

interface CalendarViewProps {
  onNavigate?: (page: string) => void;
}

const NO_SUBJECT_VALUE = "__NONE__";
const NO_GROUP_VALUE = "__NO_GROUP__";

export function CalendarView({ onNavigate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { tasks, addTask } = useTasks();
  const { myGroups } = useGroups();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materia, setMateria] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  const availableMaterias = useMemo(() => {
    const s = new Set<string>();
    for (const t of tasks) {
      if (t.materia && t.materia.trim() !== "") s.add(t.materia.trim());
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b, 'es'));
  }, [tasks]);

  const [filterMateria, setFilterMateria] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");

  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    myGroups.forEach(g => map.set(g.id, g.name));
    return map;
  }, [myGroups]);

  const taskDate = (t: Task): Date | null => {
    if (!t || !t.fechaEntrega || typeof t.fechaEntrega !== "string") return null;
    const dateString = t.fechaEntrega.replace(/-/g, '/');
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) return d;
    console.warn(`Could not parse date: ${t.fechaEntrega} (Task: ${t.title})`);
    return null;
  };

  const taskMatchesFilters = (t: Task): boolean => {
    if (filterMateria !== "all" && (t.materia ?? "") !== filterMateria) return false;
    if (filterEstado !== "all") {
      if (filterEstado === "pending" && t.completada) return false;
      if (filterEstado === "completed" && !t.completada) return false;
    }
    if (filterGroup !== "all" && (t.groupId ?? NO_GROUP_VALUE) !== filterGroup) return false;
    return true;
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayTasks = tasks
        .filter(task => {
          const d = taskDate(task);
          return d ? (d.toDateString() === current.toDateString() && taskMatchesFilters(task)) : false;
        })
        .map(task => ({
          ...task,
          groupName: task.groupId ? groupNameById.get(task.groupId) : undefined
        }));

      days.push({
        date: new Date(current),
        isToday: current.toDateString() === new Date().toDateString(),
        isSelected: selectedDate?.toDateString() === current.toDateString(),
        isOtherMonth: current.getMonth() !== month,
        tasks: dayTasks
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const goToPreviousMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const goToNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setFechaEntrega(date.toISOString().split('T')[0]);
    setIsCreateModalOpen(true);
  };
  const handleTaskDrop = (taskId: string, date: Date) => { console.log(`Move task ${taskId} to ${date.toDateString()}`); };

  const monthData = getMonthData();

  const handleCreateTask = () => {
    if (!title.trim() || !fechaEntrega) return;
    const taskDataForContext = { title: title.trim(), description: description.trim() || undefined, materia: materia || undefined, fechaEntrega };
    addTask(taskDataForContext);
    setTitle(""); setDescription(""); setMateria(""); setFechaEntrega("");
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header and Create Task Modal */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><CalendarIcon className="h-8 w-8" /> Calendario</h1>
            <p className="text-muted-foreground">Organiza y programa tus tareas académicas</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-white rounded-lg p-1">
               
               {/* <Button variant={view === "week" ? "default" : "ghost"} size="sm" onClick={() => setView("week")}>Semana</Button>
               <Button variant={view === "day" ? "default" : "ghost"} size="sm" onClick={() => setView("day")}>Día</Button> */}
             </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
               <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Nueva tarea</Button></DialogTrigger>
               <DialogContent className="sm:max-w-md">
                 <DialogHeader><DialogTitle>Crear nueva tarea</DialogTitle></DialogHeader>
                 <div className="space-y-4">
                   <div><label className="text-sm font-medium">Título</label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre de la tarea" /></div>
                   <div><label className="text-sm font-medium">Descripción</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción opcional" /></div>
                   <div>
                     <label className="text-sm font-medium">Materia (opcional)</label>
                     <Select value={materia || NO_SUBJECT_VALUE} onValueChange={(v: string) => setMateria(v === NO_SUBJECT_VALUE ? "" : v)}>
                       <SelectTrigger><SelectValue placeholder="Seleccionar materia" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value={NO_SUBJECT_VALUE}>Sin materia (Tarea suelta)</SelectItem>
                         {Array.isArray(availableMaterias) && availableMaterias.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="text-sm font-medium">Fecha de entrega</label><Input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} /></div>
                     <div><label className="text-sm font-medium">Tiempo estimado (min)</label><Input type="number" placeholder="60" /></div>
                   </div>
                   <div className="flex gap-2 justify-end">
                     <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                     <Button onClick={handleCreateTask}>Crear tarea</Button>
                   </div>
                 </div>
               </DialogContent>
             </Dialog>
          </div>
        </div>


        {/* Main Grid: Calendar + Sidebar */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar Main Area */}
          <div className="lg:col-span-3">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoy</Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* --- CAREFUL GRID STRUCTURE --- */}
                <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-200 rounded-lg overflow-hidden"> {/* Added border-t border-l */}
                  {/* Week Day Headers */}
                  {weekDays.map((day) => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium border-b border-r border-gray-200"> {/* Adjusted padding/border */}
                      {day}
                    </div>
                  ))}
                  {/* Calendar Day Cells - Render directly */}
                  {monthData.map((dayData, index) => (
                    <CalendarDay
                      key={dayData.date.toISOString()} // Use date string as key
                      date={dayData.date}
                      isToday={dayData.isToday}
                      isSelected={dayData.isSelected}
                      isOtherMonth={dayData.isOtherMonth}
                      tasks={dayData.tasks as CalendarTask[]} // Pass the enriched tasks
                      onDateClick={handleDateClick}
                      onTaskDrop={handleTaskDrop}
                      // Add border-b and border-r for grid lines on the day itself
                      className="border-b border-r border-gray-200"
                    />
                  ))}
                </div>
                {/* --- END GRID STRUCTURE --- */}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info Card */}
            {selectedDate && (
              <Card>
                 <CardHeader><CardTitle className="text-lg">{selectedDate.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</CardTitle></CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {tasks
                       .filter(task => { const d = taskDate(task); return d ? d.toDateString() === selectedDate.toDateString() && taskMatchesFilters(task) : false; })
                       .map((task) => (
                         <div key={task.id} className="p-3 border rounded-lg">
                           <div className="flex items-center justify-between mb-1">
                             <h4 className="font-medium text-sm">{task.title}</h4>
                             {task.groupId && groupNameById.get(task.groupId) && (
                                <Badge variant="outline" className="text-xs ml-2 border-blue-200 text-blue-800">
                                   <Users className="w-3 h-3 mr-1"/>
                                   {groupNameById.get(task.groupId)}
                                </Badge>
                             )}
                           </div>
                           {task.materia && !task.groupId && (
                             <Badge variant="secondary" className="text-xs mt-1">{task.materia}</Badge>
                           )}
                           {!task.materia && !task.groupId && (
                              <Badge variant="secondary" className="text-xs mt-1">Tarea suelta</Badge>
                           )}
                         </div>
                       ))}
                     {tasks.filter(task => { const d = taskDate(task); return d ? d.toDateString() === selectedDate.toDateString() && taskMatchesFilters(task) : false; }).length === 0 && (
                       <p className="text-sm text-muted-foreground text-center py-4">No hay tareas programadas para este día</p>
                     )}
                   </div>
                 </CardContent>
              </Card>
            )}

            {/* Quick Filters Card */}
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Filter className="h-5 w-5" /> Filtros</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {/* Subject Filter */}
                <div>
                   <label className="text-sm font-medium">Materia</label>
                   <Select value={filterMateria || NO_SUBJECT_VALUE} onValueChange={(v: string) => setFilterMateria(v === NO_SUBJECT_VALUE ? "" : v)}>
                     <SelectTrigger><SelectValue placeholder="Todas las materias" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Todas las materias</SelectItem>
                       <SelectItem value={NO_SUBJECT_VALUE}>Sin materia</SelectItem>
                       {Array.isArray(availableMaterias) && availableMaterias.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                     </SelectContent>
                   </Select>
                </div>
                {/* Group Filter */}
                <div>
                  <label className="text-sm font-medium">Grupo</label>
                  <Select value={filterGroup} onValueChange={(v: string) => setFilterGroup(v)}>
                    <SelectTrigger><SelectValue placeholder="Todos los grupos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos (Grupos y Sueltas)</SelectItem>
                      <SelectItem value={NO_GROUP_VALUE}>Solo Tareas Sueltas</SelectItem>
                      {myGroups.length > 0 && <SelectSeparator />}
                      {myGroups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={filterEstado} onValueChange={(v: string) => setFilterEstado(v)}>
                    <SelectTrigger><SelectValue placeholder="Todos los estados" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Todos los estados</SelectItem>
                       <SelectItem value="pending">Pendientes</SelectItem>
                       <SelectItem value="completed">Completadas</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks Card */}
            <Card>
               <CardHeader><CardTitle className="text-lg">Próximas entregas</CardTitle></CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   {tasks.map(t => ({ ...t, _date: taskDate(t) }))
                     .filter(t => t._date && !t.completada && (t._date as Date) >= new Date() && taskMatchesFilters(t)) // Filters are applied here
                     .sort((a, b) => (a._date as Date).getTime() - (b._date as Date).getTime())
                     .slice(0, 3)
                     .map((task) => (
                       <div key={task.id} className="p-3 border rounded-lg">
                         <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                         <p className="text-xs text-muted-foreground mb-2">{task._date ? (task._date as Date).toLocaleDateString('es-CO') : ""}</p>
                         {/* Show Group or Subject or 'Tarea Suelta' */}
                         {task.groupId && groupNameById.get(task.groupId) ? (
                            <Badge variant='outline' className="text-xs border-blue-200 text-blue-800"><Users className="w-3 h-3 mr-1"/>{groupNameById.get(task.groupId)}</Badge>
                         ) : task.materia ? (
                            <Badge variant="secondary" className="text-xs">{task.materia}</Badge>
                         ) : (
                            <Badge variant="secondary" className="text-xs">Tarea suelta</Badge>
                         )}
                       </div>
                     ))}
                   {/* Message if no upcoming tasks match filters */}
                   {tasks.map(t => ({ ...t, _date: taskDate(t) }))
                     .filter(t => t._date && !t.completada && (t._date as Date) >= new Date() && taskMatchesFilters(t))
                     .length === 0 && (
                       <p className="text-sm text-muted-foreground text-center py-4">No hay próximas entregas que coincidan con los filtros.</p>
                   )}
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}