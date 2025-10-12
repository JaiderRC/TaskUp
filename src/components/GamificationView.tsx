// src/components/GamificationView.tsx
import React, { useState, useMemo } from "react";
import { useParticipants } from "../contexts/ParticipantsContext";
import { Button } from "./ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Toaster, toast } from "sonner";

export const GamificationView: React.FC = () => {
  const { participants, addParticipant, removeParticipant, changePoints, loadSample, resetAll } = useParticipants();

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [initialPoints, setInitialPoints] = useState<number | "">("");

  // leaderboard ordenado por puntos desc
  const leaderboard = useMemo(() => {
    return [...participants].sort((a, b) => b.points - a.points);
  }, [participants]);

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return toast.error("Agrega un nombre");
    addParticipant({ name: name.trim(), school: school.trim() || undefined, avatar: undefined });
    if (typeof initialPoints === "number" && initialPoints > 0) {
      // aplicar puntos iniciales sumando al último creado
      const last = leaderboard.length ? leaderboard[0] : undefined;
      // safer: find the participant with name (recent)
    }
    setName("");
    setSchool("");
    setInitialPoints("");
    toast.success("Participante agregado");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gamificación</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { loadSample(); toast.success("Ejemplo cargado"); }}>Cargar ejemplo</Button>
            <Button variant="destructive" onClick={() => { resetAll(); toast("Ranking reiniciado"); }}>Reiniciar</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form: agregar participante */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Agregar participante</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="w-full border rounded px-3 py-2" />
              <input value={school} onChange={e => setSchool(e.target.value)} placeholder="Universidad / Facultad (opcional)" className="w-full border rounded px-3 py-2" />
              <input value={initialPoints} onChange={e => setInitialPoints(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Puntos iniciales (opcional)" type="number" className="w-full border rounded px-3 py-2" />
              <div className="flex justify-end gap-2">
                <Button type="submit"><Plus className="w-4 h-4 mr-2" />Agregar</Button>
              </div>
            </form>
          </div>

          {/* Leaderboard */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Ranking</h2>

            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-sm text-slate-500">No hay participantes aún.</div>
              ) : (
                leaderboard.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{p.name.split(" ").map(n => n[0]).slice(0,2).join("")}</div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.school || "-"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right mr-3">
                        <div className="text-lg font-semibold">{p.points}</div>
                        <div className="text-xs text-slate-500">#{idx + 1}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => { changePoints(p.id, -10); toast.success(`-10 puntos a ${p.name}`); }}>
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => { changePoints(p.id, 10); toast.success(`+10 puntos a ${p.name}`); }}>
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button size="sm" variant="destructive" onClick={() => { if (confirm(`Eliminar ${p.name}?`)) { removeParticipant(p.id); toast(`Eliminado ${p.name}`); } }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
