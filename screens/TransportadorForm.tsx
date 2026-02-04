
import React, { useState, useMemo } from 'react';
import { Transportador, TransportadorIdentity, TransportadorGeometria, TransportadorMaterial, TransportadorCapacidad, TransportadorCorrea, TransportadorPolines, TransportadorZonaCarga, TransportadorLimpieza, TransportadorTambores, TransportadorAccionamiento, TransportadorTakeUp, TransportadorCurvas } from '../types';
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
  formData: {
    identity: TransportadorIdentity;
    geometria: TransportadorGeometria;
    material: TransportadorMaterial;
    capacidad: TransportadorCapacidad;
    correa: TransportadorCorrea;
    polines: TransportadorPolines;
    zonaCarga: TransportadorZonaCarga;
    limpieza: TransportadorLimpieza;
    tambores: TransportadorTambores;
    accionamiento: TransportadorAccionamiento;
    takeUp: TransportadorTakeUp;
    curvas: TransportadorCurvas;
  };
  onFormDataChange: (section: string, data: any) => void;
  onSave: () => void;
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
    limpieza: ['raspadores'],
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
  formData,
  onFormDataChange,
  onSave,
  onCancel,
}) => {
  console.log('[TransportadorForm] Rendering with formData:', formData?.identity?.codigoTransportador);
  console.log('[TransportadorForm] Material:', formData?.material?.material);
  
  const [activeTab, setActiveTab] = useState('identity');
  const [saving, setSaving] = useState(false);

  // Calculate overall completeness
  const completeness = useMemo(() => {
    const sections = [
      { id: 'identity', data: formData.identity },
      { id: 'geometria', data: formData.geometria },
      { id: 'material', data: formData.material },
      { id: 'capacidad', data: formData.capacidad },
      { id: 'correa', data: formData.correa },
      { id: 'polines', data: formData.polines },
      { id: 'zonaCarga', data: formData.zonaCarga },
      { id: 'limpieza', data: formData.limpieza },
      { id: 'tambores', data: formData.tambores },
      { id: 'accionamiento', data: formData.accionamiento },
      { id: 'takeUp', data: formData.takeUp },
      { id: 'curvas', data: formData.curvas },
    ];

    const total = sections.reduce((acc, s) => acc + getSectionCompleteness(s.data, s.id), 0);
    return Math.round(total / sections.length);
  }, [formData]);

  // Calculate section completeness for tabs
  const sectionCompleteness = useMemo(() => ({
    identity: getSectionCompleteness(formData.identity, 'identity'),
    geometria: getSectionCompleteness(formData.geometria, 'geometria'),
    material: getSectionCompleteness(formData.material, 'material'),
    capacidad: getSectionCompleteness(formData.capacidad, 'capacidad'),
    correa: getSectionCompleteness(formData.correa, 'correa'),
    polines: getSectionCompleteness(formData.polines, 'polines'),
    zonaCarga: getSectionCompleteness(formData.zonaCarga, 'zonaCarga'),
    limpieza: getSectionCompleteness(formData.limpieza, 'limpieza'),
    tambores: getSectionCompleteness(formData.tambores, 'tambores'),
    accionamiento: getSectionCompleteness(formData.accionamiento, 'accionamiento'),
    takeUp: getSectionCompleteness(formData.takeUp, 'takeUp'),
    curvas: getSectionCompleteness(formData.curvas, 'curvas'),
  }), [formData]);

  const handleSave = async () => {
    // Basic validation for identity
    if (!formData.identity.cliente || !formData.identity.faena || !formData.identity.codigoTransportador || !formData.identity.nombreDescriptivo || !formData.identity.usuario) {
      alert('Por favor completa los campos obligatorios de identificación');
      setActiveTab('identity');
      return;
    }

    setSaving(true);
    try {
      onSave();
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
        return <TransportadorIdentityForm key="identity" identity={formData.identity} onChange={(data) => onFormDataChange('identity', data)} />;
      case 'geometria':
        return <TransportadorGeometriaForm key="geometria" geometria={formData.geometria} onChange={(data) => onFormDataChange('geometria', data)} />;
      case 'material':
        return <TransportadorMaterialForm key="material" material={formData.material} onChange={(data) => onFormDataChange('material', data)} />;
      case 'capacidad':
        return <TransportadorCapacidadForm key="capacidad" capacidad={formData.capacidad} onChange={(data) => onFormDataChange('capacidad', data)} />;
      case 'correa':
        return <TransportadorCorreaForm key="correa" correa={formData.correa} onChange={(data) => onFormDataChange('correa', data)} />;
      case 'polines':
        return <TransportadorPolinesForm key="polines" polines={formData.polines} onChange={(data) => onFormDataChange('polines', data)} />;
      case 'zonaCarga':
        return <TransportadorZonaCargaForm key="zonaCarga" zonaCarga={formData.zonaCarga} onChange={(data) => onFormDataChange('zonaCarga', data)} />;
      case 'limpieza':
        return <TransportadorLimpiezaForm key="limpieza" limpieza={formData.limpieza} onChange={(data) => onFormDataChange('limpieza', data)} />;
      case 'tambores':
        return <TransportadorTamboresForm key="tambores" tambores={formData.tambores} onChange={(data) => onFormDataChange('tambores', data)} />;
      case 'accionamiento':
        return <TransportadorAccionamientoForm key="accionamiento" accionamiento={formData.accionamiento} onChange={(data) => onFormDataChange('accionamiento', data)} />;
      case 'takeUp':
        return <TransportadorTakeUpForm key="takeUp" takeUp={formData.takeUp} onChange={(data) => onFormDataChange('takeUp', data)} />;
      case 'curvas':
        return <TransportadorCurvasForm key="curvas" curvas={formData.curvas} onChange={(data) => onFormDataChange('curvas', data)} />;
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
      {/* Header with Back Button for Edit Mode */}
      <div className="soft-card p-4 mb-4 border-l-4 border-l-[#5e72e4]">
        {transportador && (
          <button
            onClick={onCancel}
            className="mb-2 flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors text-xs sm:text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
          </button>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
              {transportador ? 'Editar Transportador' : 'Nuevo Transportador'}
            </h3>
            <p className="text-slate-400 text-[10px] font-semibold mt-1">
              Complete la información del transportador paso a paso
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-[#32325d]">{completeness}%</span>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider hidden sm:block">Completado</p>
            </div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={completeness === 100 ? '#2dce89' : completeness >= 50 ? '#fb6340' : '#f5365c'}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${completeness * 1.25} 125`}
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
      <div className="soft-card p-4 sm:p-6 animate-in fade-in duration-300">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#32325d] flex items-center gap-2">
            <span className="text-lg">{SECTIONS.find(s => s.id === activeTab)?.icon}</span>
            <span className="truncate">{SECTIONS.find(s => s.id === activeTab)?.label}</span>
          </h4>
          <div className="flex items-center gap-2">
            {/* Quick Save Button in Header */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-slate-400 hover:text-[#5e72e4] transition-colors p-1.5 rounded-lg hover:bg-gray-100"
              title="Guardar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <span className="text-xs text-slate-400">
              {currentIndex + 1}/{SECTIONS.length}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-[#5e72e4] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / SECTIONS.length) * 100}%` }}
          ></div>
        </div>

        {renderTabContent()}

        {/* Navigation Buttons - Mobile Optimized */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 pt-4 border-t border-gray-100 px-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevTab}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center gap-1 sm:gap-2 min-w-[48px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-[10px] uppercase tracking-[0.1em] transition-all ${
              currentIndex === 0
                ? 'bg-gray-100 text-slate-300 cursor-not-allowed'
                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
            }`}
            title="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Cancel Button - Red */}
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center justify-center gap-1 min-w-[48px] px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500 text-white rounded-xl font-bold text-xs sm:text-[10px] uppercase tracking-[0.1em] hover:bg-red-600 transition-all disabled:opacity-50"
            title="Cancelar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Cancelar</span>
          </button>

          {/* Next or Save Button */}
          {currentIndex < SECTIONS.length - 1 ? (
            <button
              onClick={handleNextTab}
              className="flex items-center justify-center gap-1 sm:gap-2 min-w-[48px] px-3 sm:px-4 py-2.5 sm:py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-xs sm:text-[10px] uppercase tracking-[0.1em] shadow-lg hover:shadow-xl transition-all"
              title="Siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 min-w-[48px] px-4 sm:px-6 py-3 sm:py-4 bg-[#5e72e4] text-white rounded-xl font-bold text-xs sm:text-[10px] uppercase tracking-[0.1em] shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              title="Guardar Evaluación"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span className="hidden sm:inline">Guardar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportadorForm;
