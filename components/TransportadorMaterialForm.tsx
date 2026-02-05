
import React, { useState } from 'react';
import { TransportadorMaterial, Moisture, Abrasiveness } from '../types';
import MaterialSelectorModal from './MaterialSelectorModal';

interface TransportadorMaterialFormProps {
  material: TransportadorMaterial;
  onChange: (material: TransportadorMaterial) => void;
}

const HUMEDAD_OPCIONES = [
  { value: Moisture.DRY, label: 'Seco (<2%)' },
  { value: Moisture.MOIST, label: 'Húmedo (2-8%)' },
  { value: Moisture.WET, label: 'Mojado (>8%)' },
  { value: Moisture.SLURRY, label: 'Lodo/Desbordante' },
];

const FLUIDEZ_OPCIONES = [
  { value: 'libre', label: 'Libre (fluye fácilmente)' },
  { value: 'media', label: 'Media (flujo normal)' },
  { value: 'pobre', label: 'Pobre (flujo difícil)' },
];

const ABRASIVIDAD_OPCIONES = [
  { value: Abrasiveness.MILD, label: 'Ligeramente abrasivo (Index 1-17)' },
  { value: Abrasiveness.MODERATE, label: 'Moderadamente abrasivo (Index 18-67)' },
  { value: Abrasiveness.EXTREME, label: 'Extremadamente abrasivo (Index 68-416)' },
];

// Densidades típicas por categoría (toneladas métricas/m³)
const DENSIDADES_TIPICAS = {
  minerales_metalicos: 2.0,
  minerales_energeticos: 0.8,
  construccion: 1.6,
  cemento: 1.2,
  sales_quimicos: 1.1,
  relaves: 1.4,
  graneles: 1.5,
  otros: 1.0,
};

const TransportadorMaterialForm: React.FC<TransportadorMaterialFormProps> = ({
  material,
  onChange,
}) => {
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  const handleChange = (field: keyof TransportadorMaterial, value: string | number | Moisture | Abrasiveness) => {
    onChange({
      ...material,
      [field]: value,
    });
  };

  const handleMaterialSelect = (id: string, nombre: string) => {
    onChange({
      ...material,
      material: id,
      materialNombre: nombre,
    });
  };

  const aplicarDensidadTipica = (categoria: keyof typeof DENSIDADES_TIPICAS) => {
    handleChange('densidadAparante_tm3', DENSIDADES_TIPICAS[categoria]);
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          3. Material Transportado
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Propiedades físicas y características del material
        </p>
      </div>

      {/* 3.1 Propiedades Principales */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          3.1 Propiedades del Material
        </h4>

        {/* Selector de Material */}
        <div className="space-y-2 mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Material Transportado
          </label>
          <button
            type="button"
            onClick={() => setShowMaterialModal(true)}
            className="w-full px-4 py-3 text-left text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all hover:bg-gray-100"
          >
            {material.materialNombre || material.material || 'Seleccionar material...'}
          </button>
        </div>

        {/* Densidad Aparente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Densidad Aparente
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={material.densidadAparante_tm3}
                onChange={(e) => handleChange('densidadAparante_tm3', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                ton/m³
              </span>
            </div>
          </div>

          {/* Densidades rápidas */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Densidades Típicas
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => aplicarDensidadTipica('minerales_metalicos')}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Minerales (2.0)
              </button>
              <button
                type="button"
                onClick={() => aplicarDensidadTipica('construccion')}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Áridos (1.6)
              </button>
              <button
                type="button"
                onClick={() => aplicarDensidadTipica('cemento')}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Cemento (1.2)
              </button>
              <button
                type="button"
                onClick={() => aplicarDensidadTipica('minerales_energeticos')}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold hover:bg-slate-200 transition-colors"
              >
                Carbón (0.8)
              </button>
            </div>
          </div>
        </div>

        {/* Tamaño de Partículas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tamaño Máximo de Partícula
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                min="0"
                value={material.tamanoMaxParticula_mm}
                onChange={(e) => handleChange('tamanoMaxParticula_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                mm
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tamaño Medio de Partícula
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                min="0"
                value={material.tamanoMedio_mm}
                onChange={(e) => handleChange('tamanoMedio_mm', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                mm
              </span>
            </div>
          </div>
        </div>

        {/* Humedad, Fluidez y Abrasividad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Humedad */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Humedad
            </label>
            <select
              value={material.humedad}
              onChange={(e) => handleChange('humedad', e.target.value as Moisture)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {HUMEDAD_OPCIONES.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fluidez */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Fluidez
            </label>
            <select
              value={material.fluidez}
              onChange={(e) => handleChange('fluidez', e.target.value as 'libre' | 'media' | 'pobre')}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {FLUIDEZ_OPCIONES.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          {/* Abrasividad */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Abrasividad
            </label>
            <select
              value={material.abrasividad}
              onChange={(e) => handleChange('abrasividad', e.target.value as Abrasiveness)}
              className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#fb6340] focus:border-transparent outline-none transition-all cursor-pointer"
            >
              {ABRASIVIDAD_OPCIONES.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selector de Material Modal */}
      <MaterialSelectorModal
        open={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        onSelect={handleMaterialSelect}
        currentMaterial={material.material}
      />
    </div>
  );
};

export default TransportadorMaterialForm;
