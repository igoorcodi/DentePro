
import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  UserPlus,
  FileSpreadsheet,
  FileText,
  Baby,
  Activity,
  Layers,
  ShoppingBag,
  History,
  AlertTriangle,
  Info,
  ArrowLeft,
  Eye,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Gift,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownCircle,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

// --- Helper Functions ---

const isWithinRange = (dateStr: string, startStr: string, endStr: string) => {
  if (!dateStr || dateStr === 'n/a') return true;
  
  const targetDate = new Date(dateStr);
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  targetDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() >= startDate.getTime() && targetDate.getTime() <= endDate.getTime();
};

// --- Custom Calendar Popup Component ---

interface CalendarPopupProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ selectedDate, onSelect, onClose }) => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date(selectedDate || new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const handlePrevMonth = () => setCurrentViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentViewDate(new Date(year, month + 1, 1));

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = startDayOfMonth(year, month);

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <button
          key={day}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(dateStr);
            onClose();
          }}
          className={`h-8 w-8 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center
            ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
            ${isToday && !isSelected ? 'border border-blue-200' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 mt-2 z-[100] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 w-64 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-slate-800">
          {monthNames[month]} {year}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <span key={d} className="text-[9px] font-black text-slate-300">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between">
         <button 
           onClick={() => { onSelect(new Date().toISOString().split('T')[0]); onClose(); }}
           className="text-[10px] font-black text-blue-600 uppercase hover:underline"
         >
           Hoje
         </button>
         <button 
           onClick={onClose}
           className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-600"
         >
           Fechar
         </button>
      </div>
    </div>
  );
};

// --- Mock Data Pool ---

const FINANCIAL_POOL = [
  { id: '1', date: '2024-01-10', dueDate: '2024-01-20', desc: 'Canal - Maria Silva', cat: 'Procedimento', val: 1200, status: 'pago', type: 'in', professional: 'Dr. Ricardo Silva' },
  { id: '2', date: '2024-02-12', dueDate: '2024-02-12', desc: 'Compra Luvas Nitrílicas', cat: 'Insumos', val: -350, status: 'pago', type: 'out', professional: 'Todos' },
  { id: '3', date: '2024-03-15', dueDate: '2024-03-15', desc: 'Mensalidade Software', cat: 'Fixo', val: -249, status: 'pago', type: 'out', professional: 'Todos' },
  { id: '4', date: '2024-05-18', dueDate: '2024-06-05', desc: 'Avaliação Orto - João P.', cat: 'Procedimento', val: 150, status: 'agendado', type: 'in', professional: 'Dra. Luiza Souza' },
  { id: '5', date: '2024-06-20', dueDate: '2024-06-20', desc: 'Repasse Dr. Ricardo', cat: 'Comissão', val: -600, status: 'agendado', type: 'out', professional: 'Dr. Ricardo Silva' },
  { id: '6', date: '2024-08-05', dueDate: '2024-08-10', desc: 'Implante - Roberto M.', cat: 'Procedimento', val: 2500, status: 'atrasado', type: 'in', professional: 'Dr. Ricardo Silva' },
  { id: '7', date: '2024-09-12', dueDate: '2024-09-20', desc: 'Limpeza - Ana Clara', cat: 'Procedimento', val: 200, status: 'pago', type: 'in', professional: 'Dra. Luiza Souza' },
  { id: '8', date: '2024-11-20', dueDate: '2024-12-05', desc: 'Conta de Energia', cat: 'Fixo', val: -450, status: 'agendado', type: 'out', professional: 'Todos' },
  { id: '9', date: '2024-05-10', dueDate: '2024-05-25', desc: 'Manutenção Equipamento', cat: 'Manutenção', val: -1200, status: 'atrasado', type: 'out', professional: 'Todos' },
];

const PATIENTS_POOL = [
  { id: '1', name: 'Mariana Oliveira', cpf: '123.456.789-00', email: 'mari@email.com', last: '2024-03-12', birth: '1995-05-15', gender: 'Feminino', conversion: 'Convertido', budget: 4500, status: 'Ativo' },
  { id: '2', name: 'João Pedro Santos', cpf: '987.654.321-11', email: 'jpedro@email.com', last: '2024-04-05', birth: '1988-10-22', gender: 'Masculino', conversion: 'Convertido', budget: 1200, status: 'Ativo' },
  { id: '3', name: 'Ana Clara Souza', cpf: '456.123.789-22', email: 'ana@email.com', last: '2024-01-22', birth: '2001-05-02', gender: 'Feminino', conversion: 'Perdido', budget: 850, status: 'Inativo' },
  { id: '4', name: 'Roberto Mendes', cpf: '321.654.987-33', email: 'rob@email.com', last: '2024-05-15', birth: '1975-03-30', gender: 'Masculino', conversion: 'Em Aberto', budget: 15000, status: 'Ativo' },
  { id: '5', name: 'Fernanda Lima', cpf: '789.456.123-44', email: 'fe@email.com', last: '2024-02-10', birth: '1992-06-12', gender: 'Feminino', conversion: 'Convertido', budget: 3200, status: 'Ativo' },
  { id: '6', name: 'Carlos Alberto', cpf: '111.222.333-44', email: 'carlos@email.com', last: '2024-05-10', birth: '1980-05-25', gender: 'Masculino', conversion: 'Em Aberto', budget: 600, status: 'Ativo' },
];

const INVENTORY_POOL = [
  { id: '1', item: 'Resina Composta A3', cat: 'Material', qtd: 4, min: 10, val: '2025-12-12', lastPurchase: '2024-04-10', turnover: 'Alto', status: 'Crítico', supplier: 'Dental X' },
  { id: '2', item: 'Agulha Gengival 30G', cat: 'Insumos', qtd: 150, min: 50, val: '2026-06-01', lastPurchase: '2024-01-15', turnover: 'Médio', status: 'Ok', supplier: 'MedShop' },
  { id: '3', item: 'Anestésico Lidocaína', cat: 'Fármacos', qtd: 8, min: 20, val: '2025-01-10', lastPurchase: '2024-05-02', turnover: 'Alto', status: 'Crítico', supplier: 'Dental X' },
  { id: '4', item: 'Máscaras Descartáveis', cat: 'EPI', qtd: 500, min: 200, val: '2024-12-31', lastPurchase: '2023-11-20', turnover: 'Baixo', status: 'Ok', supplier: 'MedShop' },
  { id: '5', item: 'Sugador Odontológico', cat: 'Insumos', qtd: 40, min: 100, val: '2024-08-15', lastPurchase: '2024-02-28', turnover: 'Médio', status: 'Crítico', supplier: 'Dental X' },
];

// --- Mock Data Generators ---

const filterData = (pool: any[], filters: any, dateField: string) => {
  return pool.filter(item => {
    const dateMatch = isWithinRange(item[dateField], filters.dateStart, filters.dateEnd);
    const profMatch = !item.professional || filters.professional === 'Todos' || item.professional === filters.professional || item.professional === 'Todos';
    const statusMatch = filters.status === 'Todos' || 
                       (filters.status === 'Ativos' && (item.status === 'Ativo' || item.status === 'Ok')) ||
                       (filters.status === 'Pagos' && item.status === 'pago') ||
                       (filters.status === 'Críticos' && item.status === 'Crítico');
    return dateMatch && profMatch && statusMatch;
  });
};

const ReportsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'finance' | 'patients' | 'inventory'>('finance');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportResults, setReportResults] = useState<any[] | null>(null);
  const [lastGenerated, setLastGenerated] = useState<{name: string, date: string, category: string} | null>(null);

  const [filters, setFilters] = useState({
    dateStart: '2024-01-01',
    dateEnd: '2024-12-31',
    professional: 'Todos',
    status: 'Todos',
    gender: 'Todos',
    stockCategory: 'Todas',
    supplier: 'Todos'
  });

  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);

  const categories = [
    { id: 'finance', label: 'Financeiro', icon: CreditCard },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'inventory', label: 'Estoque', icon: Package },
  ];

  const handleGenerateReport = (name: string, category: string) => {
    setIsGenerating(true);
    setReportResults(null);
    setSelectedReport(name);

    setTimeout(() => {
      let data: any[] = [];
      if (category === 'finance') {
        const dateField = name.includes('Vencimento') ? 'dueDate' : 'date';
        data = filterData(FINANCIAL_POOL, filters, dateField);
      } else if (category === 'patients') {
        const dateField = name.includes('Aniversariantes') ? 'birth' : 'last';
        data = filterData(PATIENTS_POOL, filters, dateField);
      } else if (category === 'inventory') {
        const dateField = name.includes('Validade') ? 'val' : 'lastPurchase';
        data = filterData(INVENTORY_POOL, filters, dateField);
      }

      setReportResults(data);
      setIsGenerating(false);
      setLastGenerated({ name, date: new Date().toLocaleString('pt-BR'), category });
    }, 1200);
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "Selecione";
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const renderFilterPanel = (context: string) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-800">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold uppercase tracking-tight text-sm">Filtros de Inteligência</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Início do Período</label>
          <button 
            onClick={() => setActivePicker(activePicker === 'start' ? null : 'start')}
            className={`w-full flex items-center gap-3 pl-4 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold transition-all
              ${activePicker === 'start' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}
            `}
          >
            <Calendar className="w-4 h-4 text-slate-300" />
            <span className={filters.dateStart ? 'text-slate-800' : 'text-slate-400'}>{formatDateLabel(filters.dateStart)}</span>
          </button>
          {activePicker === 'start' && <CalendarPopup selectedDate={filters.dateStart} onSelect={(d) => setFilters({...filters, dateStart: d})} onClose={() => setActivePicker(null)} />}
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fim do Período</label>
          <button 
            onClick={() => setActivePicker(activePicker === 'end' ? null : 'end')}
            className={`w-full flex items-center gap-3 pl-4 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold transition-all
              ${activePicker === 'end' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}
            `}
          >
            <Calendar className="w-4 h-4 text-slate-300" />
            <span className={filters.dateEnd ? 'text-slate-800' : 'text-slate-400'}>{formatDateLabel(filters.dateEnd)}</span>
          </button>
          {activePicker === 'end' && <CalendarPopup selectedDate={filters.dateEnd} onSelect={(d) => setFilters({...filters, dateEnd: d})} onClose={() => setActivePicker(null)} />}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Profissional</label>
          <select 
            value={filters.professional}
            onChange={(e) => setFilters({...filters, professional: e.target.value})}
            className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-50/50 outline-none appearance-none transition-all"
          >
            <option>Todos</option>
            <option>Dr. Ricardo Silva</option>
            <option>Dra. Luiza Souza</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Estado / Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-50/50 outline-none appearance-none transition-all"
          >
            <option>Todos</option>
            <option>Ativos</option>
            <option>Pagos</option>
            <option>Críticos</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderResultsTable = () => {
    if (!reportResults) return null;

    const isVencimentoReport = selectedReport?.includes('Vencimento');
    const isBirthdayReport = selectedReport?.includes('Aniversariantes');
    const isConversionReport = selectedReport?.includes('Conversão');

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500 mt-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{selectedReport}</h3>
            <p className="text-xs text-slate-500 mt-1">Gerado em {lastGenerated?.date} • Intervalo: {formatDateLabel(filters.dateStart)} - {formatDateLabel(filters.dateEnd)}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black hover:bg-slate-900 transition-all shadow-lg active:scale-95">
              <Download className="w-3.5 h-3.5" /> EXPORTAR PDF
            </button>
            <button onClick={() => setReportResults(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl ml-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {activeCategory === 'finance' && (
                <tr>
                  <th className="px-8 py-5">Lançamento</th>
                  <th className="px-8 py-5">Vencimento</th>
                  <th className="px-8 py-5">Descrição</th>
                  <th className="px-8 py-5">Categoria</th>
                  <th className="px-8 py-5 text-right">Valor</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              )}
              {activeCategory === 'patients' && (
                <tr>
                  <th className="px-8 py-5">Paciente</th>
                  {isBirthdayReport ? <th className="px-8 py-5">Data Nasc..</th> : <th className="px-8 py-5">CPF</th>}
                  <th className="px-8 py-5">E-mail</th>
                  {isConversionReport && <th className="px-8 py-5">Orçamento</th>}
                  {isConversionReport ? <th className="px-8 py-5">Taxa</th> : <th className="px-8 py-5">Status</th>}
                </tr>
              )}
              {activeCategory === 'inventory' && (
                <tr>
                  <th className="px-8 py-5">Insumo</th>
                  <th className="px-8 py-5">Fornecedor</th>
                  <th className="px-8 py-5">Saldo</th>
                  <th className="px-8 py-5">Giro</th>
                  <th className="px-8 py-5">Validade</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {activeCategory === 'finance' && (
                    <>
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium">{formatDateLabel(row.date)}</td>
                      <td className={`px-8 py-5 text-xs font-black ${row.status === 'atrasado' ? 'text-rose-600' : 'text-slate-800'}`}>{formatDateLabel(row.dueDate)}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-800">{row.desc}</td>
                      <td className="px-8 py-5"><span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black text-slate-500 uppercase">{row.cat}</span></td>
                      <td className={`px-8 py-5 text-sm font-black text-right ${row.type === 'in' ? 'text-emerald-600' : 'text-slate-700'}`}>R$ {row.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="px-8 py-5"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${row.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : row.status === 'atrasado' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{row.status}</span></td>
                    </>
                  )}
                  {activeCategory === 'patients' && (
                    <>
                      <td className="px-8 py-5 text-sm font-bold text-slate-800">{row.name}</td>
                      <td className="px-8 py-5 text-sm text-slate-500">{isBirthdayReport ? formatDateLabel(row.birth) : row.cpf}</td>
                      <td className="px-8 py-5 text-sm text-slate-500">{row.email}</td>
                      {isConversionReport && <td className="px-8 py-5 text-sm font-black text-slate-800">R$ {row.budget.toLocaleString('pt-BR')}</td>}
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${row.conversion === 'Convertido' ? 'bg-emerald-100 text-emerald-700' : row.conversion === 'Perdido' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                          {isConversionReport ? row.conversion : row.status}
                        </span>
                      </td>
                    </>
                  )}
                  {activeCategory === 'inventory' && (
                    <>
                      <td className="px-8 py-5 text-sm font-bold text-slate-800">{row.item}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-bold">{row.supplier}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-800">{row.qtd} un</td>
                      <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.turnover}</td>
                      <td className="px-8 py-5 text-sm text-slate-500">{formatDateLabel(row.val)}</td>
                      <td className="px-8 py-5"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${row.status === 'Crítico' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.status}</span></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReportList = (reports: any[]) => (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
      {isGenerating && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Processando Inteligência...</p>
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {reports.map((report, i) => (
          <div key={i} className="flex items-center justify-between p-6 transition-all hover:bg-slate-50 group">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-600 transition-all">
                <report.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-800">{report.name}</h4>
                <p className="text-xs text-slate-500 max-w-sm">{report.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => handleGenerateReport(report.name, activeCategory)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
            >
              GERAR AGORA <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Centro de Inteligência</h2>
          <p className="text-slate-500">Dados estratégicos filtrados para alta performance clínica.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id as any); setReportResults(null); }}
            className={`flex items-center gap-2 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap
              ${activeCategory === cat.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-800'}
            `}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
            {activeCategory === cat.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {!reportResults ? (
        <>
          {renderFilterPanel(activeCategory)}
          {activeCategory === 'finance' && renderReportList([
            { id: 'due_dates', name: 'Relatório de Vencimentos (A Pagar/Receber)', desc: 'Visão focada em datas críticas de pagamento e recebimento para fluxo de caixa.', icon: Clock },
            { id: 'cashflow', name: 'Fluxo de Caixa Consolidado', desc: 'Entradas e saídas detalhadas por data de lançamento e categoria.', icon: FileBarChart },
            { id: 'commission', name: 'Produção e Repasses por Profissional', desc: 'Cálculo automatizado de comissões baseado em procedimentos realizados.', icon: TrendingUp },
            { id: 'dre', name: 'DRE - Demonstrativo de Resultados', desc: 'Visão contábil estruturada por grupos de contas e planos.', icon: BarChart3 },
          ])}
          {activeCategory === 'patients' && renderReportList([
            { id: 'conversion', name: 'Taxa de Conversão de Orçamentos', desc: 'Análise de quantos orçamentos foram aprovados e transformados em tratamento.', icon: PieIcon },
            { id: 'birthdays', name: 'Aniversariantes do Período', desc: 'Listagem de pacientes que fazem aniversário para ações de fidelização.', icon: Gift },
            { id: 'general', name: 'Listagem Geral e Status Clínico', desc: 'Dados cadastrais e histórico de última visita dos pacientes.', icon: Users },
            { id: 'inactive', name: 'Relatório de Evasão (Inativos)', desc: 'Identificação de pacientes sem retorno nos últimos 6 meses.', icon: AlertTriangle },
          ])}
          {/* Fix: Replaced comma with logical AND operator (&&) for correct conditional rendering */}
          {activeCategory === 'inventory' && renderReportList([
            { id: 'stock_val', name: 'Relatório de Validade de Insumos', desc: 'Monitoramento de produtos com data de vencimento próxima.', icon: Calendar },
            { id: 'abc', name: 'Curva ABC de Insumos (Giro)', desc: 'Análise de itens com maior rotatividade e impacto no estoque.', icon: Layers },
            { id: 'low_stock', name: 'Estoque Crítico e Reposição', desc: 'Produtos abaixo do nível mínimo configurado para compra.', icon: AlertTriangle },
            { id: 'history', name: 'Histórico de Entradas/Saídas', desc: 'Log completo de movimentação de produtos por categoria.', icon: History },
          ])}
        </>
      ) : renderResultsTable()}

      <style>{`
        @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .animate-progress { animation: progress 1.2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default ReportsView;
