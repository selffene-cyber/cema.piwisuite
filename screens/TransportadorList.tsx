
import React, { useState, useMemo } from 'react';
import { Transportador, ClienteIndustrial, RegistroEstado, TipoEquipo } from '../types';

interface TransportadorListProps {
  transportadores: Transportador[];
  onNewTransportador: () => void;
  onEditTransportador: (id: string) => void;
  onViewTransportador: (id: string) => void;
  onDuplicateTransportador: (id: string) => void;
  onDeleteTransportador: (id: string) => void;
  onUpdateEstado?: (id: string, newEstado: RegistroEstado) => void;
  onExportPDF?: (id: string) => void;
  loading?: boolean;
}

const ESTADO_COLORES: Record<RegistroEstado, { bg: string; text: string; border: string }> = {
  borrador: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  completo: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
  validado: { bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-200' },
  archivado: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' },
};

const ESTADO_LABELS: Record<RegistroEstado, string> = {
  borrador: 'Borrador',
  completo: 'Completo',
  validado: 'Validado',
  archivado: 'Archivado',
};

const TIPO_EQUIPO_LABELS: Record<string, string> = {
  TRANSPORTADOR_CONVENCIONAL: 'Convencional',
  ALIMENTADOR_BANDA: 'Alimentador',
  TRANSPORTADOR_REVERSIBLE: 'Reversible',
  TRANSPORTADOR_CURVO: 'Curvo',
  TRANSPORTADOR_INCLINADO_FUERTE: 'Inclinado',
  PIPE_TUBULAR: 'Pipe',
};

// Calculate completeness percentage for a transportador
const calculateCompleteness = (t: Transportador): number => {
  // Helper: Check if tramos arrays should be required based on perfil
  const shouldCheckTramos = (field: string) => {
    const perfil = t.geometria?.perfil;
    if (field === 'tramosInclinados' || field === 'tramosHorizontal') {
      return perfil === 'MIXTO' || perfil === 'INCLINADO';
    }
    return true;
  };

  // Helper: Check if field exists in the data structure (for changed structures like limpieza)
  const fieldExists = (sectionData: any, field: string): boolean => {
    if (!sectionData) return false;
    // For raspadores array in limpieza section
    if (field === 'raspadores' && sectionData.raspadores !== undefined) {
      return true;
    }
    // For problemas object in limpieza section
    if (field === 'problemas' && sectionData.problemas !== undefined) {
      return true;
    }
    // For standard field check
    return sectionData[field] !== undefined;
  };

  // Helper: Check if field is filled (handles arrays, objects, and scalar values)
  const isFieldFilled = (sectionData: any, field: string): boolean => {
    if (!sectionData) return false;

    // Handle raspadores array in limpieza section
    if (field === 'raspadores') {
      return Array.isArray(sectionData.raspadores) && sectionData.raspadores.length > 0;
    }

    // Handle problemas object in limpieza section
    if (field === 'problemas') {
      return sectionData.problemas !== undefined && sectionData.problemas !== null;
    }

    // Handle standard fields
    const value = sectionData[field];
    if (value === undefined || value === null || value === '') {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  };

  const sections = [
    { key: 'identity', fields: ['cliente', 'faena', 'codigoTransportador', 'nombreDescriptivo', 'tipoEquipo', 'usuario', 'area', 'fechaLevantamiento', 'fuenteDato', 'nivelConfianza'] },
    { key: 'geometria', fields: ['longitudTotal_m', 'anchoBanda_mm', 'velocidadNominal_ms', 'elevacionTotal_m', 'inclinacionPromedio_grados', 'perfil', 'tramosInclinados', 'tramosHorizontal'] },
    { key: 'material', fields: ['material', 'densidadAparante_tm3', 'tamanoMaxParticula_mm', 'tamanoMedio_mm', 'humedad', 'fluidez', 'abrasividad'] },
    { key: 'capacidad', fields: ['capacidadNominal_th', 'capacidadMaxima_th', 'factorLlenado_pct', 'regimenOperacion'] },
    { key: 'correa', fields: ['tipo', 'resistenciaNominal_kNm', 'numTelasCables', 'tipoCubiertaSuperior', 'tipoCubiertaInferior', 'espesorCubiertaSup_mm', 'espesorCubiertaInf_mm', 'tipoEmpalme'] },
    { key: 'polines', fields: ['polinesCarga', 'polinesRetorno'] },
    { key: 'zonaCarga', fields: ['numZonasCarga', 'zonas'] },
    { key: 'limpieza', fields: ['raspadores', 'problemas'] },
    { key: 'tambores', fields: ['tambores'] },
    { key: 'accionamiento', fields: ['potenciaInstalada_kW', 'numMotores', 'tipoArranque', 'reductor', 'backstop', 'freno'] },
    { key: 'takeUp', fields: ['takeUp'] },
    { key: 'curvas', fields: ['curvasHorizontales', 'curvasVerticales', 'radioHorizontal_m', 'radioVertical_m'] },
  ];

  let totalFields = 0;
  let filledFields = 0;
  const missingFields: { section: string; field: string }[] = [];

  sections.forEach(section => {
    const sectionData = (t as any)[section.key];
    section.fields.forEach(field => {
      // Skip tramos arrays for HORIZONTAL profile
      if (!shouldCheckTramos(field)) {
        return;
      }

      totalFields++;
      const isFilled = isFieldFilled(sectionData, field);
      if (isFilled) {
        filledFields++;
      } else {
        missingFields.push({ section: section.key, field });
      }
    });
  });

  // Debug logging for missing fields
  if (missingFields.length > 0) {
    console.log(`[Completeness] Transportador ${t.identity.codigoTransportador || 'unknown'}: ${filledFields}/${totalFields} fields (${Math.round((filledFields / totalFields) * 100)}%)`);
    console.log('[Completeness] Missing fields:', missingFields);
  }

  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
};

const TransportadorList: React.FC<TransportadorListProps> = ({
  transportadores,
  onNewTransportador,
  onEditTransportador,
  onViewTransportador,
  onDuplicateTransportador,
  onDeleteTransportador,
  onUpdateEstado,
  onExportPDF,
  loading = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transportadorToDelete, setTransportadorToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [filterCliente, setFilterCliente] = useState<ClienteIndustrial | ''>('');
  const [filterFaena, setFilterFaena] = useState('');
  const [filterEstado, setFilterEstado] = useState<RegistroEstado | ''>('');
  const [filterTipoEquipo, setFilterTipoEquipo] = useState('');

  // Get unique clients and faenas for filters
  const uniqueClientes = useMemo(() => {
    const clientes = new Set(transportadores.map(t => t.identity.cliente).filter(Boolean));
    return Array.from(clientes).sort();
  }, [transportadores]);

  const uniqueFaenas = useMemo(() => {
    const faenas = new Set(transportadores.map(t => t.identity.faena).filter(Boolean));
    return Array.from(faenas).sort();
  }, [transportadores]);

  // Filter transportadores
  const filteredTransportadores = useMemo(() => {
    return transportadores.filter((t) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesCode = t.identity.codigoTransportador?.toLowerCase().includes(query);
        const matchesName = t.identity.nombreDescriptivo?.toLowerCase().includes(query);
        const matchesFaena = t.identity.faena?.toLowerCase().includes(query);
        const matchesCliente = t.identity.cliente?.toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesFaena && !matchesCliente) return false;
      }
      if (filterCliente && t.identity.cliente !== filterCliente) return false;
      if (filterFaena && !t.identity.faena.toLowerCase().includes(filterFaena.toLowerCase())) return false;
      if (filterEstado && t.estado !== filterEstado) return false;
      if (filterTipoEquipo && t.identity.tipoEquipo !== filterTipoEquipo) return false;
      return true;
    });
  }, [transportadores, searchQuery, filterCliente, filterFaena, filterEstado, filterTipoEquipo]);

  const activeFilterCount = [filterCliente, filterFaena, filterEstado, filterTipoEquipo, searchQuery].filter(Boolean).length;

  const handleDeleteClick = (id: string) => {
    setTransportadorToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!transportadorToDelete) return;
    try {
      setDeleting(true);
      await onDeleteTransportador(transportadorToDelete);
      setShowDeleteModal(false);
      setTransportadorToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete transportador:', err);
      alert(err.message || 'Error al eliminar el transportador');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="soft-card p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-[#5e72e4]">
        <div>
          <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">Maestro de Transportadores</h3>
          <p className="text-slate-400 text-[11px] font-semibold mt-1.5">Gestión centralizada de transportadores CEMA.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#5e72e4] text-white shadow-lg'
                : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{activeFilterCount}</span>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                viewMode === 'card'
                  ? 'bg-white text-[#5e72e4] shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-white text-[#5e72e4] shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>

          {/* Nuevo Button */}
          <button
            onClick={onNewTransportador}
            className="px-5 py-3.5 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all hover:bg-[#435ad8]"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="soft-card p-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código, nombre, cliente o faena..."
            className="w-full pl-12 pr-4 py-3 text-sm font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="soft-card p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">Filtros de Búsqueda</h4>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilterCliente('');
                  setFilterFaena('');
                  setFilterEstado('');
                  setFilterTipoEquipo('');
                  setSearchQuery('');
                }}
                className="text-[10px] font-bold text-[#f5365c] hover:text-[#e02a45] uppercase tracking-wider"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cliente Filter */}
            <div className="relative">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cliente</label>
              <select
                value={filterCliente}
                onChange={(e) => setFilterCliente(e.target.value as ClienteIndustrial | '')}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Todos los clientes</option>
                {uniqueClientes.map((cliente) => (
                  <option key={cliente} value={cliente}>{cliente}</option>
                ))}
              </select>
            </div>

            {/* Faena Filter */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Faena</label>
              <input
                type="text"
                value={filterFaena}
                onChange={(e) => setFilterFaena(e.target.value)}
                placeholder="Buscar faena..."
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Estado Filter */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estado</label>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value as RegistroEstado | '')}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Todos los estados</option>
                {Object.entries(ESTADO_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Tipo Equipo Filter */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipo Equipo</label>
              <select
                value={filterTipoEquipo}
                onChange={(e) => setFilterTipoEquipo(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(TIPO_EQUIPO_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {activeFilterCount > 0 && (
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Mostrando {filteredTransportadores.length} de {transportadores.length} transportadores
        </div>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
          {loading ? (
            <div className="col-span-full text-center py-24 soft-card">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Cargando transportadores...</p>
            </div>
          ) : filteredTransportadores.length === 0 ? (
            <div className="col-span-full text-center py-24 soft-card">
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                {activeFilterCount > 0 ? 'No se encontraron transportadores con los filtros seleccionados' : 'No hay transportadores registrados'}
              </p>
              <button
                onClick={onNewTransportador}
                className="mt-4 px-6 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all"
              >
                Crear Primer Transportador
              </button>
            </div>
          ) : (
            filteredTransportadores.map((transportador) => {
              const estadoColors = ESTADO_COLORES[transportador.estado];
              const completeness = calculateCompleteness(transportador);
              return (
                <div
                  key={transportador.id}
                  className="soft-card p-6 lg:p-8 hover:border-blue-100 transition-all border-l-4 group relative"
                  style={{ borderLeftColor: '#5e72e4' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-lg font-extrabold text-[#32325d] truncate tracking-tight mb-1">
                        {transportador.identity.nombreDescriptivo}
                      </h4>
                      <div className="flex items-center space-x-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {transportador.identity.codigoTransportador}
                        </span>
                        <span className="opacity-30">•</span>
                        <span>{TIPO_EQUIPO_LABELS[transportador.identity.tipoEquipo] || transportador.identity.tipoEquipo}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${estadoColors.bg} ${estadoColors.text}`}>
                      {ESTADO_LABELS[transportador.estado]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Cliente</span>
                      <span className="text-[#32325d] font-extrabold truncate block text-xs">
                        {transportador.identity.clienteNombre || transportador.identity.cliente || '-'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Faena</span>
                      <span className="text-[#32325d] font-extrabold truncate block text-xs">
                        {transportador.identity.faena || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Completeness Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completitud</span>
                      <span className={`text-xs font-bold ${
                        completeness === 100 ? 'text-green-500' :
                        completeness >= 50 ? 'text-amber-500' :
                        'text-red-500'
                      }`}>
                        {completeness}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          completeness === 100 ? 'bg-green-500' :
                          completeness >= 50 ? 'bg-amber-500' :
                          'bg-red-400'
                        }`}
                        style={{ width: `${completeness}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                    <button
                      onClick={() => onViewTransportador(transportador.id)}
                      className="px-4 py-2 bg-[#5e72e4]/10 text-[#5e72e4] rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-[#5e72e4]/20 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => onEditTransportador(transportador.id)}
                      className="px-4 py-2 bg-gray-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => onDuplicateTransportador(transportador.id)}
                      className="px-4 py-2 bg-gray-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Duplicar
                    </button>
                    {/* Estado Action Buttons */}
                    {onUpdateEstado && (
                      <>
                        {transportador.estado === 'borrador' && (
                          <button
                            onClick={() => onUpdateEstado(transportador.id, 'completo')}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Completar
                          </button>
                        )}
                        {transportador.estado === 'completo' && (
                          <button
                            onClick={() => onUpdateEstado(transportador.id, 'validado')}
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-green-100 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Validar
                          </button>
                        )}
                        {transportador.estado === 'validado' && (
                          <button
                            onClick={() => onUpdateEstado(transportador.id, 'archivado')}
                            className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-amber-100 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Archivar
                          </button>
                        )}
                        {transportador.estado === 'archivado' && (
                          <button
                            onClick={() => onUpdateEstado(transportador.id, 'borrador')}
                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Abrir
                          </button>
                        )}
                      </>
                    )}
                    {onExportPDF && (
                      <button
                        onClick={() => onExportPDF(transportador.id)}
                        className="px-4 py-2 bg-gray-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar PDF
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(transportador.id)}
                      className="px-4 py-2 bg-gray-100 text-[#f5365c] rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] hover:bg-red-50 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] text-slate-400 flex justify-between">
                    <span>Actualizado: {new Date(transportador.updatedAt).toLocaleDateString()}</span>
                    <span>v{transportador.version}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="soft-card overflow-hidden">
          {loading ? (
            <div className="text-center py-24">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Cargando transportadores...</p>
            </div>
          ) : filteredTransportadores.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                {activeFilterCount > 0 ? 'No se encontraron transportadores' : 'No hay transportadores registrados'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Código</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Faena</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Completitud</th>
                    <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransportadores.map((transportador) => {
                    const estadoColors = ESTADO_COLORES[transportador.estado];
                    const completeness = calculateCompleteness(transportador);
                    return (
                      <tr
                        key={transportador.id}
                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                        onClick={() => onViewTransportador(transportador.id)}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-extrabold text-[#32325d]">{transportador.identity.codigoTransportador}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-[#32325d] truncate max-w-[150px] block">
                            {transportador.identity.nombreDescriptivo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px] block">
                            {transportador.identity.clienteNombre || transportador.identity.cliente || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-slate-600">{transportador.identity.faena}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-slate-600">
                            {TIPO_EQUIPO_LABELS[transportador.identity.tipoEquipo] || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${estadoColors.bg} ${estadoColors.text}`}>
                            {ESTADO_LABELS[transportador.estado]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-16">
                              <div
                                className={`h-full rounded-full ${
                                  completeness === 100 ? 'bg-green-500' :
                                  completeness >= 50 ? 'bg-amber-500' :
                                  'bg-red-400'
                                }`}
                                style={{ width: `${completeness}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-bold ${
                              completeness === 100 ? 'text-green-500' :
                              completeness >= 50 ? 'text-amber-500' :
                              'text-red-400'
                            }`}>{completeness}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); onViewTransportador(transportador.id); }}
                              className="p-2 text-slate-400 hover:text-[#5e72e4] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver Detalle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onEditTransportador(transportador.id); }}
                              className="p-2 text-slate-400 hover:text-[#2dce89] hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDuplicateTransportador(transportador.id); }}
                              className="p-2 text-slate-400 hover:text-[#fb6340] hover:bg-orange-50 rounded-lg transition-colors"
                              title="Duplicar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(transportador.id); }}
                              className="p-2 text-slate-400 hover:text-[#f5365c] hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="soft-card p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#f5365c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#32325d] mb-2">¿Eliminar transportador?</h3>
              <p className="text-slate-400 font-semibold text-sm mb-8">¿Estás seguro de que deseas eliminar este transportador? Esta acción no se puede deshacer.</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTransportadorToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-[#f5365c] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:bg-[#e02a45] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
        </div>
      )}
    </div>
  );
};

export default TransportadorList;
