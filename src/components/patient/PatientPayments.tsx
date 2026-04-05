import { useStore } from '@/store/useStore';
import { PaymentBadge } from '@/components/shared/Badges';
import { AlertCircle } from 'lucide-react';

const PatientPayments = () => {
  const { invoices, appointments, specialties, currentPatientId } = useStore();

  const myInvoices = invoices
    .filter(i => i.patient_id === currentPatientId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const pending = myInvoices.filter(i => i.status === 'pending');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Pagos</h2>

      {pending.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm font-medium text-yellow-800">Tienes {pending.length} pago{pending.length > 1 ? 's' : ''} pendiente{pending.length > 1 ? 's' : ''}</p>
        </div>
      )}

      {myInvoices.length === 0 ? (
        <div className="glass-card p-8 text-center text-muted-foreground">No tienes recibos de pago</div>
      ) : (
        <div className="space-y-3">
          {myInvoices.map(inv => {
            const apt = appointments.find(a => a.id === inv.appointment_id);
            const spec = apt ? specialties.find(s => s.id === apt.service_id) : null;
            return (
              <div key={inv.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{inv.date}</span>
                  <PaymentBadge status={inv.status} />
                </div>
                <p className="text-lg font-bold text-foreground">${inv.amount.toLocaleString()} MXN</p>
                <p className="text-sm text-muted-foreground">{spec?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">Método: {inv.method}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientPayments;
