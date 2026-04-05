import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/Badges';

const DoctorPatients = () => {
  const { appointments, patients, specialties, currentDoctorId } = useStore();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const doctorApts = appointments.filter(a => a.doctor_id === currentDoctorId);
  const patientIds = [...new Set(doctorApts.map(a => a.patient_id))];
  const doctorPatients = patientIds.map(id => {
    const pat = patients.find(p => p.id === id)!;
    const apts = doctorApts.filter(a => a.patient_id === id);
    const lastApt = apts.sort((a, b) => b.date.localeCompare(a.date))[0];
    return { ...pat, totalConsults: apts.filter(a => a.status === 'completed').length, lastVisit: lastApt?.date || '-' };
  });

  const patient = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;
  const patientApts = selectedPatient ? doctorApts.filter(a => a.patient_id === selectedPatient).sort((a, b) => b.date.localeCompare(a.date)) : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Mis Pacientes</h2>

      <div className="space-y-2">
        {doctorPatients.map(p => (
          <button key={p.id} onClick={() => setSelectedPatient(p.id)}
            className="w-full glass-card p-4 text-left hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{p.name}</p>
              <p className="text-sm text-muted-foreground">Última visita: {p.lastVisit}</p>
            </div>
            <span className="text-sm text-muted-foreground">{p.totalConsults} consultas</span>
          </button>
        ))}
        {doctorPatients.length === 0 && (
          <div className="glass-card p-8 text-center text-muted-foreground">Aún no has atendido pacientes</div>
        )}
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{patient?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {patientApts.map(a => (
              <div key={a.id} className="p-3 bg-muted rounded-lg text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{a.date} {a.time}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-xs text-muted-foreground">{specialties.find(s => s.id === a.service_id)?.name}</p>
                {a.notes && <p className="text-xs mt-1">{a.notes}</p>}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;
