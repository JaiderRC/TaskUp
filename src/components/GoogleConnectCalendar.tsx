// src/components/GoogleConnectCalendar.tsx
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./ui/button";

export const GoogleConnectCalendar: React.FC = () => {
  // Asume que el contexto provee esta info y función
  const { user, connectGoogleCalendar } = useAuth();

  // Asumimos que 'user' tiene una propiedad 'isCalendarConnected'
  const isConnected = (user as any)?.isCalendarConnected || false;

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-600">✅</span>
        <p className="text-sm font-medium">Calendario de Google conectado.</p>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={connectGoogleCalendar}
    >
      {/* <CalendarIcon className="w-4 h-4 mr-2" /> */}
      Conectar Calendario de Google
    </Button>
  );
};