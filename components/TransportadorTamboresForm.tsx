
import React from 'react';
import { TransportadorTambores, Tambor, TipoTambor, Revestimiento, TipoEje } from '../types';

interface TransportadorTamboresFormProps {
  tambores: TransportadorTambores;
  onChange: (tambores: TransportadorTambores) => void;
}

const TIPO_TAMBOR_OPCIONES = ['DRIVE', 'TAIL', 'SNUB', 'BEND', 'TAKEUP', 'DEFLECTOR'];
const REVESTIMIENTO_OPCIONES = ['NONE', 'RUBBER_PLAIN', 'RUBBER_GROOVED', 'CERAMIC'];
const TIPO_EJE_OPCIONES = ['STRAIGHT', 'STEPPED', 'TAPERED'];

const createEmptyTambor = (): Tambor => ({
  tipo: 'TAIL' as TipoTambor,
  diametro_mm: 500,
  ancho_mm: 800,
  revestimiento: 'NONE' as Revestimiento,
  tipoEje: 'STRAIGHT' as TipoEje,
});

const TransportadorTamboresForm: React.FC<TransportadorTamboresFormProps> = ({
  tambores,
  onChange,
}) => {
  const agregarTambor = () => {
    const nuevos = [...(tambores.tambores || []), createEmptyTambor()];
    onChange({ tambores: nuevos });
  };

  const actualizarTambor = (index: number, field: keyof Tambor, value: any) => {
    const nuevos = [...(tambores.tambores || [])];
    nuevos[index] = { ...nuevos[index], [field]: value };
    onChange({ tambores: nuevos });
  };

  const eliminarTambor = (index: number) => {
    const nuevos = tambores.tambores?.filter((_, i) => i !== index) || [];
    onChange({ tambores: nuevos });
  };

  const getTamborLabel = (tipo: TipoTambor): string => {
    const labels: Record<TipoTambor, string> = {
      DRIVE: 'Tambor Motriz (Drive)',
      TAIL: 'Tambor de Cola (Tail)',
      SNUB: 'Tambor Deflector (Snub)',
      BEND: 'Tambor de Curva (Bend)',
      TAKEUP: 'Tambor Take-Up',
      DEFLECTOR: 'Tambor Deflector',
    };
    return labels[tipo];
  };

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="soft-card p-4 border-l-4 border-l-[#f5365c]">
        <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">
          9. Tambores del Transportador
        </h3>
        <p className="text-slate-400 text-[10px] font-semibold mt-1">
          Especificaciones técnicas de tambores
        </p>
      </div>

      {/* Lista de Tambores */}
      <div className="soft-card p-4 border-l-4 border-l-[#fb6340]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black text-[#32325d] uppercase tracking-[0.15em]">
            Tambores Configurados
          </h4>
          <button
            type="button"
            onClick={agregarTambor}
            className="px-3 py-1 bg-[#f5365c] text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#e5256e] transition-colors"
          >
            + Agregar Tambor
          </button>
        </div>

        {(tambores.tambores || []).length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-slate-400 text-xs font-semibold">
              No hay tambores configurados. Agregue uno para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(tambores.tambores || []).map((tambor, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Tambor #{index + 1} - {getTamborLabel(tambor.tipo)}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarTambor(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Tipo de Tambor */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Tipo
                    </label>
                    <select
                      value={tambor.tipo}
                      onChange={(e) => actualizarTambor(index, 'tipo', e.target.value as unknown as TipoTambor)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] outline-none cursor-pointer"
                    >
                      {TIPO_TAMBOR_OPCIONES.map(tipo => (
                        <option key={tipo} value={tipo}>{getTamborLabel(tipo as TipoTambor)}</option>
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
                      value={tambor.diametro_mm}
                      onChange={(e) => actualizarTambor(index, 'diametro_mm', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] outline-none"
                    />
                  </div>

                  {/* Ancho */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Ancho (mm)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={tambor.ancho_mm}
                      onChange={(e) => actualizarTambor(index, 'ancho_mm', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] outline-none"
                    />
                  </div>

                  {/* Revestimiento */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Revestimiento
                    </label>
                    <select
                      value={tambor.revestimiento}
                      onChange={(e) => actualizarTambor(index, 'revestimiento', e.target.value as Revestimiento)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] outline-none cursor-pointer"
                    >
                      {REVESTIMIENTO_OPCIONES.map(rev => (
                        <option key={rev} value={rev}>{rev.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de Eje */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Tipo de Eje
                    </label>
                    <select
                      value={tambor.tipoEje}
                      onChange={(e) => actualizarTambor(index, 'tipoEje', e.target.value as TipoEje)}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#32325d] bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f5365c] outline-none cursor-pointer"
                    >
                      {TIPO_EJE_OPCIONES.map(eje => (
                        <option key={eje} value={eje}>{eje.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
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

export default TransportadorTamboresForm;
