import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/shared/Badges';
import { Button } from '@/components/ui/button';
import { Play, XCircle, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

const DoctorMyDay = ({ onStartConsult }: { onStartConsult: () => void }) => {
  const { appointments, patients, specialties, currentDoctorId, transitionAppointment } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayApts = appointments
    .filter(a => a.doctor_id === currentDoctorId && a.date === today && !['cancelled'].includes(a.status))
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextApt = todayApts.find(a => ['confirmed', 'scheduled'].includes(a.status));
  const activeApt = todayApts.find(a => a.status === 'in_progress');
  const highlightApt = activeApt || nextApt;

  const getPatient = (id: string) => patients.find(p => p.id === id);
  const getSpec = (id: string) => specialties.find(s => s.id === id);

  const handleStart = (aptId: string) => {
    // First confirm if scheduled
    const apt = appointments.find(a => a.id === aptId);
    if (apt?.status === 'scheduled') {
      const err1 = transitionAppointment(aptId, 'confirmed');
      if (err1) { toast.error(err1); return; }
    }
    const err = transitionAppointment(aptId, 'in_progress');
    if (err) { toast.error(err); return; }
    toast.success('Consulta iniciada');
    onStartConsult();
  };

  const handleNoShow = (aptId: string) => {
    const err = transitionAppointment(aptId, 'no_show');
    if (err) toast.error(err);
    else toast.success('Marcado como no-show');
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diff = new Date().getFullYear() - new Date(dob).getFullYear();
    return `${diff} años`;
  };

  return (
    <div className="space-y-6">
      {/* Highlighted card */}
      {highlightApt && (
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground mb-1">{activeApt ? 'Consulta en curso' : 'Próximo paciente'}</p>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{getPatient(highlightApt.patient_id)?.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {calculateAge(getPatient(highlightApt.patient_id)?.dob || '')}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {highlightApt.time}</span>
              </div>
              <p className="mt-2 text-sm text-foreground">{highlightApt.reason}</p>
              <p className="text-xs text-muted-foreground mt-1">{getSpec(highlightApt.service_id)?.name}</p>
            </div>
            <StatusBadge status={highlightApt.status} />
          </div>
          {!activeApt && (
            <Button className="mt-4" onClick={() => handleStart(highlightApt.id)}>
              <Play className="h-4 w-4 mr-2" /> Iniciar Consulta
            </Button>
          )}
          {activeApt && (
            <Button className="mt-4" variant="outline" onClick={onStartConsult}>
              Ir a Consulta
            </Button>
          )}
        </div>
      )}

      {/* Day list */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Agenda del día</h3>
        {todayApts.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">No hay citas para hoy</div>
        ) : (
          <div className="space-y-2">
            {todayApts.map(a => {
              const pat = getPatient(a.patient_id);
              return (
                <div key={a.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono font-medium text-foreground w-14">{a.time}</span>
                    <div>
                      <p className="font-medium text-foreground">{pat?.name}</p>
                      <p className="text-xs text-muted-foreground">{a.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    {['scheduled', 'confirmed'].includes(a.status) && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleStart(a.id)} title="Iniciar"><Play className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleNoShow(a.id)} title="No-show"><XCircle className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMyDay;
