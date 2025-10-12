// src/contexts/ParticipantsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type Participant = {
  id: string;
  name: string;
  school?: string;
  avatar?: string; // url opcional
  points: number;
};

type ParticipantsCtx = {
  participants: Participant[];
  addParticipant: (p: Omit<Participant, "id" | "points">) => void;
  removeParticipant: (id: string) => void;
  changePoints: (id: string, delta: number) => void;
  loadSample: () => void;
  resetAll: () => void;
};

const KEY = "taskup_participants_v1";
const Ctx = createContext<ParticipantsCtx | undefined>(undefined);

export const ParticipantsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setParticipants(JSON.parse(raw));
    } catch (e) {
      console.error("participants load:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(participants));
    } catch (e) {
      console.error("participants save:", e);
    }
  }, [participants]);

  const addParticipant = (p: Omit<Participant, "id" | "points">) => {
    const newP: Participant = { id: uuidv4(), points: 0, ...p };
    setParticipants(prev => [newP, ...prev]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(x => x.id !== id));
  };

  const changePoints = (id: string, delta: number) => {
    setParticipants(prev =>
      prev.map(x => (x.id === id ? { ...x, points: Math.max(0, x.points + delta) } : x))
    );
  };

  const loadSample = () => {
    setParticipants([
      { id: uuidv4(), name: "María Pérez", school: "Uni A", points: 1240, avatar: "" },
      { id: uuidv4(), name: "Carlos R.", school: "Uni B", points: 980, avatar: "" },
      { id: uuidv4(), name: "Ana G.", school: "Uni A", points: 760, avatar: "" },
    ]);
  };

  const resetAll = () => setParticipants([]);

  return (
    <Ctx.Provider value={{ participants, addParticipant, removeParticipant, changePoints, loadSample, resetAll }}>
      {children}
    </Ctx.Provider>
  );
};

export function useParticipants() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useParticipants must be used within ParticipantsProvider");
  return ctx;
}
