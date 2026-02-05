
import React, { useState, useEffect, useMemo } from 'react';
import { Transportador, RegistroEstado } from '../types';

interface TransportadorDetailProps {
  transportadorId: string;
  transportadores: Transportador[];
  onBack: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateEstado?: (id: string, newEstado: RegistroEstado) => void;
}

// Utility function to calculate completeness percentage
const calculateCompleteness = (t: Transportador): number => {
  const sections = [
    { key: 'identity', fields: ['cliente', 'faena', 'codigoTransportador', 'nombreDescriptivo', 'tipoEquipo', 'usuario'] },
    { key: 'geometria', fields: ['longitudTotal_m', 'anchoBanda_mm', 'velocidadNominal_ms'] },
    { key: 'material', fields: ['material', 'densidadAparante_tm3'] },
    { key: 'capacidad', fields: ['capacidadNominal_th'] },
    { key: 'correa', fields: ['tipo', 'resistenciaNominal_kNm'] },
    { key: 'polines', fields: ['polinesCarga', 'polinesRetorno'] },
    { key: 'zonaCarga', fields: ['numZonasCarga', 'zonas'] },
    { key: 'limpieza', fields: ['raspadores', 'problemas'] },
    { key: 'tambores', fields: ['tambores'] },
    { key: 'accionamiento', fields: ['potenciaInstalada_kW', 'numMotores'] },
    { key: 'takeUp', fields: ['takeUp'] },
    { key: 'curvas', fields: ['curvasHorizontales', 'curvasVerticales'] },
  ];

  let totalFields = 0;
  let filledFields = 0;

  sections.forEach(section => {
    const sectionData = (t as any)[section.key];
    section.fields.forEach(field => {
      totalFields++;
      if (sectionData && (sectionData[field] !== undefined && sectionData[field] !== null && sectionData[field] !== '' && sectionData[field] !== 0 && (!Array.isArray(sectionData[field]) || sectionData[field].length > 0))) {
        filledFields++;
      }
    });
  });

  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
};

// Completeness by section
const getSectionCompleteness = (t: Transportador): Record<string, number> => {
  const sections: Record<string, { data: any; fields: string[] }> = {
    'Identidad': { data: t.identity, fields: ['cliente', 'faena', 'codigoTransportador', 'nombreDescriptivo', 'tipoEquipo', 'usuario', 'nivelConfianza'] },
    'Geometría': { data: t.geometria, fields: ['longitudTotal_m', 'elevacionTotal_m', 'anchoBanda_mm', 'velocidadNominal_ms', 'perfil'] },
    'Material': { data: t.material, fields: ['material', 'densidadAparante_tm3', 'tamanoMaxParticula_mm', 'humedad', 'abrasividad'] },
    'Capacidad': { data: t.capacidad, fields: ['capacidadNominal_th', 'capacidadMaxima_th', 'factorLlenado_pct', 'regimenOperacion'] },
    'Correa': { data: t.correa, fields: ['tipo', 'resistenciaNominal_kNm', 'tipoCubiertaSuperior', 'tipoCubiertaInferior'] },
    'Polines': { data: t.polines, fields: ['polinesCarga', 'polinesRetorno'] },
    'Zona de Carga': { data: t.zonaCarga, fields: ['numZonasCarga', 'zonas'] },
    'Limpieza': { data: t.limpieza, fields: ['raspadores', 'problemas'] },
    'Tambores': { data: t.tambores, fields: ['tambores'] },
    'Accionamiento': { data: t.accionamiento, fields: ['potenciaInstalada_kW', 'numMotores', 'tipoArranque', 'reductor'] },
    'Take-Up': { data: t.takeUp, fields: ['takeUp'] },
    'Curvas': { data: t.curvas, fields: ['curvasHorizontales', 'curvasVerticales', 'radioHorizontal_m', 'radioVertical_m'] },
  };

  const result: Record<string, number> = {};
  Object.entries(sections).forEach(([name, { data, fields }]) => {
    if (!data) {
      result[name] = 0;
      return;
    }
    let filled = 0;
    fields.forEach(field => {
      const value = (data as any)[field];
      if (value !== undefined && value !== null && value !== '' && value !== 0 && (!Array.isArray(value) || value.length > 0)) {
        filled++;
      }
    });
    result[name] = Math.round((filled / fields.length) * 100);
  });
  return result;
};

