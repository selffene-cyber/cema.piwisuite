
import React, { useState, useEffect, useRef } from 'react';
import { Evaluation } from '../types';
import { evaluationsApi } from '../utils/api';
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

interface EvaluationDetailProps {
  evaluationId: string;
  onBack: () => void;
}

const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ evaluationId, onBack }) => {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [wasDeleted, setWasDeleted] = useState(false);
  const chartRef = useRef<any>(null);

  const handleDownloadPDF = async () => {
    if (!evaluation) return;
    const breakdown = calculateScores(
      evaluation.beltWidthValue,
      evaluation.beltSpeedValue,
      evaluation.spliceType,
      evaluation.abrasiveness,
      evaluation.moisture
    );
    await generateEvaluationPDF(breakdown, {
      clientName: evaluation.clientName,
      tag: evaluation.tag,
      beltWidthValue: evaluation.beltWidthValue,
      beltWidthUnit: evaluation.beltWidthUnit,
      beltSpeedValue: evaluation.beltSpeedValue,
      beltSpeedUnit: evaluation.beltSpeedUnit,
      spliceType: evaluation.spliceType,
      abrasiveness: evaluation.abrasiveness,
      moisture: evaluation.moisture,
      faena: evaluation.faena,
      tipo_correa: evaluation.tipo_correa,
      capacidad: evaluation.capacidad,
      tipo_material: evaluation.tipo_material,
    }, chartRef);
  };

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await evaluationsApi.getById(evaluationId);
        setEvaluation(data);
      } catch (err: any) {
        console.error('Failed to fetch evaluation:', err);
        setError(err.message || 'Error al cargar la evaluación');
      } finally {
        setLoading(false);
      }
    };

    if (evaluationId) {
      fetchEvaluation();
    }
  }, [evaluationId]);

  const handleDeleteEvaluation = async () => {
    if (!evaluationId) return;
    
    try {
      setDeleting(true);
      await evaluationsApi.deleteById(evaluationId);
      setWasDeleted(true);
      setShowDeleteModal(false);
      // Small delay to ensure state is updated before navigating
      setTimeout(() => {
        onBack();
      }, 0);
    } catch (err: any) {
      console.error('Failed to delete evaluation:', err);
      setError(err.message || 'Error al eliminar la evaluación');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#5e72e4] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em] mt-6">Cargando evaluación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soft-card p-10 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#f5365c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-[#32325d] mb-2">Error al cargar</h2>
        <p className="text-slate-400 font-semibold text-sm mb-6">{error}</p>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#435ad8] transition-all"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="soft-card p-10 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-[#32325d] mb-2">Evaluación no encontrada</h2>
        <p className="text-slate-400 font-semibold text-sm mb-6">No se pudo encontrar la evaluación solicitada.</p>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#435ad8] transition-all"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  // If wasDeleted, show success message and navigate back
  if (wasDeleted) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="soft-card p-10 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#2dce89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#32325d] mb-2">Evaluación eliminada</h2>
          <p className="text-slate-400 font-semibold text-sm mb-6">La evaluación ha sido eliminada correctamente.</p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-[#435ad8] transition-all"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isCritical = evaluation?.severityClass > 3;
  
  // Calculate breakdown scores from stored evaluation data
  const breakdown = evaluation ? calculateScores(
    evaluation.beltWidthValue,
    evaluation.beltSpeedValue,
    evaluation.spliceType,
    evaluation.abrasiveness,
    evaluation.moisture
  ) : null;

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
      {/* Header Card */}
      <div className="soft-card p-6 lg:p-8 border-l-4 mb-6 relative" style={{ borderLeftColor: isCritical ? '#f5365c' : '#2dce89' }}>
        {/* Row 1: Date/time aligned right */}
        <div className="flex justify-end mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {new Date(evaluation.timestamp).toLocaleString()}
          </span>
        </div>

        {/* Row 2: Back button + Title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-[#5e72e4] transition-colors rounded-lg hover:bg-gray-50"
            title="Volver al Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xs font-black text-[#5e72e4] uppercase tracking-[0.2em]">Detalle de Evaluación</h3>
        </div>

        {/* Row 3: Action icons aligned right */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-1">
            <button
              onClick={handleDownloadPDF}
              className="p-2 text-slate-400 hover:text-[#2dce89] transition-colors rounded-lg hover:bg-green-50"
              title="Descargar PDF"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-400 hover:text-[#f5365c] transition-colors rounded-lg hover:bg-red-50"
              title="Eliminar evaluación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Client Name */}
        <h1 className="text-2xl font-extrabold text-[#32325d] truncate tracking-tight mb-3">{evaluation.clientName}</h1>
        
        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
          <span className="bg-gray-50 px-3 py-1 rounded border border-gray-100">{evaluation.tag}</span>
          <span className="opacity-30">•</span>
          <span className="bg-gray-50 px-3 py-1 rounded border border-gray-100">{evaluation.faena}</span>
          <span className="opacity-30">•</span>
          <span className="bg-gray-50 px-3 py-1 rounded border border-gray-100">
            {evaluation.tipo_correa_valor && `${evaluation.tipo_correa_valor} `}({evaluation.tipo_correa})
          </span>
          <span className="opacity-30">•</span>
          <span className="bg-gray-50 px-3 py-1 rounded border border-gray-100">{evaluation.capacidad_valor} {evaluation.capacidad}</span>
        </div>

        {/* Centered Severity Class and Points */}
        <div className="flex flex-col items-center justify-center py-4 mb-6">
          <span className={`text-4xl font-black px-8 py-4 rounded-2xl border-2 ${
            isCritical 
            ? 'text-[#f5365c] border-[#f5365c]/10 bg-[#f5365c]/5' 
            : 'text-[#2dce89] border-[#2dce89]/10 bg-[#2dce89]/5'
          }`}>
            C{evaluation.severityClass}
          </span>
          <span className="text-[10px] font-black text-slate-300 mt-2 uppercase tracking-tighter">{evaluation.totalScore} Puntos</span>
        </div>

        {/* Sistema Information */}
        <div className="soft-card p-6 lg:p-8">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-5 mb-6">
            <span className="text-[11px] font-black text-white w-8 h-8 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.2em]">Información del Sistema</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Tipo de Correa</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">
                  {evaluation.tipo_correa_valor && `${evaluation.tipo_correa_valor} `}({evaluation.tipo_correa})
                </span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50">
                <svg className="w-6 h-6 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Capacidad</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">{evaluation.capacidad_valor} {evaluation.capacidad}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-50">
                <svg className="w-6 h-6 text-[#2dce89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Material</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">{evaluation.tipo_material}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-purple-50">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Belt Parameters */}
        <div className="soft-card p-6 lg:p-8">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-5 mb-6">
            <span className="text-[11px] font-black text-white w-8 h-8 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.2em]">Parámetros de Correa</h2>
          </div>

          <div className="space-y-6">
            {/* Belt Width */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Ancho de Banda</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">{evaluation.beltWidthValue} {evaluation.beltWidthUnit || 'in'}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50">
                <svg className="w-6 h-6 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
            </div>

            {/* Belt Speed */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Velocidad</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">{evaluation.beltSpeedValue} {evaluation.beltSpeedUnit || 'fpm'}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50">
                <svg className="w-6 h-6 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Splice Type */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Tipo de Empalme</span>
                <span className="text-sm font-bold text-[#32325d] mt-1 whitespace-normal break-words">{evaluation.spliceType}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-50">
                <svg className="w-6 h-6 text-[#5e72e4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Material Conditions */}
        <div className="soft-card p-6 lg:p-8">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-5 mb-6">
            <span className="text-[11px] font-black text-white w-8 h-8 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.2em]">Condiciones del Material</h2>
          </div>

          <div className="space-y-6">
            {/* Abrasiveness */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Abrasividad</span>
                <span className="text-sm font-bold text-[#32325d] mt-1 whitespace-normal break-words">{evaluation.abrasiveness}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-50">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>

            {/* Moisture */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Humedad</span>
                <span className="text-sm font-bold text-[#32325d] mt-1">{evaluation.moisture}</span>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-cyan-50">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Severity Result Card */}
      <div className={`mt-6 p-8 rounded-[1.5rem] border-2 animate-in zoom-in-95 duration-500 text-center ${
        isCritical 
        ? 'bg-red-50/40 border-red-100/50 shadow-red-500/5' 
        : 'bg-green-50/40 border-green-100/50 shadow-green-500/5'
      }`}>
        <span className="inline-block text-[10px] font-black text-slate-400 uppercase tracking-[0.35em] mb-6">Resultado de Evaluación</span>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Score Total</span>
            <span className="text-5xl font-black text-[#32325d] tracking-tighter">{evaluation.totalScore}<span className="text-sm font-bold opacity-20 ml-1">PTS</span></span>
          </div>
          <div className="hidden sm:block h-12 w-px bg-gray-200/50" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Clase de Severidad</span>
            <span className={`text-5xl font-black tracking-tighter ${isCritical ? 'text-[#f5365c]' : 'text-[#2dce89]'}`}>
              CLASE {evaluation.severityClass}
            </span>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      {breakdown && (
        <div className="mt-10">
          <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">Análisis por Variable</h3>
          <div className="h-[350px] w-full max-w-xl mx-auto">
            <Radar
              ref={chartRef}
              data={{
                labels: ['Ancho de Banda', 'Velocidad', 'Empalme', 'Abrasividad', 'Humedad'],
                datasets: [{
                  label: 'Puntaje Individual',
                  data: [
                    breakdown.breakdown.beltWidth,
                    breakdown.breakdown.beltSpeed,
                    breakdown.breakdown.spliceType,
                    breakdown.breakdown.abrasiveness,
                    breakdown.breakdown.moisture
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

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className="px-10 py-4 bg-[#5e72e4] text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all hover:bg-[#435ad8] flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Dashboard
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="soft-card p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#f5365c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#32325d] mb-2">¿Eliminar evaluación?</h3>
              <p className="text-slate-400 font-semibold text-sm mb-8">¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteEvaluation}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-[#f5365c] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl hover:bg-[#e02a45] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationDetail;
