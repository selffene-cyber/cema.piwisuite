
import React, { useState, useMemo } from 'react';
import { Transportador, TransportadorIdentity, TransportadorGeometria, TransportadorMaterial, TransportadorCapacidad, TransportadorCorrea, TransportadorPolines, TransportadorZonaCarga, TransportadorLimpieza, TransportadorTambores, TransportadorAccionamiento, TransportadorTakeUp, TransportadorCurvas, TipoEquipo } from '../types';
import TransportadorIdentityForm from '../components/TransportadorIdentityForm';
import TransportadorGeometriaForm from '../components/TransportadorGeometriaForm';
import TransportadorMaterialForm from '../components/TransportadorMaterialForm';
import TransportadorCapacidadForm from '../components/TransportadorCapacidadForm';
import TransportadorCorreaForm from '../components/TransportadorCorreaForm';
import TransportadorPolinesForm from '../components/TransportadorPolinesForm';
import TransportadorZonaCargaForm from '../components/TransportadorZonaCargaForm';
import TransportadorLimpiezaForm from '../components/TransportadorLimpiezaForm';
import TransportadorTamboresForm from '../components/TransportadorTamboresForm';
import TransportadorAccionamientoForm from '../components/TransportadorAccionamientoForm';
import TransportadorTakeUpForm from '../components/TransportadorTakeUpForm';
import TransportadorCurvasForm from '../components/TransportadorCurvasForm';

interface TransportadorFormProps {
  transportador?: Transportador | null;
  onSave: (transportador: Transportador) => void;
  onCancel: () => void;
}

// Tab definitions
const SECTIONS = [
  { id: 'identity', label: 'Identidad', icon: '📋', required: true },
  { id: 'geometria', label: 'Geometría', icon: '📐', required: true },
  { id: 'material', label: 'Material', icon: '🪨', required: true },
  { id: 'capacidad', label: 'Capacidad', icon: '⚡', required: true },
  { id: 'correa', label: 'Correa', icon: '🔗', required: true },
  { id: 'polines', label: 'Polines', icon: '⚙️', required: false },
  { id: 'zonaCarga', label: 'Zona Carga', icon: '📥', required: false },
  { id: 'limpieza', label: 'Limpieza', icon: '🧹', required: false },
  { id: 'tambores', label: 'Tambores', icon: '🔘', required: false },
  { id: 'accionamiento', label: 'Accionamiento', icon: '🔌', required: false },
  { id: 'takeUp', label: 'Take-Up', icon: '🎯', required: false },
  { id: 'curvas', label: 'Curvas', icon: '↩️', required: false },
];

const createEmptyIdentity = (): TransportadorIdentity => ({
  cliente: '',
  clienteNombre: '',
  faena: '',
  area: '',
  codigoTransportador: '',
  nombreDescriptivo: '',
  tipoEquipo: TipoEquipo.TRANSPORTADOR_CONVENCIONAL,
  fechaLevantamiento: new Date().toISOString().split('T')[0],
  usuario: '',
  fuenteDato: 'levantamiento_campo',
  nivelConfianza: 50,
  comentarios: '',
});

const createEmptyGeometria = (): TransportadorGeometria => ({
  longitudTotal_m: 0,
  elevacionTotal_m: 0,
  inclinacionPromedio_grados: 0,
  anchoBanda_mm: 0,
  velocidadNominal_ms: 0,
  perfil: 'HORIZONTAL' as any,
  numTramosInclinados: 0,
  tramosInclinados: [],
  tramosHorizontal: [],
});

const createEmptyMaterial = (): TransportadorMaterial => ({
  material: '',
  densidadAparante_tm3: 1.5,
  tamanoMaxParticula_mm: 0,
  tamanoMedio_mm: 0,
  humedad: 'MOIST' as any,
  fluidez: 'media',
  abrasividad: 'MODERATE' as any,
});

const createEmptyCapacidad = (): TransportadorCapacidad => ({
  capacidadNominal_th: 0,
  capacidadMaxima_th: 0,
  factorLlenado_pct: 75,
  regimenOperacion: 'CONTINUO' as any,
});

const createEmptyCorrea = (): TransportadorCorrea => ({
  tipo: 'EP',
  resistenciaNominal_kNm: 0,
  numTelasCables: 0,
  tipoCubiertaSuperior: 'DIN_X',
  tipoCubiertaInferior: 'DIN_X',
  espesorCubiertaSup_mm: 0,
  espesorCubiertaInf_mm: 0,
  tipoEmpalme: 'Vulcanized' as any,
  longitudEmpalme_mm: 0,
});

const createEmptyPolines = (): TransportadorPolines => ({
  polinesCarga: [],
  polinesRetorno: [],
});

const createEmptyZonaCarga = (): TransportadorZonaCarga => ({
  numZonasCarga: 0,
  zonas: [],
});

const createEmptyLimpieza = (): TransportadorLimpieza => ({
  limpiezaPrimaria: false,
  limpiezaSecundaria: false,
  problemas: {
    carryback: 'LEVEL_I' as any,
    derrames: 'NONE' as any,
    acumulacionRetorno: 'NONE' as any,
  },
});

