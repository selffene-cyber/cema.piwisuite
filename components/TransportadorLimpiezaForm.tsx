
import React from 'react';
import { TransportadorLimpieza, ProblemasOperacionales, NivelCarryback, NivelDerrames, NivelAcumulacionRetorno, ZonaInstalacion } from '../types';

interface TransportadorLimpiezaFormProps {
  limpieza: TransportadorLimpieza;
  onChange: (limpieza: TransportadorLimpieza) => void;
}

const NIVEL_CARRYBACK_OPCIONES = ['LEVEL_I', 'LEVEL_II', 'LEVEL_III', 'LEVEL_IV'];
const NIVEL_DERRAMES_OPCIONES = ['NONE', 'LOW', 'MODERATE', 'HIGH', 'SEVERE'];
const NIVEL_ACUMULACION_OPCIONES = ['NONE', 'LOW', 'MODERATE', 'HIGH', 'SEVERE'];
const ZONA_INSTALACION_OPCIONES = ['HEAD', 'TAIL', 'RETURN', 'CARGO'];

const createEmptyProblemas = (): ProblemasOperacionales => ({
  carryback: 'LEVEL_II' as NivelCarryback,
  derrames: 'LOW' as NivelDerrames,
  acumulacionRetorno: 'LOW' as NivelAcumulacionRetorno,
});

const TransportadorLimpiezaForm: React.FC<TransportadorLimpiezaFormProps> = ({
  limpieza,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorLimpieza, value: any) => {
    onChange({
      ...limpieza,
      [field]: value,
    });
  };

  const handleProblemaChange = (field: keyof ProblemasOperacionales, value: any) => {
    onChange({
      ...limpieza,
      problemas: {
        ...limpieza.problemas,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#2dce89]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          8. Limpieza del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Sistema de limpieza y problemas operacionales
        </p>
      </div>

      {/* 8.1 Sistema de Limpieza */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          8.1 Sistema de Limpieza
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Limpieza Primaria */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Limpieza Primaria
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="limpiezaPrimaria"
                  checked={limpieza.limpiezaPrimaria === true}
                  onChange={() => handleChange('limpiezaPrimaria', true)}
                  className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="limpiezaPrimaria"
                  checked={limpieza.limpiezaPrimaria === false}
                  onChange={() => handleChange('limpiezaPrimaria', false)}
                  className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>

          {/* Limpieza Secundaria */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Limpieza Secundaria
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="limpiezaSecundaria"
                  checked={limpieza.limpiezaSecundaria === true}
                  onChange={() => handleChange('limpiezaSecundaria', true)}
                  className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="limpiezaSecundaria"
                  checked={limpieza.limpiezaSecundaria === false}
                  onChange={() => handleChange('limpiezaSecundaria', false)}
                  className="w-4 h-4 text-[#11cdef] focus:ring-[#11cdef]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>
        </div>

        {(limpieza.limpiezaPrimaria || limpieza.limpiezaSecundaria) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Tipo de Limpiador */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Tipo de Limpiador
              </label>
              <input
                type="text"
                value={limpieza.tipoLimpiador || ''}
                onChange={(e) => handleChange('tipoLimpiador', e.target.value)}
                placeholder="Ej: Diagonal, Primario, Secundario, etc."
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Zona de Instalación */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Zona de Instalación
              </label>
              <select
                value={limpieza.zonaInstalacion || ''}
                onChange={(e) => handleChange('zonaInstalacion', e.target.value as ZonaInstalacion)}
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">Seleccionar...</option>
                {ZONA_INSTALACION_OPCIONES.map(zona => (
                  <option key={zona} value={zona}>{zona}</option>
                ))}
              </select>
            </div>
          </div>
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
