import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // si no lo tienes, usa <input> nativo
import { Card } from "./ui/card";
import { GoogleConnectCalendar } from "./GoogleConnectCalendar"; // Importado

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // form
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [editing, setEditing] = useState(false);

  // keep form synced if user changes externally
  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return alert("Nombre y correo obligatorios");
    updateProfile({ name: name.trim(), email: email.trim() });
    setEditing(false);
    // opcional: toast
  };

  if (!user) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="p-6 text-center">
              <p className="text-slate-600">No hay usuario autenticado.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Perfil</h1>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {user.name.split(" ").map(n => n[0]).slice(0,2).join("")}
            </div>
            <div className="flex-1">
              {!editing ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Nivel {user.level ?? 1}</p>
                      <p className="text-sm text-slate-500">{(user.points ?? 0).toLocaleString()} puntos</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3 w-full">
                  <label className="text-sm">Nombre</label>
                  <input className="border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
                  <label className="text-sm">Correo</label>
                  <input className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            {!editing ? (
              <Button onClick={() => setEditing(true)}>Editar perfil</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setEditing(false); setName(user.name); setEmail(user.email); }}>Cancelar</Button>
                <Button onClick={handleSave}>Guardar</Button>
              </>
            )}
          </div>
        </div>

        {/* sección extensible: información adicional editable */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-3">Conexiones</h3>
          
          {/* Conexión a Google Calendar */}
          <div className="mb-4">
            <GoogleConnectCalendar />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Información adicional (Por definir)</h3>
            <p className="text-sm text-slate-600">
              {/* TODO(Jaider): Definir el contenido de esta sección. */}
              Aquí puedes agregar más campos como carrera, semestre, bio, enlaces, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};