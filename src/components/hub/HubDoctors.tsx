import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const HubDoctors = () => {
  const { doctors, specialties, appointments, addDoctor, updateDoctor } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', specialty_id: '', bio: '', photo: '' });

  const handleAdd = () => {
    if (!form.name || !form.specialty_id) { toast.error('Nombre y especialidad requeridos'); return; }
    addDoctor({
      id: `doc_${Date.now()}`,
      name: form.name,
      specialty_id: form.specialty_id,
      photo: form.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
      schedule: { lunes: { start: '09:00', end: '17:00' }, martes: { start: '09:00', end: '17:00' }, miercoles: { start: '09:00', end: '17:00' }, jueves: { start: '09:00', end: '17:00' }, viernes: { start: '09:00', end: '17:00' } },
      active: true,
      bio: form.bio || 'Nuevo especialista del equipo.',
    });
    toast.success('Doctor agregado');
    setShowAdd(false);
    setForm({ name: '', specialty_id: '', bio: '', photo: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Doctores</h1>
        <Button onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-2" /> Agregar Doctor</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {doctors.map(d => {
          const spec = specialties.find(s => s.id === d.specialty_id);
          const weekApts = appointments.filter(a => a.doctor_id === d.id).length;
          const noShows = appointments.filter(a => a.doctor_id === d.id && a.status === 'no_show').length;
          return (
            <div key={d.id} className="glass-card p-4 flex gap-4">
              <img src={d.photo} alt={d.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{d.name}</h3>
                  <button onClick={() => updateDoctor(d.id, { active: !d.active })}
                    className={cn('text-xs px-2 py-1 rounded-full', d.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {d.active ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <p className="text-sm text-primary">{spec?.name}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{weekApts} citas total</span>
                  <span>{noShows} no-shows</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Agregar Doctor</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nombre completo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <select className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-card"
              value={form.specialty_id} onChange={e => setForm(f => ({ ...f, specialty_id: e.target.value }))}>
              <option value="">Seleccionar especialidad</option>
              {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Input placeholder="Bio corta" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            <Input placeholder="URL de foto (opcional)" value={form.photo} onChange={e => setForm(f => ({ ...f, photo: e.target.value }))} />
            <Button className="w-full" onClick={handleAdd}>Agregar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HubDoctors;