const createEmptyTambores = (): TransportadorTambores => ({
  tambores: [],
});

const createEmptyAccionamiento = (): TransportadorAccionamiento => ({
  potenciaInstalada_kW: 0,
  numMotores: 1,
  tipoArranque: 'DIRECT_ON_LINE' as any,
  reductor: '',
  backstop: false,
  freno: false,
});

const createEmptyTakeUp = (): TransportadorTakeUp => ({
  takeUp: {
    tipoTakeUp: 'SCREW_TAKEUP' as any,
    ubicacionTakeUp: 'TAIL' as any,
    carreraDisponible_m: 1.5,
  },
});

const createEmptyCurvas = (): TransportadorCurvas => ({
  curvasHorizontales: false,
  radioHorizontal_m: 0,
  curvasVerticales: false,
  radioVertical_m: 0,
});

// Calculate section completeness
const getSectionCompleteness = (data: any, sectionId: string): number => {
  const sectionFields: Record<string, string[]> = {
    identity: ['cliente', 'faena', 'codigoTransportador', 'nombreDescriptivo', 'usuario'],
    geometria: ['longitudTotal_m', 'anchoBanda_mm', 'velocidadNominal_ms'],
    material: ['material', 'densidadAparante_tm3'],
    capacidad: ['capacidadNominal_th'],
    correa: ['tipo', 'resistenciaNominal_kNm'],
    polines: ['polinesCarga', 'polinesRetorno'],
    zonaCarga: ['numZonasCarga'],
    limpieza: ['limpiezaPrimaria', 'limpiezaSecundaria'],
    tambores: ['tambores'],
    accionamiento: ['potenciaInstalada_kW', 'numMotores'],
    takeUp: ['takeUp'],
    curvas: ['curvasHorizontales', 'curvasVerticales'],
  };

  const fields = sectionFields[sectionId] || [];
  if (!data || fields.length === 0) return 0;

  const filled = fields.filter(f => {
    const value = (data as any)[f];
    return value !== undefined && value !== null && value !== '' && value !== 0 && 
      (!Array.isArray(value) || value.length > 0);
  }).length;

  return Math.round((filled / fields.length) * 100);
};

