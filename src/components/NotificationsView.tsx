// src/components/NotificationsView.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bell } from "lucide-react";

// Mock data
const notifications = [
  { id: 1, text: "Nueva tarea asignada: 'Hacer el deploy' en el grupo 'Proyecto Final'.", time: "hace 5 minutos" },
  { id: 2, text: "Recordatorio: 'Examen de Cálculo' vence mañana.", time: "hace 1 hora" },
  { id: 3, text: "Juan Pérez ha completado la tarea 'Diseño de base de datos'.", time: "hace 3 horas" },
];

export const NotificationsView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-slate-500">No tienes notificaciones nuevas.</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="flex items-start gap-4 p-4 border-b last:border-b-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p>{notif.text}</p>
                    <span className="text-sm text-slate-500">{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};