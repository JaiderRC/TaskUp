// src/App.tsx
import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { CalendarView } from "./components/CalendarView";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./auth/AuthContext"; // Asegúrate que la ruta sea correcta
import { Login } from "./components/Login";
import { TasksProvider } from "./contexts/TasksContext";
import { TasksView } from "./components/TasksView";
import { GamificationView } from "./components/GamificationView";
import { AnalyticsView } from "./components/AnalyticsView";
import { ProfileView } from "./components/ProfileView";
import { NotificationsView } from "./components/NotificationsView";
import { GroupsProvider } from "./contexts/GroupsContext";

function AppInner() {
  const { user, ready } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(user ? "resumen" : "landing");

  useEffect(() => {
    if (ready && user && currentPage === "landing") {
      setCurrentPage("resumen");
    }
    // Si no está listo o no hay usuario, y NO estamos en login/landing, redirigir a landing
    // (Esto evita quedar "atrapado" en una página protegida si se borra localStorage)
    if (ready && !user && currentPage !== "login" && currentPage !== "landing") {
       setCurrentPage("landing");
    }
  }, [ready, user, currentPage]);

  const handlePageChange = (page: string) => setCurrentPage(page);
  const handleGetStarted = () => setCurrentPage("login"); // Ahora "Get Started" va a Login
  const handleLogin = () => setCurrentPage("login");

  // --- CORRECCIÓN AQUÍ ---
  // Usar valores fijos para level y points ya que no están en el User actual
  const userLevel = 1; // Valor fijo o quitar si Navigation ya no lo usa
  const userPoints = 0; // Valor fijo o quitar si Navigation ya no lo usa
  // Usar displayName o username como respaldo para el nombre
  const userNameForNav = user?.displayName || user?.username || "Usuario";
  // --- FIN CORRECCIÓN ---

  const notifications = 3; // Mantener como ejemplo

  // Vistas públicas (si no hay usuario)
  if (!user) {
    switch (currentPage) {
      case "landing":
        return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
      case "login":
        return <Login onSuccess={() => setCurrentPage("resumen")} />;
      default:
         // Redirigir a landing si intenta acceder a otra página sin estar logueado
        return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
    }
  }

  // Vistas protegidas (si hay usuario)
  return (
    <div className="min-h-screen flex flex-col"> {/* Asegurar flex-col para layout */}
      {/* La navegación siempre se muestra si hay usuario */}
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        userLevel={userLevel}       // <-- Usa valor fijo
        userPoints={userPoints}     // <-- Usa valor fijo
        notifications={notifications}
        userName={userNameForNav} // <-- Usa la variable corregida
      />

      {/* Contenido principal que cambia */}
      <main className="flex-grow"> {/* Añadir flex-grow para que ocupe el espacio */}
        {(() => {
          switch (currentPage) {
            case "resumen":
              return <Dashboard onNavigate={handlePageChange} />;
            case "calendario":
              return <CalendarView onNavigate={handlePageChange} />;
            case "tareas":
              return <TasksView />;
            case "grupos":
              return <GamificationView />;
            case "rendimiento":
              return <AnalyticsView />;
            case "perfil":
              return <ProfileView />;
            case "notificaciones":
              return <NotificationsView />;
            default:
              // Si currentPage no coincide con ninguna ruta conocida, ir a resumen
              return <Dashboard onNavigate={handlePageChange} />;
          }
        })()}
      </main>

      <Toaster position="top-center" richColors/> {/* Posición común para Toaster */}
    </div>
  );
}

// Proveedores globales
export default function App() {
 return (
    <AuthProvider>
      <TasksProvider>
        <GroupsProvider>
          <AppInner />
        </GroupsProvider>
      </TasksProvider>
    </AuthProvider>
  );
}