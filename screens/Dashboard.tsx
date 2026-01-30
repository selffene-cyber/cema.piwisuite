
import React from 'react';
import { Evaluation } from '../types';

interface DashboardProps {
  evaluations: Evaluation[];
  onNewEvaluation: () => void;
  activeModule: string;
}

const Dashboard: React.FC<DashboardProps> = ({ evaluations, onNewEvaluation, activeModule }) => {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="soft-card p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-l-[#5e72e4]">
        <div>
          <h3 className="text-xs font-black text-[#32325d] uppercase tracking-[0.2em]">Gestión CEMA 576</h3>
          <p className="text-slate-400 text-[11px] font-semibold mt-1.5">Repositorio de evaluaciones de severidad técnica.</p>
        </div>
        <button
          onClick={onNewEvaluation}
          className="w-full sm:w-auto px-10 py-3.5 bg-[#5e72e4] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] shadow-lg hover:shadow-xl transition-all hover:bg-[#435ad8]"
        >
          + Nueva Captura
        </button>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-5">
        {evaluations.length === 0 ? (
          <div className="col-span-full text-center py-24 soft-card">
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-[0.3em]">Bandeja de entrada vacía</p>
          </div>
        ) : (
          evaluations.map((evalItem) => (
            <div 
              key={evalItem.id} 
              className="soft-card p-6 lg:p-8 hover:border-blue-100 transition-all border-l-4 group"
              style={{ borderLeftColor: evalItem.severityClass > 3 ? '#f5365c' : '#2dce89' }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-lg font-extrabold text-[#32325d] truncate tracking-tight mb-1">{evalItem.clientName}</h4>
                  <div className="flex items-center space-x-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{evalItem.tag}</span>
                    <span className="opacity-30">•</span>
                    <span>{new Date(evalItem.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-2xl font-black px-5 py-2 rounded-2xl border-2 transition-colors ${
                    evalItem.severityClass > 3 
                    ? 'text-[#f5365c] border-[#f5365c]/10 bg-[#f5365c]/5' 
                    : 'text-[#2dce89] border-[#2dce89]/10 bg-[#2dce89]/5'
                  }`}>
                    C{evalItem.severityClass}
                  </span>
                  <span className="text-[9px] font-black text-slate-300 mt-2 uppercase tracking-tighter">{evalItem.totalScore} Puntos</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-50 text-[10px] font-bold">
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Ancho & Velocidad</span>
                  <span className="text-[#32325d] font-extrabold">{evalItem.beltWidth}" @ {evalItem.beltSpeed} FPM</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Tipo de Empalme</span>
                  <span className="text-[#32325d] font-extrabold truncate block">{evalItem.spliceType}</span>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block uppercase text-[8px] tracking-widest opacity-60">Condición Material</span>
                  <span className="text-[#32325d] font-extrabold truncate block">{evalItem.abrasiveness}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
