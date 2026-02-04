
import React from 'react';
import { TransportadorCapacidad, RegimenOperacion } from '../types';

interface TransportadorCapacidadFormProps {
  capacidad: TransportadorCapacidad;
  onChange: (capacidad: TransportadorCapacidad) => void;
}

const REGIMEN_OPCIONES = [
  { value: RegimenOperacion.CONTINUO, label: 'Continuo (24/7)', descripcion: 'Operación continua sin paradas programadas' },
  { value: RegimenOperacion.INTERMITENTE, label: 'Intermitente', descripcion: 'Operación con ciclos de trabajo/pausa' },
  { value: RegimenOperacion.CAMPAÑA, label: 'Campaña', descripcion: 'Operación por períodos definidos' },
];

const TransportadorCapacidadForm: React.FC<TransportadorCapacidadFormProps> = ({
  capacidad,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorCapacidad, value: number | RegimenOperacion) => {
    onChange({
      ...capacidad,
      [field]: value,
    });
  };

  // Calcular capacidad máxima basada en nominal y factor de llenado
  const capacidadCalculada = capacidad.capacidadNominal_th * (capacidad.factorLlenado_pct / 100);

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#2dce89]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          4. Capacidad del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Producción, capacidad y régimen de operación
        </p>
      </div>

      {/* 4.1 Producción y Capacidad */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          4.1 Producción y Capacidad
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capacidad Nominal */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Capacidad Nominal <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                min="0"
                value={capacidad.capacidadNominal_th}
                onChange={(e) => handleChange('capacidadNominal_th', parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2dce89] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                ton/h
              </span>
            </div>
            <p className="text-[9px] text-slate-400">
              Capacidad de diseño del transportador
            </p>
          </div>

          {/* Capacidad Máxima */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Capacidad Máxima
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                min="0"
                value={capacidad.capacidadMaxima_th}
                onChange={(e) => handleChange('capacidadMaxima_th', parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2dce89] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                ton/h
              </span>
            </div>
            <p className="text-[9px] text-slate-400">
              Capacidad máxima bajo condiciones óptimas
            </p>
          </div>
        </div>

        {/* Factor de Llenado */}
        <div className="mt-6 space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Factor de Llenado: <span className="text-[#2dce89]">{capacidad.factorLlenado_pct}%</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={capacidad.factorLlenado_pct}
              onChange={(e) => handleChange('factorLlenado_pct', parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2dce89]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Indicador visual del factor de llenado */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Capacidad Efectiva Estimada</span>
              <span className="text-sm font-bold text-[#2dce89]">{capacidadCalculada.toFixed(1)} ton/h</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2dce89] transition-all duration-300"
                style={{ width: `${capacidad.factorLlenado_pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4.2 Régimen de Operación */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          4.2 Régimen de Operación
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {REGIMEN_OPCIONES.map((opcion) => (
            <div
              key={opcion.value}
              onClick={() => handleChange('regimenOperacion', opcion.value)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                capacidad.regimenOperacion === opcion.value
                  ? 'border-[#2dce89] bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  capacidad.regimenOperacion === opcion.value
                    ? 'border-[#2dce89] bg-[#2dce89]'
                    : 'border-gray-300'
                }`}>
                  {capacidad.regimenOperacion === opcion.value && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#32325d]">
                    {opcion.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {opcion.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Capacidad */}
      <div className="soft-card p-4 bg-gradient-to-r from-[#5e72e4] to-[#825ee4]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Capacidad Total Disponible
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {capacidad.capacidadNominal_th.toLocaleString()} <span className="text-sm font-semibold">ton/h</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Factor de Utilización
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {capacidad.factorLlenado_pct}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorCapacidadForm;
