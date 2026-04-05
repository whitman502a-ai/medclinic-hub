import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, UserCog, Users, CreditCard, BarChart3, Settings, Heart, LogOut, Menu, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import HubDashboard from '@/components/hub/HubDashboard';
import HubAgenda from '@/components/hub/HubAgenda';
import HubDoctors from '@/components/hub/HubDoctors';
import HubPatients from '@/components/hub/HubPatients';
import HubBilling from '@/components/hub/HubBilling';
import HubReports from '@/components/hub/HubReports';
import HubSettings from '@/components/hub/HubSettings';
import OnboardingWizard from '@/components/hub/OnboardingWizard';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'doctors', label: 'Doctores', icon: UserCog },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'billing', label: 'Cobros', icon: CreditCard },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

const Hub = () => {
  const { setRole, resetStore, onboardingCompleted } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setRole(null);
    navigate('/auth');
  };

  const handleReset = () => {
    resetStore();
    toast.success('Datos restaurados al estado inicial');
    navigate('/auth');
  };

  if (!onboardingCompleted) {
    return <OnboardingWizard />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <HubDashboard />;
      case 'agenda': return <HubAgenda />;
      case 'doctors': return <HubDoctors />;
      case 'patients': return <HubPatients />;
      case 'billing': return <HubBilling />;
      case 'reports': return <HubReports />;
      case 'settings': return <HubSettings />;
      default: return <HubDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-card border-r border-border">
        <div className="p-4 flex items-center gap-2 border-b border-border">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">MediOS</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeTab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              <t.icon className="h-5 w-5" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={handleReset} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <RotateCcw className="h-4 w-4" /> Reset Demo
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground text-sm">MediOS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-foreground/50" onClick={() => setSidebarOpen(false)}>
            <aside className="w-60 bg-card h-full p-3 space-y-1" onClick={e => e.stopPropagation()}>
              <div className="p-2 mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">MediOS</span>
              </div>
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
                  className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
                  <t.icon className="h-5 w-5" />
                  {t.label}
                </button>
              ))}
            </aside>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderContent()}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center justify-around bg-card border-t border-border py-2">
          {tabs.slice(0, 5).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn('flex flex-col items-center gap-1 p-1', activeTab === t.id ? 'text-primary' : 'text-muted-foreground')}>
              <t.icon className="h-5 w-5" />
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Hub;
