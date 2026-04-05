import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DoctorMyDay from '@/components/doctor/DoctorMyDay';
import DoctorConsult from '@/components/doctor/DoctorConsult';
import DoctorPatients from '@/components/doctor/DoctorPatients';

const tabs = [
  { id: 'myday', label: 'Mi Día' },
  { id: 'consult', label: 'Consulta' },
  { id: 'patients', label: 'Mis Pacientes' },
];

const DoctorPage = () => {
  const { setRole, resetStore, currentDoctorId, doctors } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myday');

  const doctor = doctors.find(d => d.id === currentDoctorId);

  const handleLogout = () => { setRole(null); navigate('/auth'); };
  const handleReset = () => { resetStore(); toast.success('Datos restaurados'); navigate('/auth'); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">MediOS</span>
            {doctor && <span className="text-sm text-muted-foreground ml-2">· {doctor.name}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 overflow-auto">
        {activeTab === 'myday' && <DoctorMyDay onStartConsult={() => setActiveTab('consult')} />}
        {activeTab === 'consult' && <DoctorConsult />}
        {activeTab === 'patients' && <DoctorPatients />}
      </main>
    </div>
  );
};

export default DoctorPage;
