import { useStore } from '@/store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const HubReports = () => {
  const { appointments, invoices, doctors, specialties } = useStore();

  const monthInvoices = invoices.filter(i => i.status === 'paid');
  const totalRevenue = monthInvoices.reduce((s, i) => s + i.amount, 0);

  const total = appointments.length || 1;
  const noShowRate = Math.round((appointments.filter(a => a.status === 'no_show').length / total) * 100);

  const doctorCounts = doctors.map(d => ({
    name: d.name.split(' ').slice(-1)[0],
    count: appointments.filter(a => a.doctor_id === d.id).length,
  })).sort((a, b) => b.count - a.count);

  const topDoctor = doctorCounts[0];

  // Hours distribution
  const hourCounts: Record<string, number> = {};
  appointments.forEach(a => {
    const h = a.time.split(':')[0] + ':00';
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const topHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

  // Revenue by week (mock)
  const weekRevenue = [
    { name: 'Sem 1', ingresos: Math.round(totalRevenue * 0.3) },
    { name: 'Sem 2', ingresos: Math.round(totalRevenue * 0.25) },
    { name: 'Sem 3', ingresos: Math.round(totalRevenue * 0.2) },
    { name: 'Sem 4', ingresos: Math.round(totalRevenue * 0.25) },
  ];

  const pieData = [
    { name: 'Completadas', value: appointments.filter(a => a.status === 'completed').length, color: '#22c55e' },
    { name: 'No-shows', value: appointments.filter(a => a.status === 'no_show').length, color: '#ef4444' },
    { name: 'Canceladas', value: appointments.filter(a => a.status === 'cancelled').length, color: '#9ca3af' },
  ];

  const metrics = [
    { label: 'Ingresos del mes', value: `$${totalRevenue.toLocaleString()}` },
    { label: 'Tasa de no-show', value: `${noShowRate}%` },
    { label: 'Doctor más activo', value: topDoctor ? `${topDoctor.name} (${topDoctor.count})` : '-' },
    { label: 'Horario más demandado', value: topHour ? topHour[0] : '-' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reportes</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card p-4">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Ingresos por semana</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekRevenue}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="ingresos" fill="hsl(217, 91%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Estado de citas</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HubReports;
