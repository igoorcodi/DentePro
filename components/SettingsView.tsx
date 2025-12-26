
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Shield, 
  Bell, 
  Smartphone, 
  Database, 
  CreditCard,
  UserPlus,
  ArrowLeft,
  Save,
  CheckCircle2,
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  Info, 
  X, 
  Plus, 
  Download, 
  Search, 
  AlertCircle,
  Settings,
  CreditCard as CardIcon,
  Calendar as CalendarIcon,
  ListTree,
  GripVertical,
  PlusCircle,
  TrendingUp,
  ArrowDownCircle,
  LayoutGrid,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

type SettingsSection = 'main' | 'clinic' | 'users' | 'subscription' | 'notifications' | 'whatsapp' | 'procedures' | 'chart_of_accounts';
type SubscriptionSubView = 'overview' | 'plans' | 'card' | 'invoices';
type AccountsTab = 'receitas' | 'despesas' | 'dre';

const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');
  const [subView, setSubView] = useState<SubscriptionSubView>('overview');
  const [activeAccountsTab, setActiveAccountsTab] = useState<AccountsTab>('receitas');

  // Dados mockados para o Plano de Contas
  const [receitasDiversas, setReceitasDiversas] = useState(['Rendimentos financeiros', 'Outras receitas']);
  const [receitasVendas, setReceitasVendas] = useState(['Venda de produtos/serviços']);

  // --- Estados do Cartão ---
  const [cardForm, setCardForm] = useState({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [showCvv, setShowCvv] = useState(false);
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'unknown'>('unknown');

  const mainSections = [
    { id: 'clinic', title: 'Dados da Clínica', icon: Building2, desc: 'Informações fiscais, logo e endereço.' },
    { id: 'users', title: 'Usuários e Permissões', icon: Shield, desc: 'Gerenciar acessos da equipe.' },
    { id: 'notifications', title: 'Notificações', icon: Bell, desc: 'SMS, WhatsApp e Lembretes automáticos.' },
    { id: 'whatsapp', title: 'WhatsApp Integration', icon: Smartphone, desc: 'Conectar API do WhatsApp Business.' },
    { id: 'procedures', title: 'Tabela de Procedimentos', icon: Database, desc: 'Editar valores e códigos TUSS.' },
    { id: 'chart_of_accounts', title: 'Plano de Contas', icon: ListTree, desc: 'Configurar categorias financeiras e DRE.' },
    { id: 'subscription', title: 'Assinatura', icon: CreditCard, desc: 'Faturas e plano DentePro.' },
  ];

  // --- Helpers de Validação de Cartão ---
  const validateLuhn = (number: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const detectBrand = (number: string) => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^3[47]/.test(clean)) return 'amex';
    return 'unknown';
  };

  const maskCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    setCardBrand(detectBrand(clean));
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const maskExpiry = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 3) return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    return clean;
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const cleanCard = cardForm.cardNumber.replace(/\D/g, '');

    if (cardForm.holderName.length < 5) errors.holderName = "Nome muito curto ou inválido";
    if (cleanCard.length < 13 || !validateLuhn(cleanCard)) errors.cardNumber = "Número de cartão inválido";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiry)) errors.expiry = "Formato MM/AA inválido";
    if (cardForm.cvv.length < 3) errors.cvv = "CVV inválido";

    setCardErrors(errors);

    if (Object.keys(errors).length === 0) {
      alert("Cartão processado com sucesso em ambiente criptografado!");
      setSubView('overview');
    }
  };

  const renderHeader = (title: string, desc: string, onBack?: () => void) => (
    <div className="flex items-center gap-4 mb-8 animate-in slide-in-from-left-4 duration-300">
      <button 
        onClick={onBack || (() => setActiveSection('main'))}
        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 text-sm">{desc}</p>
      </div>
    </div>
  );

  const renderCardUpdate = () => (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      {renderHeader('Atualizar Cartão de Pagamento', 'Seus dados são protegidos por criptografia de ponta a ponta.', () => setSubView('overview'))}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Visual Card Display */}
        <div className="space-y-6 sticky top-8">
          <div className={`
            relative h-56 w-full rounded-[24px] p-8 text-white shadow-2xl transition-all duration-500 overflow-hidden
            ${cardBrand === 'visa' ? 'bg-gradient-to-br from-blue-700 to-indigo-900' : 
              cardBrand === 'mastercard' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 
              cardBrand === 'amex' ? 'bg-gradient-to-br from-emerald-700 to-teal-900' : 'bg-gradient-to-br from-slate-800 to-slate-950'}
          `}>
            {/* Gloss Reflection */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-inner flex items-center justify-center">
                 <div className="w-8 h-6 border border-black/10 rounded-sm opacity-50"></div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">DentePro Subscription</p>
                <div className="h-8 flex items-center justify-end mt-1">
                  {cardBrand === 'visa' && <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 brightness-0 invert" alt="Visa" />}
                  {cardBrand === 'mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="Mastercard" />}
                  {cardBrand === 'unknown' && <CreditCard className="w-6 h-6 opacity-30" />}
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <p className="text-xl font-mono tracking-[0.25em]">
                {cardForm.cardNumber || '**** **** **** ****'}
              </p>
            </div>

            <div className="mt-8 flex justify-between items-end relative z-10">
              <div className="min-w-0 flex-1 mr-4">
                <p className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Titular do Cartão</p>
                <p className="text-sm font-bold uppercase tracking-wider truncate">{cardForm.holderName || 'Seu Nome Aqui'}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Expira</p>
                <p className="text-sm font-bold">{cardForm.expiry || 'MM/AA'}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-start gap-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Segurança de Dados</p>
              <p className="text-xs text-blue-700/80 leading-relaxed mt-1">
                Utilizamos tecnologia PCI DSS Level 1 para garantir que seus dados nunca sejam armazenados em nossos servidores. Todas as transações são tokenizadas.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
              <Lock className="w-3 h-3" /> SSL Secure
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleCardSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo (como no cartão)</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  value={cardForm.holderName}
                  onChange={(e) => setCardForm({...cardForm, holderName: e.target.value.toUpperCase()})}
                  placeholder="NOME SOBRENOME" 
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-sm font-bold focus:ring-4 outline-none transition-all ${cardErrors.holderName ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
                />
              </div>
              {cardErrors.holderName && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1 animate-in slide-in-from-top-1">{cardErrors.holderName}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Número do Cartão</label>
              <div className="relative">
                <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({...cardForm, cardNumber: maskCardNumber(e.target.value)})}
                  placeholder="0000 0000 0000 0000" 
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-sm font-mono tracking-wider focus:ring-4 outline-none transition-all ${cardErrors.cardNumber ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
                />
              </div>
              {cardErrors.cardNumber && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1 animate-in slide-in-from-top-1">{cardErrors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Validade</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({...cardForm, expiry: maskExpiry(e.target.value)})}
                    placeholder="MM/AA" 
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-sm font-bold focus:ring-4 outline-none transition-all ${cardErrors.expiry ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
                  />
                </div>
                {cardErrors.expiry && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1 animate-in slide-in-from-top-1">{cardErrors.expiry}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CVV</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type={showCvv ? "text" : "password"}
                    maxLength={4}
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g, '')})}
                    placeholder="123" 
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-2xl text-sm font-bold focus:ring-4 outline-none transition-all ${cardErrors.cvv ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-50 focus:border-blue-500'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {cardErrors.cvv && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1 animate-in slide-in-from-top-1">{cardErrors.cvv}</p>}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Confirmar Atualização Segura
              </button>
              <button 
                type="button" 
                onClick={() => setSubView('overview')}
                className="w-full py-4 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Manter Cartão Atual
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderChartOfAccounts = () => (
    <div className="animate-in fade-in duration-500 space-y-8 pb-20">
      {renderHeader('Configurações do Plano de Contas', 'Configure o seu plano de contas.')}

      {/* Tabs Sistema */}
      <div className="flex border-b border-slate-200 mb-8">
        {[
          { id: 'receitas', label: 'CONFIGURAR RECEITAS', icon: TrendingUp },
          { id: 'despesas', label: 'CONFIGURAR DESPESAS', icon: ArrowDownCircle },
          { id: 'dre', label: 'CONFIGURAR DRE', icon: LayoutGrid },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAccountsTab(tab.id as AccountsTab)}
            className={`
              flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative
              ${activeAccountsTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeAccountsTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-300"></div>
            )}
          </button>
        ))}
      </div>

      {activeAccountsTab === 'receitas' ? (
        <div className="space-y-6 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Card Receitas Diversas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-800 group cursor-pointer">
                  <h3 className="text-lg font-bold">RECEITAS DIVERSAS</h3>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Grupo do DRE: <span className="text-slate-500 italic">Receitas/despesas diversas</span></p>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {receitasDiversas.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl group hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/50 transition-all cursor-move">
                  <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 flex-1">{item}</span>
                  <button 
                    onClick={() => setReceitasDiversas(receitasDiversas.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const name = prompt('Nome da nova conta de receita:');
                  if (name) setReceitasDiversas([...receitasDiversas, name]);
                }}
                className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 border-2 border-dashed border-blue-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group"
              >
                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Adicionar novo
              </button>
            </div>
          </div>

          {/* Card Receitas de Vendas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-800 group cursor-pointer">
                  <h3 className="text-lg font-bold">RECEITAS DE VENDAS</h3>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Grupo do DRE: <span className="text-slate-500 italic">Receita bruta</span></p>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {receitasVendas.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl group hover:border-blue-100 hover:shadow-md hover:shadow-blue-50/50 transition-all cursor-move">
                  <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 flex-1">{item}</span>
                  <button 
                    onClick={() => setReceitasVendas(receitasVendas.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const name = prompt('Nome da nova conta de venda:');
                  if (name) setReceitasVendas([...receitasVendas, name]);
                }}
                className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 border-2 border-dashed border-blue-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group"
              >
                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Adicionar novo
              </button>
            </div>
          </div>

        </div>
      ) : activeAccountsTab === 'despesas' ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <ArrowDownCircle className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Configurar Despesas</h3>
           <p className="text-slate-500 max-w-sm mx-auto mb-8">Gerencie suas saídas financeiras, custos fixos e variáveis.</p>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <LayoutGrid className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Configurar Estrutura DRE</h3>
           <p className="text-slate-500 max-w-sm mx-auto mb-8">Defina os grupos e a hierarquia do seu demonstrativo de resultados.</p>
        </div>
      )}
    </div>
  );

  const renderPlans = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      {renderHeader('Alterar Plano', 'Escolha o plano que melhor se adapta ao crescimento da sua clínica.', () => setSubView('overview'))}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'DentePro Lite', price: '129,90', features: ['Até 2 Profissionais', 'Agenda Digital', 'Prontuário Básico', 'Suporte via Ticket'], current: false },
          { name: 'DentePro Premium', price: '249,90', features: ['Profissionais Ilimitados', 'Odontograma 3D', 'Financeiro Avançado', 'IA Preditiva', 'WhatsApp Integrado'], current: true },
          { name: 'DentePro Enterprise', price: '499,90', features: ['Multi-clínicas', 'API Aberta', 'Gerente de Conta', 'Treinamento VIP', 'Backup em Tempo Real'], current: false }
        ].map((plan, i) => (
          <div key={i} className={`relative bg-white rounded-3xl border p-8 flex flex-col h-full transition-all hover:shadow-xl ${plan.current ? 'border-blue-600 ring-4 ring-blue-50 shadow-blue-50' : 'border-slate-200 shadow-sm'}`}>
            {plan.current && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Plano Atual
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-slate-900">R$ {plan.price}</span>
              <span className="text-slate-400 text-sm font-medium">/mês</span>
            </div>
            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                </div>
              ))}
            </div>
            <button 
              disabled={plan.current}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 ${plan.current ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100'}`}
            >
              {plan.current ? 'Plano Ativo' : 'Selecionar Plano'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailedInvoices = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      {renderHeader('Histórico de Faturas', 'Acesse todos os seus comprovantes e notas fiscais emitidas.', () => setSubView('overview'))}
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por número da fatura ou data..." className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar Tudo (Excel)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Fatura</th>
                <th className="px-8 py-5">Emissão</th>
                <th className="px-8 py-5">Período</th>
                <th className="px-8 py-5">Valor Bruto</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Documentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: '2307', date: '15/06/2024', period: 'Mai - Jun 2024', val: '249,90', status: 'pendente' },
                { id: '2306', date: '15/05/2024', period: 'Abr - Mai 2024', val: '249,90', status: 'pago' },
                { id: '2305', date: '15/04/2024', period: 'Mar - Abr 2024', val: '249,90', status: 'pago' },
                { id: '2304', date: '15/03/2024', period: 'Fev - Mar 2024', val: '249,90', status: 'pago' },
                { id: '2303', date: '15/02/2024', period: 'Jan - Fev 2024', val: '249,90', status: 'pago' },
                { id: '2302', date: '15/01/2024', period: 'Dez - Jan 2024', val: '249,90', status: 'pago' },
              ].map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-800">#{inv.id}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-500 font-medium">{inv.date}</td>
                  <td className="px-8 py-6 text-xs text-slate-400 uppercase font-bold tracking-wider">{inv.period}</td>
                  <td className="px-8 py-6 text-sm font-black text-slate-800">R$ {inv.val}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      inv.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Ver PDF"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Baixar NF-e"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClinicData = () => (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      {renderHeader('Dados da Clínica', 'Informações básicas e fiscais da sua unidade.')}
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-1 group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
              <Building2 className="w-8 h-8 group-hover:text-blue-500" />
              <span className="text-[10px] font-bold uppercase">Logo</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Logotipo da Clínica</h4>
              <p className="text-sm text-slate-500 mb-3">Recomendado: 512x512px em PNG ou JPG.</p>
              <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Alterar Imagem</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Fantasia</label>
              <input type="text" defaultValue="Clínica DentePro Matriz" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">CNPJ / CPF</label>
              <input type="text" defaultValue="12.345.678/0001-90" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                E-mail de Contato <Mail className="w-3 h-3" />
              </label>
              <input type="email" defaultValue="contato@dentepro.com.br" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
                Telefone / WhatsApp <Phone className="w-3 h-3" />
              </label>
              <input type="text" defaultValue="(11) 4002-8922" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1">
              Endereço Completo <MapPin className="w-3 h-3" />
            </label>
            <input type="text" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={() => setActiveSection('main')} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Descartar</button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="animate-in fade-in duration-500">
      {renderHeader('Usuários e Permissões', 'Gerencie quem tem acesso ao sistema e quais módulos podem visualizar.')}
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800">Equipe da Clínica</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
              <UserPlus className="w-4 h-4" />
              Adicionar Usuário
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Cargo / Função</th>
                  <th className="px-6 py-4">Nível de Acesso</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Dr. Ricardo Silva', email: 'ricardo@dentepro.com', role: 'Proprietário', access: 'Master', status: 'Ativo' },
                  { name: 'Dra. Luiza Souza', email: 'luiza@dentepro.com', role: 'Ortodontista', access: 'Clínico', status: 'Ativo' },
                  { name: 'Carla Pereira', email: 'carla@dentepro.com', role: 'Recepcionista', access: 'Recepção', status: 'Ativo' },
                  { name: 'Dr. Andre Marques', email: 'andre@dentepro.com', role: 'Implantodontista', access: 'Clínico', status: 'Férias' },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.access === 'Master' ? 'bg-purple-100 text-purple-700' :
                        user.access === 'Clínico' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.access}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                        user.status === 'Ativo' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Ativo' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {activeSection === 'main' ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
            <p className="text-slate-500">Gerencie todos os aspectos administrativos da sua clínica.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-left"
              >
                <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl transition-all w-fit mb-4">
                  <section.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{section.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{section.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ) : activeSection === 'clinic' ? (
        renderClinicData()
      ) : activeSection === 'users' ? (
        renderUsersManagement()
      ) : activeSection === 'chart_of_accounts' ? (
        renderChartOfAccounts()
      ) : activeSection === 'subscription' ? (
        subView === 'overview' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {renderHeader('Assinatura', 'Gerencie seu plano e pagamentos.')}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Plano Atual</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                      <Database className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">DentePro Premium</h3>
                      <p className="text-slate-500 text-sm">Próxima renovação: 15/07/2024</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSubView('plans')} className="w-full py-3 text-blue-600 bg-blue-50 rounded-xl font-bold hover:bg-blue-100 transition-all">Alterar de Plano</button>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pagamento</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl">
                      <CardIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Visa ending in 8821</h3>
                      <p className="text-slate-500 text-sm">Expira em 12/28</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSubView('card')} className="w-full py-3 text-slate-600 bg-slate-100 rounded-xl font-bold hover:bg-slate-200 transition-all">Atualizar Cartão</button>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Próxima Fatura</h4>
                    <p className="text-sm text-slate-500">Vencimento em 15 de Junho, 2024. Valor: R$ 249,90</p>
                  </div>
               </div>
               <button onClick={() => setSubView('invoices')} className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Ver Histórico</button>
            </div>
          </div>
        ) : subView === 'plans' ? renderPlans() : subView === 'card' ? renderCardUpdate() : renderDetailedInvoices()
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Settings className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Módulo em Configuração</h3>
           <p className="text-slate-500 max-w-sm mx-auto mb-8">Estamos trabalhando para trazer as opções de {activeSection} o mais rápido possível.</p>
           <button onClick={() => setActiveSection('main')} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Voltar para Início</button>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
