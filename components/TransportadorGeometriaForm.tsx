
import React, { useState, useEffect } from 'react';
import { TransportadorGeometria, Perfil } from '../types';

interface TransportadorGeometriaFormProps {
  geometria: TransportadorGeometria;
  onChange: (geometria: TransportadorGeometria) => void;
}

const PERFIL_OPCIONES = [
  { value: Perfil.HORIZONTAL, label: 'Horizontal' },
  { value: Perfil.INCLINADO, label: 'Inclinado' },
  { value: Perfil.MIXTO, label: 'Mixto' },
];

const TransportadorGeometriaForm: React.FC<TransportadorGeometriaFormProps> = ({
  geometria,
  onChange,
}) => {
  // Initialize unit states from prop to preserve user selections
  const [longitudUnidad, setLongitudUnidad] = useState<'m' | 'ft'>(geometria.longitudUnidad || 'm');
  const [velocidadUnidad, setVelocidadUnidad] = useState<'m/s' | 'fpm'>(geometria.velocidadUnidad || 'm/s');
  const [anchoUnidad, setAnchoUnidad] = useState<'mm' | 'in'>(geometria.anchoUnidad || 'mm');
  
  // Sync unit states when prop changes (e.g., when navigating back to this section)
  useEffect(() => {
    if (geometria.longitudUnidad) setLongitudUnidad(geometria.longitudUnidad);
  }, [geometria.longitudUnidad]);
  
  useEffect(() => {
    if (geometria.velocidadUnidad) setVelocidadUnidad(geometria.velocidadUnidad);
  }, [geometria.velocidadUnidad]);
  
  useEffect(() => {
    if (geometria.anchoUnidad) setAnchoUnidad(geometria.anchoUnidad);
  }, [geometria.anchoUnidad]);
  
  // Save unit selections when they change
  const handleUnidadChange = (tipo: 'longitud' | 'velocidad' | 'ancho', valor: string) => {
    if (tipo === 'longitud') {
      setLongitudUnidad(valor as 'm' | 'ft');
      onChange({ ...geometria, longitudUnidad: valor as 'm' | 'ft' });
    } else if (tipo === 'velocidad') {
      setVelocidadUnidad(valor as 'm/s' | 'fpm');
      onChange({ ...geometria, velocidadUnidad: valor as 'm/s' | 'fpm' });
    } else {
      setAnchoUnidad(valor as 'mm' | 'in');
      onChange({ ...geometria, anchoUnidad: valor as 'mm' | 'in' });
    }
  };

  const handleChange = (field: keyof TransportadorGeometria, value: number | Perfil | undefined) => {
    onChange({
      ...geometria,
      [field]: value,
    });
  };

  const handleTramoChange = (tipo: 'inclinados' | 'horizontal', index: number, value: number) => {
    const array = tipo === 'inclinados' ? [...(geometria.tramosInclinados || [])] : [...(geometria.tramosHorizontal || [])];
    array[index] = value;
    
    if (tipo === 'inclinados') {
      onChange({ ...geometria, tramosInclinados: array });
    } else {
      onChange({ ...geometria, tramosHorizontal: array });
    }
  };

  const agregarTramo = (tipo: 'inclinados' | 'horizontal') => {
    if (tipo === 'inclinados') {
      const nuevos = [...(geometria.tramosInclinados || []), 0];
      onChange({ ...geometria, tramosInclinados: nuevos, numTramosInclinados: nuevos.length });
    } else {
      const nuevos = [...(geometria.tramosHorizontal || []), 0];
      onChange({ ...geometria, tramosHorizontal: nuevos });
    }
  };

  const eliminarTramo = (tipo: 'inclinados' | 'horizontal', index: number) => {
    if (tipo === 'inclinados') {
      const nuevos = geometria.tramosInclinados?.filter((_, i) => i !== index) || [];
      onChange({ ...geometria, tramosInclinados: nuevos, numTramosInclinados: nuevos.length });
    } else {
      const nuevos = geometria.tramosHorizontal?.filter((_, i) => i !== index) || [];
      onChange({ ...geometria, tramosHorizontal: nuevos });
    }
  };

  // Conversiones
  const convertirLongitud = (valor: number, aMetros: boolean): number => {
    if (longitudUnidad === 'm' && aMetros) return valor;
    if (longitudUnidad === 'ft' && !aMetros) return valor;
    return longitudUnidad === 'ft' ? valor * 0.3048 : valor / 0.3048;
  };

  const convertirVelocidad = (valor: number, aMs: boolean): number => {
    if (velocidadUnidad === 'm/s' && aMs) return valor;
    if (velocidadUnidad === 'fpm' && !aMs) return valor;
    return velocidadUnidad === 'fpm' ? valor * 0.00508 : valor / 0.00508;
  };

  const convertirAncho = (valor: number, aMm: boolean): number => {
    if (anchoUnidad === 'mm' && aMm) return valor;
    if (anchoUnidad === 'in' && !aMm) return valor;
    return anchoUnidad === 'in' ? valor * 25.4 : valor / 25.4;
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#11cdef]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          2. Geometría del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Dimensiones principales y perfil del transportador
        </p>
      </div>

      {/* 2.1 Dimensiones Principales */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          2.1 Dimensiones Principales
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Longitud Total */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Longitud Total
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={convertirLongitud(geometria.longitudTotal_m, longitudUnidad === 'm')}
                onChange={(e) => handleChange('longitudTotal_m', convertirLongitud(parseFloat(e.target.value) || 0, longitudUnidad === 'm'))}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
              <select
                value={longitudUnidad}
                onChange={(e) => handleUnidadChange('longitud', e.target.value)}
                className="px-3 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
              >
                <option value="m">m</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>

          {/* Elevación Total */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Elevación Total (positivo = ascendente)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={geometria.elevacionTotal_m}
                onChange={(e) => handleChange('elevacionTotal_m', parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                m
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Inclinación Promedio */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Inclinación Promedio
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="-90"
                max="90"
                value={geometria.inclinacionPromedio_grados}
                onChange={(e) => handleChange('inclinacionPromedio_grados', parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
              <span className="flex items-center px-3 py-3 bg-gray-100 text-xs font-semibold text-slate-500 rounded-lg">
                °
              </span>
            </div>
          </div>

          {/* Ancho de Banda */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Ancho de Banda
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="1"
                min="0"
                value={convertirAncho(geometria.anchoBanda_mm, anchoUnidad === 'mm')}
                onChange={(e) => handleChange('anchoBanda_mm', convertirAncho(parseFloat(e.target.value) || 0, anchoUnidad === 'mm'))}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
              <select
                value={anchoUnidad}
                onChange={(e) => handleUnidadChange('ancho', e.target.value)}
                className="px-3 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
              >
                <option value="mm">mm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          {/* Velocidad Nominal */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Velocidad Nominal
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={convertirVelocidad(geometria.velocidadNominal_ms, velocidadUnidad === 'm/s')}
                onChange={(e) => handleChange('velocidadNominal_ms', convertirVelocidad(parseFloat(e.target.value) || 0, velocidadUnidad === 'm/s'))}
                className="flex-1 px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
              />
              <select
                value={velocidadUnidad}
                onChange={(e) => handleUnidadChange('velocidad', e.target.value)}
                className="px-3 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] outline-none cursor-pointer"
              >
                <option value="m/s">m/s</option>
                <option value="fpm">fpm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2.2 Perfil del Transportador */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em] mb-4">
          2.2 Perfil del Transportador
        </h4>

        {/* Selector de Perfil */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Tipo de Perfil
          </label>
          <select
            value={geometria.perfil}
            onChange={(e) => handleChange('perfil', e.target.value as Perfil)}
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all cursor-pointer"
          >
            {PERFIL_OPCIONES.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campos dinámicos para perfil MIXTO */}
        {geometria.perfil === Perfil.MIXTO && (
          <div className="mt-6 space-y-6">
            {/* Tramos Inclinados */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tramos Inclinados
                </label>
                <button
                  type="button"
                  onClick={() => agregarTramo('inclinados')}
                  className="px-3 py-1 bg-[#11cdef] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#0bbcd6] transition-colors"
                >
                  + Agregar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(geometria.tramosInclinados || []).map((tramo, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={tramo}
                      onChange={(e) => handleTramoChange('inclinados', index, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11cdef] focus:border-transparent outline-none transition-all"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">m</span>
                    <button
                      type="button"
                      onClick={() => eliminarTramo('inclinados', index)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tramos Horizontales */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tramos Horizontales
                </label>
                <button
                  type="button"
                  onClick={() => agregarTramo('horizontal')}
                  className="px-3 py-1 bg-[#f5365c] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#e5256e] transition-colors"
                >
                  + Agregar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(geometria.tramosHorizontal || []).map((tramo, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={tramo}
                      onChange={(e) => handleTramoChange('horizontal', index, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] focus:border-transparent outline-none transition-all"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">m</span>
                    <button
                      type="button"
                      onClick={() => eliminarTramo('horizontal', index)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar resumen para perfil INCLINADO */}
        {geometria.perfil === Perfil.INCLINADO && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-600">
              Transportador con un solo tramo inclinado. La elevación total representa el desnivel entre cola y cabeza.
            </p>
          </div>
        )}

        {/* Mostrar resumen para perfil HORIZONTAL */}
        {geometria.perfil === Perfil.HORIZONTAL && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-xs font-semibold text-green-600">
              Transportador horizontal. La elevación total debe ser 0.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportadorGeometriaForm;
