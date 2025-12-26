
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Search, 
  X,
  Calendar,
  Layers,
  Info,
  History,
  Truck,
  ShoppingCart,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Tag,
  Warehouse,
  Stethoscope,
  Clock,
  DollarSign,
  Palette,
  Edit3,
  Eye,
  Hash,
  Binary
} from 'lucide-react';

interface Product {
  id: string;
  code: string; // Código numérico imutável
  name: string;
  catId: string;
  qtd: number;
  min: number;
  val: string; 
  batch: string; 
  alert: boolean;
  supplierId: string;
  description?: string;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  tussCode: string;
  duration: number;
  cost: number;
  price: number;
  description: string;
}

interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  qtd: number;
  date: string;
  reason: string;
  user: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
  rating: number;
}

const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat1', name: 'Material de Consumo', description: 'Itens de uso diário na clínica', color: 'bg-blue-500' },
  { id: 'cat2', name: 'Instrumental', description: 'Ferramentas e utensílios reutilizáveis', color: 'bg-purple-500' },
  { id: 'cat3', name: 'Medicamentos', description: 'Anestésicos e fármacos controlados', color: 'bg-rose-500' },
  { id: 'cat4', name: 'EPIs', description: 'Equipamentos de proteção individual', color: 'bg-emerald-500' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: '001', name: 'Resina Composta A3', catId: 'cat1', qtd: 4, min: 10, val: '2025-12-12', batch: 'LOT-9922', alert: true, supplierId: 's1', description: 'Resina fotopolimerizável de alta estética.' },
  { id: '2', code: '002', name: 'Agulha Gengival 30G', catId: 'cat1', qtd: 150, min: 50, val: '2026-06-01', batch: 'BCH-1100', alert: false, supplierId: 's2', description: 'Agulhas descartáveis siliconadas.' },
  { id: '3', code: '003', name: 'Anestésico Lidocaína', catId: 'cat3', qtd: 8, min: 20, val: '2025-01-10', batch: 'AN-554', alert: true, supplierId: 's1', description: 'Solução injetável com vasoconstritor.' },
  { id: '4', code: '004', name: 'Máscaras Descartáveis', catId: 'cat4', qtd: 500, min: 200, val: '2024-12-31', batch: 'EPI-202', alert: false, supplierId: 's2', description: 'Tripla camada com elástico.' },
];

