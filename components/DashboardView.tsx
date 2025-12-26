
import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Seg', faturamento: 4000, atendimentos: 12 },
  { name: 'Ter', faturamento: 3000, atendimentos: 10 },
  { name: 'Qua', faturamento: 2000, atendimentos: 8 },
  { name: 'Qui', faturamento: 2780, atendimentos: 11 },
  { name: 'Sex', faturamento: 1890, atendimentos: 7 },
  { name: 'Sáb', faturamento: 2390, atendimentos: 5 },
];

const nextAppointments = [
  { id: '1', time: '09:00', patient: 'Mariana Oliveira', procedure: 'Canal', status: 'confirmed' },
  { id: '2', time: '10:30', patient: 'João Pedro Santos', procedure: 'Limpeza', status: 'scheduled' },
  { id: '3', time: '14:00', patient: 'Ana Clara Souza', procedure: 'Avaliação Orto', status: 'confirmed' },
  { id: '4', time: '15:30', patient: 'Roberto Mendes', procedure: 'Implante', status: 'scheduled' },
];

interface DashboardViewProps {
  onStartCare: (id: string) => void;
  onViewAgenda: () => void;
  onNewAppointment: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onStartCare, onViewAgenda, onNewAppointment }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bom dia, Dr. Ricardo</h2>
          <p className="text-slate-500">Aqui está o que está acontecendo na clínica hoje.</p>
        </div>
        <button 
          onClick={onViewAgenda}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
        >
          <Calendar className="w-4 h-4" />
          Ver Agenda Completa
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pacientes', value: '1,284', icon: Users, change: '+12%', positive: true },
          { label: 'Agendamentos Hoje', value: '18', icon: Calendar, change: '+4', positive: true },
          { label: 'Faturamento Mensal', value: 'R$ 42.500', icon: TrendingUp, change: '+18.5%', positive: true },
          { label: 'Inadimplência', value: '4.2%', icon: AlertCircle, change: '-0.5%', positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Fluxo de Faturamento</h3>
            <select className="text-sm border-slate-200 rounded-md focus:ring-blue-500">
              <option>Últimos 7 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="faturamento" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel: Upcoming */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            Próximos Atendimentos
            <span onClick={onViewAgenda} className="text-xs font-normal text-blue-600 cursor-pointer hover:underline">Ver todos</span>
          </h3>
          <div className="space-y-4 flex-1">
            {nextAppointments.map((app) => (
              <div key={app.id} className="group flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                <div className="flex flex-col items-center justify-center h-12 w-12 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{app.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{app.patient}</p>
                  <p className="text-xs text-slate-500 truncate">{app.procedure}</p>
                </div>
                <button 
                  onClick={() => onStartCare(app.id)}
                  className="p-2 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={onNewAppointment}
            className="mt-6 w-full py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Adicionar Novo Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
