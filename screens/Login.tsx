
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md space-y-10 bg-white p-8 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#5e72e4] rounded-2xl flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-blue-500/20 mb-8">
            C
          </div>
          <h2 className="text-3xl font-extrabold text-[#32325d] tracking-tight">Bienvenido</h2>
          <p className="mt-3 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] opacity-80">Asistente CEMA Professional</p>
        </div>
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-[#32325d] uppercase mb-2 block ml-1 tracking-widest opacity-60">Credencial de Acceso</label>
              <input
                type="email"
                required
                className="block w-full rounded-xl px-5 py-4 text-sm font-medium text-slate-700 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="usuario@corporativo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#32325d] uppercase mb-2 block ml-1 tracking-widest opacity-60">Contraseña Segura</label>
              <input
                type="password"
                required
                className="block w-full rounded-xl px-5 py-4 text-sm font-medium text-slate-700 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#5e72e4] rounded-xl text-white font-black shadow-[0_10px_30px_rgba(94,114,228,0.3)] hover:bg-[#435ad8] hover:shadow-[0_15px_35px_rgba(94,114,228,0.4)] transition-all uppercase text-[11px] tracking-[0.2em] active:scale-[0.98]"
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
