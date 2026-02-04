
import React, { useState } from 'react';
import { TransportadorIdentity, TipoEquipo, FuenteLevantamiento, ClienteIndustrial } from '../types';
import ClienteSelectorModal from './ClienteSelectorModal';

interface TransportadorIdentityFormProps {
  identity: TransportadorIdentity;
  onChange: (identity: TransportadorIdentity) => void;
}

const TIPO_EQUIPO_OPCIONES = [
  { value: TipoEquipo.TRANSPORTADOR_CONVENCIONAL, label: 'Transportador Convencional' },
  { value: TipoEquipo.ALIMENTADOR_BANDA, label: 'Alimentador de Banda' },
  { value: TipoEquipo.TRANSPORTADOR_REVERSIBLE, label: 'Transportador Reversible' },
  { value: TipoEquipo.TRANSPORTADOR_CURVO, label: 'Transportador Curvo' },
  { value: TipoEquipo.TRANSPORTADOR_INCLINADO_FUERTE, label: 'Transportador Inclinado Fuerte' },
  { value: TipoEquipo.PIPE_TUBULAR, label: 'Pipe Tubular' },
];

const FUENTE_LEVANTAMIENTO_OPCIONES: { value: FuenteLevantamiento; label: string }[] = [
  { value: 'levantamiento_campo', label: 'Levantamiento de Campo' },
  { value: 'datos_proyecto', label: 'Datos de Proyecto' },
  { value: 'revision_dibujo', label: 'Revisión de Dibujo' },
  { value: 'especificacion_tecnica', label: 'Especificación Técnica' },
  { value: 'otro', label: 'Otro' },
];

const TransportadorIdentityForm: React.FC<TransportadorIdentityFormProps> = ({
  identity,
  onChange,
}) => {
  const [showClienteModal, setShowClienteModal] = useState(false);

  const handleChange = (field: keyof TransportadorIdentity, value: string | number) => {
    onChange({
      ...identity,
      [field]: value,
    });
  };

  const handleClienteSelect = (id: ClienteIndustrial, name: string) => {
    onChange({
      ...identity,
      cliente: id,
      clienteNombre: name,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#5e72e4]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          1. Identificación del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Información general de identificación y contexto del equipo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cliente */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Cliente / Instalación <span className="text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowClienteModal(true)}
            className="w-full px-4 py-3 text-left text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all hover:bg-gray-100"
          >
            {identity.clienteNombre || identity.cliente || 'Seleccionar cliente...'}
          </button>
          {identity.cliente && (
            <p className="text-[10px] text-slate-400">
              ID: <span className="font-mono">{identity.cliente}</span>
            </p>
          )}
        </div>

        {/* Tipo de Equipo */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Tipo de Equipo <span className="text-red-400">*</span>
          </label>
          <select
            value={identity.tipoEquipo}
            onChange={(e) => handleChange('tipoEquipo', e.target.value as TipoEquipo)}
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
          >
            {TIPO_EQUIPO_OPCIONES.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faena */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Faena / Planta <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={identity.faena}
            onChange={(e) => handleChange('faena', e.target.value)}
            placeholder="Ej: Concentradora, Puerto, Stockpile..."
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Área */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Área / Sector
          </label>
          <input
            type="text"
            value={identity.area}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="Ej: Área de Trituración, Correa de Retorno..."
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Código del Transportador */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Código del Transportador <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={identity.codigoTransportador}
            onChange={(e) => handleChange('codigoTransportador', e.target.value)}
            placeholder="Ej: CV-BELT-001, AL-101, BC-201..."
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Nombre Descriptivo */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Nombre Descriptivo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={identity.nombreDescriptivo}
            onChange={(e) => handleChange('nombreDescriptivo', e.target.value)}
            placeholder="Ej: Correa de Alimentacion Primaria, Transportador de Salida..."
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="soft-card p-4 border-l-4 border-l-[#f5365c] mt-8">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          13. Metadatos del Levantamiento
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Información de trazabilidad y control de calidad del registro
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fecha de Levantamiento */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Fecha de Levantamiento <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={identity.fechaLevantamiento}
            onChange={(e) => handleChange('fechaLevantamiento', e.target.value)}
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Usuario */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Usuario / Responsable <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={identity.usuario}
            onChange={(e) => handleChange('usuario', e.target.value)}
            placeholder="Nombre del responsable"
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        {/* Fuente del Dato */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Fuente del Dato
          </label>
          <select
            value={identity.fuenteDato}
            onChange={(e) => handleChange('fuenteDato', e.target.value as FuenteLevantamiento)}
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all cursor-pointer"
          >
            {FUENTE_LEVANTAMIENTO_OPCIONES.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nivel de Confianza */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Nivel de Confianza: <span className="text-[#5e72e4]">{identity.nivelConfianza}%</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={identity.nivelConfianza}
              onChange={(e) => handleChange('nivelConfianza', parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5e72e4]"
            />
            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
              <span>Bajo</span>
              <span>Medio</span>
              <span>Alto</span>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Comentarios
          </label>
          <textarea
            value={identity.comentarios || ''}
            onChange={(e) => handleChange('comentarios', e.target.value)}
            placeholder="Observaciones adicionales..."
            rows={2}
            className="w-full px-4 py-3 text-xs font-semibold text-[#32325d] bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5e72e4] focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Selector de Cliente Modal */}
      <ClienteSelectorModal
        open={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onSelect={handleClienteSelect}
        currentClient={identity.cliente || ''}
      />
    </div>
  );
};

export default TransportadorIdentityForm;
