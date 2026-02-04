
import React from 'react';
import { TransportadorAccionamiento, TipoArranque, TipoArranque as TipoArranqueEnum } from '../types';

interface TransportadorAccionamientoFormProps {
  accionamiento: TransportadorAccionamiento;
  onChange: (accionamiento: TransportadorAccionamiento) => void;
}

const TIPO_ARRANQUE_OPCIONES = [
  'DIRECT_ON_LINE - Arranque directo en línea (DOL)',
  'STAR_DELTA - Arranque estrella-triángulo',
  'SOFT_STARTER - Arrancador suave por control de tensión',
  'VFD - Variador de frecuencia',
  'FLUID_COUPLING - Acoplamiento hidráulico',
  'MAGNETIC_COUPLING - Acoplamiento magnético',
  'WOUND_ROTOR - Motor de rotor bobinado con resistencias',
  'EDDY_CURRENT - Acoplamiento de corrientes parásitas'
];

const TransportadorAccionamientoForm: React.FC<TransportadorAccionamientoFormProps> = ({
  accionamiento,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorAccionamiento, value: any) => {
    onChange({
      ...accionamiento,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#ffd600]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          10. Accionamiento del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Especificaciones del sistema de accionamiento
        </p>
      </div>

      {/* 10.1 Sistema de Accionamiento */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          10.1 Sistema de Accionamiento
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Potencia Instalada */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Potencia Instalada (kW)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={accionamiento.potenciaInstalada_kW}
              onChange={(e) => handleChange('potenciaInstalada_kW', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Número de Motores */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Número de Motores
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={accionamiento.numMotores}
              onChange={(e) => handleChange('numMotores', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Tipo de Arranque */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tipo de Arranque
            </label>
            <select
              value={accionamiento.tipoArranque}
              onChange={(e) => handleChange('tipoArranque', e.target.value as TipoArranque)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {TIPO_ARRANQUE_OPCIONES.map((opcion) => (
                <option key={opcion.split(' - ')[0]} value={opcion.split(' - ')[0]}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          {/* Reductor */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Reductor / Gearbox
            </label>
            <input
              type="text"
              value={accionamiento.reductor}
              onChange={(e) => handleChange('reductor', e.target.value)}
              placeholder="Ej: Helicoidal, Planetario, etc."
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Backstop */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Backstop
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`backstop-${Math.random()}`}
                  checked={accionamiento.backstop === true}
                  onChange={() => handleChange('backstop', true)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`backstop-${Math.random()}`}
                  checked={accionamiento.backstop === false}
                  onChange={() => handleChange('backstop', false)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>

          {/* Freno */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Freno
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`freno-${Math.random()}`}
                  checked={accionamiento.freno === true}
                  onChange={() => handleChange('freno', true)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`freno-${Math.random()}`}
                  checked={accionamiento.freno === false}
                  onChange={() => handleChange('freno', false)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorAccionamientoForm;
