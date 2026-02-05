
import React from 'react';
import { TransportadorCurvas } from '../types';

interface TransportadorCurvasFormProps {
  curvas: TransportadorCurvas;
  onChange: (curvas: TransportadorCurvas) => void;
}

const TransportadorCurvasForm: React.FC<TransportadorCurvasFormProps> = ({
  curvas,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorCurvas, value: any) => {
    onChange({
      ...curvas,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#ffd600]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          12. Curvas del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Configuración de curvas horizontales y verticales
        </p>
      </div>

      {/* 12.1 Curvas Horizontales */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          12.1 Curvas Horizontales
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tiene Curvas Horizontales */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              ¿Tiene Curvas Horizontales?
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="curvasHorizontales"
                  checked={curvas.curvasHorizontales === true}
                  onChange={() => handleChange('curvasHorizontales', true)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="curvasHorizontales"
                  checked={curvas.curvasHorizontales === false}
                  onChange={() => handleChange('curvasHorizontales', false)}
                  className="w-4 h-4 text-[#fb6340] focus:ring-[#fb6340]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>

          {/* Radio Horizontal */}
          {curvas.curvasHorizontales && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Radio Horizontal (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={curvas.radioHorizontal_m}
                onChange={(e) => handleChange('radioHorizontal_m', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
            </div>
          )}
        </div>

        {curvas.curvasHorizontales && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-xs font-semibold text-yellow-600">
              <strong>Nota:</strong> Según CEMA, el radio mínimo para curvas horizontales debe ser al menos 3 veces el ancho de la banda para transportadores con polines de artesa estándar.
            </p>
          </div>
        )}
      </div>

      {/* 12.2 Curvas Verticales */}
      <div className="soft-card p-4 border-l-4 border-l-[#5e72e4]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          12.2 Curvas Verticales
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tiene Curvas Verticales */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              ¿Tiene Curvas Verticales?
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="curvasVerticales"
                  checked={curvas.curvasVerticales === true}
                  onChange={() => handleChange('curvasVerticales', true)}
                  className="w-4 h-4 text-[#5e72e4] focus:ring-[#5e72e4]"
                />
                <span className="text-xs font-semibold text-[#32325d]">Sí</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="curvasVerticales"
                  checked={curvas.curvasVerticales === false}
                  onChange={() => handleChange('curvasVerticales', false)}
                  className="w-4 h-4 text-[#5e72e4] focus:ring-[#5e72e4]"
                />
                <span className="text-xs font-semibold text-[#32325d]">No</span>
              </label>
            </div>
          </div>

          {/* Radio Vertical */}
          {curvas.curvasVerticales && (
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Radio Vertical (m)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={curvas.radioVertical_m}
                onChange={(e) => handleChange('radioVertical_m', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all"
              />
            </div>
          )}
        </div>

        {curvas.curvasVerticales && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-xs font-semibold text-purple-600">
              <strong>Nota:</strong> Para curvas verticales convexas, el radio mínimo recomendado es de 3 a 5 veces la distancia entre polines. Para curvas cóncavas, se recomienda un mínimo de 6 a 8 veces la distancia entre polines para evitar despegue de la correa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportadorCurvasForm;
