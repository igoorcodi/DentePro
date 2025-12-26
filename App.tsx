
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Wallet, 
  Package, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  Stethoscope,
  Menu,
  X
} from 'lucide-react';
import { ViewState } from './types';
import DashboardView from './components/DashboardView';
import AgendaView from './components/AgendaView';
import PatientsView from './components/PatientsView';
import FinancialView from './components/FinancialView';
import InventoryView from './components/InventoryView';
import SettingsView from './components/SettingsView';
import ClinicalCareView from './components/ClinicalCareView';
import ReportsView from './components/ReportsView';
import LoginView from './components/LoginView';
import ClinicSetupView from './components/ClinicSetupView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [autoOpenAgendaModal, setAutoOpenAgendaModal] = useState(false);

  // Estados de Autenticação e Onboarding
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClinicConfigured, setIsClinicConfigured] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const navigation = [
    { id: ViewState.DASHBOARD, name: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.AGENDA, name: 'Agenda', icon: Calendar },
    { id: ViewState.PATIENTS, name: 'Pacientes', icon: Users },
    { id: ViewState.FINANCIAL, name: 'Financeiro', icon: Wallet },
    { id: ViewState.INVENTORY, name: 'Estoque', icon: Package },
    { id: ViewState.REPORTS, name: 'Relatórios', icon: BarChart3 },
    { id: ViewState.SETTINGS, name: 'Configurações', icon: Settings },
  ];

  const handleStartCare = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveView(ViewState.CARE);
  };

  const handleNavigateToAgenda = (openModal = false) => {
    setAutoOpenAgendaModal(openModal);
    setActiveView(ViewState.AGENDA);
  };

  const handleLogin = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleClinicSetup = (data: any) => {
    console.log('Clínica configurada:', data);
    // Persiste que a clínica foi configurada
    setIsClinicConfigured(true);
    // Redireciona para login como solicitado (encerrando a sessão temporária de setup)
    setIsAuthenticated(false);
    setUserData(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (!isClinicConfigured) {
    return <ClinicSetupView onComplete={handleClinicSetup} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return (
          <DashboardView 
            onStartCare={handleStartCare} 
            onViewAgenda={() => handleNavigateToAgenda(false)}
            onNewAppointment={() => handleNavigateToAgenda(true)}
          />
        );
      case ViewState.AGENDA:
        return (
          <AgendaView 
            initialOpenModal={autoOpenAgendaModal} 
            onModalClosed={() => setAutoOpenAgendaModal(false)} 
          />
        );
      case ViewState.PATIENTS:
        return <PatientsView onSelectPatient={handleStartCare} />;
      case ViewState.CARE:
        return <ClinicalCareView patientId={selectedPatientId || '1'} onClose={() => setActiveView(ViewState.DASHBOARD)} />;
      case ViewState.FINANCIAL:
        return <FinancialView />;
      case ViewState.INVENTORY:
        return <InventoryView />;
      case ViewState.REPORTS:
        return <ReportsView />;
      case ViewState.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView onStartCare={handleStartCare} onViewAgenda={() => handleNavigateToAgenda(false)} onNewAppointment={() => handleNavigateToAgenda(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">DentePro</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setAutoOpenAgendaModal(false);
                }}
                className={`
                  flex items-center w-full gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${activeView === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full text-slate-400 focus-within:text-blue-500 transition-colors">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar pacientes, prontuários..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{userData?.name || 'Dr. Ricardo'}</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <img src="https://picsum.photos/seed/dentist/100/100" className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
