import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ProgressRing } from "./ProgressRing";
import { TaskCard } from "./TaskCard";
import { useTasks } from "../contexts/TasksContext";
import { 
  Calendar, 
  // Clock, // No se usa si se quitan recomendaciones
  Trophy, 
  Target, 
  Flame, 
  BookOpen,
  TrendingUp,
  Plus,
  // Bell, // No se usa si se quitan recomendaciones
  // Lightbulb // No se usa si se quitan recomendaciones
} from "lucide-react";
import { useAuth } from "../auth/AuthContext"; 

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth(); 
  const today = new Date();
  const fechaHoy = today.toLocaleDateString('es-CO', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mock data
  const userStats = {
    nivel: 0,
    puntos: 0,
    puntosParaSiguienteNivel: 2500,
    streak: 0,
    tareasCompletadas: 0,
    tareasTotal: 0,
    progresoDiario: 0
  };

 // ✅ importa arriba del archivo

// ...

const { tasks, toggleComplete } = useTasks(); // 👈 obtén tareas del contexto

// mostramos solo las 5 más recientes
const proximasTareas = tasks.slice(0, 5);

  // RECOMENDACIONES ELIMINADAS

  const materias = [
    { nombre: "Ing. Software", progreso: 0, color: "bg-blue-500" },
    { nombre: "Est. Datos", progreso: 0, color: "bg-green-500" },
    { nombre: "Matemáticas", progreso: 0, color: "bg-yellow-500" },
    { nombre: "Base de Datos", progreso: 0, color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Título de la página renombrado en Navigation.tsx */}
            <h1 className="text-3xl font-bold">¡Hola, {user?.name || "Usuario"}! 👋</h1>
            <p className="text-muted-foreground capitalize">{fechaHoy}</p>
          </div>
          <Button onClick={() => onNavigate("tareas")} className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Nueva tarea
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Nivel y Puntos */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nivel actual</p>
                  <p className="text-2xl font-bold">{userStats.nivel}</p>
                </div>
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>{userStats.puntos} puntos</span>
                  <span>{userStats.puntosParaSiguienteNivel}</span>
                </div>
                <Progress 
                  value={(userStats.puntos / userStats.puntosParaSiguienteNivel) * 100} 
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Racha actual</p>
                  <p className="text-2xl font-bold">{userStats.streak} días</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ¡Mantén la consistencia!
              </p>
            </CardContent>
          </Card>

          {/* Tareas Completadas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tareas completadas</p>
                  <p className="text-2xl font-bold">
                    {userStats.tareasCompletadas}/{userStats.tareasTotal}
                  </p>
                </div>
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <Progress 
                value={(userStats.tareasCompletadas / userStats.tareasTotal) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Progreso Diario */}
          <Card>
            <CardContent className="p-6 flex items-center justify-center">
              <ProgressRing
                progress={userStats.progresoDiario}
                size="md"
                color="primary"
                label="Progreso de hoy"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Tareas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas tareas
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate("tareas")}
                >
                  Ver todas
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {proximasTareas.map((tarea) => (
                  <TaskCard
                    key={tarea.id}
                    {...tarea}
                    materia={tarea.materia ?? ""}
                    onComplete={() => toggleComplete(tarea.id)}
                    onEdit={() => console.log("Editar:", tarea.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* SECCIÓN DE RECOMENDACIONES ELIMINADA */}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendario Compacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold">{today.getDate()}</p>
                  <p className="text-sm text-muted-foreground">
                    {today.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate("calendario")}
                >
                  Ver calendario completo
                </Button>
              </CardContent>
            </Card>

            {/* Progreso por Materia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Progreso por materia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materias.map((materia, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{materia.nombre}</span>
                      <span>{materia.progreso}%</span>
                    </div>
                    <Progress value={materia.progreso} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ranking Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu posición
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">#12</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    en tu universidad
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onNavigate("gamificacion")} // Esto ahora es 'grupos'
                  >
                    Ver grupos de trabajo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}