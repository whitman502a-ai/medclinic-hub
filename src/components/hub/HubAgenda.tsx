import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/Badges';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AppointmentStatus } from '@/types';

const doctorColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

const HubAgenda = () => {
  const { appointments, doctors, patients, specialties, transitionAppointment } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedApt, setSelectedApt] = useState<string | null>(null);

  const dateStr = format(currentDate, 'yyyy-MM-dd');

  const getAptsForDate = (d: string) =>
    appointments.filter(a => a.date === d && !['cancelled'].includes(a.status))
      .sort((a, b) => a.time.localeCompare(b.time));

  const dayApts = getAptsForDate(dateStr);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const apt = selectedApt ? appointments.find(a => a.id === selectedApt) : null;
  const aptPatient = apt ? patients.find(p => p.id === apt.patient_id) : null;
  const aptDoctor = apt ? doctors.find(d => d.id === apt.doctor_id) : null;
  const aptSpec = apt ? specialties.find(s => s.id === apt.service_id) : null;

  const handleTransition = (id: string, status: AppointmentStatus) => {
    const err = transitionAppointment(id, status);
    if (err) toast.error(err);
    else toast.success(`Cita actualizada a: ${status}`);
    setSelectedApt(null);
  };

  const renderAptCard = (a: typeof appointments[0]) => {
    const doc = doctors.find(d => d.id === a.doctor_id);
    const pat = patients.find(p => p.id === a.patient_id);
    const docIndex = doctors.findIndex(d => d.id === a.doctor_id);
    return (
      <button key={a.id} onClick={() => setSelectedApt(a.id)}
        className="w-full glass-card p-3 text-left hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn('w-2 h-2 rounded-full', doctorColors[docIndex % doctorColors.length])} />
          <span className="text-sm font-medium text-foreground">{a.time}</span>
          <StatusBadge status={a.status} />
        </div>
        <p className="text-sm text-foreground">{pat?.name}</p>
        <p className="text-xs text-muted-foreground">{doc?.name}</p>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button onClick={() => setView('day')} className={cn('px-3 py-1 rounded text-sm', view === 'day' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}>Día</button>
            <button onClick={() => setView('week')} className={cn('px-3 py-1 rounded text-sm', view === 'week' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}>Semana</button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(d => subDays(d, view === 'week' ? 7 : 1))}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="font-medium text-foreground">
          {view === 'day' ? format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : `Semana del ${format(weekStart, "d 'de' MMMM", { locale: es })}`}
        </span>
        <Button variant="ghost" size="sm" onClick={() => setCurrentDate(d => addDays(d, view === 'week' ? 7 : 1))}><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoy</Button>
      </div>

      {view === 'day' ? (
        <div className="space-y-2">
          {dayApts.length === 0 ? (
            <div className="glass-card p-8 text-center text-muted-foreground">No hay citas para este día</div>
          ) : dayApts.map(renderAptCard)}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(d => {
            const ds = format(d, 'yyyy-MM-dd');
            const apts = getAptsForDate(ds);
            return (
              <div key={ds} className={cn('glass-card p-2 min-h-[120px]', isSameDay(d, new Date()) && 'ring-2 ring-primary')}>
                <p className="text-xs font-medium text-muted-foreground mb-1">{format(d, 'EEE d', { locale: es })}</p>
                <div className="space-y-1">
                  {apts.slice(0, 3).map(a => {
                    const docI = doctors.findIndex(doc => doc.id === a.doctor_id);
                    return (
                      <button key={a.id} onClick={() => setSelectedApt(a.id)} className={cn('w-full text-left text-xs p-1 rounded', doctorColors[docI % doctorColors.length], 'bg-opacity-10')}>
                        <span className="font-medium">{a.time}</span>
                      </button>
                    );
                  })}
                  {apts.length > 3 && <p className="text-xs text-muted-foreground">+{apts.length - 3} más</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment detail modal */}
      <Dialog open={!!selectedApt} onOpenChange={() => setSelectedApt(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalle de Cita</DialogTitle></DialogHeader>
          {apt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Paciente</p><p className="font-medium">{aptPatient?.name}</p></div>
                <div><p className="text-muted-foreground">Doctor</p><p className="font-medium">{aptDoctor?.name}</p></div>
                <div><p className="text-muted-foreground">Servicio</p><p className="font-medium">{aptSpec?.name}</p></div>
                <div><p className="text-muted-foreground">Fecha</p><p className="font-medium">{apt.date} {apt.time}</p></div>
                <div><p className="text-muted-foreground">Estado</p><StatusBadge status={apt.status} /></div>
                <div><p className="text-muted-foreground">Motivo</p><p className="font-medium">{apt.reason || '-'}</p></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {apt.status === 'scheduled' && (
                  <>
                    <Button size="sm" onClick={() => handleTransition(apt.id, 'confirmed')}>Confirmar</Button>
                    <Button size="sm" variant="outline" onClick={() => handleTransition(apt.id, 'cancelled')}>Cancelar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleTransition(apt.id, 'no_show')}>No-show</Button>
                  </>
                )}
                {apt.status === 'confirmed' && (
                  <>
                    <Button size="sm" onClick={() => handleTransition(apt.id, 'in_progress')}>Iniciar</Button>
                    <Button size="sm" variant="outline" onClick={() => handleTransition(apt.id, 'cancelled')}>Cancelar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleTransition(apt.id, 'no_show')}>No-show</Button>
                  </>
                )}
                {apt.status === 'in_progress' && (
                  <Button size="sm" onClick={() => handleTransition(apt.id, 'completed')}>Completar</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HubAgenda;
