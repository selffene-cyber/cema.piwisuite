
import React from 'react';
import { TransportadorZonaCarga, ZonaCarga, TipoCamaImpacto, TipoDescarga, LargoZonaImpactoUnidad } from '../types';

interface TransportadorZonaCargaFormProps {
  zonaCarga: TransportadorZonaCarga;
  onChange: (zonaCarga: TransportadorZonaCarga) => void;
  materialTamanoMaxParticula_mm?: number;
}

const TIPO_CAMA_IMPACTO_OPCIONES = Object.values(TipoCamaImpacto);
const TIPO_DESCARGA_OPCIONES = ['CENTRAL', 'DESVIADA', 'CASCADA'];
const LARGO_ZONA_IMPACTO_UNIDADES = Object.values(LargoZonaImpactoUnidad);

const createEmptyZonaCarga = (tamanoLumpMax_mm?: number): ZonaCarga => ({
  alturaCaidaDiseno_m: 1.0,
  alturaCaidaReal_m: 1.0,
  tipoDescarga: 'CENTRAL' as TipoDescarga,
  tamanoLumpMax_mm: tamanoLumpMax_mm || 0,
  camaImpacto: false,
  largoZonaImpacto: 0,
  largoZonaImpactoUnidad: LargoZonaImpactoUnidad.MM,
  numPolinesImpacto: 0,
  largoCamaDeslizante: 0,
  numEstaciones: 0,
  marcaFabricante: '',
});

