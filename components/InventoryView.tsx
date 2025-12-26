
import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  cat: string;
  qtd: number;
  min: number;
  val: string;
  alert: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Resina Composta A3', cat: 'Material', qtd: 4, min: 10, val: '12/12/2025', alert: true },
  { id: '2', name: 'Agulha Gengival 30G', cat: 'Insumos', qtd: 150, min: 50, val: '01/06/2026', alert: false },
  { id: '3', name: 'Anestésico Lidocaína', cat: 'Fármacos', qtd: 8, min: 20, val: '10/01/2025', alert: true },
  { id: '4', name: 'Máscaras Descartáveis', cat: 'EPI', qtd: 500, min: 200, val: 'n/a', alert: false },
];

const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    cat: 'Material',
    qtd: '',
    min: '',
    val: ''
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qtd = Number(newProduct.qtd);
    const min = Number(newProduct.min);
    
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      cat: newProduct.cat,
      qtd: qtd,
      min: min,
      val: newProduct.val || 'n/a',
      alert: qtd <= min
    };

    setProducts([product, ...products]);
    setIsModalOpen(false);
    setNewProduct({ name: '', cat: 'Material', qtd: '', min: '', val: '' });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const alertCount = products.filter(p => p.alert).length;
  const totalValue = products.reduce((acc, p) => acc + (p.qtd * 15.5), 0); // Mock value calculation

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Estoque</h2>
          <p className="text-slate-500">Controle de insumos, materiais e validade.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-white text-amber-600 rounded-lg shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">Itens em Alerta</h3>
            <p className="text-sm text-amber-700 mb-2">{alertCount} produtos estão abaixo do estoque mínimo.</p>
            <button className="text-xs font-bold text-amber-800 underline hover:text-amber-600">Gerar Pedido de Compra</button>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shadow-sm">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Entradas Mês</h3>
            <p className="text-sm text-slate-500">Novos insumos registrados recentemente.</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg shadow-sm">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Valor em Estoque</h3>
            <p className="text-sm text-slate-500">Valor total estimado: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="Filtrar por produto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
             />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-md hover:bg-white bg-slate-100 transition-colors">Todos</button>
            <button className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-500">Críticos</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Qtd Atual</th>
                <th className="px-6 py-4">Mínimo</th>
                <th className="px-6 py-4">Validade</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600">{p.cat}</span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${p.alert ? 'text-red-600' : 'text-slate-900'}`}>
                    {p.qtd}
                    {p.alert && <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Baixo</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{p.min}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.val}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Adicionar Entrada"><Plus className="w-4 h-4" /></button>
                       <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded" title="Registrar Saída"><ArrowDownLeft className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Nenhum produto encontrado com os critérios de busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Novo Produto</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nome do Produto</label>
                <div className="relative">
                  <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Resina, Luvas, Espátula..."
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Categoria</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      value={newProduct.cat}
                      onChange={(e) => setNewProduct({...newProduct, cat: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all text-sm"
                    >
                      <option>Material</option>
                      <option>Insumos</option>
                      <option>Fármacos</option>
                      <option>EPI</option>
                      <option>Instrumental</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Validade (Opcional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="DD/MM/AAAA"
                      value={newProduct.val}
                      onChange={(e) => setNewProduct({...newProduct, val: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Qtd em Estoque</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={newProduct.qtd}
                    onChange={(e) => setNewProduct({...newProduct, qtd: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Estoque Mínimo</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    placeholder="Alerta de reposição"
                    value={newProduct.min}
                    onChange={(e) => setNewProduct({...newProduct, min: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
