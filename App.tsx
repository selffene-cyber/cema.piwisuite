
import React, { useState, useEffect, useCallback } from 'react';
import { User, Evaluation } from './types';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import EvaluationForm from './screens/EvaluationForm';
import Home from './screens/Home';
import Layout from './components/Layout';
import { evaluationsApi, authApi } from './utils/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<string>('home');
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch evaluations from API
  const fetchEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await evaluationsApi.getAll();
      setEvaluations(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch evaluations:', err.message);
      setError('Error al cargar evaluaciones: ' + err.message);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch evaluations when user is logged in
  useEffect(() => {
    if (currentUser) {
      fetchEvaluations();
    }
  }, [currentUser, fetchEvaluations]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setActiveModule('home');
    setView('dashboard');
  };

  const saveEvaluation = async (newEval: Evaluation) => {
    try {
      await evaluationsApi.create(newEval);
      fetchEvaluations();
    } catch (err: any) {
      console.error('Failed to save evaluation to API:', err.message);
      throw new Error('Error al guardar evaluación: ' + err.message);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeModule === 'home') {
      return <Home evaluations={evaluations} setActiveModule={setActiveModule} />;
    }

    if (activeModule === 'cema576') {
      if (view === 'form') {
        return <EvaluationForm onSave={saveEvaluation} onCancel={() => setView('dashboard')} />;
      }
      return (
        <Dashboard 
          evaluations={evaluations} 
          onNewEvaluation={() => setView('form')} 
          activeModule={activeModule}
          loading={loading}
        />
      );
    }

    return (
      <div className="soft-card p-10 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl border border-gray-100">
          🛠️
        </div>
        <h2 className="text-xl font-black text-[#344767] mb-2">Módulo en Construcción</h2>
        <p className="text-slate-400 font-semibold text-sm">Estamos trabajando para habilitar esta funcionalidad muy pronto.</p>
        <button 
          onClick={() => setActiveModule('home')}
          className="mt-6 px-6 py-2 bg-brand-secondary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-md"
        >
          Volver al Inicio
        </button>
      </div>
    );
  };

  return (
    <Layout 
      activeModule={activeModule} 
      setActiveModule={(m) => {
        setActiveModule(m);
        setView('dashboard');
      }} 
      onLogout={handleLogout}
      user={currentUser}
    >
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          {error}
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
