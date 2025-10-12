// src/components/AnalyticsView.tsx
import React, { useMemo } from "react";
import { useTasks } from "../contexts/TasksContext";
import { useParticipants } from "../contexts/ParticipantsContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";
import { Card } from "./ui/card";

const COLORS = ["#2563eb", "#06b6d4", "#f97316", "#f59e0b", "#10b981"];

export const AnalyticsView: React.FC = () => {
  const { tasks } = useTasks();
  const { participants } = useParticipants();

  // --- Metric: tareas completadas por día (últimos 14 días) ---
  const tasksPerDay = useMemo(() => {
    const map = new Map<string, { date: string; completadas: number; total: number }>();
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key, completadas: 0, total: 0 });
    }

    tasks.forEach(t => {
      if (!t.fechaEntrega) return;
      // Intentamos parsear dd/mm/yyyy o ISO
      let dateKey = "";
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(t.fechaEntrega)) {
        const [dd, mm, yyyy] = t.fechaEntrega.split("/");
        dateKey = `${yyyy}-${mm}-${dd}`;
      } else {
        // asume ISO
        try { dateKey = new Date(t.fechaEntrega).toISOString().slice(0,10); } catch { dateKey = ""; }
      }
      if (!map.has(dateKey)) return;
      const entry = map.get(dateKey)!;
      entry.total += 1;
      if (t.completada) entry.completadas += 1;
    });

    return Array.from(map.values()).map(x => ({ date: x.date.slice(5), completadas: x.completadas, total: x.total }));
  }, [tasks]);

  // --- Metric: tareas por materia (top 6) ---
  const tasksBySubject = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const m = t.materia || "Sin materia";
      counts[m] = (counts[m] || 0) + 1;
    });
    const arr = Object.entries(counts).map(([name, value]) => ({ name, value }));
    arr.sort((a,b)=>b.value-a.value);
    return arr.slice(0,6);
  }, [tasks]);

  // --- Metric: tareas estado (completadas / pendientes) ---
  const tasksStatus = useMemo(() => {
    const completed = tasks.filter(t => t.completada).length;
    const pending = tasks.length - completed;
    return [
      { name: "Completadas", value: completed },
      { name: "Pendientes", value: pending }
    ];
  }, [tasks]);

  // --- Metric: top participantes (ranking) ---
  const topParticipants = useMemo(() => {
    return [...participants].sort((a,b)=>b.points-a.points).slice(0,5);
  }, [participants]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart 1: Tareas completadas (serie temporal) */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tareas completadas (últimos 14 días)</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={tasksPerDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="completadas" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeDasharray="5 5" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Chart 2: Top participantes */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top participantes</h3>
              <div className="space-y-3">
                {topParticipants.length === 0 ? (
                  <div className="text-sm text-slate-500">No hay participantes aún.</div>
                ) : (
                  topParticipants.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {p.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.school || ""}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{p.points}</div>
                        <div className="text-xs text-slate-500">#{i+1}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart 3: tareas por materia (barras) */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tareas por materia</h3>
              {tasksBySubject.length === 0 ? (
                <div className="text-sm text-slate-500">No hay tareas.</div>
              ) : (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={tasksBySubject} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>

          {/* Donut: estado de tareas */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estado de tareas</h3>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={tasksStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label>
                      {tasksStatus.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Small stats */}
          <Card>
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-semibold">Resumen</h3>
              <div className="text-sm text-slate-600">
                <div>Total tareas: <strong>{tasks.length}</strong></div>
                <div>Tareas completadas: <strong>{tasks.filter(t=>t.completada).length}</strong></div>
                <div>Participantes: <strong>{participants.length}</strong></div>
                <div>Puntos totales: <strong>{participants.reduce((s,p)=>s+p.points,0)}</strong></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
