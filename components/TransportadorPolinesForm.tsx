
import React from 'react';
import { TransportadorPolines, PolinCarga, PolinRetorno, TipoPolinCarga, TipoRetorno, ClaseCEMA } from '../types';

interface TransportadorPolinesFormProps {
  polines: TransportadorPolines;
  onChange: (polines: TransportadorPolines) => void;
}

const TIPO_POLIN_CARGA_OPCIONES: TipoPolinCarga[] = [
  'TROUGHING_STANDARD (Polín de carga estándar con rodillos en artesa)',
  'IMPACT_IDLER (Polín de impacto con rodillos amortiguados con anillos de goma)',
  'TRAINING_IDLER (Polín de carga autoalineante. Usado como elemento correctivo para problemas de tracking)',
  'OFFSET_TROUGHING (Polín de carga con rodillos desplazados. Aplicaciones especiales de transición o geometría particular)',
  'EQUAL_TROUGHING (Polín de carga con rodillos laterales iguales)',
  'PICKUP_IDLER (olín ubicado inmediatamente después de la zona de carga, diseñado para estabilizar la correa cargada)',
  'TRANSITION_IDLER (Polín usado en zonas de transición entre tambor plano y artesa)'
];

const TIPO_RETORNO_OPCIONES: TipoRetorno[] = [
  'FLAT_RETURN (Retorno plano con un solo rodillo horizontal)',
  'V_RETURN (Retorno en V (normalmente 10°–15° por lado))',
  'TRAINING_RETURN (Polín de retorno autoalineante)',
  'RUBBER_DISK_RETURN (Rodillo de retorno con discos de goma)',
  'SPIRAL_RETURN (Rodillo de retorno espiralado)',
  'IMPACT_RETURN (Retorno reforzado para zonas con caída de material o limpieza agresiva)'
];

// ClaseCEMA es un enum,，所以我们需要使用enum值
const CLASE_CEMA_OPCIONES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const createEmptyPolinCarga = (): PolinCarga => ({
  anguloArtesa: 20,
  claseCEMA: 'C' as ClaseCEMA,
  diametroRodillo_mm: 108,
  espaciamiento_m: 1.0,
  tipo: 'TROUGHING_STANDARD (Polín de carga estándar con rodillos en artesa)',
});

const createEmptyPolinRetorno = (): PolinRetorno => ({
  tipo: 'FLAT_RETURN (Retorno plano con un solo rodillo horizontal)',
  espaciamiento_m: 2.0,
  diametroRodillo_mm: 108,
});

const TransportadorPolinesForm: React.FC<TransportadorPolinesFormProps> = ({
  polines,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorPolines, value: any) => {
    onChange({
      ...polines,
      [field]: value,
    });
  };

  // Polines de Carga
  const agregarPolinCarga = () => {
    const nuevos = [...(polines.polinesCarga || []), createEmptyPolinCarga()];
    handleChange('polinesCarga', nuevos);
  };

  const actualizarPolinCarga = (index: number, field: keyof PolinCarga, value: any) => {
    const nuevos = [...(polines.polinesCarga || [])];
    nuevos[index] = { ...nuevos[index], [field]: value };
    handleChange('polinesCarga', nuevos);
  };

  const eliminarPolinCarga = (index: number) => {
    const nuevos = polines.polinesCarga?.filter((_, i) => i !== index) || [];
    handleChange('polinesCarga', nuevos);
  };

  // Polines de Retorno
  const agregarPolinRetorno = () => {
    const nuevos = [...(polines.polinesRetorno || []), createEmptyPolinRetorno()];
    handleChange('polinesRetorno', nuevos);
  };

  const actualizarPolinRetorno = (index: number, field: keyof PolinRetorno, value: any) => {
    const nuevos = [...(polines.polinesRetorno || [])];
    nuevos[index] = { ...nuevos[index], [field]: value };
    handleChange('polinesRetorno', nuevos);
  };

  const eliminarPolinRetorno = (index: number) => {
    const nuevos = polines.polinesRetorno?.filter((_, i) => i !== index) || [];
    handleChange('polinesRetorno', nuevos);
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#2dce89]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          6. Polines del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Especificaciones de polines de carga y retorno
        </p>
      </div>

      {/* 6.1 Polines de Carga */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">
            6.1 Polines de Carga
          </h4>
          <button
            type="button"
            onClick={agregarPolinCarga}
            className="px-3 py-1 bg-[#11cdef] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#0bbcd6] transition-colors"
          >
            + Agregar Polín
          </button>
        </div>

        {(polines.polinesCarga || []).length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-slate-400 text-xs font-semibold">
              No hay polines de carga configurados. Agregue uno para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(polines.polinesCarga || []).map((polin, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Polín de Carga #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarPolinCarga(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Tipo */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Tipo
                    </label>
                    <select
                      value={polin.tipo}
                      onChange={(e) => actualizarPolinCarga(index, 'tipo', e.target.value as TipoPolinCarga)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
                    >
                      {TIPO_POLIN_CARGA_OPCIONES.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ángulo de Artesa */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Ángulo (°)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="45"
                      value={polin.anguloArtesa}
                      onChange={(e) => actualizarPolinCarga(index, 'anguloArtesa', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none"
                    />
                  </div>

                  {/* Clase CEMA */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Clase CEMA
                    </label>
                    <select
                      value={polin.claseCEMA}
                      onChange={(e) => actualizarPolinCarga(index, 'claseCEMA', e.target.value as ClaseCEMA)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
                    >
                      {CLASE_CEMA_OPCIONES.map(clase => (
                        <option key={clase} value={clase}>{clase}</option>
                      ))}
                    </select>
                  </div>

                  {/* Diámetro */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Diámetro (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={polin.diametroRodillo_mm}
                      onChange={(e) => actualizarPolinCarga(index, 'diametroRodillo_mm', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Espaciamiento */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Espaciamiento (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={polin.espaciamiento_m}
                      onChange={(e) => actualizarPolinCarga(index, 'espaciamiento_m', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6.2 Polines de Retorno */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">
            6.2 Polines de Retorno
          </h4>
          <button
            type="button"
            onClick={agregarPolinRetorno}
            className="px-3 py-1 bg-[#fb6340] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#fa5a32] transition-colors"
          >
            + Agregar Polín
          </button>
        </div>

        {(polines.polinesRetorno || []).length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-slate-400 text-xs font-semibold">
              No hay polines de retorno configurados. Agregue uno para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(polines.polinesRetorno || []).map((polin, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Polín de Retorno #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarPolinRetorno(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tipo */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Tipo
                    </label>
                    <select
                      value={polin.tipo}
                      onChange={(e) => actualizarPolinRetorno(index, 'tipo', e.target.value as TipoRetorno)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] outline-none cursor-pointer"
                    >
                      {TIPO_RETORNO_OPCIONES.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Diámetro */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Diámetro (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={polin.diametroRodillo_mm}
                      onChange={(e) => actualizarPolinRetorno(index, 'diametroRodillo_mm', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] outline-none"
                    />
                  </div>

                  {/* Espaciamiento */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Espaciamiento (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={polin.espaciamiento_m}
                      onChange={(e) => actualizarPolinRetorno(index, 'espaciamiento_m', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportadorPolinesForm;
