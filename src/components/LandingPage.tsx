import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Calendar, 
  Trophy, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock,
  Star,
  Target,
  BookOpen,
  Zap
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">TaskUp</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLogin}>
              Iniciar sesión
            </Button>
            <Button onClick={onGetStarted}>
              Probar ahora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Gestor Educativo Gamificado
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Planifica, aprende y 
                <span className="text-primary"> motívate</span> con TaskUp
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                La herramienta educativa que ayuda a estudiantes universitarios a organizar 
                sus tareas, mantener la motivación mediante gamificación y recibir 
                recomendaciones personalizadas de estudio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Comenzar gratis
                </Button>
                <Button variant="outline" size="lg" onClick={onLogin} className="text-lg px-8">
                  Ver demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://www.fastweb.com/uploads/article_photo/photo/2036641/10-ways-to-be-a-better-student.jpeg"
                  alt="Estudiantes universitarios usando TaskUp"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">¡Nivel 15!</p>
                    <p className="text-sm text-muted-foreground">+50 puntos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Todo lo que necesitas para el éxito académico
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              TaskUp combina planificación inteligente, gamificación motivadora y 
              recomendaciones personalizadas en una sola plataforma.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Calendario Inteligente</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Organiza tus tareas con drag & drop, recibe estimaciones automáticas 
                  de tiempo y sincroniza con tu horario académico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-8 w-8 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Gamificación</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Gana puntos, sube de nivel, desbloquea insignias y compite 
                  sanamente con tus compañeros de universidad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-accent-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Recomendaciones IA</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Recibe sugerencias personalizadas de estudio, técnicas como 
                  Pomodoro y horarios optimizados según tu rendimiento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Analytics Avanzados</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Visualiza tu progreso, identifica patrones de procrastinación 
                  y mejora tu productividad con datos precisos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Colaboración</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Conecta con compañeros, participa en retos grupales y 
                  recibe apoyo de docentes y coordinadores.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Gestión de Materias</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Organiza tareas por materias, establece prioridades y 
                  mantén un seguimiento detallado de cada asignatura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            ¿Listo para transformar tu experiencia académica?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de estudiantes que ya han mejorado su productividad 
            y rendimiento académico con TaskUp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8">
              <Star className="mr-2 h-5 w-5" />
              Comenzar gratis
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Conocer más
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="font-bold text-lg">TaskUp</span>
              </div>
              <p className="text-muted-foreground">
                Gestor educativo gamificado para estudiantes universitarios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Características</li>
                <li>Precios</li>
                <li>Demo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Documentación</li>
                <li>Contacto</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Universidad</h4>
              <p className="text-muted-foreground text-sm">
                Universidad Francisco de Paula Santander<br />
                Facultad de Ingeniería<br />
                Ingeniería de Sistemas<br />
                San José de Cúcuta - 2025
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 TaskUp. Proyecto académico - JAIDER RICARDO CONTRERAS FLOREZ (1152362) • ROGER SANTIAGO MIRANDA HOYOS (1152363)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}