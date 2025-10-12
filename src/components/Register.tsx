// src/components/Register.tsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../auth/AuthContext";

export const Register: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { register } = useAuth();
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
    register(user);
    onSuccess?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Crear cuenta (demo)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Nombre</label>
            <input
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/40"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Correo</label>
            <input
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Crear cuenta</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
