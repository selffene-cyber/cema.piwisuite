
import React, { useState } from 'react';
import { Evaluation } from '../types';

interface FilterState {
  clientName: string;
  severityClass: string;
  dateFrom: string;
  dateTo: string;
  beltWidth: string;
}

interface DashboardProps {
  evaluations: Evaluation[];
  onNewEvaluation: () => void;
  activeModule: string;
  loading?: boolean;
  filters?: FilterState;
  onFilterChange?: (key: keyof FilterState, value: string) => void;
  onClearFilters?: () => void;
  onViewEvaluation?: (id: string) => void;
  onDeleteEvaluation?: (id: string) => void;
  onDownloadPDF?: (id: string) => void;
  onRefresh?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  evaluations, 
  onNewEvaluation, 
  activeModule, 
  loading,
  filters,
  onFilterChange,
  onClearFilters,
  onViewEvaluation,
  onDeleteEvaluation,
  onDownloadPDF,
  onRefresh
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Get unique belt widths for filter dropdown
  const uniqueBeltWidths = [...new Set(evaluations.map(e => e.beltWidthValue))].sort((a: number, b: number) => a - b);

  // Count active filters
  const activeFilterCount = filters ? Object.values(filters).filter(v => v !== '').length : 0;

  const hasFilters = filters && onFilterChange && onClearFilters;

  const handleDeleteClick = (id: string) => {
    setEvaluationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!evaluationToDelete || !onDeleteEvaluation) return;
    
