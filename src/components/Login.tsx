// src/components/Login.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../auth/AuthContext";

export const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: "u_" + Date.now(),
      name: name || email.split("@")[0] || "Estudiante",
      email,
      level: 1,
      points: 0,
    };
    login(user);
    onSuccess?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-white/70">
        {/* Header con icono */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Iniciar Sesión
          </h2>
          <p className="text-slate-500 mt-2 text-sm">Demo educativa - Ingresa tus datos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre (opcional)
            </label>
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correo electrónico
            </label>
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              type="email"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-black font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700 border-0"
          >
            Comenzar Ahora
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
};
