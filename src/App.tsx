// src/App.tsx
import React, { useState ,useEffect} from "react";
import { LandingPage } from "./components/LandingPage";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { CalendarView } from "./components/CalendarView";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { TasksProvider } from "./contexts/TasksContext";
import { TasksView } from "./components/TasksView";
import { ParticipantsProvider } from "./contexts/ParticipantsContext";
import { GamificationView } from "./components/GamificationView";
import { AnalyticsView } from "./components/AnalyticsView";
import { ProfileView } from "./components/ProfileView";
/**
 * Componente interno que maneja la navegación por estado y el flujo
 * publico vs autenticado (frontend-only auth via AuthContext).
 */
function AppInner() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const { user, ready } = useAuth(); // <-- ahora usamos `ready`

  // cuando auth se inicializa y hay usuario, vamos al dashboard si aún estamos en "landing"
  useEffect(() => {
    if (ready && user) {
      setCurrentPage(prev => (prev === "landing" ? "dashboard" : prev));
    }
  }, [ready, user]);

  const handlePageChange = (page: string) => setCurrentPage(page);
  const handleGetStarted = () => setCurrentPage("register");
  const handleLogin = () => setCurrentPage("login");

  // valores que antes usabas hardcodeados; si el usuario existe, intenta usarlos
  const userLevel = user?.level ?? 15;
  const userPoints = user?.points ?? 2340;
  const notifications = 3;

  // Si no hay usuario autenticado, mostrar pantallas de landing / login / register
  if (!user) {
    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
      case "login":
        return <Login onSuccess={() => setCurrentPage("dashboard")} />;
      case "register":
        return <Register onSuccess={() => setCurrentPage("dashboard")} />;

      default:
        return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
    }
  }

  // Usuario autenticado: render principal con navegación y páginas internas
  return (
    <div className="min-h-screen">
      {currentPage !== "landing" && (
        <Navigation
          currentPage={currentPage}
          onPageChange={handlePageChange}
          userLevel={userLevel}
          userPoints={userPoints}
          notifications={notifications}
          userName={user?.name}
        />
      )}

      {(() => {
        switch (currentPage) {
          case "dashboard":
            return <Dashboard onNavigate={handlePageChange} />;
          case "calendario":
            return <CalendarView onNavigate={handlePageChange} />;
          case "tareas":
           case "tareas":
      return <TasksView />;
          case "gamificacion":
  return <GamificationView />; 
          case "analytics":
  return <AnalyticsView />;

          case "perfil":
  return <ProfileView />;
          case "configuracion":
            return (
              <div className="min-h-screen bg-muted/30 p-6">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Configuración</h1>
                  <div className="bg-white rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Página de configuración en desarrollo...</p>
                  </div>
                </div>
              </div>
            );
          default:
            return <Dashboard onNavigate={handlePageChange} />;
        }
      })()}

      <Toaster />
    </div>
  );
}


/** Exporta App envuelto en AuthProvider */
export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <ParticipantsProvider>
          <AppInner />
        </ParticipantsProvider>
      </TasksProvider>
    </AuthProvider>
  );
}