const ESTADO_COLORES: Record<RegistroEstado, { bg: string; text: string; border: string; icon: string }> = {
  borrador: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: '📝' },
  completo: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: '📋' },
  validado: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: '✅' },
  archivado: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: '📦' },
};

const ESTADO_LABELS: Record<RegistroEstado, string> = {
  borrador: 'Borrador',
  completo: 'Completo',
  validado: 'Validado',
  archivado: 'Archivado',
};

const TIPO_EQUIPO_LABELS: Record<string, string> = {
  TRANSPORTADOR_CONVENCIONAL: 'Transportador Convencional',
  ALIMENTADOR_BANDA: 'Alimentador de Banda',
  TRANSPORTADOR_REVERSIBLE: 'Transportador Reversible',
  TRANSPORTADOR_CURVO: 'Transportador Curvo',
  TRANSPORTADOR_INCLINADO_FUERTE: 'Transportador Inclinado',
  PIPE_TUBULAR: 'Pipe/ tubular',
};

// Labels for Fuente de Levantamiento
const FUENTE_LABELS: Record<string, string> = {
  levantamiento_campo: 'Levantamiento de Campo',
  datos_proyecto: 'Datos de Proyecto',
  revision_dibujo: 'Revisión de Dibujo',
  especificacion_tecnica: 'Especificación Técnica',
  otro: 'Otro',
};

// Labels for Tipo Polín de Carga
const TIPO_POLIN_CARGA_LABELS: Record<string, string> = {
  'TROUGHING_STANDARD': 'Polín de Carga Estándard',
  'IMPACT_IDLER': 'Polín de Impacto',
  'TRAINING_IDLER': 'Polín Autoalineante',
  'OFFSET_TROUGHING': 'Polín con Rodillos Desplazados',
  'EQUAL_TROUGHING': 'Polín con Rodillos Iguales',
  'PICKUP_IDLER': 'Polín Pickup',
  'TRANSITION_IDLER': 'Polín de Transición',
};

// Labels for Tipo Polín de Retorno
const TIPO_POLIN_RETORNO_LABELS: Record<string, string> = {
  'FLAT_RETURN': 'Retorno Plano',
  'V_RETURN': 'Retorno en V',
  'TRAINING_RETURN': 'Retorno Autoalineante',
  'RUBBER_DISK_RETURN': 'Retorno con Discos de Goma',
  'SPIRAL_RETURN': 'Retorno Espiralado',
  'IMPACT_RETURN': 'Retorno de Impacto',
};

// Labels for Zona de Instalación
const ZONA_INSTALACION_LABELS: Record<string, string> = {
  HEAD: 'Cabeza (Head)',
  TAIL: 'Cola (Tail)',
  RETURN: 'Retorno',
};

// Labels for Nivel Carryback
const CARRYBACK_LABELS: Record<string, string> = {
  LEVEL_I: 'Nivel I - Mínimo',
  LEVEL_II: 'Nivel II - Leve',
  LEVEL_III: 'Nivel III - Moderado',
  LEVEL_IV: 'Nivel IV - Severo',
};

// Labels for Nivel Derrames
const DERRAMES_LABELS: Record<string, string> = {
  'NONE': 'Ninguno',
  'LOW': 'Bajo',
  'MODERATE': 'Moderado',
  'HIGH': 'Alto',
  'SEVERE': 'Severo',
};

// Labels for Acumulación en Retorno
const ACUMULACION_RETORNO_LABELS: Record<string, string> = {
  'NONE': 'Ninguna',
  'LOW': 'Baja',
  'MODERATE': 'Moderada',
  'HIGH': 'Alta',
  'SEVERE': 'Severa',
};

