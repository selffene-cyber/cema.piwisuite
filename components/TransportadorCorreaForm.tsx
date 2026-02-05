
import React from 'react';
import { TransportadorCorrea, SpliceType, SpliceType as SpliceTypeEnum, TipoCubiertaSuperiorInferior } from '../types';

interface TransportadorCorreaFormProps {
  correa: TransportadorCorrea;
  onChange: (correa: TransportadorCorrea) => void;
}

const SPLICE_OPTIONS = Object.values(SpliceTypeEnum).map(value => ({
  value,
  label: value
}));

const TIPO_CUBIERTA_OPCIONES: TipoCubiertaSuperiorInferior[] = [
  'DIN X (Alta resistencia a abrasión. Uso en minería severa y materiales altamente abrasivos).',
  'DIN Y (Resistencia media a abrasión. Uso industrial general).',
  'DIN Z (Servicio liviano. Materiales poco abrasivos).',
  'RMA 1',
  'RMA 2',
  'OIL RESISTANT (Compuesto resistente a aceites, grasas e hidrocarburos).',
  'HEAT RESISTANT (Diseñada para transporte de material a alta temperatura).',
  'DIN K (Cubierta retardante al fuego para aplicaciones con requisitos de seguridad.).',
  'CHEMICAL RESISTANT (Resistente a ambientes o materiales químicamente agresivos).',
  'FOOD GRADE (Cumple requisitos sanitarios para aplicaciones alimentarias).',
];

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
    const match = value.match(/\((\d+)mm\)/);
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
        </div>

        {/* Campos específicos para EP */}
        {correa.tipo === 'EP' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
                onChange={(e) => handleChange('resistenciaNominal_kNm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Número de Telas */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Número de Telas (EP)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={correa.numTelasCables}
                onChange={(e) => handleChange('numTelasCables', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Campos específicos para ST */}
        {correa.tipo === 'ST' && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resistencia ST */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Resistencia ST (kN/m) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={correa.resistenciaST_kN_m || ''}
                  onChange={(e) => handleChange('resistenciaST_kN_m', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Número de Cables */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Número de Cables (ST)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={correa.numTelasCables}
                  onChange={(e) => handleChange('numTelasCables', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Paso Cable */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Paso Cable (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={correa.pasoCable_mm || ''}
                  onChange={(e) => handleChange('pasoCable_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Diámetro Cable */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Diámetro Cable (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={correa.diametroCable_mm || ''}
                  onChange={(e) => handleChange('diametroCable_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Campos comunes EP y ST - Cubiertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
              onChange={(e) => handleChange('espesorCubiertaSup_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
            />
          </div>

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
              onChange={(e) => handleChange('espesorCubiertaInf_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
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
              onChange={(e) => handleChange('tipoCubiertaSuperior', e.target.value as TipoCubiertaSuperiorInferior)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {TIPO_CUBIERTA_OPCIONES.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>

          {/* Tipo Cubierta Inferior */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Grado Cubierta Inferior
            </label>
            <select
              value={correa.tipoCubiertaInferior}
              onChange={(e) => handleChange('tipoCubiertaInferior', e.target.value as TipoCubiertaSuperiorInferior)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {TIPO_CUBIERTA_OPCIONES.map(opcion => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
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
              onChange={(e) => handleChange('longitudEmpalme_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportadorCorreaForm;
