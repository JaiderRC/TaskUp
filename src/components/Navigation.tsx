// src/components/Navigation.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../auth/AuthContext";
import {
  Home,
  Calendar,
  CheckSquare,
  Trophy,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userLevel: number;
  userPoints: number;
  notifications: number;
  userName?: string;
}

export function Navigation({

  currentPage,
  onPageChange,
  userLevel,
  userPoints,
  notifications,
  userName = "Usuario",
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "calendario", label: "Calendario", icon: Calendar },
    { id: "tareas", label: "Tareas", icon: CheckSquare },
    { id: "gamificacion", label: "Gamificación", icon: Trophy },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  // Close user menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const toggleMobile = () => setIsMenuOpen((s) => !s);
  const toggleUser = () => setIsUserOpen((s) => !s);

  // Small inline Avatar component (no external deps)
  const Avatar: React.FC<{ initials?: string }> = ({ initials = "JC" }) => (
    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
      {initials}
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">TaskUp</h1>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <Button
                key={item.id}
                variant={active ? "default" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center gap-2 ${active ? "bg-primary text-white" : "text-slate-700"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search (hidden on smallest screens) */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => onPageChange("notificaciones")}>
              <Bell className="h-4 w-4" />
            </Button>
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                {notifications}
              </Badge>
            )}
          </div>

          {/* User dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              aria-haspopup="true"
              aria-expanded={isUserOpen}
              onClick={toggleUser}
              className="flex items-center gap-3 p-1 rounded hover:bg-slate-100"
            >
              <Avatar initials={userName.split(" ").map(n => n[0]).slice(0,2).join("")} />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-slate-500">Nivel {userLevel}</p>
              </div>
            </button>

            {isUserOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-slate-500">{userPoints.toLocaleString()} puntos • Nivel {userLevel}</p>
                </div>

                <div className="flex flex-col py-2">
                  <button
                    onClick={() => { onPageChange("perfil"); setIsUserOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    <User className="w-4 h-4" />
                    Perfil
                  </button>

                  <button
                    onClick={() => { onPageChange("configuracion"); setIsUserOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>

                  <div className="border-t my-1" />

                  <button
                   onClick={() => {
                    logout();
                    onPageChange("landing"); 
                    setIsUserOpen(false);
}}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-rose-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobile}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-100">
          <div className="flex flex-col gap-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-3 ${active ? "bg-primary text-white rounded" : "text-slate-700 hover:bg-slate-50 rounded"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
