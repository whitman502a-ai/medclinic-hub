import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PatientAppointments from '@/components/patient/PatientAppointments';
import PatientHistory from '@/components/patient/PatientHistory';
import PatientPayments from '@/components/patient/PatientPayments';

const tabs = [
  { id: 'appointments', label: 'Mis Citas' },
  { id: 'history', label: 'Historial' },
  { id: 'payments', label: 'Pagos' },
];

const PatientPage = () => {
  const { setRole, resetStore, currentPatientId, patients } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');

  const patient = patients.find(p => p.id === currentPatientId);

  const handleLogout = () => { setRole(null); navigate('/auth'); };
  const handleReset = () => { resetStore(); toast.success('Datos restaurados'); navigate('/auth'); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">MediOS</span>
            {patient && <span className="text-sm text-muted-foreground ml-2">· {patient.name}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-auto">
        {activeTab === 'appointments' && <PatientAppointments />}
        {activeTab === 'history' && <PatientHistory />}
        {activeTab === 'payments' && <PatientPayments />}
      </main>
    </div>
  );
};

export default PatientPage;
