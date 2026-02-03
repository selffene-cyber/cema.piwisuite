
import React, { useState, useRef, useEffect } from 'react';
import { authApi } from '../utils/api';
import { User } from '../types';

// Audio file path - handle special characters in filename
const AUDIO_PATH = '/sound/sonido cema loading .mp3';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio on component mount
  useEffect(() => {
    audioRef.current = new Audio(AUDIO_PATH);
    audioRef.current.volume = 0.5;

    const playAudio = async () => {
      try {
        await audioRef.current?.play();
      } catch (err) {
        console.log('Audio playback failed:', err);
      }
    };
    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      onLogin({
        id: response.user?.id?.toString() || '',
        name: response.user?.name || email.split('@')[0],
        email: response.user?.email || email,
        role: response.user?.role || 'Técnico',
        estado: response.user?.estado || 'Activo'
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md space-y-10 bg-white p-8 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="text-center">
          <img
            src="/icon/favicon-96x96.png"
            alt="CEMA Logo"
            className="mx-auto w-16 h-16 rounded-2xl shadow-xl mb-8"
          />
          <h2 className="text-3xl font-extrabold text-[#32325d] tracking-tight">Bienvenido</h2>
          <p className="mt-3 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] opacity-80">Asistente CEMA</p>
        </div>

        {error && (
          <p className="text-center text-red-600 text-sm font-medium mb-2">
            {error}
          </p>
        )}

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-[#32325d] uppercase mb-2 block ml-1 tracking-widest opacity-60">Credencial de Acceso</label>
              <input
                type="email"
                required
                className="block w-full rounded-xl px-5 py-4 text-sm font-medium text-slate-700 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="tucorreo@correo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[#5e72e4] rounded-xl text-white font-black shadow-[0_10px_30px_rgba(94,114,228,0.3)] hover:bg-[#435ad8] hover:shadow-[0_15px_35px_rgba(94,114,228,0.4)] transition-all uppercase text-[11px] tracking-[0.2em] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
