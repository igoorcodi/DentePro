
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Download, 
  Filter,
  CreditCard,
  Plus,
  X,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  ListTree
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  desc: string;
  cat: string;
  accountPlan: string; // Adicionado Plano de Contas
  val: number;
  status: 'pago' | 'agendado' | 'atrasado';
  type: 'in' | 'out';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-05-15', desc: 'Canal - Maria Silva', cat: 'Procedimento', accountPlan: 'Venda de produtos/serviços', val: 850, status: 'pago', type: 'in' },
  { id: '2', date: '2024-05-14', desc: 'Material Cirúrgico DentalX', cat: 'Suprimentos', accountPlan: 'Insumos Clínicos', val: 1200, status: 'pago', type: 'out' },
  { id: '3', date: '2024-05-14', desc: 'Aluguel Sala Comercial', cat: 'Fixo', accountPlan: 'Aluguel e Condomínio', val: 3500, status: 'agendado', type: 'out' },
  { id: '4', date: '2024-05-13', desc: 'Implante - Pedro Alvares', cat: 'Procedimento', accountPlan: 'Venda de produtos/serviços', val: 2400, status: 'atrasado', type: 'in' },
];

const FinancialView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Opções de Plano de Contas baseadas no tipo
  const accountPlanOptions = {
    in: [
      'Venda de produtos/serviços',
      'Rendimentos financeiros',
      'Outras receitas',
      'Repasses de convênio',
      'Venda de ativos'
    ],
    out: [
      'Salários e Encargos',
      'Aluguel e Condomínio',
      'Insumos Clínicos',
      'Marketing e Publicidade',
      'Manutenção e Equipamentos',
      'Impostos e Taxas',
      'Outras despesas'
    ]
  };

  // Form State
  const [formData, setFormData] = useState({
    type: 'in' as 'in' | 'out',
    desc: '',
    cat: 'Procedimento',
    accountPlan: 'Venda de produtos/serviços',
    val: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pago' as 'pago' | 'agendado' | 'atrasado'
  });

  // Derived calculations
  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'in') acc.income += curr.val;
      else acc.expense += curr.val;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: formData.date,
      desc: formData.desc,
      cat: formData.cat,
      accountPlan: formData.accountPlan,
      val: Number(formData.val),
      status: formData.status,
      type: formData.type
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'in',
      desc: '',
      cat: 'Procedimento',
      accountPlan: 'Venda de produtos/serviços',
      val: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pago'
    });
  };

  const chartData = [
    { month: 'Jan', receitas: 45000, despesas: 28000 },
    { month: 'Fev', receitas: 52000, despesas: 31000 },
    { month: 'Mar', receitas: 48000, despesas: 29500 },
    { month: 'Abr', receitas: 61000, despesas: 34000 },
    { month: 'Mai', receitas: 55000, despesas: 32000 },
    { month: 'Jun', receitas: totals.income, despesas: totals.expense },
  ];

  const categoryPieData = [
    { name: 'Procedimentos', value: 65, color: '#3b82f6' },
    { name: 'Planos', value: 20, color: '#10b981' },
    { name: 'Venda Produtos', value: 15, color: '#f59e0b' },
  ];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão Financeira</h2>
          <p className="text-slate-500">Controle total do fluxo de caixa e faturamento.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar DRE
          </button>
          <button 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpCircle className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Resumo Junho</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Receitas Totais</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totals.income)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ArrowDownCircle className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Resumo Junho</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Despesas Totais</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totals.expense)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Saldo Líquido</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Lucro do Período</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totals.income - totals.expense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Receita vs Despesa (Semestre)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="receitas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="despesas" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Origem das Receitas</h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Últimos Lançamentos</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">Ver Histórico Completo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição / Plano de Contas</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(row.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{row.desc}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.accountPlan}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600">{row.cat}</span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${row.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {row.type === 'in' ? '+' : '-'} {formatCurrency(row.val)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      row.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 
                      row.status === 'agendado' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhuma transação registrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${formData.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Nova Transação</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'in', accountPlan: accountPlanOptions.in[0]})}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${formData.type === 'in' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'out', accountPlan: accountPlanOptions.out[0]})}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${formData.type === 'out' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Despesa
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Pagamento Canal - João, Material ABC..."
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Plano de Contas</label>
                <div className="relative">
                  <ListTree className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={formData.accountPlan}
                    onChange={(e) => setFormData({...formData, accountPlan: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none text-sm font-medium"
                  >
                    {formData.type === 'in' 
                      ? accountPlanOptions.in.map(opt => <option key={opt} value={opt}>{opt}</option>)
                      : accountPlanOptions.out.map(opt => <option key={opt} value={opt}>{opt}</option>)
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      value={formData.cat}
                      onChange={(e) => setFormData({...formData, cat: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none text-sm font-medium"
                    >
                      <option>Procedimento</option>
                      <option>Suprimentos</option>
                      <option>Fixo</option>
                      <option>Marketing</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0,00"
                      value={formData.val}
                      onChange={(e) => setFormData({...formData, val: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Data</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 appearance-none text-sm font-medium"
                    >
                      <option value="pago">Pago / Recebido</option>
                      <option value="agendado">Agendado</option>
                      <option value="atrasado">Em Atraso</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-4 text-sm font-bold text-white rounded-2xl transition-all shadow-xl active:scale-95 ${formData.type === 'in' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
                >
                  Confirmar {formData.type === 'in' ? 'Receita' : 'Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialView;
