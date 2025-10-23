// src/contexts/GroupsContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task } from './TasksContext';
import { toast } from "sonner";

// Interfaz para Grupo (con 'key')
export interface Group {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  key: string;
  tasks: Task[];
}

// Interfaz para el Contexto
interface GroupsContextType {
  myGroups: Group[];
  addGroup: (groupData: Omit<Group, 'id' | 'tasks'>) => void;
  joinGroup: (groupIdOrName: string, key: string) => boolean;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'taskup_groups_v1'; // Clave para guardar

// Datos iniciales (solo si localStorage está vacío o falla)
const initialMockGroups: Group[] = [
  // Puedes dejar esto vacío si prefieres empezar sin grupos de ejemplo
  // { id: "g1_mock", name: "Proyecto Final", description: "Grupo para el proyecto de IS", creatorId: "u1_mock", key: "proy123", tasks: [] },
];

export const GroupsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- LÓGICA DE CARGA MEJORADA ---
  const [myGroups, setMyGroups] = useState<Group[]>(() => {
    console.log(`Intentando cargar grupos desde localStorage con la clave: ${LOCAL_STORAGE_KEY}`);
    try {
      const storedGroups = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      // Verificar si hay algo guardado y no es una cadena vacía
      if (storedGroups && storedGroups !== "[]") {
        console.log("Datos encontrados en localStorage:", storedGroups);
        const parsedGroups = JSON.parse(storedGroups);
        
        // MUY IMPORTANTE: Asegurarse de que lo parseado sea un Array
        if (Array.isArray(parsedGroups)) {
          console.log("Grupos cargados exitosamente desde localStorage:", parsedGroups);
          return parsedGroups;
        } else {
          console.warn("Los datos guardados no son un array. Usando datos iniciales.");
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Limpiar datos corruptos
          return initialMockGroups;
        }
      } else {
         console.log("No se encontraron grupos guardados o estaban vacíos. Usando datos iniciales.");
         return initialMockGroups; // Nada guardado, usar mocks (o lista vacía)
      }
    } catch (error) {
      console.error("Error al parsear grupos desde localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Limpiar datos corruptos
      return initialMockGroups; // Volver a los mocks si hay error
    }
  });
  // --- FIN LÓGICA DE CARGA ---


  // --- LÓGICA DE GUARDADO (con log) ---
  useEffect(() => {
    try {
      console.log("Guardando grupos en localStorage:", myGroups);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myGroups));
    } catch (error) {
      console.error("Error guardando grupos en localStorage:", error);
    }
  }, [myGroups]); // Se ejecuta cada vez que 'myGroups' cambia
  // --- FIN LÓGICA DE GUARDADO ---


  // Función para añadir un grupo
  const addGroup = (groupData: Omit<Group, 'id' | 'tasks'>) => {
    if (!groupData.key || groupData.key.trim() === "") {
        toast.error("La clave del grupo no puede estar vacía.");
        return;
    }
    const newGroup: Group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tasks: [],
      ...groupData,
    };
    // Actualiza el estado, lo que disparará el useEffect de guardado
    setMyGroups(prevGroups => [newGroup, ...prevGroups]);
  };

  // Función para unirse a un grupo (simulada)
  const joinGroup = (groupIdOrName: string, key: string): boolean => {
    // Buscar en la lista ACTUAL de grupos (cargada o inicial)
    const groupToJoin = myGroups.find(g => g.id === groupIdOrName || g.name.toLowerCase() === groupIdOrName.toLowerCase());

    if (!groupToJoin) {
      toast.error(`Grupo "${groupIdOrName}" no encontrado.`);
      return false;
    }
    if (groupToJoin.key !== key) {
      toast.error("Clave incorrecta para este grupo.");
      return false;
    }

    toast.success(`¡Te has unido (simulado) al grupo "${groupToJoin.name}"!`);
    console.log(`Simulación: Usuario se unió al grupo ${groupToJoin.id}`);
    // Podrías añadirlo a myGroups aquí si no existe, pero requiere lógica de usuario
    return true;
  };

  const value = {
    myGroups,
    addGroup,
    joinGroup,
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};