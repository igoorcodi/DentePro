
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  User,
  X,
  Clock,
  Calendar as CalendarIcon,
  Activity,
  UserCheck,
  Check
} from 'lucide-react';

interface AppointmentEntry {
  hour: number;
  patient: string;
  type: string;
  color: string;
  professional: string;
  date: string;
  time: string;
}

interface AgendaViewProps {
  initialOpenModal?: boolean;
  onModalClosed?: () => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ initialOpenModal, onModalClosed }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isModalOpen, setIsModalOpen] = useState(initialOpenModal || false);
  const [isSuccess, setIsSuccess] = useState(false);
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8am to 6pm

  const [appointments, setAppointments] = useState<AppointmentEntry[]>([
    { hour: 9, time: '09:00', patient: 'Felipe Amorim', type: 'Extração', color: 'bg-rose-100 border-rose-200 text-rose-700', professional: 'Dr. Ricardo Silva', date: new Date().toISOString().split('T')[0] },
    { hour: 11, time: '11:00', patient: 'Beatriz Costa', type: 'Ortodontia', color: 'bg-blue-100 border-blue-200 text-blue-700', professional: 'Dra. Luiza Souza', date: new Date().toISOString().split('T')[0] },
    { hour: 14, time: '14:00', patient: 'Lucas Viana', type: 'Limpeza', color: 'bg-emerald-100 border-emerald-200 text-emerald-700', professional: 'Dr. Andre Marques', date: new Date().toISOString().split('T')[0] },
  ]);

  const [formData, setFormData] = useState({
    patient: '',
    professional: 'Dr. Ricardo Silva',
    procedure: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });

  useEffect(() => {
    if (initialOpenModal) setIsModalOpen(true);
  }, [initialOpenModal]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    if (onModalClosed) onModalClosed();
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [hourStr] = formData.time.split(':');
    const hour = parseInt(hourStr, 10);

    const newApp: AppointmentEntry = {
      hour,
      time: formData.time,
      patient: formData.patient,
      type: formData.procedure,
      professional: formData.professional,
      date: formData.date,
      // Atribuir cor baseada no profissional
      color: formData.professional.includes('Ricardo') ? 'bg-blue-100 border-blue-200 text-blue-700' :
             formData.professional.includes('Luiza') ? 'bg-purple-100 border-purple-200 text-purple-700' :
             'bg-orange-100 border-orange-200 text-orange-700'
    };

    setIsSuccess(true);
    
    // Pequeno delay para mostrar o estado de sucesso antes de fechar
    setTimeout(() => {
      setAppointments(prev => [...prev, newApp]);
      handleCloseModal();
      setFormData({
        patient: '',
        professional: 'Dr. Ricardo Silva',
        procedure: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00'
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('day')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${viewMode === 'day' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Dia
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${viewMode === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${viewMode === 'month' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Mês
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <button className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
            <span className="px-4 text-sm font-bold text-slate-700">15 de Maio, 2024</span>
            <button className="p-2 hover:bg-slate-50 border-l border-slate-200"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-[700px]">
        {/* Sidebar Filter */}
        <div className="w-64 border-r border-slate-100 p-6 hidden lg:block bg-slate-50/30">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Equipe Clínica</h4>
          <div className="space-y-4">
            {[
              { name: 'Dr. Ricardo Silva', color: 'bg-blue-600', role: 'Implantodontista' },
              { name: 'Dra. Luiza Souza', color: 'bg-purple-500', role: 'Ortodontista' },
              { name: 'Dr. Andre Marques', color: 'bg-orange-400', role: 'Clínico Geral' },
            ].map((p, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-100">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.role}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
              </label>
            ))}
          </div>
        </div>

        {/* Time Grid Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'day' ? (
            <div className="relative min-w-[600px]">
              {timeSlots.map(hour => {
                const hourAppointments = appointments.filter(a => a.hour === hour);
                return (
                  <div key={hour} className="flex border-b border-slate-50 group min-h-[90px]">
                    <div className="w-20 py-4 px-4 text-right border-r border-slate-50 shrink-0">
                      <span className="text-xs font-bold text-slate-400">{hour}:00</span>
                    </div>
                    <div className="flex-1 p-2 relative flex flex-col gap-2">
                      {hourAppointments.length > 0 ? (
                        hourAppointments.map((app, idx) => (
                          <div key={idx} className={`
                            ${app.color} 
                            min-h-[70px] p-4 rounded-xl border-l-4 shadow-sm flex items-center justify-between
                            animate-in zoom-in-95 duration-300 group-hover:scale-[1.01] transition-transform
                          `}>
                            <div className="flex items-center gap-4">
                              <div className="bg-white/50 p-2 rounded-full shadow-sm">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black leading-none mb-1">{app.patient}</p>
                                <div className="flex items-center gap-2 opacity-80">
                                  <span className="text-[10px] font-bold uppercase tracking-wider">{app.type}</span>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-[10px] font-bold">{app.professional}</span>
                                </div>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div 
                          onClick={() => {
                            setFormData({...formData, time: `${hour < 10 ? '0'+hour : hour}:00`});
                            setIsModalOpen(true);
                          }}
                          className="w-full h-full border-2 border-dashed border-transparent hover:border-slate-200 hover:bg-slate-50/50 rounded-xl transition-all cursor-pointer flex items-center justify-center group/empty"
                        >
                          <Plus className="w-5 h-5 text-slate-200 group-hover/empty:text-blue-400 group-hover/empty:scale-110 transition-all opacity-0 group-hover/empty:opacity-100" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-12 text-center">
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold mb-2">Visualização em Construção</h3>
                <p className="text-slate-500 text-sm">O modo {viewMode === 'week' ? 'Semanal' : 'Mensal'} está sendo otimizado para melhor performance. Use o modo Diário por enquanto.</p>
                <button onClick={() => setViewMode('day')} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Voltar ao modo Diário</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Novo Agendamento</h3>
                  <p className="text-xs text-slate-500">Agende consultas e procedimentos rapidamente.</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="p-8 space-y-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800">Agendado com Sucesso!</h4>
                  <p className="text-slate-500 mt-2">O horário foi reservado e confirmado.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Paciente</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="Busque pelo nome ou CPF..."
                          value={formData.patient}
                          onChange={(e) => setFormData({...formData, patient: e.target.value})}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data</label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            required
                            type="date" 
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Horário</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select 
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium appearance-none"
                          >
                            {timeSlots.map(h => (
                              <option key={h} value={`${h < 10 ? '0'+h : h}:00`}>{h}:00</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Procedimento Principal</label>
                      <div className="relative">
                        <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Canal, Limpeza, Avaliação..."
                          value={formData.procedure}
                          onChange={(e) => setFormData({...formData, procedure: e.target.value})}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Profissional Responsável</label>
                      <div className="relative">
                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                          value={formData.professional}
                          onChange={(e) => setFormData({...formData, professional: e.target.value})}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-sm font-medium appearance-none"
                        >
                          <option>Dr. Ricardo Silva</option>
                          <option>Dra. Luiza Souza</option>
                          <option>Dr. Andre Marques</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 text-sm font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                    >
                      Confirmar Agendamento
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaView;
