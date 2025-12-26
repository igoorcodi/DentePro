
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar,
  ChevronRight,
  ExternalLink,
  X,
  User,
  CreditCard,
  Smartphone
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
}

const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'Mariana Oliveira', cpf: '123.456.789-00', lastVisit: '12/03/2024', status: 'active', email: 'mari@gmail.com', phone: '(11) 98765-4321' },
  { id: '2', name: 'João Pedro Santos', cpf: '987.654.321-11', lastVisit: '05/04/2024', status: 'active', email: 'jpedro@yahoo.com', phone: '(11) 91234-5678' },
  { id: '3', name: 'Ana Clara Souza', cpf: '456.123.789-22', lastVisit: '22/01/2024', status: 'inactive', email: 'ana.souza@outlook.com', phone: '(11) 97777-8888' },
  { id: '4', name: 'Roberto Mendes', cpf: '321.654.987-33', lastVisit: '15/05/2024', status: 'active', email: 'rob_mendes@gmail.com', phone: '(11) 95555-4444' },
  { id: '5', name: 'Fernanda Lima', cpf: '789.456.123-44', lastVisit: '10/02/2024', status: 'active', email: 'fe_lima@gmail.com', phone: '(11) 96666-3333' },
];

interface PatientsViewProps {
  onSelectPatient: (id: string) => void;
}

const PatientsView: React.FC<PatientsViewProps> = ({ onSelectPatient }) => {
  const [patientList, setPatientList] = useState<Patient[]>(INITIAL_PATIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: ''
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      cpf: formData.cpf,
      email: formData.email,
      phone: formData.phone,
      status: 'active',
      lastVisit: 'Novo Paciente'
    };

    setPatientList([newPatient, ...patientList]);
    setIsModalOpen(false);
    setFormData({ name: '', cpf: '', email: '', phone: '' });
  };

  const filteredPatients = patientList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pacientes</h2>
          <p className="text-slate-500">Gerencie o prontuário e histórico de seus pacientes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Novo
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF ou prontuário..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filtros Avançados
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
                <MoreVertical className="w-5 h-5" />
               </button>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <img 
                  src={`https://picsum.photos/seed/${patient.id}/100/100`} 
                  className="w-14 h-14 rounded-full border-2 border-slate-50 group-hover:border-blue-100 transition-all object-cover"
                  alt={patient.name}
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${patient.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 leading-tight truncate text-lg">{patient.name}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                  <CreditCard className="w-3 h-3" />
                  <p className="text-xs">{patient.cpf}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 bg-slate-50/50 p-3 rounded-xl">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span>Visto em: {patient.lastVisit}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {patient.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
              <button 
                onClick={() => onSelectPatient(patient.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
              >
                Ver Prontuário
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold">Nenhum paciente encontrado</h3>
            <p className="text-slate-500 text-sm">Tente mudar os filtros ou o termo de busca.</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro de Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Cadastrar Paciente</h3>
                  <p className="text-xs text-slate-500">Preencha os dados básicos do novo prontuário.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="p-8 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Maria das Graças Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">CPF</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Celular / WhatsApp</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="paciente@exemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsView;
