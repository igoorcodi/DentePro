
import React, { useState } from 'react';
import { Stethoscope, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: (userData: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de processamento de API
    setTimeout(() => {
      setLoading(false);
      if (isLogin) {
        onLogin({ email: formData.email, name: formData.name || 'Usuário' });
      } else {
        // Fluxo de Cadastro: Mostra sucesso e volta para login
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsLogin(true);
          setFormData({ ...formData, password: '' }); // Limpa senha por segurança
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 mb-4">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DentePro</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestão Odontológica Inteligente</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {success ? (
            <div className="p-12 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Conta Criada!</h2>
              <p className="text-slate-500 mt-2">Agora você pode acessar sua conta.</p>
              <p className="text-blue-600 text-xs font-bold mt-4 animate-pulse">Redirecionando para login...</p>
            </div>
          ) : (
            <>
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Entrar
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Criar Conta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
                      placeholder="exemplo@dentepro.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Esqueci minha senha</button>
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin ? 'Acessar Sistema' : 'Finalizar Cadastro'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Powered by DentePro Intelligence &copy; 2024
        </p>
      </div>
    </div>
  );
};

export default LoginView;
