import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const HubSettings = () => {
  const { clinic, updateClinic } = useStore();
  const [form, setForm] = useState({ ...clinic });

  const handleSave = () => {
    updateClinic(form);
    toast.success('Configuración guardada');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Configuración</h1>

      <div className="glass-card p-6 max-w-lg space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Nombre de la clínica</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Dirección</label>
          <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Teléfono</label>
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Hora apertura</label>
            <Input type="time" value={form.openTime} onChange={e => setForm(f => ({ ...f, openTime: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Hora cierre</label>
            <Input type="time" value={form.closeTime} onChange={e => setForm(f => ({ ...f, closeTime: e.target.value }))} className="mt-1" />
          </div>
        </div>
        <Button onClick={handleSave}>Guardar configuración</Button>
      </div>
    </div>
  );
};

export default HubSettings;
