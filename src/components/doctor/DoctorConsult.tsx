import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/Badges';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PaymentMethod, Invoice } from '@/types';
import { format } from 'date-fns';

const DoctorConsult = () => {
  const { appointments, patients, specialties, doctors, invoices, currentDoctorId, transitionAppointment, updateAppointmentNotes, addInvoice } = useStore();
  const [showBilling, setShowBilling] = useState(false);
  const [billingMethod, setBillingMethod] = useState<PaymentMethod>('efectivo');
  const [billingNotes, setBillingNotes] = useState('');

  const activeApt = appointments.find(a => a.doctor_id === currentDoctorId && a.status === 'in_progress');
  const patient = activeApt ? patients.find(p => p.id === activeApt.patient_id) : null;
  const spec = activeApt ? specialties.find(s => s.id === activeApt.service_id) : null;

  const patientHistory = patient
    ? appointments.filter(a => a.patient_id === patient.id && a.status === 'completed' && a.id !== activeApt?.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const calculateAge = (dob: string) => {
    if (!dob) return '-';
    return `${new Date().getFullYear() - new Date(dob).getFullYear()} años`;
  };

  const handleComplete = () => {
    if (!activeApt) return;
    const err = transitionAppointment(activeApt.id, 'completed');
    if (err) { toast.error(err); return; }
    toast.success('Consulta completada');
  };

  const handleBill = () => {
    if (!activeApt || !spec) return;
    const inv: Invoice = {
      id: `inv_${Date.now()}`,
      appointment_id: activeApt.id,
      patient_id: activeApt.patient_id,
      amount: spec.price,
      status: 'paid',
      method: billingMethod,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: billingNotes,
    };
    addInvoice(inv);
    toast.success('Cobro registrado');
    setShowBilling(false);
  };

  if (!activeApt) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No hay consulta en curso.</p>
          <p className="text-sm text-muted-foreground mt-1">Inicia una desde "Mi Día".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left - Patient */}
      <div className="space-y-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-3">Paciente</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-muted-foreground">Nombre</p><p className="font-medium text-foreground">{patient?.name}</p></div>
            <div><p className="text-muted-foreground">Edad</p><p className="font-medium text-foreground">{calculateAge(patient?.dob || '')}</p></div>
            <div><p className="text-muted-foreground">Teléfono</p><p className="font-medium text-foreground">{patient?.phone}</p></div>
            <div><p className="text-muted-foreground">Email</p><p className="font-medium text-foreground">{patient?.email}</p></div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-3">Historial</h3>
          {patientHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">Primera consulta</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-auto">
              {patientHistory.map(a => (
                <div key={a.id} className="p-2 bg-muted rounded-lg text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{a.date}</span>
                    <span className="text-muted-foreground">{doctors.find(d => d.id === a.doctor_id)?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{specialties.find(s => s.id === a.service_id)?.name}</p>
                  {a.notes && <p className="text-xs mt-1">{a.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right - Current consult */}
      <div className="space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Consulta actual</h3>
            <StatusBadge status={activeApt.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-1">{spec?.name} · {activeApt.time}</p>
          <p className="text-sm text-foreground mb-4">Motivo: {activeApt.reason}</p>

          <label className="text-sm font-medium text-foreground">Notas de la consulta</label>
          <Textarea
            value={activeApt.notes}
            onChange={e => updateAppointmentNotes(activeApt.id, e.target.value)}
            placeholder="Escribe las notas clínicas aquí..."
            className="mt-1"
            rows={6}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleComplete} className="flex-1">Completar Consulta</Button>
          <Button variant="outline" onClick={() => setShowBilling(true)} className="flex-1">Cobrar</Button>
        </div>
      </div>

      {/* Billing modal */}
      <Dialog open={showBilling} onOpenChange={setShowBilling}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cobro rápido</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Monto</label>
              <Input value={`$${spec?.price.toLocaleString()}`} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Método de pago</label>
              <select className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card mt-1"
                value={billingMethod} onChange={e => setBillingMethod(e.target.value as PaymentMethod)}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Notas (opcional)</label>
              <Input value={billingNotes} onChange={e => setBillingNotes(e.target.value)} className="mt-1" placeholder="Notas del cobro" />
            </div>
            <Button className="w-full" onClick={handleBill}>Confirmar Cobro</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorConsult;
