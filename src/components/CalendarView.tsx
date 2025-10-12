import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CalendarDay } from "./CalendarDay";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Calendar as CalendarIcon
} from "lucide-react";

interface CalendarViewProps {
  onNavigate: (page: string) => void;
}

export function CalendarView({ onNavigate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data
  const tasks = [
    {
      id: "1",
      title: "Entrega proyecto",
      materia: "Ing. Software",
      prioridad: "alta" as const,
      completada: false,
      date: new Date(2025, 0, 15) // 15 enero 2025
    },
    {
      id: "2",
      title: "Parcial matemáticas", 
      materia: "Matemáticas",
      prioridad: "alta" as const,
      completada: false,
      date: new Date(2025, 0, 12)
    },
    {
      id: "3",
      title: "Taller algoritmos",
      materia: "Est. Datos", 
      prioridad: "media" as const,
      completada: true,
      date: new Date(2025, 0, 8)
    },
    {
      id: "4",
      title: "Presentación BD",
      materia: "Base de Datos",
      prioridad: "baja" as const,
      completada: false,
      date: new Date(2025, 0, 18)
    }
  ];

  const materias = [
    "Ingeniería de Software",
    "Estructuras de Datos", 
    "Matemáticas Discretas",
    "Base de Datos",
    "Redes de Computadores"
  ];

  // Calendar functions
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayTasks = tasks.filter(task => 
        task.date.toDateString() === current.toDateString()
      );
      
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

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskDrop = (taskId: string, date: Date) => {
    console.log(`Mover tarea ${taskId} a ${date.toDateString()}`);
    // Aquí implementarías la lógica para mover la tarea
  };

  const monthData = getMonthData();

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Calendario
            </h1>
            <p className="text-muted-foreground">
              Organiza y programa tus tareas académicas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
              >
                Mes
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
              >
                Semana
              </Button>
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
              >
                Día
              </Button>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva tarea
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear nueva tarea</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <Input placeholder="Nombre de la tarea" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descripción</label>
                    <Textarea placeholder="Descripción opcional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Materia</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar materia" />
                      </SelectTrigger>
                      <SelectContent>
                        {materias.map((materia) => (
                          <SelectItem key={materia} value={materia}>
                            {materia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Fecha de entrega</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tiempo estimado (min)</label>
                      <Input type="number" placeholder="60" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prioridad</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(false)}>
                      Crear tarea
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar Main */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Hoy
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                  {/* Week Headers */}
                  {weekDays.map((day) => (
                    <div 
                      key={day}
                      className="bg-gray-50 p-3 text-center text-sm font-medium border-b border-gray-200"
                    >
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {monthData.map((dayData, index) => (
                    <CalendarDay
                      key={index}
                      date={dayData.date}
                      isToday={dayData.isToday}
                      isSelected={dayData.isSelected}
                      isOtherMonth={dayData.isOtherMonth}
                      tasks={dayData.tasks}
                      onDateClick={handleDateClick}
                      onTaskDrop={handleTaskDrop}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString('es-CO', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.date.toDateString() === selectedDate.toDateString())
                      .map((task) => (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <Badge 
                              variant="outline"
                              className={
                                task.prioridad === "alta" ? "border-red-200 text-red-800" :
                                task.prioridad === "media" ? "border-yellow-200 text-yellow-800" :
                                "border-green-200 text-green-800"
                              }
                            >
                              {task.prioridad}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {task.materia}
                          </Badge>
                        </div>
                      ))}
                    
                    {tasks.filter(task => task.date.toDateString() === selectedDate.toDateString()).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay tareas programadas para este día
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Materia</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las materias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las materias</SelectItem>
                      {materias.map((materia) => (
                        <SelectItem key={materia} value={materia}>
                          {materia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las prioridades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las prioridades</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximas entregas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks
                    .filter(task => !task.completada && task.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {task.date.toLocaleDateString('es-CO')}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {task.materia}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}