    try {
      setDeleting(true);
      await onDeleteEvaluation(evaluationToDelete);
      setShowDeleteModal(false);
      setEvaluationToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete evaluation:', err);
      alert(err.message || 'Error al eliminar la evaluación');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="soft-card p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-[#5e72e4]">
        <div>
          <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">Gestión CEMA 576</h3>
          <p className="text-slate-400 text-[11px] font-semibold mt-1.5">Repositorio de evaluaciones de severidad técnica.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {hasFilters && (
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
          )}
          {/* View Toggle + Nuevo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                  viewMode === 'card'
                    ? 'bg-white text-[#5e72e4] shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Vista de tarjetas"
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
                title="Vista de lista"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
            <button
              onClick={onNewEvaluation}
              className="px-5 py-3.5 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all hover:bg-[#435ad8]"
            >
              + Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {hasFilters && showFilters && (
        <div className="soft-card p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">Filtros de Búsqueda</h4>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-[10px] font-bold text-[#f5365c] hover:text-[#e02a45] uppercase tracking-wider"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Client Name Search */}
            <div className="relative">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cliente / Instalación</label>
              <input
                type="text"
                value={filters.clientName}
                onChange={(e) => onFilterChange('clientName', e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Severity Class Filter */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Clase Severidad</label>
              <select
                value={filters.severityClass}
                onChange={(e) => onFilterChange('severityClass', e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Todas las clases</option>
                <option value="1">Clase 1 (Menor)</option>
                <option value="2">Clase 2</option>
                <option value="3">Clase 3 (Moderada)</option>
                <option value="4">Clase 4</option>
                <option value="5">Clase 5 (Crítica)</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Desde Fecha</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hasta Fecha</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Belt Width Filter */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ancho Correa</label>
              <select
                value={filters.beltWidth}
                onChange={(e) => onFilterChange('beltWidth', e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="">Todos los anchos</option>
                {uniqueBeltWidths.map((width) => (
                  <option key={width} value={String(width)}>{width} pulgadas</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {hasFilters && activeFilterCount > 0 && (
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Mostrando {evaluations.length} de {evaluations.length} resultados
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
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Cargando evaluaciones...</p>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="col-span-full text-center py-24 soft-card">
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                {hasFilters && activeFilterCount > 0 ? 'No se encontraron evaluaciones con los filtros seleccionados' : 'Bandeja de entrada vacía'}
              </p>
            </div>
          ) : (
            evaluations.map((evalItem) => (
              <div 
                key={evalItem.id} 
                className="soft-card p-6 lg:p-8 hover:border-blue-100 transition-all border-l-4 group relative"
                style={{ borderLeftColor: evalItem.severityClass > 3 ? '#f5365c' : '#2dce89' }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1 min-w-0 pr-4 cursor-pointer" onClick={() => onViewEvaluation?.(evalItem.id)}>
                    <h4 className="text-lg font-extrabold text-[#32325d] truncate tracking-tight mb-1">{evalItem.faena}</h4>
                    <div className="flex items-center space-x-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{evalItem.tag}</span>
                      <span className="opacity-30">•</span>
                      <span>{new Date(evalItem.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className={`text-2xl font-black px-5 py-2 rounded-2xl border-2 transition-colors ${
                      evalItem.severityClass > 3 
                      ? 'text-[#f5365c] border-[#f5365c]/10 bg-[#f5365c]/5' 
                      : 'text-[#2dce89] border-[#2dce89]/10 bg-[#2dce89]/5'
                    }`}>
                      C{evalItem.severityClass}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 mt-2 uppercase tracking-tighter">{evalItem.totalScore} Puntos</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50 text-[10px] font-bold">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Ancho & Velocidad</span>
                    <span className="text-[#32325d] font-extrabold">{evalItem.beltWidthValue} {evalItem.beltWidthUnit || 'in'} @ {evalItem.beltSpeedValue} {evalItem.beltSpeedUnit || 'fpm'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Tipo de Empalme</span>
                    <span className="text-[#32325d] font-extrabold truncate block">{evalItem.spliceType}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Condición Material</span>
                    <span className="text-[#32325d] font-extrabold truncate block">{evalItem.abrasiveness}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Faena</span>
                    <span className="text-[#32325d] font-extrabold truncate block">{evalItem.faena}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 pt-4 text-[10px] font-bold">
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Tipo Correa</span>
                    <span className="text-[#32325d] font-extrabold">
                      {evalItem.tipo_correa_valor && `${evalItem.tipo_correa_valor} `}({evalItem.tipo_correa})
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Capacidad</span>
                    <span className="text-[#32325d] font-extrabold">{evalItem.capacidad_valor} {evalItem.capacidad}</span>
                  </div>
                </div>
                
                {/* Delete Button */}
                {onDeleteEvaluation && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(evalItem.id);
                      }}
                      className="p-2 text-slate-400 hover:text-[#f5365c] hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))
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
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Cargando evaluaciones...</p>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em]">
                {hasFilters && activeFilterCount > 0 ? 'No se encontraron evaluaciones con los filtros seleccionados' : 'Bandeja de entrada vacía'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Tag</th>
                    <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Clase</th>
                    <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Puntos</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Ancho</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Velocidad</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Empalme</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Material</th>
                    <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                    {onDeleteEvaluation && <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {evaluations.map((evalItem) => (
                    <tr 
                      key={evalItem.id} 
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() => onViewEvaluation?.(evalItem.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-extrabold text-[#32325d] truncate max-w-[150px] block">{evalItem.clientName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-slate-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{evalItem.tag}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[40px] px-3 py-1 rounded-xl text-sm font-black border-2 ${
                          evalItem.severityClass > 3 
                            ? 'text-[#f5365c] border-[#f5365c]/10 bg-[#f5365c]/5' 
                            : 'text-[#2dce89] border-[#2dce89]/10 bg-[#2dce89]/5'
                        }`}>
                          C{evalItem.severityClass}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-slate-600">{evalItem.totalScore}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#32325d]">{evalItem.beltWidthValue} {evalItem.beltWidthUnit || 'in'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#32325d]">{evalItem.beltSpeedValue} {evalItem.beltSpeedUnit || 'fpm'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#32325d] truncate max-w-[100px] block">{evalItem.spliceType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#32325d] truncate max-w-[100px] block">{evalItem.abrasiveness}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-slate-400">{new Date(evalItem.timestamp).toLocaleDateString()}</span>
                      </td>
                      {onDeleteEvaluation && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {onDownloadPDF && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onDownloadPDF(evalItem.id); }}
                                className="p-2 text-slate-400 hover:text-[#2dce89] hover:bg-green-50 rounded-lg transition-colors"
                                title="Descargar PDF"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(evalItem.id); }}
                              className="p-2 text-slate-400 hover:text-[#f5365c] hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
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
              <h3 className="text-xl font-black text-[#32325d] mb-2">¿Eliminar evaluación?</h3>
              <p className="text-slate-400 font-semibold text-sm mb-8">¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEvaluationToDelete(null);
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

export default Dashboard;
