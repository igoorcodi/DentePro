
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Camera, 
  FileText, 
  ClipboardList, 
  Activity, 
  History,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Odontogram from './Odontogram';

interface ClinicalCareViewProps {
  patientId: string;
  onClose: () => void;
}

const ClinicalCareView: React.FC<ClinicalCareViewProps> = ({ patientId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'evolution' | 'odontogram' | 'anamnesis' | 'budget'>('evolution');
  const [evolutionText, setEvolutionText] = useState('');

  const tabs = [
    { id: 'evolution', label: 'Evolução', icon: Activity },
    { id: 'odontogram', label: 'Odontograma', icon: FileText },
    { id: 'anamnesis', label: 'Anamnese', icon: ClipboardList },
    { id: 'budget', label: 'Orçamentos', icon: History },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in slide-in-from-right-8 duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">Mariana Oliveira</h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Atendimento em Curso</span>
            </div>
            <p className="text-slate-500 text-sm">Prontuário: #00234 • Última consulta: 12/03/2024</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Save className="w-4 h-4" />
            Salvar Consulta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Nav Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
              `}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-300'}`} />
            </button>
          ))}
          
          <div className="mt-8 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Assistente AI</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Com base no histórico, Mariana possui sensibilidade nos molares superiores. Sugerir profilaxia com flúor tópico.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'odontogram' ? (
            <div className="space-y-6">
              <Odontogram />
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800">Notas de Observação</h3>
                <textarea 
                  placeholder="Descreva detalhes específicos observados no odontograma..."
                  className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ) : activeTab === 'evolution' ? (
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[600px] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Registro de Evolução Clínica</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">
                    <Camera className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-6 relative">
                <textarea 
                  value={evolutionText}
                  onChange={(e) => setEvolutionText(e.target.value)}
                  placeholder="Inicie o registro do atendimento aqui... Ex: Paciente relata dor no dente 16 ao ingerir líquidos gelados."
                  className="w-full h-full resize-none bg-transparent border-none focus:ring-0 p-0 text-slate-700 leading-relaxed"
                />
                {!evolutionText && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-slate-300 pointer-events-none">
                    <Activity className="w-12 h-12 mb-2" />
                    <p className="text-sm">Nenhum registro iniciado</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 bg-slate-50/30">
                <span>Última alteração automática: Agora mesmo</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-500" /> IA está analisando sua escrita...</span>
              </div>
            </div>
          ) : (
             <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                   <ClipboardList className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-medium text-slate-800">Módulo em Desenvolvimento</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">Esta funcionalidade está sendo preparada para o próximo update do sistema DentePro.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalCareView;
