import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Shield, Stethoscope, User, Heart } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';

const roles = [
  { role: 'admin' as Role, icon: Shield, label: 'Administrador', desc: 'Gestiona la clínica', path: '/hub' },
  { role: 'doctor' as Role, icon: Stethoscope, label: 'Doctor', desc: 'Atiende pacientes', path: '/doctor' },
  { role: 'patient' as Role, icon: User, label: 'Paciente', desc: 'Agenda y consulta', path: '/patient' },
];

const Auth = () => {
  const { setRole } = useStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);

  const handleLogin = () => {
    if (!selected) return;
    setRole(selected);
    const r = roles.find(r => r.role === selected);
    navigate(r!.path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">MediOS</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Inicia sesión</h1>
          <p className="text-muted-foreground mt-1">Selecciona tu rol para continuar</p>
        </div>

        <div className="space-y-3">
          {roles.map(r => (
            <button key={r.role} onClick={() => setSelected(r.role)}
              className={cn('glass-card p-5 w-full flex items-center gap-4 text-left hover:shadow-md transition-all',
                selected === r.role && 'ring-2 ring-primary shadow-md')}>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center',
                selected === r.role ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                <r.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{r.label}</p>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <Button className="w-full mt-6" size="lg" disabled={!selected} onClick={handleLogin}>
          Entrar
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo: No se requiere contraseña. Selecciona un rol.
        </p>
      </div>
    </div>
  );
};

export default Auth;
