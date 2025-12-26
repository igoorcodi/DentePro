
import React, { useState } from 'react';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  Filter, 
  Users,
  Package,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronDown,
  Printer,
  Mail,
  Smartphone,
  Loader2,
  Share2,
  Search,
  Tag,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const patientGrowthData = [
  { month: 'Jan', novos: 45, ativos: 420 },
  { month: 'Fev', novos: 52, ativos: 455 },
  { month: 'Mar', novos: 48, ativos: 490 },
  { month: 'Abr', novos: 61, ativos: 540 },
  { month: 'Mai', novos: 55, ativos: 585 },
  { month: 'Jun', novos: 72, ativos: 640 },
];

const proceduresData = [
  { name: 'Limpezas', value: 40, color: '#3b82f6' },
  { name: 'Ortodontia', value: 25, color: '#8b5cf6' },
  { name: 'Implantes', value: 15, color: '#10b981' },
  { name: 'Canal', value: 12, color: '#f59e0b' },
  { name: 'Outros', value: 8, color: '#94a3b8' },
];

const ReportsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'finance' | 'patients' | 'inventory'>('finance');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<{name: string, date: string} | null>(null);

  // Filter States
  const [filters, setFilters] = useState({
    dateStart: '2024-05-01',
    dateEnd: '2024-05-31',
    professional: 'Todos',
    category: 'Todas',
    status: 'Todos'
  });

  const categories = [
    { id: 'finance', label: 'Financeiro', icon: CreditCard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'inventory', label: 'Estoque', icon: Package },
  ];

  const handleGenerateReport = (name: string) => {
    setIsGenerating(true);
    setLastGenerated(null);
    setSelectedReport(name);

    // Simulação de processamento pesado de dados
    setTimeout(() => {
      setIsGenerating(false);
      setLastGenerated({
        name: name,
        date: new Date().toLocaleString('pt-BR')
      });
    }, 2500);
  };

  const handleShare = (method: 'whatsapp' | 'email') => {
    if (!lastGenerated) return;
    
    const text = `Segue o relatório "${lastGenerated.name}" gerado em ${lastGenerated.date} através do DentePro.\n\nFiltros aplicados:\n- Período: ${filters.dateStart} até ${filters.dateEnd}\n- Profissional: ${filters.professional}\n- Status: ${filters.status}`;
    const message = encodeURIComponent(text);
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${message}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=Relatório DentePro: ${lastGenerated.name}&body=${message}`;
    }
  };

  const renderFilterPanel = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold">Filtros Avançados para {selectedReport || 'Relatórios'}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Início</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="date" 
              value={filters.dateStart}
              onChange={(e) => setFilters({...filters, dateStart: e.target.value})}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Fim</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="date" 
              value={filters.dateEnd}
              onChange={(e) => setFilters({...filters, dateEnd: e.target.value})}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profissional</label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select 
              value={filters.professional}
              onChange={(e) => setFilters({...filters, professional: e.target.value})}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option>Todos</option>
              <option>Dr. Ricardo Silva</option>
              <option>Dra. Luiza Souza</option>
              <option>Dr. Andre Marques</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option>Todas</option>
              <option>Procedimentos</option>
              <option>Suprimentos</option>
              <option>Marketing</option>
              <option>Fixas</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
          <div className="relative">
            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option>Todos</option>
              <option>Pagos</option>
              <option>Pendentes</option>
              <option>Atrasados</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReports = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderFilterPanel()}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-20 h-20 relative flex items-center justify-center mb-6">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <FileBarChart className="w-6 h-6 text-blue-400 absolute" />
            </div>
            <p className="text-lg font-black text-slate-800">Processando Inteligência Financeira...</p>
            <p className="text-sm text-slate-500 mt-2">Cruzando dados de {filters.professional} no período selecionado.</p>
            <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 animate-progress origin-left"></div>
            </div>
          </div>
        )}

        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Relatórios Financeiros por Completo</h3>
          {lastGenerated && (
            <div className="flex gap-2 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl mr-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Documento Gerado</span>
              </div>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100"
              >
                <Smartphone className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button 
                onClick={() => handleShare('email')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-100"
              >
                <Mail className="w-3.5 h-3.5" /> E-mail
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { id: 'cashflow', name: 'Fluxo de Caixa Consolidado', desc: 'Resumo completo de entradas e saídas detalhadas por categoria.', icon: FileBarChart },
            { id: 'overdue', name: 'Relatório de Inadimplência', desc: 'Listagem de pacientes com pagamentos em atraso e projeção de cobrança.', icon: Clock },
            { id: 'commission', name: 'Comissão por Profissional', desc: 'Cálculo automático de repasse líquido para dentistas.', icon: TrendingUp },
            { id: 'dre', name: 'DRE - Demonstrativo do Exercício', desc: 'Visão contábil do lucro líquido e margem operacional.', icon: CheckCircle2 },
            { id: 'receipts', name: 'Relatório de Recebimentos por Canal', desc: 'Comparativo entre Cartão, Pix, Boleto e Convênios.', icon: CreditCard },
          ].map((report, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-6 transition-all group hover:bg-slate-50/80 ${selectedReport === report.name ? 'bg-blue-50/30 border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all shadow-sm ${selectedReport === report.name ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:text-blue-600 group-hover:scale-110'}`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 mb-0.5">{report.name}</h4>
                  <p className="text-xs text-slate-500 max-w-md">{report.desc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleGenerateReport(report.name)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                  {selectedReport === report.name && isGenerating ? 'Gerando...' : 'Gerar Relatório'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                {lastGenerated?.name === report.name && (
                  <div className="flex gap-2 animate-in zoom-in-95">
                    <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatientReports = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Crescimento da Base de Pacientes</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ativos" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} name="Ativos" />
                <Line type="monotone" dataKey="novos" stroke="#10b981" strokeWidth={2} dot={{r: 4, fill: '#10b981'}} name="Novos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Taxa de Conversão de Orçamentos</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="132" className="text-blue-600" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">72%</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Conversão</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center px-8">Aumento de 5% em relação ao mês anterior.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Inativos (+6 meses)', count: '124', color: 'text-rose-600', bg: 'bg-rose-50', icon: Clock },
          { label: 'Aniversariantes', count: '48', color: 'text-blue-600', bg: 'bg-blue-50', icon: Users },
          { label: 'Novos Cadastros', count: '72', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} p-6 rounded-2xl border border-transparent hover:border-slate-200 transition-all group`}>
            <div className="flex justify-between items-start mb-4">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <button onClick={() => handleGenerateReport(item.label)} className="opacity-0 group-hover:opacity-100 transition-all"><Download className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-4xl font-black ${item.color}`}>{item.count}</p>
            <button className="mt-4 text-[10px] font-black text-slate-400 hover:text-slate-800 uppercase tracking-widest flex items-center gap-1">
              Ver Listagem Completa <Share2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventoryReports = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest">Validade de Insumos</h3>
           <div className="flex gap-2">
              <button onClick={() => handleGenerateReport('Relatório Validade')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar PDF
              </button>
           </div>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Anestésico Mepevadent', date: '12/06/2024', status: 'critical', days: '15 dias' },
            { name: 'Resina Opallis A2', date: '05/07/2024', status: 'warning', days: '38 dias' },
            { name: 'Álcool 70% 1L', date: '22/08/2024', status: 'ok', days: '85 dias' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full ${
                  item.status === 'critical' ? 'bg-rose-500 shadow-lg shadow-rose-200 animate-pulse' : 
                  item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-wider">{item.name}</p>
                  <p className="text-xs text-slate-500">Data de Vencimento: {item.date}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                item.status === 'critical' ? 'bg-rose-100 text-rose-700' : 
                item.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {item.days} restantes
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Centro de Relatórios</h2>
          <p className="text-slate-500">Inteligência de dados para uma gestão eficiente da clínica.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95">
            <Search className="w-4 h-4" />
            Nova Busca Global
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setLastGenerated(null);
              setSelectedReport(null);
            }}
            className={`
              flex items-center gap-2 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative
              ${activeCategory === cat.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-800'}
            `}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in fade-in duration-300"></div>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeCategory === 'finance' && renderFinancialReports()}
        {activeCategory === 'patients' && renderPatientReports()}
        {activeCategory === 'inventory' && renderInventoryReports()}
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReportsView;
