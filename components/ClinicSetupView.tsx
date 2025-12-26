
import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, FileText, Check, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

interface ClinicSetupViewProps {
  onComplete: (data: any) => void;
}

const ClinicSetupView: React.FC<ClinicSetupViewProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'SP',
    responsible: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome da clínica é essencial.';
    if (!formData.cnpj.trim()) newErrors.cnpj = 'Documento fiscal é obrigatório.';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone de contato é obrigatório.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'E-mail inválido.';
    if (!formData.address.trim()) newErrors.address = 'O endereço é necessário para orçamentos.';
    if (!formData.responsible.trim()) newErrors.responsible = 'O responsável técnico deve ser identificado.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Simulação de salvamento
      setTimeout(() => {
        setLoading(false);
        setShowSuccess(true);
        // Pequena pausa para o usuário ler a confirmação antes de deslogar
        setTimeout(() => {
          onComplete(formData);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-700">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Configuração da Clínica</h1>
              <p className="text-slate-500 font-medium">Esta etapa é obrigatória para habilitar os recursos do sistema.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
          {showSuccess ? (
            <div className="p-20 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Clínica Configurada!</h2>
              <p className="text-slate-500 mt-4 text-lg">Seu ambiente está sendo preparado.</p>
              <p className="text-slate-400 text-sm mt-8 animate-pulse">Retornando para a tela de login para validar sua nova sessão...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Fantasia da Clínica</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none transition-all text-sm font-bold ${errors.name ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                    placeholder="Ex: Odonto Excellence Matriz"
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-in slide-in-from-top-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ ou CPF (Identificador Fiscal)</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none text-sm font-bold transition-all ${errors.cnpj ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                  {errors.cnpj && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.cnpj}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone Principal</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none text-sm font-bold transition-all ${errors.phone ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none text-sm font-bold transition-all ${errors.email ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                      placeholder="financeiro@suaclinica.com"
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço de Atendimento</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none text-sm font-bold transition-all ${errors.address ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                      placeholder="Rua, Número, Complemento, Cidade - UF"
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.address}</p>}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Responsável Técnico</label>
                  <input 
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-4 outline-none text-sm font-bold transition-all ${errors.responsible ? 'border-rose-300 ring-rose-50' : 'border-slate-200 focus:ring-blue-100'}`}
                    placeholder="Ex: Dr. Ricardo Silva - CRO/SP 123456"
                  />
                  {errors.responsible && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{errors.responsible}</p>}
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  disabled={loading}
                  className="flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Salvar e Prosseguir
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicSetupView;
