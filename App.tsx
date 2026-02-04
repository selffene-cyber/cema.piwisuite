
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Evaluation, Transportador } from './types';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import EvaluationForm from './screens/EvaluationForm';
import EvaluationDetail from './screens/EvaluationDetail';
import TransportadorList from './screens/TransportadorList';
import TransportadorForm from './screens/TransportadorForm';
import TransportadorDetail from './screens/TransportadorDetail';
import Home from './screens/Home';
import ConfigPage from './screens/ConfigPage';
import Layout from './components/Layout';
import CEMALoading from './components/CEMALoading';
import { evaluationsApi, authApi } from './utils/api';
import { calculateScores } from './utils/calculator';
import { generateEvaluationPDFSimple } from './utils/pdfGenerator';

interface FilterState {
  clientName: string;
  severityClass: string;
  dateFrom: string;
  dateTo: string;
  beltWidth: string;
}

type ViewState = 'dashboard' | 'form' | 'detail';

const App: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<string>('home');
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Transportador state
  const [transportadores, setTransportadores] = useState<Transportador[]>([]);
  const [selectedTransportadorId, setSelectedTransportadorId] = useState<string | null>(null);
  const [transportadorView, setTransportadorView] = useState<'list' | 'form' | 'detail'>('list');
  const [transportadorToEdit, setTransportadorToEdit] = useState<Transportador | null>(null);
  const [loadingTransportadores, setLoadingTransportadores] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    clientName: '',
    severityClass: '',
    dateFrom: '',
    dateTo: '',
    beltWidth: '',
  });

  // Filter evaluations based on criteria
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evalItem) => {
      // Client Name filter (case-insensitive partial match)
      if (filters.clientName && !evalItem.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }
      
      // Severity Class filter
      if (filters.severityClass && evalItem.severityClass !== parseInt(filters.severityClass)) {
        return false;
      }
      
      // Date range filter
      const evalDate = new Date(evalItem.timestamp);
      if (filters.dateFrom && evalDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && evalDate > new Date(filters.dateTo)) {
        return false;
      }
      
      // Belt Width filter
      if (filters.beltWidth && evalItem.beltWidthValue !== parseInt(filters.beltWidth)) {
        return false;
      }
      
      return true;
    });
  }, [evaluations, filters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      clientName: '',
      severityClass: '',
      dateFrom: '',
      dateTo: '',
      beltWidth: '',
    });
  }, []);

  // Handle individual filter changes
  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle loading finish
  const handleLoadingFinish = useCallback(() => {
    setShowLoading(false);
  }, []);

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
      console.error('Failed to save evaluation to API:', err);
      throw new Error('Error al guardar evaluación: ' + (err.message || String(err)));
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      await evaluationsApi.deleteById(id);
      fetchEvaluations();
      // If viewing the deleted evaluation, go back to dashboard
      if (selectedEvaluationId === id) {
        setView('dashboard');
        setSelectedEvaluationId(null);
      }
    } catch (err: any) {
      console.error('Failed to delete evaluation:', err);
      throw new Error('Error al eliminar evaluación: ' + (err.message || String(err)));
    }
  };

  const handleDownloadPDF = async (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    if (!evaluation) return;
    
    const result = calculateScores(
      evaluation.beltWidth,
      evaluation.beltSpeed,
      evaluation.spliceType,
      evaluation.abrasiveness,
      evaluation.moisture
    );
    
    await generateEvaluationPDFSimple(result, {
      clientName: evaluation.clientName,
      tag: evaluation.tag,
      beltWidth: evaluation.beltWidth,
      beltSpeed: evaluation.beltSpeed,
      spliceType: evaluation.spliceType,
      abrasiveness: evaluation.abrasiveness,
      moisture: evaluation.moisture,
    });
  };

  // Transportador functions
  const fetchTransportadores = useCallback(async () => {
    try {
      setLoadingTransportadores(true);
      // Load from localStorage for now (until API is implemented)
      const stored = localStorage.getItem('transportadores');
      const data: Transportador[] = stored ? JSON.parse(stored) : [];
      setTransportadores(data);
    } catch (err: any) {
      console.error('Failed to fetch transportadores:', err);
      setTransportadores([]);
    } finally {
      setLoadingTransportadores(false);
    }
  }, []);

  // Fetch transportadores when user is logged in
  useEffect(() => {
    if (currentUser) {
      fetchTransportadores();
    }
  }, [currentUser, fetchTransportadores]);

  const saveTransportador = async (transportador: Transportador) => {
    try {
      const stored = localStorage.getItem('transportadores');
      const existing: Transportador[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = existing.findIndex(t => t.id === transportador.id);
      let updated: Transportador[];
      
      if (existingIndex >= 0) {
        existing[existingIndex] = transportador;
        updated = [...existing];
      } else {
        updated = [...existing, transportador];
      }
      
      localStorage.setItem('transportadores', JSON.stringify(updated));
      setTransportadores(updated);
    } catch (err: any) {
      console.error('Failed to save transportador:', err);
      throw new Error('Error al guardar transportador: ' + (err.message || String(err)));
    }
  };

  const deleteTransportador = async (id: string) => {
    try {
      const stored = localStorage.getItem('transportadores');
      const existing: Transportador[] = stored ? JSON.parse(stored) : [];
      
      const filtered = existing.filter(t => t.id !== id);
      localStorage.setItem('transportadores', JSON.stringify(filtered));
      setTransportadores(filtered);
      
      if (selectedTransportadorId === id) {
        setTransportadorView('list');
        setSelectedTransportadorId(null);
      }
    } catch (err: any) {
      console.error('Failed to delete transportador:', err);
      throw new Error('Error al eliminar transportador: ' + (err.message || String(err)));
    }
  };

  const handleDuplicateTransportador = async (id: string) => {
    const original = transportadores.find(t => t.id === id);
    if (!original) return;
    
    const duplicate: Transportador = {
      ...original,
      id: crypto.randomUUID(),
      identity: {
        ...original.identity,
        codigoTransportador: `${original.identity.codigoTransportador}-COPY`,
        nombreDescriptivo: `${original.identity.nombreDescriptivo} (Copia)`,
      },
      estado: 'borrador',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    
    await saveTransportador(duplicate);
  };

  if (showLoading) {
    return <CEMALoading onFinish={handleLoadingFinish} />;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (activeModule === 'home') {
      return <Home evaluations={evaluations} setActiveModule={setActiveModule} />;
    }

    if (activeModule === 'cema576') {
      if (view === 'form') {
        return <EvaluationForm onSave={saveEvaluation} onCancel={() => setView('dashboard')} onSaveComplete={() => setView('dashboard')} />;
      }
      if (view === 'detail' && selectedEvaluationId) {
        return <EvaluationDetail evaluationId={selectedEvaluationId} onBack={() => { setView('dashboard'); setSelectedEvaluationId(null); }} />;
      }
      return (
        <Dashboard 
          evaluations={filteredEvaluations} 
          onNewEvaluation={() => setView('form')} 
          activeModule={activeModule}
          loading={loading}
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          onViewEvaluation={(id) => { setSelectedEvaluationId(id); setView('detail'); }}
          onDeleteEvaluation={deleteEvaluation}
          onDownloadPDF={handleDownloadPDF}
        />
      );
    }

    if (activeModule === 'transportadores') {
      // Detail view
      if (transportadorView === 'detail' && selectedTransportadorId) {
        return (
          <TransportadorDetail
            transportadorId={selectedTransportadorId}
            transportadores={transportadores}
            onBack={() => {
              setTransportadorView('list');
              setSelectedTransportadorId(null);
            }}
            onEdit={(id) => {
              const t = transportadores.find(x => x.id === id);
              setTransportadorToEdit(t || null);
              setTransportadorView('form');
            }}
            onDuplicate={(id) => {
              handleDuplicateTransportador(id);
            }}
            onDelete={(id) => {
              deleteTransportador(id);
              setTransportadorView('list');
            }}
          />
        );
      }

      // Form view (edit/create)
      if (transportadorView === 'form') {
        return (
          <TransportadorForm
            transportador={transportadorToEdit}
            onSave={async (t) => {
              await saveTransportador(t);
              setTransportadorView('list');
              setTransportadorToEdit(null);
            }}
            onCancel={() => {
              setTransportadorView('list');
              setTransportadorToEdit(null);
            }}
          />
        );
      }

      // List view
      return (
        <TransportadorList
          transportadores={transportadores}
          onNewTransportador={() => {
            setTransportadorToEdit(null);
            setTransportadorView('form');
          }}
          onEditTransportador={(id) => {
            const t = transportadores.find(x => x.id === id);
            setTransportadorToEdit(t || null);
            setTransportadorView('form');
          }}
          onViewTransportador={(id) => {
            setSelectedTransportadorId(id);
            setTransportadorView('detail');
          }}
          onDuplicateTransportador={handleDuplicateTransportador}
          onDeleteTransportador={deleteTransportador}
          loading={loadingTransportadores}
        />
      );
    }

    if (activeModule === 'configuracion') {
      return <ConfigPage user={currentUser} />;
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
        setTransportadorView('list');
        setSelectedTransportadorId(null);
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
