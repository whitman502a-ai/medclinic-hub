import { useStore } from '@/store/useStore';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SpecialtyIcon } from '@/components/shared/SpecialtyIcon';
import { Star, Shield, Clock, Heart, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

const Landing = () => {
  const { clinic, specialties, doctors } = useStore();
  const navigate = useNavigate();

  const testimonials = [
    { name: 'Carolina M.', text: 'Excelente atención. La Dra. Martínez es muy profesional y dedicada.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { name: 'Roberto L.', text: 'El sistema de citas es muy fácil de usar. Ya no tengo que llamar por teléfono.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Ana P.', text: 'Mis hijos aman a la Dra. López. El mejor servicio pediátrico de la zona.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">MediOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>Iniciar sesión</Button>
            <Button onClick={() => navigate('/booking')}>Agendar cita</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
              {clinic.name.replace('Demo', '').trim()}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground">
              Tu clínica. Tus datos. Tu sistema.
            </p>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Agenda tu cita en línea en menos de 2 minutos. Sin llamadas, sin esperas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8 h-14" onClick={() => navigate('/booking')}>
                Agendar Cita <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" onClick={() => navigate('/auth')}>
                Entrar al sistema
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Nuestras Especialidades</h2>
          <p className="mt-3 text-muted-foreground text-center text-lg">Atención integral con los mejores especialistas</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {specialties.map(s => (
              <div key={s.id} className="glass-card p-6 text-center hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/booking')}>
                <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <SpecialtyIcon name={s.icon} className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <p className="mt-2 text-sm font-medium text-primary">${s.price.toLocaleString()} MXN</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctores */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Nuestro Equipo Médico</h2>
          <p className="mt-3 text-muted-foreground text-center text-lg">Profesionales comprometidos con tu salud</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.filter(d => d.active).map(d => {
              const spec = specialties.find(s => s.id === d.specialty_id);
              return (
                <div key={d.id} className="glass-card overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img src={d.photo} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground text-lg">{d.name}</h3>
                    <p className="text-primary text-sm font-medium">{spec?.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{d.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why MediOS */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center">¿Por qué MediOS?</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Tus datos son tuyos', desc: 'Sin costos ocultos por exportar tu información. Tu clínica, tus reglas.' },
              { icon: Clock, title: 'Sin contratos', desc: 'Cancela cuando quieras. Sin permanencias ni letra pequeña.' },
              { icon: Star, title: 'Simple de usar', desc: 'Interfaz intuitiva. Tus doctores la aprenden en minutos, no en semanas.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Lo que dicen nuestros pacientes</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="text-xl font-bold">MediOS</span>
              </div>
              <p className="text-primary-foreground/70">Tu clínica. Tus datos. Tu sistema.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contacto</h4>
              <div className="space-y-2 text-primary-foreground/70">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {clinic.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {clinic.email}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {clinic.address}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Horario</h4>
              <p className="text-primary-foreground/70">Lunes a Viernes</p>
              <p className="text-primary-foreground/70">{clinic.openTime} - {clinic.closeTime}</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/50 text-sm">
            © 2026 MediOS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