const TransportadorForm: React.FC<TransportadorFormProps> = ({
  transportador,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState('identity');
  const [identity, setIdentity] = useState<TransportadorIdentity>(
    transportador?.identity || createEmptyIdentity()
  );
  const [geometria, setGeometria] = useState<TransportadorGeometria>(
    transportador?.geometria || createEmptyGeometria()
  );
  const [material, setMaterial] = useState<TransportadorMaterial>(
    transportador?.material || createEmptyMaterial()
  );
  const [capacidad, setCapacidad] = useState<TransportadorCapacidad>(
    transportador?.capacidad || createEmptyCapacidad()
  );
  const [correa, setCorrea] = useState<TransportadorCorrea>(
    transportador?.correa || createEmptyCorrea()
  );
  const [polines, setPolines] = useState<TransportadorPolines>(
    transportador?.polines || createEmptyPolines()
  );
  const [zonaCarga, setZonaCarga] = useState<TransportadorZonaCarga>(
    transportador?.zonaCarga || createEmptyZonaCarga()
  );
  const [limpieza, setLimpieza] = useState<TransportadorLimpieza>(
    transportador?.limpieza || createEmptyLimpieza()
  );
  const [tambores, setTambores] = useState<TransportadorTambores>(
    transportador?.tambores || createEmptyTambores()
  );
  const [accionamiento, setAccionamiento] = useState<TransportadorAccionamiento>(
    transportador?.accionamiento || createEmptyAccionamiento()
  );
  const [takeUp, setTakeUp] = useState<TransportadorTakeUp>(
    transportador?.takeUp || createEmptyTakeUp()
  );
  const [curvas, setCurvas] = useState<TransportadorCurvas>(
    transportador?.curvas || createEmptyCurvas()
  );
  const [saving, setSaving] = useState(false);

  // Calculate overall completeness
  const completeness = useMemo(() => {
    const sections = [
      { id: 'identity', data: identity },
      { id: 'geometria', data: geometria },
      { id: 'material', data: material },
      { id: 'capacidad', data: capacidad },
      { id: 'correa', data: correa },
      { id: 'polines', data: polines },
      { id: 'zonaCarga', data: zonaCarga },
      { id: 'limpieza', data: limpieza },
      { id: 'tambores', data: tambores },
      { id: 'accionamiento', data: accionamiento },
      { id: 'takeUp', data: takeUp },
      { id: 'curvas', data: curvas },
    ];

    const total = sections.reduce((acc, s) => acc + getSectionCompleteness(s.data, s.id), 0);
    return Math.round(total / sections.length);
  }, [identity, geometria, material, capacidad, correa, polines, zonaCarga, limpieza, tambores, accionamiento, takeUp, curvas]);

  // Calculate section completeness for tabs
  const sectionCompleteness = useMemo(() => ({
    identity: getSectionCompleteness(identity, 'identity'),
    geometria: getSectionCompleteness(geometria, 'geometria'),
    material: getSectionCompleteness(material, 'material'),
    capacidad: getSectionCompleteness(capacidad, 'capacidad'),
    correa: getSectionCompleteness(correa, 'correa'),
    polines: getSectionCompleteness(polines, 'polines'),
    zonaCarga: getSectionCompleteness(zonaCarga, 'zonaCarga'),
    limpieza: getSectionCompleteness(limpieza, 'limpieza'),
    tambores: getSectionCompleteness(tambores, 'tambores'),
    accionamiento: getSectionCompleteness(accionamiento, 'accionamiento'),
    takeUp: getSectionCompleteness(takeUp, 'takeUp'),
    curvas: getSectionCompleteness(curvas, 'curvas'),
  }), [identity, geometria, material, capacidad, correa, polines, zonaCarga, limpieza, tambores, accionamiento, takeUp, curvas]);

  const handleSave = async () => {
    // Basic validation for identity
    if (!identity.cliente || !identity.faena || !identity.codigoTransportador || !identity.nombreDescriptivo || !identity.usuario) {
      alert('Por favor completa los campos obligatorios de identificación');
      setActiveTab('identity');
      return;
    }

    setSaving(true);
    try {
      const newTransportador: Transportador = {
        id: transportador?.id || crypto.randomUUID(),
        identity,
        geometria,
        material,
        capacidad,
        correa,
        polines,
        zonaCarga,
        limpieza,
        tambores,
        accionamiento,
        takeUp,
        curvas,
        estado: transportador?.estado || 'borrador',
        createdAt: transportador?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: transportador?.version ? transportador.version + 1 : 1,
      };
      await onSave(newTransportador);
    } catch (err: any) {
      console.error('Failed to save transportador:', err);
      alert(err.message || 'Error al guardar el transportador');
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'identity':
        return <TransportadorIdentityForm identity={identity} onChange={setIdentity} />;
      case 'geometria':
        return <TransportadorGeometriaForm geometria={geometria} onChange={setGeometria} />;
      case 'material':
        return <TransportadorMaterialForm material={material} onChange={setMaterial} />;
      case 'capacidad':
        return <TransportadorCapacidadForm capacidad={capacidad} onChange={setCapacidad} />;
      case 'correa':
        return <TransportadorCorreaForm correa={correa} onChange={setCorrea} />;
      case 'polines':
        return <TransportadorPolinesForm polines={polines} onChange={setPolines} />;
      case 'zonaCarga':
        return <TransportadorZonaCargaForm zonaCarga={zonaCarga} onChange={setZonaCarga} />;
      case 'limpieza':
        return <TransportadorLimpiezaForm limpieza={limpieza} onChange={setLimpieza} />;
      case 'tambores':
        return <TransportadorTamboresForm tambores={tambores} onChange={setTambores} />;
      case 'accionamiento':
        return <TransportadorAccionamientoForm accionamiento={accionamiento} onChange={setAccionamiento} />;
      case 'takeUp':
        return <TransportadorTakeUpForm takeUp={takeUp} onChange={setTakeUp} />;
      case 'curvas':
        return <TransportadorCurvasForm curvas={curvas} onChange={setCurvas} />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleNextTab = () => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
    if (currentIndex < SECTIONS.length - 1) {
      setActiveTab(SECTIONS[currentIndex + 1].id);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(SECTIONS[currentIndex - 1].id);
    }
  };

  const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="soft-card p-6 mb-6 border-l-4 border-l-[#5e72e4]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
              {transportador ? 'Editar Transportador' : 'Nuevo Transportador'}
            </h3>
            <p className="text-slate-400 text-[10px] font-semibold mt-1">
              Complete la información del transportador paso a paso
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-black text-[#32325d]">{completeness}%</span>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">Completado</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={completeness === 100 ? '#2dce89' : completeness >= 50 ? '#fb6340' : '#f5365c'}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${completeness * 1.76} 176`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="soft-card p-4 mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleTabClick(section.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.1em] transition-all whitespace-nowrap ${
                activeTab === section.id
                  ? 'bg-[#5e72e4] text-white shadow-lg'
                  : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
              }`}
            >
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
              <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center ${
                sectionCompleteness[section.id as keyof typeof sectionCompleteness] === 100
                  ? 'bg-green-500 text-white'
                  : sectionCompleteness[section.id as keyof typeof sectionCompleteness] >= 50
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-400 text-white'
              }`}>
                {sectionCompleteness[section.id as keyof typeof sectionCompleteness]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="soft-card p-6 animate-in fade-in duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#32325d] flex items-center gap-2">
            <span className="text-lg">{SECTIONS.find(s => s.id === activeTab)?.icon}</span>
            {SECTIONS.find(s => s.id === activeTab)?.label}
          </h4>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} de {SECTIONS.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-[#5e72e4] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / SECTIONS.length) * 100}%` }}
          ></div>
        </div>

        {renderTabContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handlePrevTab}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
              currentIndex === 0
                ? 'bg-gray-100 text-slate-300 cursor-not-allowed'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            {currentIndex < SECTIONS.length - 1 ? (
              <button
                onClick={handleNextTab}
                className="px-6 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[#2dce89] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Transportador
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorForm;
