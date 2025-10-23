// src/components/AnalyticsView.tsx (or PerformanceView.tsx)
import React, { useMemo, useState } from "react";
import { useTasks, Task } from "../contexts/TasksContext"; // Import Task interface
import { useGroups, Group } from "../contexts/GroupsContext"; // Import Group interface
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from "recharts";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const COLORS = ["#2563eb", "#06b6d4", "#f97316", "#f59e0b", "#10b981"];

export const AnalyticsView: React.FC = () => {
  const { tasks } = useTasks();
  const { myGroups } = useGroups(); // Get groups from context

  const [filterGroup, setFilterGroup] = useState<string>("general"); // 'general' or a group ID

  // Filter tasks based on the selected group or 'general'
  const filteredTasks = useMemo(() => {
    console.log(`Filtering tasks for: ${filterGroup}`);
    if (filterGroup === "general") {
      // Tasks "generales" (sin grupo)
      return tasks.filter(t => !t.groupId);
    }
    // Tasks del grupo seleccionado
    return tasks.filter(t => t.groupId === filterGroup);
  }, [tasks, filterGroup]);

  // --- Metric: Tasks completed per day (Last 14 days) ---
  const tasksPerDay = useMemo(() => {
    const map = new Map<string, { date: string; completadas: number; total: number }>();
    const today = new Date();
    // Initialize map for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      map.set(key, { date: key, completadas: 0, total: 0 });
    }
    // Populate map with filtered tasks
    filteredTasks.forEach(t => {
      if (!t.fechaEntrega) return;
      let dateKey = "";
      try {
        // Ensure date is parsed correctly from YYYY-MM-DD
        dateKey = new Date(t.fechaEntrega.replace(/-/g, '/')).toISOString().slice(0, 10);
      } catch { dateKey = ""; }

      if (map.has(dateKey)) {
        const entry = map.get(dateKey)!;
        entry.total += 1;
        if (t.completada) entry.completadas += 1;
      }
    });
    // Format for chart: { date: 'MM-DD', completadas: N, total: M }
    return Array.from(map.values()).map(x => ({ date: x.date.slice(5), completadas: x.completadas, total: x.total }));
  }, [filteredTasks]);


  // --- Metric: Tasks per Group (Top 6 if 'general' selected, otherwise just the selected group) ---
  const tasksByGroup = useMemo(() => {
    const groupMap: Record<string, { name: string; value: number }> = {};

    // Get group names for lookup
    const groupNameById: Record<string, string> = {};
    myGroups.forEach(g => { groupNameById[g.id] = g.name });

    tasks.forEach(task => { // Iterate through ALL tasks to count totals per group
        const groupId = task.groupId;
        const groupName = groupId ? (groupNameById[groupId] || `Grupo ${groupId.substring(0,4)}`) : "Tareas Sueltas";

        if (!groupMap[groupName]) {
            groupMap[groupName] = { name: groupName, value: 0 };
        }
        groupMap[groupName].value += 1;
    });

    const arr = Object.values(groupMap);
    arr.sort((a, b) => b.value - a.value); // Sort descending by count

    // If 'general' is selected, show top groups. Otherwise, filter isn't needed here.
    // This chart will show the distribution across all relevant groups.
    return arr.slice(0, 6); // Limit to top 6 for readability

  }, [tasks, myGroups]); // Depend on all tasks and groups list


  // --- Metric: Task Status (Completed / Pending) ---
  const tasksStatus = useMemo(() => {
    const completed = filteredTasks.filter(t => t.completada).length;
    const pending = filteredTasks.length - completed;
    // Return data formatted for PieChart
    return [
      { name: "Completadas", value: completed },
      { name: "Pendientes", value: pending }
    ];
  }, [filteredTasks]);


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Filter */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rendimiento</h1>
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Ver rendimiento..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Rendimiento General </SelectItem>
              {myGroups.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chart Row 1 */}
        <div className="grid lg:grid-cols-1 gap-6">
          {/* Chart 1: Tasks completed (Time series) - Uses filteredTasks */}
          <Card className="lg:col-span-1">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tareas completadas (últimos 14 días)</h3>
              <div style={{ width: "100%", height: 260 }}>
                {filteredTasks.length === 0 && tasksPerDay.every(d => d.total === 0) ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos de tareas completadas para este período/grupo.</div>
                ) : (
                  <ResponsiveContainer>
                    <LineChart data={tasksPerDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line name="Completadas" type="monotone" dataKey="completadas" stroke="#10b981" strokeWidth={2} />
                      <Line name="Totales Creadas/Vencidas" type="monotone" dataKey="total" stroke="#8884d8" strokeDasharray="5 5" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Chart 2: Tasks per Group - Uses tasksByGroup derived from ALL tasks */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tareas por Grupo (Top 6)</h3>
              {tasksByGroup.length === 0 ? (
                <div className="flex items-center justify-center h-[220px] text-muted-foreground">No hay tareas en grupos.</div>
              ) : (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={tasksByGroup} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={40} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar name="Nº Tareas" dataKey="value" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>

          {/* Chart 3: Task Status (Pie Chart) - Uses filteredTasks */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estado de Tareas ({filterGroup === 'general' ? 'Generales' : myGroups.find(g=>g.id===filterGroup)?.name})</h3>
              {(tasksStatus[0].value === 0 && tasksStatus[1].value === 0) ? (
                 <div className="flex items-center justify-center h-[220px] text-muted-foreground">No hay tareas {filterGroup === 'general' ? 'generales' : `en este grupo`}.</div>
              ) : (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={tasksStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} label={(entry) => `${entry.name} (${entry.value})`}>
                        {tasksStatus.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};