const TransportadorZonaCargaForm: React.FC<TransportadorZonaCargaFormProps> = ({
  zonaCarga,
  onChange,
  materialTamanoMaxParticula_mm,
}) => {
  const handleChange = (field: keyof TransportadorZonaCarga, value: any) => {
    onChange({
      ...zonaCarga,
      zonas: zonaCarga.zonas || [],  // Asegurar que zonas exista
      [field]: value,
    });
  };

  const agregarZona = () => {
    const nuevas = [...(zonaCarga.zonas || []), createEmptyZonaCarga(materialTamanoMaxParticula_mm)];
    onChange({
      ...zonaCarga,
      zonas: nuevas,
      numZonasCarga: nuevas.length,
    });
  };

  const actualizarZona = (index: number, field: keyof ZonaCarga, value: any) => {
    const nuevas = [...(zonaCarga.zonas || [])];
    nuevas[index] = { ...nuevas[index], [field]: value };
    handleChange('zonas', nuevas);
  };

  const eliminarZona = (index: number) => {
    const nuevas = zonaCarga.zonas?.filter((_, i) => i !== index) || [];
    onChange({
      ...zonaCarga,
      zonas: nuevas,
      numZonasCarga: nuevas.length,
    });
  };

  // Helper to check if tipoCamaImpacto is not NO_IMPACT_PROTECTION
  const showMarcaFabricante = (tipo?: TipoCamaImpacto) => {
    return tipo && tipo !== TipoCamaImpacto.NO_IMPACT_PROTECTION;
  };

  // Helper to get display name for enum values
  const getDisplayName = (value: string) => {
    return value.split(' - ')[0].replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#5e72e4]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          7. Zona de Carga del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Configuración de zonas de carga y caída de material
        </p>
      </div>

      {/* 7.1 Geometría de Carga */}
      <div className="soft-card p-4 border-l-4 border-l-[#825ee4]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">
            Zonas de Carga
          </h4>
          <button
            type="button"
            onClick={agregarZona}
            className="px-3 py-1 bg-[#825ee4] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#7c5bd6] transition-colors"
          >
            + Agregar Zona
          </button>
        </div>

        {(zonaCarga.zonas || []).length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-slate-400 text-xs font-semibold">
              No hay zonas de carga configuradas. Agregue una para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(zonaCarga.zonas || []).map((zona, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Zona de Carga #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarZona(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Altura de Caída Diseño */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Altura Caída Diseño (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={zona.alturaCaidaDiseno_m}
                      onChange={(e) => actualizarZona(index, 'alturaCaidaDiseno_m', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                    />
                  </div>

                  {/* Altura de Caída Real */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Altura Caída Real (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={zona.alturaCaidaReal_m}
                      onChange={(e) => actualizarZona(index, 'alturaCaidaReal_m', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                    />
                  </div>

                  {/* Tipo de Descarga */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Tipo Descarga
                    </label>
                    <select
                      value={zona.tipoDescarga}
                      onChange={(e) => actualizarZona(index, 'tipoDescarga', e.target.value as TipoDescarga)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none cursor-pointer"
                    >
                      {TIPO_DESCARGA_OPCIONES.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tamaño Lump Max */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Lump Max (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={zona.tamanoLumpMax_mm}
                      onChange={(e) => actualizarZona(index, 'tamanoLumpMax_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cama de Impacto */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Sistema de Impacto
                    </label>
                    <div className="flex items-center gap-4 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`cama-impacto-${index}`}
                          checked={zona.camaImpacto === true}
                          onChange={() => actualizarZona(index, 'camaImpacto', true)}
                          className="w-4 h-4 text-[#825ee4] focus:ring-[#825ee4]"
                        />
                        <span className="text-xs font-semibold text-[#32325d]">Sí</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`cama-impacto-${index}`}
                          checked={zona.camaImpacto === false}
                          onChange={() => actualizarZona(index, 'camaImpacto', false)}
                          className="w-4 h-4 text-[#825ee4] focus:ring-[#825ee4]"
                        />
                        <span className="text-xs font-semibold text-[#32325d]">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Tipo de Cama de Impacto */}
                  {zona.camaImpacto && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Tipo Cama Impacto
                      </label>
                      <select
                        value={zona.tipoCamaImpacto || ''}
                        onChange={(e) => actualizarZona(index, 'tipoCamaImpacto', e.target.value as TipoCamaImpacto)}
                        className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none cursor-pointer"
                      >
                        <option value="">Seleccionar...</option>
                        {TIPO_CAMA_IMPACTO_OPCIONES.map(tipo => (
                          <option key={tipo} value={tipo}>{getDisplayName(tipo)}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Campos dinámicos de Cama de Impacto */}
                {zona.camaImpacto && zona.tipoCamaImpacto && (
                  <>
                    {/* Largo Zona de Impacto con unidad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Largo Zona de Impacto
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={zona.largoZonaImpacto !== undefined ? zona.largoZonaImpacto : ''}
                            onChange={(e) => actualizarZona(index, 'largoZonaImpacto', e.target.value === '' ? undefined : parseFloat(e.target.value) ?? 0)}
                            className="flex-1 px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                          />
                          <select
                            value={zona.largoZonaImpactoUnidad || 'mm'}
                            onChange={(e) => actualizarZona(index, 'largoZonaImpactoUnidad', e.target.value as LargoZonaImpactoUnidad)}
                            className="w-24 px-2 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none cursor-pointer"
                          >
                            {LARGO_ZONA_IMPACTO_UNIDADES.map(unidad => (
                              <option key={unidad} value={unidad}>{unidad}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Campos dinámicos según tipo de cama de impacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Número de Polines de Impacto - solo para IMPACT_IDLER_SET */}
                      {zona.tipoCamaImpacto === TipoCamaImpacto.IMPACT_IDLER_SET && (
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Número de Polines de Impacto
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={zona.numPolinesImpacto !== undefined ? zona.numPolinesImpacto : ''}
                            onChange={(e) => actualizarZona(index, 'numPolinesImpacto', e.target.value === '' ? undefined : parseFloat(e.target.value) ?? 0)}
                            className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                          />
                        </div>
                      )}

                      {/* Largo Cama Deslizante - solo para SLIDER_BED */}
                      {zona.tipoCamaImpacto === TipoCamaImpacto.SLIDER_BED && (
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Largo Cama Deslizante (mm)
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={zona.largoCamaDeslizante || 0}
                            onChange={(e) => actualizarZona(index, 'largoCamaDeslizante', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                          />
                        </div>
                      )}

                      {/* Número de Estaciones - solo para IMPACT_CRADLE o IMPACT_CRADLE_WITH_CENTER_ROLL */}
                      {(zona.tipoCamaImpacto === TipoCamaImpacto.IMPACT_CRADLE || zona.tipoCamaImpacto === TipoCamaImpacto.IMPACT_CRADLE_WITH_CENTER_ROLL) && (
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Número de Estaciones
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={zona.numEstaciones || 0}
                            onChange={(e) => actualizarZona(index, 'numEstaciones', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                          />
                        </div>
                      )}

                      {/* Marca / Fabricante - para todos excepto NO_IMPACT_PROTECTION */}
                      {showMarcaFabricante(zona.tipoCamaImpacto) && (
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Marca / Fabricante
                          </label>
                          <input
                            type="text"
                            value={zona.marcaFabricante || ''}
                            onChange={(e) => actualizarZona(index, 'marcaFabricante', e.target.value)}
                            placeholder="Ingrese marca o fabricante"
                            className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#825ee4] outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportadorZonaCargaForm;
