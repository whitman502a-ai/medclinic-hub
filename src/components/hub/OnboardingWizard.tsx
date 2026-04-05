import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Building2, UserCog, DollarSign, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = ['Tu clínica', 'Primer doctor', 'Servicios', '¡Listo!'];

const OnboardingWizard = () => {
  const { updateClinic, addDoctor, specialties, updateSpecialty, setOnboardingCompleted } = useStore();
  const [step, setStep] = useState(0);
  const [clinicForm, setClinicForm] = useState({ name: '', address: '', phone: '' });
  const [doctorForm, setDoctorForm] = useState({ name: '', specialty_id: 'spec_01' });

  const handleFinish = () => {
    if (clinicForm.name) updateClinic({ name: clinicForm.name, address: clinicForm.address, phone: clinicForm.phone });
    if (doctorForm.name) {
      addDoctor({
        id: `doc_${Date.now()}`,
        name: doctorForm.name,
        specialty_id: doctorForm.specialty_id,
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
        schedule: { lunes: { start: '09:00', end: '17:00' }, martes: { start: '09:00', end: '17:00' }, miercoles: { start: '09:00', end: '17:00' }, jueves: { start: '09:00', end: '17:00' }, viernes: { start: '09:00', end: '17:00' } },
        active: true,
        bio: 'Nuevo miembro del equipo.',
      });
    }
    setOnboardingCompleted(true);
    toast.success('¡Tu clínica está lista!');
  };

  const stepIcons = [Building2, UserCog, DollarSign, PartyPopper];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">Configura tu clínica</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 mx-2', i < step ? 'bg-primary' : 'bg-muted')} />}
              </div>
            );
          })}
        </div>

        <div className="glass-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Datos de tu clínica</h2>
              <Input placeholder="Nombre de la clínica" value={clinicForm.name} onChange={e => setClinicForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Dirección" value={clinicForm.address} onChange={e => setClinicForm(f => ({ ...f, address: e.target.value }))} />
              <Input placeholder="Teléfono" value={clinicForm.phone} onChange={e => setClinicForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Agrega tu primer doctor</h2>
              <Input placeholder="Nombre completo" value={doctorForm.name} onChange={e => setDoctorForm(f => ({ ...f, name: e.target.value }))} />
              <select className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card"
                value={doctorForm.specialty_id} onChange={e => setDoctorForm(f => ({ ...f, specialty_id: e.target.value }))}>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Servicios y precios</h2>
              {specialties.map(s => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-sm text-foreground flex-1">{s.name}</span>
                  <Input type="number" className="w-24" value={s.price}
                    onChange={e => updateSpecialty(s.id, { price: Number(e.target.value) })} />
                  <span className="text-xs text-muted-foreground">MXN</span>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-8">
              <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">¡Tu clínica está lista!</h2>
              <p className="text-muted-foreground mt-2">Ya puedes empezar a gestionar citas, pacientes y cobros.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {step > 0 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Atrás</Button>}
          <div className="ml-auto">
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)}>Siguiente</Button>
            ) : (
              <Button onClick={handleFinish}>Ir al Dashboard</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
