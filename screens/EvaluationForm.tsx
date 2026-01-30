
import React, { useState, useRef } from 'react';
import { SpliceType, Abrasiveness, Moisture, Evaluation } from '../types';
import { calculateScores } from '../utils/calculator';
import { generateEvaluationPDF } from '../utils/pdfGenerator';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface EvaluationFormProps {
  onSave: (evalItem: Evaluation) => void;
  onCancel: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    tag: '',
    beltWidth: 36,
    beltSpeed: 400,
    spliceType: SpliceType.VULCANIZED,
    abrasiveness: Abrasiveness.MILD,
    moisture: Moisture.DRY,
  });

  const [result, setResult] = useState<{ total: number; severityClass: number; breakdown: { beltWidth: number; beltSpeed: number; spliceType: number; abrasiveness: number; moisture: number } } | null>(null);
  const [saving, setSaving] = useState(false);

  const chartRef = useRef<any>(null);

  const handleCalculate = () => {
    const calc = calculateScores(
      formData.beltWidth,
      formData.beltSpeed,
      formData.spliceType,
      formData.abrasiveness,
      formData.moisture
    );
    setResult(calc);
  };

  const handleFinish = async () => {
    if (!result) return;

    const newEval: Evaluation = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      totalScore: result.total,
      severityClass: result.severityClass
    };
    
    setSaving(true);
    await onSave(newEval);
    setSaving(false);
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    await generateEvaluationPDF(result, formData, chartRef);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="soft-card p-8 lg:p-14 space-y-14 shadow-2xl">
        
        {/* Identificación */}
        <section className="space-y-8">
          <div className="flex items-center space-x-5 border-b border-gray-100 pb-5">
            <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">01</span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.25em]">Información General</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Cliente / Unidad de Negocio</label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                placeholder="Ej. Minera Escondida"
                value={formData.clientName}
                onChange={e => { setFormData({...formData, clientName: e.target.value}); setResult(null); }}
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Código de Activo (TAG)</label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                placeholder="Ej. CV-001-ST"
                value={formData.tag}
                onChange={e => { setFormData({...formData, tag: e.target.value}); setResult(null); }}
              />
            </div>
          </div>
        </section>

        {/* Especificaciones Técnicas */}
        <section className="space-y-8">
          <div className="flex items-center space-x-5 border-b border-gray-100 pb-5">
            <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">02</span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.25em]">Diseño del Transportador</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Ancho de Banda (Pulgadas)</label>
                <span className="text-sm font-black text-[#5e72e4] bg-blue-50 px-3 py-1 rounded-lg">{formData.beltWidth}"</span>
              </div>
              <input
                type="range"
                min="18"
                max="120"
                step="2"
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5e72e4]"
                value={formData.beltWidth}
                onChange={e => { setFormData({...formData, beltWidth: parseInt(e.target.value)}); setResult(null); }}
              />
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Velocidad de Operación</label>
                <span className="text-sm font-black text-[#5e72e4] bg-blue-50 px-3 py-1 rounded-lg">{formData.beltSpeed} <span className="text-[10px] opacity-40">fpm</span></span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="50"
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5e72e4]"
                value={formData.beltSpeed}
                onChange={e => { setFormData({...formData, beltSpeed: parseInt(e.target.value)}); setResult(null); }}
              />
            </div>
          </div>

          <div className="pt-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 block ml-1">Metodología de Empalme</label>
            <select
              className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer appearance-none"
              value={formData.spliceType}
              onChange={e => { setFormData({...formData, spliceType: e.target.value as SpliceType}); setResult(null); }}
            >
              {Object.values(SpliceType).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </section>

        {/* Condiciones del Material */}
        <section className="space-y-8">
          <div className="flex items-center space-x-5 border-b border-gray-100 pb-5">
            <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">03</span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.25em]">Propiedades del Material</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nivel de Abrasividad</label>
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer appearance-none"
                value={formData.abrasiveness}
                onChange={e => { setFormData({...formData, abrasiveness: e.target.value as Abrasiveness}); setResult(null); }}
              >
                {Object.values(Abrasiveness).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Gradiente de Humedad</label>
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer appearance-none"
                value={formData.moisture}
                onChange={e => { setFormData({...formData, moisture: e.target.value as Moisture}); setResult(null); }}
              >
                {Object.values(Moisture).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Dashboard de Resultados */}
        {result && (
          <>
            <div className={`mt-14 p-10 rounded-[2rem] border-2 animate-in zoom-in-95 duration-500 text-center shadow-xl ${result.severityClass > 3 ? 'bg-red-50/40 border-red-100/50 shadow-red-500/5' : 'bg-green-50/40 border-green-100/50 shadow-green-500/5'}`}>
              <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-[0.35em] mb-6">Diagnóstico CEMA 576 Completado</span>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-24">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Score Total</span>
                  <span className="text-5xl font-black text-[#32325d] tracking-tighter">{result.total}<span className="text-sm font-bold opacity-20 ml-1">PTS</span></span>
                </div>
                <div className="hidden sm:block h-16 w-px bg-gray-200/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Categoría</span>
                  <span className={`text-5xl font-black tracking-tighter ${result.severityClass > 3 ? 'text-[#f5365c]' : 'text-[#2dce89]'}`}>
                    CLASE {result.severityClass}
                  </span>
                </div>
              </div>
            </div>

            {result.breakdown && (
              <div className="mt-10">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Análisis por Variable</h3>
                <div className="h-[350px] w-full max-w-3xl mx-auto">
                  <Radar
                    ref={chartRef}
                    data={{
                      labels: ['Ancho de Banda', 'Velocidad', 'Empalme', 'Abrasividad', 'Humedad'],
                      datasets: [{
                        label: 'Puntaje Individual',
                        data: [
                          result.breakdown.beltWidth,
                          result.breakdown.beltSpeed,
                          result.breakdown.spliceType,
                          result.breakdown.abrasiveness,
                          result.breakdown.moisture
                        ],
                        backgroundColor: 'rgba(94, 114, 228, 0.2)',
                        borderColor: 'rgba(94, 114, 228, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(94, 114, 228, 1)',
                      }]
                    }}
                    options={{
                      scales: {
                        r: {
                          min: 0,
                          max: 8,
                          ticks: { stepSize: 1 },
                          pointLabels: { font: { size: 12 } }
                        }
                      },
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </div>
            )}

            {/* Botón de Descarga PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={!result}
              className="mt-8 px-10 py-5 bg-[#2dce89] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#28b37f] transition-all active:scale-[0.98] disabled:opacity-20"
            >
              Descargar PDF
            </button>
          </>
        )}

        {/* Acciones del Formulario */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-10 py-4 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-[#f5365c] transition-all"
          >
            Cancelar Proceso
          </button>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-5">
            <button
              onClick={handleCalculate}
              disabled={!formData.clientName || !formData.tag}
              className="px-10 py-5 border-2 border-[#5e72e4] text-[#5e72e4] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#5e72e4] hover:text-white transition-all disabled:opacity-20 active:scale-[0.98]"
            >
              Calcular Severidad
            </button>
            <button
              onClick={handleFinish}
              disabled={!result || saving}
              className="px-12 py-5 bg-[#5e72e4] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:bg-[#435ad8] transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? 'Guardando...' : 'Guardar Evaluación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
