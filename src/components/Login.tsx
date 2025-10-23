// src/components/Login.tsx
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from '../auth/AuthContext'; // Corregido: auth/AuthContext.tsx
import { Mail, LockKeyhole, LogIn, UserPlus, User as UserIcon } from 'lucide-react'; // Añadido UserIcon
import { Toaster, toast } from 'sonner'; // Importar Toaster y toast

export const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { loginWithUsernamePassword, registerWithUsernamePassword, loginWithGoogle } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Para el registro
  const [isRegistering, setIsRegistering] = useState(false); // Alternar vista

  const handleGoogleLogin = () => {
    // Simulación Google
    const mockGoogleUser = { uid: "mock_google_id", email: "google@demo.com", displayName: "Google User" };
    loginWithGoogle(mockGoogleUser);
    onSuccess?.(); // Llama a onSuccess si el login simulado es exitoso
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de página por submit de form
    let success = false;

    if (isRegistering) {
      if (!username || !password) {
        toast.error("Nombre de usuario y contraseña son obligatorios para registrarse.");
        return;
      }
      // Llamar a la función de registro del contexto
      success = await registerWithUsernamePassword(username, password, email || undefined);
    } else {
      if (!username || !password) {
        toast.error("Nombre de usuario y contraseña son obligatorios.");
        return;
      }
      // Llamar a la función de login del contexto
      success = await loginWithUsernamePassword(username, password);
    }

    if (success) {
      onSuccess?.(); // Llama a onSuccess si el login/registro simulado tuvo éxito
    }
    // Los mensajes de error/éxito los maneja el contexto con toasts
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Toaster position="top-center" richColors /> {/* Añadir Toaster para mensajes */}
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
          </CardTitle>
          <CardDescription>
            {isRegistering ? "Ingresa tus datos para registrarte." : "Accede a tu cuenta de TaskUp."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Usar un formulario para manejar el submit */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Campo Nombre de Usuario */}
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="tu_usuario"
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Email (Solo para Registro) */}
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico (Opcional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@correo.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Botón de Submit (Login/Registro) */}
              <Button type="submit" className="w-full">
                {isRegistering ? <UserPlus className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
                {isRegistering ? "Registrarse" : "Iniciar Sesión"}
              </Button>
            </div>
          </form>

          {/* Separador O/O O */}
          <div className="relative my-6"> {/* Añadido margen vertical */}
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-card px-2 text-gray-500">O</span>
            </div>
          </div>

          {/* Botón de Google */}
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleLogin}>
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google icon" className="h-5 w-5" />
            Iniciar sesión con Google
          </Button>

          {/* Enlaces adicionales */}
          <div className="text-center text-sm space-y-2 pt-4"> {/* Añadido padding top */}
            <p className="text-gray-500">
              {isRegistering ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
              <Button variant="link" onClick={() => setIsRegistering(!isRegistering)} className="p-0 h-auto align-baseline">
                {isRegistering ? "Inicia Sesión" : "Regístrate"}
              </Button>
            </p>
            {!isRegistering && (
              <Button variant="link" className="p-0 h-auto text-xs text-gray-500 hover:text-gray-700">
                ¿Olvidaste tu contraseña?
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};