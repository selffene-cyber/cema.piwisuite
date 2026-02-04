
import React, { useState } from 'react';
import { TransportadorLimpieza, ProblemasOperacionales, NivelCarryback, NivelDerrames, NivelAcumulacionRetorno, ZonaInstalacion, PosicionRaspador, Raspador } from '../types';

interface TransportadorLimpiezaFormProps {
  limpieza: TransportadorLimpieza;
  onChange: (limpieza: TransportadorLimpieza) => void;
}

const NIVEL_CARRYBACK_OPCIONES = ['LEVEL_I > 250 g/m² (Severo - Afecta operación)',
                                  'LEVEL_II 100 – 250 g/m² (Moderado - Requiere atención)', 
                                  'LEVEL_III 10 – 100 g/m² (Leve - Acumulación controlada) ', 
                                  'LEVEL_IV 2 – 10 g/m² (Mínimo - Sin acumulación significativa)'];
                                  'BETTER THAN LEVEL IV <2 g/m² (Insignificante)'
const NIVEL_DERRAMES_OPCIONES = ['NONE (No se observan derrames. Condición limpia y controlada)', 
                                'LOW (Derrames ocasionales y localizados. No afectan la operación)', 
                                'MODERATE (Derrames continuos en zonas específicas. Requieren limpieza rutinaria)', 
                                'HIGH (Derrames frecuentes y extendidos. Impactan mantenimiento y disponibilidad)', 
                                'SEVERE (Derrames masivos o constantes. Condición crítica según CEMA)'];
const NIVEL_ACUMULACION_OPCIONES = ['NONE (No hay acumulación visible. Retorno limpio)', 
                                    'LOW(Acumulación leve y localizada. No interfiere con la operación)', 
                                    'MODERATE (Acumulación continua en puntos definidos. Requiere limpieza periódica)', 
                                    'HIGH (Acumulación significativa. Afecta polines, estructura y acceso)', 
                                    'SEVERE (Acumulación crítica. Riesgo operativo y de seguridad)'];
const ZONA_INSTALACION_OPCIONES = Object.values(ZonaInstalacion);
const POSICION_RASPADOR_OPCIONES: PosicionRaspador[] = [
  PosicionRaspador.PRIMARIA,
  PosicionRaspador.SECUNDARIA,
  PosicionRaspador.TERCIARIA,
  PosicionRaspador.CUATERNARIA,
  PosicionRaspador.QUINTA,
  PosicionRaspador.SEXTA,
  PosicionRaspador.SEPTIMA,
  PosicionRaspador.OCTAVA,
  PosicionRaspador.V_PLOW,
  PosicionRaspador.DIAGONAL,
  PosicionRaspador.OTRO
];

const createEmptyProblemas = (): ProblemasOperacionales => ({
  carryback: 'LEVEL_II' as NivelCarryback,
  derrames: 'LOW' as NivelDerrames,
  acumulacionRetorno: 'LOW' as NivelAcumulacionRetorno,
});

const createEmptyRaspador = (): Raspador => ({
  posicion: PosicionRaspador.PRIMARIA,
  tipo: '',
  zonaInstalacion: 'HEAD' as ZonaInstalacion,
  marcaFabricante: '',
});

