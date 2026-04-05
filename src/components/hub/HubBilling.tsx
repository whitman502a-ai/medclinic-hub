import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { PaymentBadge } from '@/components/shared/Badges';
import { PaymentStatus } from '@/types';

const HubBilling = () => {
  const { invoices, appointments, patients, doctors, specialties } = useStore();
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const filtered = invoices.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false;
    if (doctorFilter !== 'all') {
      const apt = appointments.find(a => a.id === i.appointment_id);
      if (apt?.doctor_id !== doctorFilter) return false;
    }
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Cobros</h1>

      <div className="flex flex-wrap gap-3">
        <select className="border border-input rounded-lg px-3 py-2 text-sm bg-card"
          value={filter} onChange={e => setFilter(e.target.value as any)}>
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="paid">Pagados</option>
          <option value="cancelled">Cancelados</option>
        </select>
        <select className="border border-input rounded-lg px-3 py-2 text-sm bg-card"
          value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)}>
          <option value="all">Todos los doctores</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Paciente</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Doctor</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Servicio</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Monto</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Método</th>
          </tr></thead>
          <tbody>
            {filtered.map(inv => {
              const apt = appointments.find(a => a.id === inv.appointment_id);
              const pat = patients.find(p => p.id === inv.patient_id);
              const doc = apt ? doctors.find(d => d.id === apt.doctor_id) : null;
              const spec = apt ? specialties.find(s => s.id === apt.service_id) : null;
              return (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-foreground">{inv.date}</td>
                  <td className="p-3 font-medium text-foreground">{pat?.name}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{doc?.name}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{spec?.name}</td>
                  <td className="p-3 font-medium text-foreground">${inv.amount.toLocaleString()}</td>
                  <td className="p-3"><PaymentBadge status={inv.status} /></td>
                  <td className="p-3 text-muted-foreground capitalize hidden sm:table-cell">{inv.method}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HubBilling;
