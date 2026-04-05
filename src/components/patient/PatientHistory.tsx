import { useStore } from '@/store/useStore';
import { StatusBadge } from '@/components/shared/Badges';

const PatientHistory = () => {
  const { appointments, doctors, specialties, currentPatientId } = useStore();

  const history = appointments
    .filter(a => a.patient_id === currentPatientId && ['completed', 'cancelled', 'no_show'].includes(a.status))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Historial</h2>

      {history.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground">No tienes consultas pasadas</div>
      ) : (
        <div className="space-y-3">
          {history.map(a => {
            const doc = doctors.find(d => d.id === a.doctor_id);
            const spec = specialties.find(s => s.id === a.service_id);
            return (
              <div key={a.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{a.date}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="font-medium text-foreground">{doc?.name}</p>
                <p className="text-sm text-primary">{spec?.name}</p>
                {a.reason && <p className="text-sm text-muted-foreground mt-1">Motivo: {a.reason}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