// Labels for Tipo Tambor
const TIPO_TAMBOR_LABELS: Record<string, string> = {
  DRIVE: 'Motriz (Drive)',
  TAIL: 'Cola (Tail)',
  SNUB: 'Deflector (Snub)',
  BEND: 'Curva (Bend)',
  TAKEUP: 'Tensión (Take-up)',
  DEFLECTOR: 'Desviador (Deflector)',
};

// Labels for Tipo Descarga
const TIPO_DESCARGA_LABELS: Record<string, string> = {
  CENTRAL: 'Central',
  DESVIADA: 'Desviada',
  CASCADA: 'Cascada',
};

// Labels for Perfil
const PERFIL_LABELS: Record<string, string> = {
  HORIZONTAL: 'Horizontal',
  INCLINADO: 'Inclinado',
  MIXTO: 'Mixto',
};

// Labels for Régimen de Operación
const REGIMEN_LABELS: Record<string, string> = {
  CONTINUO: 'Continuo',
  INTERMITENTE: 'Intermitente',
  CAMPAÑA: 'Campaña',
};

// Helper to render polín de carga detail
const renderPolinCarga = (polin: any, index: number) => (
  <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-[#5e72e4] uppercase">Estación #{index + 1}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
      <div><span className="text-slate-400">Tipo:</span> <span className="text-[#32325d]">{TIPO_POLIN_CARGA_LABELS[polin.tipo?.split(' (')[0]] || polin.tipo || '-'}</span></div>
      <div><span className="text-slate-400">Clase CEMA:</span> <span className="text-[#32325d]">{polin.claseCEMA || '-'}</span></div>
      <div><span className="text-slate-400">Espaciado:</span> <span className="text-[#32325d]">{polin.espaciamiento_m ? `${polin.espaciamiento_m} m` : '-'}</span></div>
      <div><span className="text-slate-400">Diámetro:</span> <span className="text-[#32325d]">{polin.diametroRodillo_mm ? `${polin.diametroRodillo_mm} mm` : '-'}</span></div>
      <div><span className="text-slate-400">Ángulo:</span> <span className="text-[#32325d]">{polin.anguloArtesa ? `${polin.anguloArtesa}°` : '-'}</span></div>
      <div><span className="text-slate-400">Material:</span> <span className="text-[#32325d]">{polin.material || '-'}</span></div>
    </div>
  </div>
);

// Helper to render polín de retorno detail
const renderPolinRetorno = (polin: any, index: number) => (
  <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-[#5e72e4] uppercase">Estación #{index + 1}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
      <div><span className="text-slate-400">Tipo:</span> <span className="text-[#32325d]">{TIPO_POLIN_RETORNO_LABELS[polin.tipo?.split(' (')[0]] || polin.tipo || '-'}</span></div>
      <div><span className="text-slate-400">Espaciado:</span> <span className="text-[#32325d]">{polin.espaciamiento_m ? `${polin.espaciamiento_m} m` : '-'}</span></div>
      <div><span className="text-slate-400">Diámetro:</span> <span className="text-[#32325d]">{polin.diametroRodillo_mm ? `${polin.diametroRodillo_mm} mm` : '-'}</span></div>
    </div>
  </div>
);

// Helper to render zona de carga detail
const renderZonaCarga = (zona: any, index: number) => (
  <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-[#5e72e4] uppercase">Zona #{index + 1}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
      <div><span className="text-slate-400">Altura Caída Diseño:</span> <span className="text-[#32325d]">{zona.alturaCaidaDiseno_m ? `${zona.alturaCaidaDiseno_m} m` : '-'}</span></div>
      <div><span className="text-slate-400">Altura Caída Real:</span> <span className="text-[#32325d]">{zona.alturaCaidaReal_m ? `${zona.alturaCaidaReal_m} m` : '-'}</span></div>
      <div><span className="text-slate-400">Tipo Descarga:</span> <span className="text-[#32325d]">{TIPO_DESCARGA_LABELS[zona.tipoDescarga] || zona.tipoDescarga || '-'}</span></div>
      <div><span className="text-slate-400">Lump Max:</span> <span className="text-[#32325d]">{zona.tamanoLumpMax_mm ? `${zona.tamanoLumpMax_mm} mm` : '-'}</span></div>
      <div><span className="text-slate-400">Cama de Impacto:</span> <span className="text-[#32325d]">{zona.camaImpacto ? 'Sí' : 'No'}</span></div>
    </div>
    {zona.camaImpacto && (
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div><span className="text-slate-400">Tipo Cama:</span> <span className="text-[#32325d]">{zona.tipoCamaImpacto?.split(' - ')[0] || '-'}</span></div>
          {zona.tipoCamaImpacto && zona.tipoCamaImpacto.includes('IMPACT_IDLER_SET') && zona.numPolinesImpacto !== undefined && (
            <div><span className="text-slate-400">N° Polines Impacto:</span> <span className="text-[#32325d]">{zona.numPolinesImpacto}</span></div>
          )}
          {zona.tipoCamaImpacto && zona.tipoCamaImpacto.includes('SLIDER_BED') && zona.largoCamaDeslizante !== undefined && (
            <div><span className="text-slate-400">Largo Cama:</span> <span className="text-[#32325d]">{zona.largoCamaDeslizante} mm</span></div>
          )}
          {zona.tipoCamaImpacto && zona.tipoCamaImpacto.includes('IMPACT_CRADLE') && zona.numEstaciones !== undefined && (
            <div><span className="text-slate-400">N° Estaciones:</span> <span className="text-[#32325d]">{zona.numEstaciones}</span></div>
          )}
          {zona.largoZonaImpacto !== undefined && (
            <div><span className="text-slate-400">Largo Zona:</span> <span className="text-[#32325d]">{zona.largoZonaImpacto} {zona.largoZonaImpactoUnidad || ''}</span></div>
          )}
          {zona.marcaFabricante && (
            <div><span className="text-slate-400">Marca/Fabricante:</span> <span className="text-[#32325d]">{zona.marcaFabricante}</span></div>
          )}
        </div>
      </div>
    )}
  </div>
);

// Helper to render raspador detail
const renderRaspador = (raspador: any, index: number) => (
  <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-[#5e72e4] uppercase">{raspador.posicion || `Raspador #${index + 1}`}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
      <div><span className="text-slate-400">Tipo:</span> <span className="text-[#32325d]">{raspador.tipo || '-'}</span></div>
      <div><span className="text-slate-400">Zona Instalación:</span> <span className="text-[#32325d]">{ZONA_INSTALACION_LABELS[raspador.zonaInstalacion] || raspador.zonaInstalacion || '-'}</span></div>
      {raspador.marcaFabricante && (
        <div><span className="text-slate-400">Marca/Fabricante:</span> <span className="text-[#32325d]">{raspador.marcaFabricante}</span></div>
      )}
    </div>
  </div>
);

// Helper to render tambor detail
const renderTambor = (tambor: any, index: number) => (
  <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2 last:mb-0">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-bold text-[#5e72e4] uppercase">{TIPO_TAMBOR_LABELS[tambor.tipo] || tambor.tipo || `Tambor #${index + 1}`}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
      <div><span className="text-slate-400">Ubicación:</span> <span className="text-[#32325d]">{tambor.ubicacion || '-'}</span></div>
      <div><span className="text-slate-400">Diámetro:</span> <span className="text-[#32325d]">{tambor.diametro_mm ? `${tambor.diametro_mm} mm` : '-'}</span></div>
      <div><span className="text-slate-400">Ancho:</span> <span className="text-[#32325d]">{tambor.ancho_mm ? `${tambor.ancho_mm} mm` : '-'}</span></div>
      <div><span className="text-slate-400">Revestimiento:</span> <span className="text-[#32325d]">{tambor.revestimiento || '-'}</span></div>
      <div><span className="text-slate-400">Tipo Eje:</span> <span className="text-[#32325d]">{tambor.tipoEje || '-'}</span></div>
      {tambor.potencia_kW !== undefined && (
        <div><span className="text-slate-400">Potencia:</span> <span className="text-[#32325d]">{tambor.potencia_kW ? `${tambor.potencia_kW} kW` : '-'}</span></div>
      )}
    </div>
  </div>
);

const TransportadorDetail: React.FC<TransportadorDetailProps> = ({
  transportadorId,
  transportadores,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onUpdateEstado,
}) => {
  const [transportador, setTransportador] = useState<Transportador | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [wasDeleted, setWasDeleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Identidad': true,
    'Geometría': false,
    'Material': false,
    'Capacidad': false,
    'Correa': false,
    'Polines': false,
    'Zona de Carga': false,
    'Limpieza': false,
    'Tambores': false,
    'Accionamiento': false,
    'Take-Up': false,
    'Curvas': false,
  });

  useEffect(() => {
    const found = transportadores.find(t => t.id === transportadorId);
    setTransportador(found || null);
    setLoading(false);
  }, [transportadorId, transportadores]);

  const completeness = useMemo(() => {
    if (!transportador) return 0;
    return calculateCompleteness(transportador);
  }, [transportador]);

  const sectionCompleteness = useMemo(() => {
    if (!transportador) return {};
    return getSectionCompleteness(transportador);
  }, [transportador]);

  const handleExportJSON = () => {
    if (!transportador) return;
    const dataStr = JSON.stringify(transportador, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transportador_${transportador.identity.codigoTransportador || transportador.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!transportadorId) return;
    try {
      setDeleting(true);
      await onDelete(transportadorId);
      setWasDeleted(true);
      setShowDeleteModal(false);
      setTimeout(() => onBack(), 0);
    } catch (err: any) {
      console.error('Failed to delete transportador:', err);
      alert(err.message || 'Error al eliminar el transportador');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSection = (title: string, completeness: number, children: React.ReactNode) => (
    <div className="soft-card overflow-hidden animate-in fade-in duration-300">
      <button
        onClick={() => toggleSection(title)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#32325d]">{title}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            completeness === 100 ? 'bg-green-100 text-green-700' :
            completeness >= 50 ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {completeness}%
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections[title] ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expandedSections[title] && (
        <div className="px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  const renderField = (label: string, value: React.ReactNode) => (
    <div className="py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <p className="text-sm text-[#32325d] mt-1">{value || '-'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#5e72e4] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-6">Cargando transportador...</p>
      </div>
    );
  }

  if (!transportador) {
    return (
      <div className="soft-card p-10 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-[#32325d] mb-2">Transportador no encontrado</h2>
        <p className="text-slate-400 font-semibold text-sm mb-6">No se pudo encontrar el transportador solicitado.</p>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#435ad8] transition-all"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  if (wasDeleted) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="soft-card p-10 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#2dce89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#32325d] mb-2">Transportador eliminado</h2>
          <p className="text-slate-400 font-semibold text-sm mb-6">El transportador ha sido eliminado correctamente.</p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#435ad8] transition-all"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const estadoInfo = ESTADO_COLORES[transportador.estado];
  const identity = transportador.identity;
  const geometria = transportador.geometria;
  const material = transportador.material;
  const capacidad = transportador.capacidad;
  const correa = transportador.correa;
  const polines = transportador.polines;
  const zonaCarga = transportador.zonaCarga;
  const limpieza = transportador.limpieza;
  const tambores = transportador.tambores;
  const accionamiento = transportador.accionamiento;
  const takeUp = transportador.takeUp;
  const curvas = transportador.curvas;

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
      {/* Header Card */}
      <div className="soft-card p-6 lg:p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5e72e4]/5 to-transparent rounded-bl-full"></div>
        
        {/* Top Row: Back button and Status */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-[#5e72e4] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-semibold">Volver</span>
          </button>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${estadoInfo.bg} ${estadoInfo.text}`}>
            {estadoInfo.icon} {ESTADO_LABELS[transportador.estado]}
          </span>
          {onUpdateEstado && (
            <select
              value={transportador.estado}
              onChange={(e) => onUpdateEstado(transportador.id, e.target.value as RegistroEstado)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-slate-600 cursor-pointer hover:border-[#5e72e4] transition-colors"
            >
              <option value="borrador">Borrador</option>
              <option value="completo">Completo</option>
              <option value="validado">Validado</option>
              <option value="archivado">Archivado</option>
            </select>
          )}
        </div>

        {/* Main Info Row */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Left: Identity Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black text-[#5e72e4] uppercase tracking-wider bg-[#5e72e4]/10 px-2 py-1 rounded">
                {identity.codigoTransportador || 'SIN CÓDIGO'}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {TIPO_EQUIPO_LABELS[identity.tipoEquipo] || identity.tipoEquipo}
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#32325d] mb-2">{identity.nombreDescriptivo || 'Sin nombre'}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{identity.clienteNombre || identity.cliente || 'Sin cliente'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{identity.faena || 'Sin faena'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{identity.area || 'Sin área'}</span>
              </div>
            </div>
          </div>

          {/* Right: Completeness and Actions */}
          <div className="flex flex-col items-end gap-4">
            {/* Completeness Ring */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke={completeness === 100 ? '#2dce89' : completeness >= 50 ? '#fb6340' : '#f5365c'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${completeness * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#32325d]">{completeness}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Completo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => onEdit(transportador.id)}
            className="px-5 py-2.5 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:bg-[#435ad8] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => onDuplicate(transportador.id)}
            className="px-5 py-2.5 bg-white text-[#32325d] border border-gray-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Duplicar
          </button>
          <button
            onClick={handleExportJSON}
            className="px-5 py-2.5 bg-white text-[#32325d] border border-gray-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar JSON
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 bg-white text-[#f5365c] border border-red-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-red-50 transition-all flex items-center gap-2 ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Section 1: Identidad y Metadatos */}
        {renderSection('Identidad', sectionCompleteness['Identidad'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Código', identity.codigoTransportador)}</div>
            <div>{renderField('Nombre', identity.nombreDescriptivo)}</div>
            <div>{renderField('Cliente', identity.clienteNombre || identity.cliente)}</div>
            <div>{renderField('Faena', identity.faena)}</div>
            <div>{renderField('Área', identity.area)}</div>
            <div>{renderField('Tipo de Equipo', TIPO_EQUIPO_LABELS[identity.tipoEquipo])}</div>
            <div>{renderField('Fecha Levantamiento', identity.fechaLevantamiento)}</div>
            <div>{renderField('Usuario', identity.usuario)}</div>
            <div>{renderField('Nivel Confianza', `${identity.nivelConfianza}%`)}</div>
            <div>{renderField('Fuente', FUENTE_LABELS[identity.fuenteDato] || identity.fuenteDato)}</div>
            {identity.comentarios && <div className="md:col-span-2">{renderField('Comentarios', identity.comentarios)}</div>}
          </div>
        ))}

        {/* Section 2: Geometría */}
        {renderSection('Geometría', sectionCompleteness['Geometría'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Longitud Total', `${geometria?.longitudTotal_m || 0} m`)}</div>
            <div>{renderField('Elevación', `${geometria?.elevacionTotal_m || 0} m`)}</div>
            <div>{renderField('Inclinación', `${geometria?.inclinacionPromedio_grados || 0}°`)}</div>
            <div>{renderField('Ancho de Banda', `${geometria?.anchoBanda_mm || 0} ${geometria?.anchoUnidad || 'mm'}`)}</div>
            <div>{renderField('Velocidad', `${geometria?.velocidadNominal_ms || 0} m/s`)}</div>
            <div>{renderField('Perfil', PERFIL_LABELS[geometria?.perfil] || geometria?.perfil || '-')}</div>
          </div>
        ))}

        {/* Section 3: Material */}
        {renderSection('Material', sectionCompleteness['Material'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Material', material?.materialNombre || material?.material)}</div>
            <div>{renderField('Densidad Aparente', `${material?.densidadAparante_tm3 || 0} t/m³`)}</div>
            <div>{renderField('Tamaño Máximo', `${material?.tamanoMaxParticula_mm || 0} mm`)}</div>
            <div>{renderField('Tamaño Medio', `${material?.tamanoMedio_mm || 0} mm`)}</div>
            <div>{renderField('Humedad', material?.humedad || '-')}</div>
            <div>{renderField('Fluidez', material?.fluidez || '-')}</div>
            <div>{renderField('Abrasividad', material?.abrasividad || '-')}</div>
          </div>
        ))}

        {/* Section 4: Capacidad */}
        {renderSection('Capacidad', sectionCompleteness['Capacidad'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Capacidad Nominal', `${capacidad?.capacidadNominal_th || 0} t/h`)}</div>
            <div>{renderField('Capacidad Máxima', `${capacidad?.capacidadMaxima_th || 0} t/h`)}</div>
            <div>{renderField('Factor de Llenado', `${capacidad?.factorLlenado_pct || 0}%`)}</div>
            <div>{renderField('Régimen', REGIMEN_LABELS[capacidad?.regimenOperacion] || capacidad?.regimenOperacion || '-')}</div>
          </div>
        ))}

        {/* Section 5: Correa */}
        {renderSection('Correa', sectionCompleteness['Correa'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Tipo', correa?.tipo || '-')}</div>
            <div>{renderField('Resistencia Nominal', `${correa?.resistenciaNominal_kNm || 0} kN/m`)}</div>
            <div>{renderField('Telas/Cables', correa?.numTelasCables || '-')}</div>
            <div>{renderField('Cubierta Superior', correa?.tipoCubiertaSuperior?.split('(')[0] || '-')}</div>
            <div>{renderField('Cubierta Inferior', correa?.tipoCubiertaInferior?.split('(')[0] || '-')}</div>
            <div>{renderField('Espesor Sup.', `${correa?.espesorCubiertaSup_mm || 0} mm`)}</div>
            <div>{renderField('Espesor Inf.', `${correa?.espesorCubiertaInf_mm || 0} mm`)}</div>
            <div>{renderField('Tipo Empalme', correa?.tipoEmpalme || '-')}</div>
            <div>{renderField('Longitud Empalme', `${correa?.longitudEmpalme_mm || 0} mm`)}</div>
          </div>
        ))}

        {/* Section 6: Polines */}
        {renderSection('Polines', sectionCompleteness['Polines'] || 0, (
          <div className="space-y-4">
            <div>
              <div className="py-2 border-b border-gray-50 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Polines de Carga ({polines?.polinesCarga?.length || 0})</span>
              </div>
              {polines?.polinesCarga && polines.polinesCarga.length > 0 ? (
                polines.polinesCarga.map((polin, index) => renderPolinCarga(polin, index))
              ) : (
                <p className="text-sm text-slate-400 italic">No hay polines de carga configurados</p>
              )}
            </div>
            <div>
              <div className="py-2 border-b border-gray-50 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Polines de Retorno ({polines?.polinesRetorno?.length || 0})</span>
              </div>
              {polines?.polinesRetorno && polines.polinesRetorno.length > 0 ? (
                polines.polinesRetorno.map((polin, index) => renderPolinRetorno(polin, index))
              ) : (
                <p className="text-sm text-slate-400 italic">No hay polines de retorno configurados</p>
              )}
            </div>
          </div>
        ))}

        {/* Section 7: Zona de Carga */}
        {renderSection('Zona de Carga', sectionCompleteness['Zona de Carga'] || 0, (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderField('Número de Zonas', zonaCarga?.numZonasCarga || 0)}
              {renderField('Zonas Configuradas', zonaCarga?.zonas?.length || 0)}
            </div>
            <div>
              <div className="py-2 border-b border-gray-50 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detalle de Zonas</span>
              </div>
              {zonaCarga?.zonas && zonaCarga.zonas.length > 0 ? (
                zonaCarga.zonas.map((zona, index) => renderZonaCarga(zona, index))
              ) : (
                <p className="text-sm text-slate-400 italic">No hay zonas de carga configuradas</p>
              )}
            </div>
          </div>
        ))}

        {/* Section 8: Limpieza */}
        {renderSection('Limpieza', sectionCompleteness['Limpieza'] || 0, (
          <div className="space-y-4">
            <div>
              <div className="py-2 border-b border-gray-50 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Raspadores ({limpieza?.raspadores?.length || 0})</span>
              </div>
              {limpieza?.raspadores && limpieza.raspadores.length > 0 ? (
                limpieza.raspadores.map((raspador, index) => renderRaspador(raspador, index))
              ) : (
                <p className="text-sm text-slate-400 italic">No hay raspadores configurados</p>
              )}
            </div>
            <div>
              <div className="py-2 border-b border-gray-50 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Problemas Operacionales</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('Carryback', CARRYBACK_LABELS[limpieza?.problemas?.carryback] || limpieza?.problemas?.carryback || '-')}
                {renderField('Derrames', DERRAMES_LABELS[limpieza?.problemas?.derrames] || limpieza?.problemas?.derrames || '-')}
                {renderField('Acumulación en Retorno', ACUMULACION_RETORNO_LABELS[limpieza?.problemas?.acumulacionRetorno] || limpieza?.problemas?.acumulacionRetorno || '-')}
              </div>
            </div>
          </div>
        ))}

        {/* Section 9: Tambores */}
        {renderSection('Tambores', sectionCompleteness['Tambores'] || 0, (
          <div>
            <div className="py-2 border-b border-gray-50 mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tambores Configurados ({tambores?.tambores?.length || 0})</span>
            </div>
            {tambores?.tambores && tambores.tambores.length > 0 ? (
              tambores.tambores.map((tambor, index) => renderTambor(tambor, index))
            ) : (
              <p className="text-sm text-slate-400 italic">No hay tambores configurados</p>
            )}
          </div>
        ))}

        {/* Section 10: Accionamiento */}
        {renderSection('Accionamiento', sectionCompleteness['Accionamiento'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Potencia Instalada', `${accionamiento?.potenciaInstalada_kW || 0} kW`)}</div>
            <div>{renderField('Número de Motores', accionamiento?.numMotores || 0)}</div>
            <div>{renderField('Tipo Arranque', accionamiento?.tipoArranque?.split(' - ')[0] || '-')}</div>
            <div>{renderField('Reductor', accionamiento?.reductor || '-')}</div>
            <div>{renderField('Backstop', accionamiento?.backstop ? 'Sí' : 'No')}</div>
            <div>{renderField('Freno', accionamiento?.freno ? 'Sí' : 'No')}</div>
          </div>
        ))}

        {/* Section 11: Take-Up */}
        {renderSection('Take-Up', sectionCompleteness['Take-Up'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Tipo Take-Up', takeUp?.takeUp?.tipoTakeUp?.split(' - ')[0] || '-')}</div>
            <div>{renderField('Ubicación', takeUp?.takeUp?.ubicacionTakeUp || '-')}</div>
            <div>{renderField('Carrera Disponible', `${takeUp?.takeUp?.carreraDisponible_m || 0} m`)}</div>
          </div>
        ))}

        {/* Section 12: Curvas */}
        {renderSection('Curvas', sectionCompleteness['Curvas'] || 0, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>{renderField('Curvas Horizontales', curvas?.curvasHorizontales ? 'Sí' : 'No')}</div>
            <div>{renderField('Radio Horizontal', `${curvas?.radioHorizontal_m || 0} m`)}</div>
            <div>{renderField('Curvas Verticales', curvas?.curvasVerticales ? 'Sí' : 'No')}</div>
            <div>{renderField('Radio Vertical', `${curvas?.radioVertical_m || 0} m`)}</div>
          </div>
        ))}
      </div>

      {/* Metadata Footer */}
      <div className="soft-card p-4 mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>Versión: {transportador.version}</span>
          <span>Creado: {new Date(transportador.createdAt).toLocaleDateString()}</span>
          <span>Actualizado: {new Date(transportador.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Sistema Maestro de Transportadores CEMA</span>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="soft-card p-8 max-w-md mx-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#f5365c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-[#32325d] text-center mb-2">¿Eliminar Transportador?</h3>
            <p className="text-slate-400 font-semibold text-sm text-center mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar "{identity.nombreDescriptivo || identity.codigoTransportador}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-[#f5365c] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#e02e4f] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportadorDetail;