const INITIAL_SERVICES: Service[] = [
  { id: 'sv1', name: 'Limpeza e Profilaxia', category: 'Prevenção', tussCode: '81000012', duration: 45, cost: 45.00, price: 180.00, description: 'Remoção de tártaro e polimento coronário.' },
  { id: 'sv2', name: 'Restauração em Resina (1 face)', category: 'Dentística', tussCode: '82000024', duration: 60, cost: 32.00, price: 220.00, description: 'Restauração estética direta.' },
  { id: 'sv3', name: 'Exodontia Simples', category: 'Cirurgia', tussCode: '83000032', duration: 40, cost: 55.00, price: 250.00, description: 'Extração de dente permanente.' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Dental Cremer', contact: '(11) 4003-2121', category: 'Geral', rating: 5 },
  { id: 's2', name: 'MedShop Brasil', contact: '(11) 98877-6655', category: 'Descartáveis', rating: 4 },
];

const INITIAL_MOVEMENTS: Movement[] = [
  { id: 'm1', productId: '1', productName: 'Resina Composta A3', type: 'exit', qtd: 1, date: '2024-05-20', reason: 'Consumo Clínico', user: 'Dra. Luiza' },
  { id: 'm2', productId: '2', productName: 'Agulha Gengival 30G', type: 'entry', qtd: 100, date: '2024-05-18', reason: 'Compra #442', user: 'Carla (Recepção)' },
];

const InventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'items' | 'movements' | 'suppliers' | 'categories' | 'services'>('items');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [movements, setMovements] = useState<Movement[]>(INITIAL_MOVEMENTS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'new' | 'entry' | 'exit' | 'category' | 'service' | 'edit'>('new');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de Código puramente numérico e sequencial
  const generateNextCode = () => {
    const numericCodes = products.map(p => parseInt(p.code, 10)).filter(n => !isNaN(n));
    const max = numericCodes.length > 0 ? Math.max(...numericCodes) : 0;
    return String(max + 1).padStart(3, '0');
  };

  // Form States
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    catId: INITIAL_CATEGORIES[0].id,
    qtd: '',
    min: '',
    val: '',
    batch: '',
    reason: 'Consumo Clínico',
    supplierId: 's1',
    description: '',
    color: 'bg-blue-500',
    tussCode: '',
    duration: '60',
    cost: '',
    price: ''
  });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'new') {
      const nextCode = generateNextCode();
      const qtdNum = Number(formData.qtd);
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        code: nextCode,
        name: formData.name,
        catId: formData.catId,
        qtd: qtdNum,
        min: Number(formData.min),
        val: formData.val,
        batch: formData.batch,
        alert: qtdNum <= Number(formData.min),
        supplierId: formData.supplierId,
        description: formData.description
      };
      setProducts([product, ...products]);
    } else if (modalType === 'edit' && selectedProduct) {
      const updatedProducts = products.map(p => {
        if (p.id === selectedProduct.id) {
          const qtdNum = Number(formData.qtd);
          return {
            ...p,
            name: formData.name,
            catId: formData.catId,
            qtd: qtdNum,
            min: Number(formData.min),
            val: formData.val,
            batch: formData.batch,
            alert: qtdNum <= Number(formData.min),
            supplierId: formData.supplierId,
            description: formData.description
          };
        }
        return p;
      });
      setProducts(updatedProducts);
    } else if (modalType === 'category') {
      const category: ProductCategory = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        color: formData.color
      };
      setCategories([...categories, category]);
    } else if (modalType === 'service') {
      const service: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        category: formData.catId, 
        tussCode: formData.tussCode,
        duration: Number(formData.duration),
        cost: Number(formData.cost),
        price: Number(formData.price),
        description: formData.description
      };
      setServices([...services, service]);
    } else if (selectedProduct && (modalType === 'entry' || modalType === 'exit')) {
      const qtdNum = Number(formData.qtd);
      const isEntry = modalType === 'entry';
      const updatedProducts = products.map(p => {
        if (p.id === selectedProduct.id) {
          const newQtd = isEntry ? p.qtd + qtdNum : p.qtd - qtdNum;
          return { ...p, qtd: Math.max(0, newQtd), alert: newQtd <= p.min };
        }
        return p;
      });
      setProducts(updatedProducts);

      const movement: Movement = {
        id: Math.random().toString(36).substr(2, 9),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        type: isEntry ? 'entry' : 'exit',
        qtd: qtdNum,
        date: new Date().toISOString().split('T')[0],
        reason: formData.reason,
        user: 'Dr. Ricardo'
      };
      setMovements([movement, ...movements]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const openEditModal = (p: Product) => {
    setSelectedProduct(p);
    setModalType('edit');
    setFormData({
      ...formData,
      code: p.code,
      name: p.name,
      catId: p.catId,
      qtd: String(p.qtd),
      min: String(p.min),
      val: p.val,
      batch: p.batch,
      supplierId: p.supplierId,
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: '', name: '', catId: categories[0]?.id || '', qtd: '', min: '', val: '', batch: '', 
      reason: 'Consumo Clínico', supplierId: 's1', description: '', color: 'bg-blue-500',
      tussCode: '', duration: '60', cost: '', price: ''
    });
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Sem Categoria';
  const getCategoryColor = (id: string) => categories.find(c => c.id === id)?.color || 'bg-slate-500';

  const stats = useMemo(() => {
    const alerts = products.filter(p => p.alert).length;
    const expired = products.filter(p => p.val !== 'n/a' && new Date(p.val) < new Date()).length;
    return { alerts, expired };
  }, [products]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Centro de Suprimentos & Serviços</h2>
          <p className="text-slate-500">Gestão integrada de materiais, serviços e fornecedores.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'items' && (
            <button 
              onClick={() => { setModalType('new'); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          )}
          {activeTab === 'categories' && (
            <button 
              onClick={() => { setModalType('category'); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </button>
          )}
          {activeTab === 'services' && (
            <button 
              onClick={() => { setModalType('service'); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Novo Serviço
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'items', label: 'Estoque Atual', icon: Warehouse },
          { id: 'categories', label: 'Categorias', icon: Layers },
          { id: 'services', label: 'Serviços/Procedimentos', icon: Stethoscope },
          { id: 'movements', label: 'Movimentações', icon: History },
          { id: 'suppliers', label: 'Fornecedores', icon: Truck },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'items' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-white text-amber-600 rounded-xl shadow-sm"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-amber-900">Estoque Crítico</h3>
                <p className="text-2xl font-black text-amber-600">{stats.alerts} Itens</p>
                <p className="text-xs text-amber-700 mt-1">Abaixo do nível de segurança.</p>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-white text-rose-600 rounded-xl shadow-sm"><AlertCircle className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-rose-900">Vencimento Próximo</h3>
                <p className="text-2xl font-black text-rose-600">{stats.expired} Itens</p>
                <p className="text-xs text-rose-700 mt-1">Itens vencidos ou alerta.</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm transition-all hover:shadow-md">
              <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm"><TrendingUp className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-emerald-900">Giro de Estoque</h3>
                <p className="text-2xl font-black text-emerald-600">+12%</p>
                <p className="text-xs text-emerald-700 mt-1">Eficiência de uso mensal.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="relative w-72">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Pesquisar por nome ou código..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                 />
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><Filter className="w-4 h-4 text-slate-400" /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Produto / Lote</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Saldo</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Validade</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded border border-slate-200">
                          {p.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">LOTE: {p.batch}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getCategoryColor(p.catId)}`}></div>
                          <span className="text-slate-600 font-medium">{getCategoryName(p.catId)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{p.qtd} un</td>
                      <td className="px-6 py-4">
                        {p.alert ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-600">
                            <AlertTriangle className="w-3 h-3" /> Repor
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {new Date(p.val).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Editar Ficha"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200 self-center"></div>
                          <button 
                            onClick={() => { setSelectedProduct(p); setModalType('entry'); setIsModalOpen(true); }}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all" 
                            title="Entrada"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedProduct(p); setModalType('exit'); setIsModalOpen(true); }}
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all" 
                            title="Baixa"
                          >
                            <ArrowDownLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Outras Abas (Mantidas do código anterior para consistência) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${cat.color} text-white`}>
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1 uppercase tracking-tight">{cat.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{cat.description}</p>
              <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-widest">
                  {products.filter(p => p.catId === cat.id).length} Itens Vinculados
                </span>
                <span className="text-blue-600 font-black cursor-pointer hover:underline">Gerenciar</span>
              </div>
            </div>
          ))}
          <button 
            onClick={() => { setModalType('category'); setIsModalOpen(true); }}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all group"
          >
            <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="font-bold">Nova Categoria</span>
          </button>
        </div>
      )}

      {/* Main Action Modal (Cadastro e Edição) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shadow-lg ${
                  modalType === 'new' || modalType === 'edit' ? 'bg-blue-600 text-white' :
                  modalType === 'entry' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {modalType === 'new' || modalType === 'edit' ? <Package className="w-6 h-6" /> : 
                   modalType === 'category' ? <Layers className="w-6 h-6" /> :
                   modalType === 'service' ? <Stethoscope className="w-6 h-6" /> :
                   modalType === 'entry' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {modalType === 'new' ? 'Novo Produto' : 
                     modalType === 'edit' ? `Editar Ficha: ${selectedProduct?.name}` :
                     modalType === 'category' ? 'Nova Categoria' :
                     modalType === 'service' ? 'Novo Serviço' :
                     modalType === 'entry' ? `Entrada: ${selectedProduct?.name}` : `Dar Baixa: ${selectedProduct?.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalType === 'new' || modalType === 'edit' ? 'Gestão de cadastro e ficha técnica.' : 'Atualize os níveis de estoque.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[75vh]">
              <form onSubmit={handleAction} className="p-8 space-y-8">
                {(modalType === 'new' || modalType === 'edit') && (
                  <>
                    {/* Código Numérico Exibido mas Bloqueado na Edição */}
                    <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-[32px]">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 border border-slate-100">
                        <Binary className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Código de Identificação (Numérico)</label>
                        <input 
                          type="text" 
                          readOnly 
                          value={modalType === 'new' ? generateNextCode() : formData.code}
                          className="bg-transparent border-none p-0 text-xl font-black text-slate-800 outline-none w-full tracking-wider cursor-default"
                        />
                        <p className="text-[9px] text-blue-500 font-bold italic">
                          {modalType === 'new' ? '*Este número será gerado automaticamente.' : '*Identificador gerado pelo sistema (Não alterável).'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nome Comercial do Produto</label>
                          <input 
                            required type="text" placeholder="Ex: Resina Estética X..."
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-bold text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Categoria</label>
                          <select 
                            value={formData.catId} onChange={(e) => setFormData({...formData, catId: e.target.value})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none appearance-none"
                          >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Fornecedor Principal</label>
                          <select 
                            value={formData.supplierId} onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none appearance-none"
                          >
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Lote Atual</label>
                          <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input 
                              type="text" placeholder="Ex: L2024-05"
                              value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})}
                              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Vencimento do Lote</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input 
                              type="date" 
                              value={formData.val} onChange={(e) => setFormData({...formData, val: e.target.value})}
                              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Saldo em Estoque</label>
                          <input 
                            required type="number" placeholder="0"
                            value={formData.qtd} onChange={(e) => setFormData({...formData, qtd: e.target.value})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estoque Mínimo (Alerta)</label>
                          <input 
                            required type="number" placeholder="Limite de segurança"
                            value={formData.min} onChange={(e) => setFormData({...formData, min: e.target.value})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-rose-600 focus:ring-4 focus:ring-rose-100 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Descrição Técnica e Notas</label>
                        <textarea 
                          placeholder="Detalhes sobre composição, uso recomendado, restrições..."
                          value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium resize-none h-32 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Modais de Movimentação (Mantidos do código anterior) */}
                {(modalType === 'entry' || modalType === 'exit') && (
                  <div className="space-y-6">
                    <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estoque Atual</p>
                        <p className="text-2xl font-black text-slate-800">{selectedProduct?.qtd} <span className="text-xs font-bold text-slate-400">UN</span></p>
                      </div>
                      <div className="h-14 w-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300">
                        <Warehouse className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                        Quantidade para {modalType === 'entry' ? 'Entrada' : 'Baixa'}
                      </label>
                      <input 
                        required type="number" placeholder="0" autoFocus
                        value={formData.qtd} onChange={(e) => setFormData({...formData, qtd: e.target.value})}
                        className="w-full px-4 py-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none text-3xl font-black text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Motivação / Observação</label>
                      <textarea 
                        value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none h-24 focus:ring-4 focus:ring-blue-100 outline-none"
                        placeholder="Ex: Compra quinzenal, uso clínico, perda..."
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 py-4 text-sm font-bold text-white rounded-2xl transition-all shadow-xl active:scale-95 ${
                      modalType === 'entry' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' :
                      modalType === 'exit' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                    }`}
                  >
                    {modalType === 'edit' ? 'Salvar Ficha Técnica' : `Confirmar ${
                      modalType === 'entry' ? 'Entrada' : 
                      modalType === 'exit' ? 'Baixa' : 
                      modalType === 'category' ? 'Categoria' :
                      modalType === 'service' ? 'Serviço' : 'Cadastro'
                    }`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
