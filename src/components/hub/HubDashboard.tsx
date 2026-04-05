import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { Calendar, CheckCircle, XCircle, DollarSign, UserPlus, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/Badges';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays } from 'date-fns';

const HubDashboard = () => {
  const { appointments, invoices, patients } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayApts = appointments.filter(a => a.date === today);
  const completedToday = todayApts.filter(a => a.status === 'completed').length;
  const noShowsToday = todayApts.filter(a => a.status === 'no_show').length;
  const todayInvoices = invoices.filter(i => i.date === today && i.status === 'paid');
  const todayRevenue = todayInvoices.reduce((s, i) => s + i.amount, 0);
  const newPatients = patients.filter(p => p.appointment_ids.length <= 1).length;

  const pendingConfirm = appointments.filter(a => a.status === 'scheduled');
  const pendingPayments = invoices.filter(i => i.status === 'pending');

  // Chart data: last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const label = format(subDays(new Date(), 6 - i), 'dd/MM');
    return { name: label, citas: appointments.filter(a => a.date === d).length };
  });

  const kpis = [
    { label: 'Citas hoy', value: todayApts.length, icon: Calendar, color: 'text-primary' },
    { label: 'Completadas', value: completedToday, icon: CheckCircle, color: 'text-green-600' },
    { label: 'No-shows', value: noShowsToday, icon: XCircle, color: 'text-red-500' },
    { label: 'Ingresos hoy', value: `$${todayRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Pacientes nuevos', value: newPatients, icon: UserPlus, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{k.label}</span>
              <k.icon className={`h-5 w-5 ${k.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Citas últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="citas" fill="hsl(217, 91%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Alertas</h3>
          <div className="space-y-3">
            {pendingConfirm.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{pendingConfirm.length} citas sin confirmar</p>
                  <p className="text-xs text-muted-foreground">Requieren confirmación del paciente</p>
                </div>
              </div>
            )}
            {pendingPayments.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">{pendingPayments.length} cobros pendientes</p>
                  <p className="text-xs text-muted-foreground">${pendingPayments.reduce((s, i) => s + i.amount, 0).toLocaleString()} MXN</p>
                </div>
              </div>
            )}
            {pendingConfirm.length === 0 && pendingPayments.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin alertas pendientes 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubDashboard;
