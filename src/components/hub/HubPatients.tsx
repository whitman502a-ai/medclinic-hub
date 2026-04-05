import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { StatusBadge, PaymentBadge } from '@/components/shared/Badges';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';

const HubPatients = () => {
  const { patients, appointments, invoices, doctors, specialties } = useStore();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  const patient = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;
  const patientApts = patient ? appointments.filter(a => a.patient_id === patient.id).sort((a, b) => b.date.localeCompare(a.date)) : [];
  const patientInvoices = patient ? invoices.filter(i => i.patient_id === patient.id) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o teléfono..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Teléfono</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Última visita</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Balance</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => {
              const lastApt = appointments.filter(a => a.patient_id === p.id && a.status === 'completed').sort((a, b) => b.date.localeCompare(a.date))[0];
              const balance = invoices.filter(i => i.patient_id === p.id && i.status === 'pending').reduce((s, i) => s + i.amount, 0);
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedPatient(p.id)}>
                  <td className="p-3 font-medium text-foreground">{p.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.phone}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{lastApt?.date || '-'}</td>
                  <td className="p-3">{balance > 0 ? <span className="text-red-600 font-medium">${balance.toLocaleString()}</span> : <span className="text-green-600">$0</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{patient?.name}</DialogTitle></DialogHeader>
          {patient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Teléfono</p><p className="font-medium">{patient.phone}</p></div>
                <div><p className="text-muted-foreground">Email</p><p className="font-medium">{patient.email}</p></div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Historial de citas</h4>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {patientApts.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{a.date} {a.time}</p>
                        <p className="text-xs text-muted-foreground">{doctors.find(d => d.id === a.doctor_id)?.name}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              </div>
              {patientInvoices.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Cobros</h4>
                  <div className="space-y-2">
                    {patientInvoices.map(i => (
                      <div key={i.id} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                        <span>${i.amount.toLocaleString()}</span>
                        <PaymentBadge status={i.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HubPatients;
