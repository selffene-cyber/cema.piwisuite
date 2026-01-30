
import React, { useState, useEffect } from 'react';
import { User, Evaluation } from './types';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import EvaluationForm from './screens/EvaluationForm';
import Home from './screens/Home';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<string>('home');
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Mock initial data
  useEffect(() => {
    const mockData: Evaluation[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        clientName: 'Minera Los Pelambres',
        tag: 'CV-101',
        beltWidth: 42,
        beltSpeed: 500,
        spliceType: 'Vulcanized' as any,
        abrasiveness: 'Moderately Abrasive (Index 18-67)' as any,
        moisture: 'Medium/Moist (2-8%)' as any,
        totalScore: 8,
        severityClass: 2
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        clientName: 'Puerto Angamos',
        tag: 'CV-02',
        beltWidth: 72,
        beltSpeed: 950,
        spliceType: 'Mechanical >= 500 fpm' as any,
        abrasiveness: 'Extremely Abrasive (Index 68-416)' as any,
        moisture: 'Heavy/Wet (>8%)' as any,
        totalScore: 23,
        severityClass: 4
      }
    ];
    setEvaluations(mockData);
  }, []);

  const handleLogin = (email: string) => {
    setCurrentUser({ id: '1', name: 'Ingeniero Terreno', email });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveModule('home');
    setView('dashboard');
  };

  const saveEvaluation = (newEval: Evaluation) => {
    setEvaluations([newEval, ...evaluations]);
    setView('dashboard');
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
      {renderContent()}
    </Layout>
  );
};

export default App;
