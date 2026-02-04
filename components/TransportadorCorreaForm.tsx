
import React from 'react';
import { TransportadorCorrea, SpliceType, SpliceType as SpliceTypeEnum, GradoCubiertaST, EspesorCubiertaMetrico } from '../types';

interface TransportadorCorreaFormProps {
  correa: TransportadorCorrea;
  onChange: (correa: TransportadorCorrea) => void;
}

const SPLICE_OPTIONS = Object.values(SpliceTypeEnum).map(value => ({
  value,
  label: value
}));

const GRADO_CUBIERTA_ST = Object.values(GradoCubiertaST);
const ESPESOR_CUBIERTA_M = Object.values(EspesorCubiertaMetrico);

const TransportadorCorreaForm: React.FC<TransportadorCorreaFormProps> = ({
  correa,
  onChange,
}) => {
  const handleChange = (field: keyof TransportadorCorrea, value: any) => {
    onChange({
      ...correa,
      [field]: value,
    });
  };

  const parseEspesor = (value: string): number => {
    const match = value.match(/\\((\\d+)mm\\)/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#825ee4]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          5. Correa del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Especificaciones técnicas de la correa transportadora
        </p>
      </div>

      {/* 5.1 Construcción de la Correa */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          5.1 Construcción de la Correa
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipo de Correa */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tipo de Correa
            </label>
            <select
              value={correa.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <option value="EP">EP (Poliester-Poliamida)</option>
              <option value="ST">ST (Cables de Acero)</option>
            </select>
          </div>

          {/* Resistencia Nominal */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Resistencia Nominal (kN/m)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={correa.resistenciaNominal_kNm}
              onChange={(e) => handleChange('resistenciaNominal_kNm', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Número de Telas/Cables */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Número de Telas (EP) / Cables (ST)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={correa.numTelasCables}
              onChange={(e) => handleChange('numTelasCables', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Espesor Cubierta Superior */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Espesor Cubierta Superior (mm)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={correa.espesorCubiertaSup_mm}
              onChange={(e) => handleChange('espesorCubiertaSup_mm', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Tipo Cubierta Superior */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Grado Cubierta Superior
            </label>
            <select
              value={correa.tipoCubiertaSuperior}
              onChange={(e) => handleChange('tipoCubiertaSuperior', e.target.value)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <optgroup label="Clasificación ST (Cables de Acero)">
                {GRADO_CUBIERTA_ST.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </optgroup>
              <optgroup label="Clasificación M (Métrico)">
                {ESPESOR_CUBIERTA_M.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Tipo Cubierta Inferior */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Grado Cubierta Inferior
            </label>
            <select
              value={correa.tipoCubiertaInferior}
              onChange={(e) => handleChange('tipoCubiertaInferior', e.target.value)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              <optgroup label="Clasificación ST (Cables de Acero)">
                {GRADO_CUBIERTA_ST.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </optgroup>
              <optgroup label="Clasificación M (Métrico)">
                {ESPESOR_CUBIERTA_M.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Espesor Cubierta Inferior */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Espesor Cubierta Inferior (mm)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={correa.espesorCubiertaInf_mm}
              onChange={(e) => handleChange('espesorCubiertaInf_mm', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 5.2 Empalme */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          5.2 Empalme
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipo de Empalme */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tipo de Empalme
            </label>
            <select
              value={correa.tipoEmpalme}
              onChange={(e) => handleChange('tipoEmpalme', e.target.value as SpliceType)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {SPLICE_OPTIONS.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          {/* Longitud de Empalme */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Longitud de Empalme (mm)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={correa.longitudEmpalme_mm}
              onChange={(e) => handleChange('longitudEmpalme_mm', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorCorreaForm;
