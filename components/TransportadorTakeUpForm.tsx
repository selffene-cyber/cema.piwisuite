
import React from 'react';
import { TransportadorTakeUp, TakeUp, TipoTakeUp, UbicacionTakeUp } from '../types';

interface TransportadorTakeUpFormProps {
  takeUp: TransportadorTakeUp;
  onChange: (takeUp: TransportadorTakeUp) => void;
}

const TIPO_TAKEUP_OPCIONES = [
  'SCREW_TAKEUP',
  'GRAVITY_TAKEUP',
  'HORIZONTAL_GRAVITY_TAKEUP',
  'VERTICAL_GRAVITY_TAKEUP',
  'HYDRAULIC_TAKEUP',
  'WINCH_TAKEUP',
  'FIXED_TAKEUP'
];

const UBICACION_TAKEUP_OPCIONES = ['HEAD', 'TAIL', 'DRIVE', 'RETURN', 'INTERMEDIATE'];

const createEmptyTakeUp = (): TakeUp => ({
  tipoTakeUp: 'SCREW_TAKEUP' as TipoTakeUp,
  ubicacionTakeUp: 'TAIL' as UbicacionTakeUp,
  carreraDisponible_m: 1.5,
});

const TransportadorTakeUpForm: React.FC<TransportadorTakeUpFormProps> = ({
  takeUp,
  onChange,
}) => {
  const handleChange = (field: keyof TakeUp, value: any) => {
    onChange({
      takeUp: {
        ...takeUp.takeUp,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#2dce89]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          11. Sistema Take-Up del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Configuración del sistema de tensión de correa
        </p>
      </div>

      {/* 11.1 Sistema Take-Up */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          11.1 Sistema Take-Up
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipo de Take-Up */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tipo de Take-Up
            </label>
            <select
              value={takeUp.takeUp.tipoTakeUp}
              onChange={(e) => handleChange('tipoTakeUp', e.target.value as TipoTakeUp)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {TIPO_TAKEUP_OPCIONES.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Ubicación del Take-Up */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ubicación del Take-Up
            </label>
            <select
              value={takeUp.takeUp.ubicacionTakeUp}
              onChange={(e) => handleChange('ubicacionTakeUp', e.target.value as UbicacionTakeUp)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {UBICACION_TAKEUP_OPCIONES.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Carrera Disponible */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Carrera Disponible (m)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={takeUp.takeUp.carreraDisponible_m}
              onChange={(e) => handleChange('carreraDisponible_m', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-600">
            <strong>Nota:</strong> Según CEMA, el sistema de gravedad (GRAVITY_TAKEUP) es el preferido para transportadores largos ya que mantiene una tensión constante independientemente de las variaciones de temperatura y elongación de la correa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportadorTakeUpForm;
