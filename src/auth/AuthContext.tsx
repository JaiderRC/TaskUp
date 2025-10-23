// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner"; // Asegúrate de tener sonner

// Interfaz User (simple, puedes añadir más campos)
export interface User {
  id: string; // ID único
  username: string; // Nombre de usuario para login
  email?: string; // Email opcional
  displayName?: string; // Nombre a mostrar
}

interface AuthContextType {
  user: User | null;
  ready: boolean;
  // Funciones de autenticación
  loginWithUsernamePassword: (username: string, password: string) => Promise<boolean>; // Devuelve true/false
  registerWithUsernamePassword: (username: string, password: string, email?: string) => Promise<boolean>; // Devuelve true/false
  loginWithGoogle: (googleUser: any) => void; // Mantenemos la simulación de Google
  logout: () => void;
  // Funciones de perfil/calendario (si las tienes)
  // updateProfile: (data: Partial<User>) => void;
  // isCalendarConnected: boolean;
  // connectGoogleCalendar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_USER_KEY = 'taskup_auth_user_v2'; // Nueva clave para evitar conflictos

// --- SIMULACIÓN DE BASE DE DATOS DE USUARIOS ---
// En una app real, esto estaría en tu backend
const mockUserDatabase: User[] = [
    { id: 'user_admin', username: 'admin', displayName: 'Administrador' },
    { id: 'user_jaider', username: 'jaider', email: 'jaider@mail.com', displayName: 'Jaider C.' },
];
// --- FIN SIMULACIÓN ---

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Cargar usuario desde localStorage al inicio
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch { return null; }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simular que la carga inicial está lista
    setReady(true);
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  // --- SIMULACIÓN: Login con Username/Password ---
  const loginWithUsernamePassword = async (username: string, password: string): Promise<boolean> => {
    console.log("Intentando iniciar sesión con:", username, password);
    // Simular búsqueda en la "base de datos"
    const foundUser = mockUserDatabase.find(u => u.username.toLowerCase() === username.toLowerCase());

    // Simular validación de contraseña (aquí cualquier contraseña funciona si el usuario existe)
    if (foundUser) {
      toast.success(`Bienvenido, ${foundUser.displayName || foundUser.username}!`);
      setUser(foundUser);
      return true; // Éxito
    } else {
      toast.error("Usuario o contraseña incorrectos.");
      return false; // Fallo
    }
  };

  // --- SIMULACIÓN: Registro con Username/Password ---
  const registerWithUsernamePassword = async (username: string, password: string, email?: string): Promise<boolean> => {
    console.log("Intentando registrar:", username, email);
    // Verificar si el usuario ya existe en nuestra simulación
    if (mockUserDatabase.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      toast.error(`El nombre de usuario "${username}" ya está en uso.`);
      return false; // Fallo - Usuario existe
    }

    // Crear nuevo usuario (simulado)
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username,
      email: email,
      displayName: username, // Usar username como display name por defecto
    };

    // Añadir a nuestra "base de datos" simulada (esto se perderá al recargar, idealmente iría a un backend)
    mockUserDatabase.push(newUser);
    console.log("Base de datos simulada actualizada:", mockUserDatabase);

    toast.success(`¡Usuario "${username}" registrado con éxito! Iniciando sesión...`);
    setUser(newUser); // Iniciar sesión automáticamente
    return true; // Éxito
  };


  // Simulación Login con Google (sin cambios)
  const loginWithGoogle = (googleUser: any) => {
    const appUser: User = {
      id: googleUser.uid,
      username: googleUser.email || `google_${googleUser.uid.substring(0, 5)}`, // Usar email o ID corto como username
      email: googleUser.email,
      displayName: googleUser.displayName || "Usuario Google",
    };
    setUser(appUser);
    toast.success(`Bienvenido vía Google, ${appUser.displayName}!`);
  };

  const logout = () => {
    setUser(null);
    toast.info("Sesión cerrada.");
  };

  const value: AuthContextType = {
    user,
    ready,
    loginWithUsernamePassword,
    registerWithUsernamePassword,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};