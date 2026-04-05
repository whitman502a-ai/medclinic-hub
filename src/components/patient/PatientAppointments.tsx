import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/Badges';
import { toast } from 'sonner';
import { Plus, X, CalendarClock } from 'lucide-react';

const PatientAppointments = () => {
  const { appointments, doctors, specialties, currentPatientId, transitionAppointment } = useStore();
  const navigate = useNavigate();

  const myApts = appointments
    .filter(a => a.patient_id === currentPatientId && ['scheduled', 'confirmed', 'in_progress'].includes(a.status))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const handleCancel = (aptId: string) => {
    const apt = appointments.find(a => a.id === aptId);
    if (!apt) return;
    // Check 2h rule (mock: always allow for demo)
    const err = transitionAppointment(aptId, 'cancelled');
    if (err) toast.error(err);
    else toast.success('Cita cancelada');
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => navigate('/booking')} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" /> Agendar Nueva Cita
      </Button>

      {myApts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No tienes citas programadas</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/booking')}>Agendar cita</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {myApts.map(a => {
            const doc = doctors.find(d => d.id === a.doctor_id);
            const spec = specialties.find(s => s.id === a.service_id);
            return (
              <div key={a.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    {doc && <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-foreground">{doc?.name}</p>
                      <p className="text-sm text-primary">{spec?.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{a.date} · {a.time}</p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {['scheduled', 'confirmed'].includes(a.status) && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => handleCancel(a.id)}>
                      <X className="h-3.5 w-3.5 mr-1" /> Cancelar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