const TransportadorLimpiezaForm: React.FC<TransportadorLimpiezaFormProps> = ({
  limpieza,
  onChange,
}) => {
  // Initialize mostrarRaspadores based on whether there are existing raspadores
  const [mostrarRaspadores, setMostrarRaspadores] = useState(limpieza.raspadores && limpieza.raspadores.length > 0);

  const handleProblemaChange = (field: keyof ProblemasOperacionales, value: any) => {
    onChange({
      ...limpieza,
      problemas: {
        ...limpieza.problemas,
        [field]: value,
      },
    });
  };

  // Funciones para raspadores
  const agregarRaspador = () => {
    const nuevos = [...(limpieza.raspadores || []), createEmptyRaspador()];
    onChange({
      ...limpieza,
      raspadores: nuevos,
    });
  };

  const actualizarRaspador = (index: number, field: keyof Raspador, value: any) => {
    const nuevos = [...(limpieza.raspadores || [])];
    nuevos[index] = { ...nuevos[index], [field]: value };
    onChange({
      ...limpieza,
      raspadores: nuevos,
    });
  };

  const eliminarRaspador = (index: number) => {
    const nuevos = limpieza.raspadores?.filter((_, i) => i !== index) || [];
    onChange({
      ...limpieza,
      raspadores: nuevos,
    });
  };

  const toggleRaspadores = (tieneRaspadores: boolean) => {
    setMostrarRaspadores(tieneRaspadores);
    if (!tieneRaspadores) {
      onChange({
        ...limpieza,
        raspadores: [],
      });
    } else if (limpieza.raspadores.length === 0) {
      onChange({
        ...limpieza,
        raspadores: [createEmptyRaspador()],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#2dce89]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          8. Limpieza del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Sistema de raspadores y problemas operacionales
        </p>
      </div>

      {/* 8.1 Sistema de Raspadores */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          8.1 Sistema de Raspadores
        </h4>

        {/* Toggle Raspadores */}
        <div className="space-y-2 mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            ¿El transportador tiene raspadores?
          </label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tieneRaspadores"
                checked={mostrarRaspadores === true}
                onChange={() => toggleRaspadores(true)}
                className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
              />
              <span className="text-xs font-semibold text-[#32325d]">Sí</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tieneRaspadores"
                checked={mostrarRaspadores === false}
                onChange={() => toggleRaspadores(false)}
                className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
              />
              <span className="text-xs font-semibold text-[#32325d]">No</span>
            </label>
          </div>
        </div>

        {/* Lista de raspadores */}
        {mostrarRaspadores && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-bold text-slate-600 uppercase tracking-[0.1em]">
                Raspadores Configurados
              </h5>
              <button
                type="button"
                onClick={agregarRaspador}
                className="px-3 py-1 bg-[#11cdef] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#0bbcd6] transition-colors"
              >
                + Agregar Raspador
              </button>
            </div>

            {(limpieza.raspadores || []).length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <p className="text-slate-400 text-xs font-semibold">
                  No hay raspadores configurados. Agregue uno para comenzar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(limpieza.raspadores || []).map((raspador, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        Raspador #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarRaspador(index)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Posición del raspador */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Posición
                        </label>
                        <select
                          value={raspador.posicion}
                          onChange={(e) => actualizarRaspador(index, 'posicion', e.target.value as PosicionRaspador)}
                          className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
                        >
                          {POSICION_RASPADOR_OPCIONES.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tipo de raspador */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Tipo de Raspador
                        </label>
                        <input
                          type="text"
                          value={raspador.tipo}
                          onChange={(e) => actualizarRaspador(index, 'tipo', e.target.value)}
                          placeholder="Ej: Cerámico, Tungsteno, Goma, etc."
                          className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none"
                        />
                      </div>

                      {/* Zona de instalación */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Zona de Instalación
                        </label>
                        <select
                          value={raspador.zonaInstalacion}
                          onChange={(e) => actualizarRaspador(index, 'zonaInstalacion', e.target.value as ZonaInstalacion)}
                          className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
                        >
                          {ZONA_INSTALACION_OPCIONES.map(zona => (
                            <option key={zona} value={zona}>{zona}</option>
                          ))}
                        </select>
                      </div>

                      {/* Marca / Fabricante (Opcional) */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Marca / Fabricante (Opcional)
                        </label>
                        <input
                          type="text"
                          value={raspador.marcaFabricante || ''}
                          onChange={(e) => actualizarRaspador(index, 'marcaFabricante', e.target.value)}
                          placeholder="Opcional"
                          className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 8.2 Problemas Operacionales */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          8.2 Problemas Operacionales
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carryback */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Carryback (Material en Retorno)
            </label>
            <select
              value={limpieza.problemas?.carryback || 'LEVEL_I'}
              onChange={(e) => handleProblemaChange('carryback', e.target.value as NivelCarryback)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none cursor-pointer"
            >
              {NIVEL_CARRYBACK_OPCIONES.map(opcion => (
                <option key={opcion} value={opcion}>{opcion.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Derrames */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Derrames
            </label>
            <select
              value={limpieza.problemas?.derrames || 'NONE'}
              onChange={(e) => handleProblemaChange('derrames', e.target.value as NivelDerrames)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none cursor-pointer"
            >
              {NIVEL_DERRAMES_OPCIONES.map(opcion => (
                <option key={opcion} value={opcion}>{opcion.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Acumulación en Retorno */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Acumulación en Retorno
            </label>
            <select
              value={limpieza.problemas?.acumulacionRetorno || 'NONE'}
              onChange={(e) => handleProblemaChange('acumulacionRetorno', e.target.value as NivelAcumulacionRetorno)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none cursor-pointer"
            >
              {NIVEL_ACUMULACION_OPCIONES.map(opcion => (
                <option key={opcion} value={opcion}>{opcion.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorLimpiezaForm;
