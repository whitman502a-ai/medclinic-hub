import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { SpecialtyIcon } from '@/components/shared/SpecialtyIcon';
import { toast } from 'sonner';
import { format, addDays, isBefore, startOfDay, parse, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

const Booking = () => {
  const { specialties, doctors, appointments, patients, addAppointment, addPatient } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientData, setPatientData] = useState({ name: '', phone: '', email: '', reason: '' });
  const [confirmed, setConfirmed] = useState(false);

  const steps = ['Especialidad', 'Doctor', 'Fecha y hora', 'Tus datos', 'Confirmación'];

  const filteredDoctors = doctors.filter(d => d.active && d.specialty_id === selectedSpecialty);
  const doctor = doctors.find(d => d.id === selectedDoctor);
  const specialty = specialties.find(s => s.id === selectedSpecialty);

  const dayNames: Record<number, string> = { 0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles', 4: 'jueves', 5: 'viernes', 6: 'sabado' };

  const isDayAvailable = (date: Date) => {
    if (!doctor) return false;
    if (isBefore(date, startOfDay(new Date()))) return false;
    const dayName = dayNames[date.getDay()];
    return !!doctor.schedule[dayName];
  };

  const getAvailableSlots = () => {
    if (!doctor || !selectedDate || !specialty) return [];
    const dayName = dayNames[selectedDate.getDay()];
    const sched = doctor.schedule[dayName];
    if (!sched) return [];

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayAppts = appointments.filter(a => a.doctor_id === doctor.id && a.date === dateStr && !['cancelled', 'no_show'].includes(a.status));

    const slots: string[] = [];
    let current = parse(sched.start, 'HH:mm', new Date());
    const end = parse(sched.end, 'HH:mm', new Date());

    while (isBefore(current, end)) {
      const timeStr = format(current, 'HH:mm');
      const slotEnd = addMinutes(current, specialty.duration);
      if (isBefore(slotEnd, end) || format(slotEnd, 'HH:mm') === format(end, 'HH:mm')) {
        const conflict = dayAppts.some(a => {
          const aStart = parse(a.time, 'HH:mm', new Date());
          const aEnd = addMinutes(aStart, a.duration);
          return isBefore(current, aEnd) && isBefore(aStart, slotEnd);
        });
        if (!conflict) {
          // Don't show past times for today
          if (dateStr === format(new Date(), 'yyyy-MM-dd')) {
            if (!isBefore(current, new Date())) slots.push(timeStr);
          } else {
            slots.push(timeStr);
          }
        }
      }
      current = addMinutes(current, 30);
    }
    return slots;
  };

  const handleConfirm = () => {
    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) return;

    // Find or create patient
    let patientId = patients.find(p => p.phone === patientData.phone)?.id;
    if (!patientId) {
      patientId = `pac_${Date.now()}`;
      addPatient({
        id: patientId,
        name: patientData.name,
        phone: patientData.phone,
        email: patientData.email,
        dob: '',
        appointment_ids: [],
      });
    }

    const aptId = `apt_${Date.now()}`;
    const newApt: Appointment = {
      id: aptId,
      patient_id: patientId,
      doctor_id: selectedDoctor,
      service_id: selectedSpecialty,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration: specialty!.duration,
      status: 'scheduled',
      reason: patientData.reason,
      notes: '',
      events: [{ type: 'created', timestamp: new Date().toISOString() }],
    };

    addAppointment(newApt);
    toast.success('¡Cita agendada exitosamente!');
    setConfirmed(true);
  };

  const canNext = () => {
    if (step === 0) return !!selectedSpecialty;
    if (step === 1) return !!selectedDoctor;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return patientData.name && patientData.phone && patientData.email;
    return true;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">¡Cita Confirmada!</h2>
          <div className="mt-6 space-y-3 text-left bg-muted rounded-lg p-4">
            <p><span className="font-medium">Especialidad:</span> {specialty?.name}</p>
            <p><span className="font-medium">Doctor:</span> {doctor?.name}</p>
            <p><span className="font-medium">Fecha:</span> {selectedDate && format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
            <p><span className="font-medium">Hora:</span> {selectedTime}</p>
            <p><span className="font-medium">Paciente:</span> {patientData.name}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Recibirás un recordatorio 24 horas antes de tu cita.</p>
          <Button className="mt-6 w-full" onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-1" /> Inicio</Button>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Agendar Cita</span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i < step ? 'bg-primary text-primary-foreground' :
                  i === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                  'bg-muted text-muted-foreground'
                )}>{i + 1}</div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={cn('h-0.5 flex-1 mx-2', i < step ? 'bg-primary' : 'bg-muted')} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Selecciona una especialidad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialties.map(s => (
                  <button key={s.id} onClick={() => { setSelectedSpecialty(s.id); setSelectedDoctor(null); setSelectedDate(undefined); setSelectedTime(null); }}
                    className={cn('glass-card p-6 text-left hover:shadow-md transition-all', selectedSpecialty === s.id && 'ring-2 ring-primary shadow-md')}>
                    <SpecialtyIcon name={s.icon} className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                    <p className="text-sm font-medium text-primary mt-2">{s.duration} min · ${s.price.toLocaleString()} MXN</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Selecciona un doctor</h2>
              {filteredDoctors.length === 0 ? (
                <p className="text-muted-foreground">No hay doctores disponibles para esta especialidad.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDoctors.map(d => (
                    <button key={d.id} onClick={() => { setSelectedDoctor(d.id); setSelectedDate(undefined); setSelectedTime(null); }}
                      className={cn('glass-card p-4 text-left hover:shadow-md transition-all flex gap-4', selectedDoctor === d.id && 'ring-2 ring-primary shadow-md')}>
                      <img src={d.photo} alt={d.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-semibold text-foreground">{d.name}</h3>
                        <p className="text-sm text-primary">{specialty?.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{d.bio}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Selecciona fecha y hora</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="glass-card p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                    disabled={(date) => !isDayAvailable(date)}
                    className="pointer-events-auto"
                    locale={es}
                  />
                </div>
                <div className="flex-1">
                  {selectedDate ? (
                    <>
                      <h3 className="font-medium text-foreground mb-3">
                        Horarios disponibles - {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {getAvailableSlots().map(slot => (
                          <button key={slot} onClick={() => setSelectedTime(slot)}
                            className={cn('px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                              selectedTime === slot ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground hover:border-primary hover:text-primary')}>
                            {slot}
                          </button>
                        ))}
                        {getAvailableSlots().length === 0 && <p className="col-span-full text-muted-foreground">No hay horarios disponibles este día.</p>}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Selecciona una fecha para ver horarios disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Tus datos</h2>
              <div className="glass-card p-6 max-w-md space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nombre completo *</label>
                  <Input value={patientData.name} onChange={e => setPatientData(p => ({ ...p, name: e.target.value }))} placeholder="Ej: María García" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Teléfono *</label>
                  <Input value={patientData.phone} onChange={e => setPatientData(p => ({ ...p, phone: e.target.value }))} placeholder="Ej: 5512345678" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <Input type="email" value={patientData.email} onChange={e => setPatientData(p => ({ ...p, email: e.target.value }))} placeholder="Ej: maria@email.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Motivo de consulta</label>
                  <Textarea value={patientData.reason} onChange={e => setPatientData(p => ({ ...p, reason: e.target.value }))} placeholder="Describe brevemente tu motivo de consulta" className="mt-1" rows={3} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Confirma tu cita</h2>
              <div className="glass-card p-6 max-w-md space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Especialidad</p><p className="font-medium text-foreground">{specialty?.name}</p></div>
                  <div><p className="text-muted-foreground">Doctor</p><p className="font-medium text-foreground">{doctor?.name}</p></div>
                  <div><p className="text-muted-foreground">Fecha</p><p className="font-medium text-foreground">{selectedDate && format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}</p></div>
                  <div><p className="text-muted-foreground">Hora</p><p className="font-medium text-foreground">{selectedTime}</p></div>
                  <div><p className="text-muted-foreground">Duración</p><p className="font-medium text-foreground">{specialty?.duration} min</p></div>
                  <div><p className="text-muted-foreground">Costo</p><p className="font-medium text-foreground">${specialty?.price.toLocaleString()} MXN</p></div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground text-sm">Paciente</p>
                  <p className="font-medium text-foreground">{patientData.name}</p>
                  <p className="text-sm text-muted-foreground">{patientData.phone} · {patientData.email}</p>
                  {patientData.reason && <p className="text-sm text-muted-foreground mt-1">Motivo: {patientData.reason}</p>}
                </div>
                <Button className="w-full mt-4" size="lg" onClick={handleConfirm}>
                  <Check className="mr-2 h-5 w-5" /> Confirmar Cita
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
          </Button>
          {step < 4 && (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
