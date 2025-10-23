// src/components/GamificationView.tsx
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TaskCard } from "./TaskCard";
import { useTasks, Task } from "../contexts/TasksContext";
import { useGroups, Group } from "../contexts/GroupsContext";

const mockUser = { id: "u1_mock" };

export const GamificationView: React.FC = () => {
  const { tasks, addTask } = useTasks();
  const { myGroups, addGroup, joinGroup } = useGroups();

  // --- ADD CONSOLE LOG HERE ---
  console.log("GamificationView rendering. myGroups from context:", myGroups);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // States for forms...
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const [joinGroupNameOrId, setJoinGroupNameOrId] = useState("");
  const [joinGroupKey, setJoinGroupKey] = useState("");
  const [assignTaskTitle, setAssignTaskTitle] = useState("");
  const [assignTaskDesc, setAssignTaskDesc] = useState("");
  const [assignTaskDate, setAssignTaskDate] = useState("");

  // useEffect to update selectedGroup's tasks
  useEffect(() => {
    // --- ADD CONSOLE LOG HERE ---
    console.log("Effect running: Updating selectedGroup tasks. Current tasks:", tasks);
    if (selectedGroup) {
      const tasksForThisGroup = tasks.filter(task => task.groupId === selectedGroup.id);
      if (JSON.stringify(tasksForThisGroup) !== JSON.stringify(selectedGroup.tasks)) {
         // --- ADD CONSOLE LOG HERE ---
        console.log(`Updating tasks for selected group ${selectedGroup.id}:`, tasksForThisGroup);
        setSelectedGroup(prev => prev ? { ...prev, tasks: tasksForThisGroup } : null);
      }
    }
  }, [tasks, selectedGroup?.id]); // Dependency on tasks and selected group ID

  // handleCreateGroup function (calls context)
  const handleCreateGroup = () => {
    if (!groupName.trim()) return toast.error("El nombre es obligatorio");
    if (!groupKey.trim()) return toast.error("La clave es obligatoria");
    addGroup({
      name: groupName.trim(),
      description: groupDesc.trim() || undefined,
      creatorId: mockUser.id,
      key: groupKey.trim(),
    });
    toast.success(`Grupo "${groupName.trim()}" creado`);
    setGroupName(""); setGroupDesc(""); setGroupKey(""); setIsCreateModalOpen(false);
  };

  // handleJoinGroup function (calls context)
  const handleJoinGroup = () => {
    if (!joinGroupNameOrId.trim()) return toast.error("El nombre o ID del grupo es obligatorio.");
    if (!joinGroupKey.trim()) return toast.error("La clave del grupo es obligatoria.");
    const success = joinGroup(joinGroupNameOrId.trim(), joinGroupKey.trim());
    if (success) {
      setJoinGroupNameOrId(""); setJoinGroupKey(""); setIsJoinModalOpen(false);
    }
  };

  // handleAssignTask function (calls context)
  const handleAssignTask = () => {
    if (!assignTaskTitle.trim() || !selectedGroup) return toast.error("El título es obligatorio.");
    addTask({
      title: assignTaskTitle.trim(),
      description: assignTaskDesc.trim() || undefined,
      fechaEntrega: assignTaskDate || undefined,
      groupId: selectedGroup.id,
    });
    toast.success(`Tarea "${assignTaskTitle}" asignada a ${selectedGroup.name}`);
    setAssignTaskTitle(""); setAssignTaskDesc(""); setAssignTaskDate("");
    setIsAssignTaskModalOpen(false);
  };

  // useEffect to select the first group
  useEffect(() => {
    // --- ADD CONSOLE LOG HERE ---
    console.log("Effect running: Selecting first group if needed. myGroups:", myGroups);
    // Select first group only if no group is selected AND the list isn't empty
    if (!selectedGroup && myGroups.length > 0) {
      console.log("Selecting first group:", myGroups[0]);
      setSelectedGroup(myGroups[0]);
    } else if (selectedGroup && !myGroups.find(g => g.id === selectedGroup.id)) {
      // If the selected group was removed, select the first one again
      console.log("Selected group removed, selecting first group:", myGroups[0] || null);
      setSelectedGroup(myGroups[0] || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myGroups]); // Now depends only on myGroups from context


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header (Buttons + Modals) */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Grupos de Trabajo</h1>
          <div className="flex items-center gap-2">
            {/* Join Group Dialog */}
            <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
              <DialogTrigger asChild><Button variant="outline">Unirse a grupo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Unirse a un Grupo</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Nombre o ID del grupo" value={joinGroupNameOrId} onChange={e => setJoinGroupNameOrId(e.target.value)} />
                  <Input placeholder="Clave del grupo" type="password" value={joinGroupKey} onChange={e => setJoinGroupKey(e.target.value)} />
                  <Button onClick={handleJoinGroup}>Unirse</Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Create Group Dialog */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Crear grupo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Crear nuevo grupo</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Nombre del grupo" value={groupName} onChange={e => setGroupName(e.target.value)} />
                  <Textarea placeholder="Descripción (opcional)" value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
                  <Input placeholder="Clave para unirse" type="password" value={groupKey} onChange={e => setGroupKey(e.target.value)} />
                  <div className="text-sm text-slate-500">(Cualidades por definir por Jaider)</div>
                  <Button onClick={handleCreateGroup}>Crear</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Grid: Group List + Selected Group */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Group List */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow h-fit">
            <h2 className="font-semibold mb-3">Mis grupos</h2>
            <div className="space-y-2">
              {/* --- CHECK THIS RENDERING LOGIC --- */}
              {myGroups.length === 0 ? (
                 <p className="text-sm text-slate-500 text-center py-4">No perteneces a ningún grupo.</p>
              ) : (
                myGroups.map(group => (
                  <button key={group.id} className={`w-full p-3 text-left rounded-lg transition-colors ${selectedGroup?.id === group.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`} onClick={() => setSelectedGroup(group)}>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-slate-500 truncate">{group.description}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Selected Group Details & Tasks */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
            {!selectedGroup ? (
              <p className="text-slate-500">Selecciona un grupo para ver sus tareas.</p>
            ) : (
              <>
                {/* Group Header + Assign Task Button */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                    <p className="text-sm text-slate-500">{selectedGroup.description || "Sin descripción."}</p>
                  </div>
                  {mockUser.id === selectedGroup.creatorId && (
                    <Dialog open={isAssignTaskModalOpen} onOpenChange={setIsAssignTaskModalOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Asignar tarea</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Asignar Tarea a "{selectedGroup.name}"</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                          <Input placeholder="Título de la tarea" value={assignTaskTitle} onChange={e => setAssignTaskTitle(e.target.value)} />
                          <Textarea placeholder="Descripción (opcional)" value={assignTaskDesc} onChange={e => setAssignTaskDesc(e.target.value)} />
                          <Input type="date" value={assignTaskDate} onChange={e => setAssignTaskDate(e.target.value)} />
                          <Button onClick={handleAssignTask}>Asignar Tarea</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Task List for the group */}
                <h3 className="font-medium mb-3">Tareas del grupo</h3>
                <div className="space-y-3">
                  {/* --- CHECK THIS RENDERING LOGIC --- */}
                  {selectedGroup.tasks.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay tareas asignadas a este grupo.</p>
                  ) : (
                    selectedGroup.tasks.map(task => (
                      <TaskCard key={task.id} {...task} />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};