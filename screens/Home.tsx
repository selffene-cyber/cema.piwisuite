
import React, { useState } from 'react';
import { Evaluation } from '../types';

interface HomeProps {
  evaluations: Evaluation[];
  setActiveModule: (module: string) => void;
}

const Home: React.FC<HomeProps> = ({ evaluations, setActiveModule }) => {
  const [timeFilter, setTimeFilter] = useState<'Día' | 'Semana' | 'Mes' | 'Año'>('Mes');
  const [moduleFilter, setModuleFilter] = useState<'Todos' | 'CEMA 576' | 'Impacto'>('Todos');
  const recentItems = evaluations.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 w-full pb-10">
      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button 
          onClick={() => setActiveModule('cema576')}
          className="soft-card p-8 text-left group hover:bg-slate-50 transition-all border-l-[6px] border-l-[#2dce89] active:scale-[0.99]"
        >
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Módulo Operativo</span>
          <h3 className="text-sm font-extrabold text-[#32325d] tracking-widest uppercase group-hover:text-[#2dce89] transition-colors">ANÁLISIS CEMA 576</h3>
        </button>

        <button 
          onClick={() => setActiveModule('impact')}
          className="soft-card p-8 text-left group hover:bg-slate-50 transition-all border-l-[6px] border-l-[#fb6340] active:scale-[0.99]"
        >
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Módulo Ingeniería</span>
          <h3 className="text-sm font-extrabold text-[#32325d] tracking-widest uppercase group-hover:text-[#fb6340] transition-colors">ANÁLISIS DE IMPACTO</h3>
        </button>

        <button 
          onClick={() => setActiveModule('calc1')}
          className="soft-card p-8 text-left group hover:bg-slate-50 transition-all border-l-[6px] border-l-[#11cdef] active:scale-[0.99]"
        >
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Herramientas</span>
          <h3 className="text-sm font-extrabold text-[#32325d] tracking-widest uppercase group-hover:text-[#11cdef] transition-colors">CALCULADORA TÉCNICA</h3>
        </button>
      </div>

      {/* Statistics Section */}
      <div className="soft-card p-8 lg:p-10 w-full overflow-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
          <div>
            <h3 className="font-black text-[#32325d] uppercase text-xs tracking-[0.2em]">Rendimiento Operativo</h3>
            <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-tight opacity-70">Monitoreo de frecuencia y tipos de evaluación técnica</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Module Filter */}
            <div className="flex bg-gray-50/80 p-1.5 rounded-xl border border-gray-100 flex-1 sm:flex-none">
              <select 
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value as any)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-tighter text-[#32325d] py-1.5 px-3 focus:ring-0 cursor-pointer"
              >
                <option value="Todos">Módulo: Todos</option>
                <option value="CEMA 576">CEMA 576</option>
                <option value="Impacto">Impacto</option>
              </select>
            </div>

            {/* Time Filter */}
            <div className="flex bg-gray-50/80 p-1.5 rounded-xl border border-gray-100 flex-1 sm:flex-none">
              {['Día', 'Semana', 'Mes', 'Año'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f as any)}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                    timeFilter === f ? 'bg-white shadow-sm text-[#5e72e4]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Full-Width Chart */}
        <div className="relative h-72 lg:h-96 w-full group">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5e72e4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#5e72e4" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal Grid */}
            <line x1="0" y1="40" x2="1000" y2="40" stroke="#f8f9fa" strokeWidth="1" />
            <line x1="0" y1="80" x2="1000" y2="80" stroke="#f8f9fa" strokeWidth="1" />
            <line x1="0" y1="120" x2="1000" y2="120" stroke="#f8f9fa" strokeWidth="1" />
            <line x1="0" y1="160" x2="1000" y2="160" stroke="#f8f9fa" strokeWidth="1" />
            
            {/* Smooth Spline Path */}
            <path 
              d="M0,140 C100,145 150,110 250,120 C350,130 450,40 550,60 C650,80 750,160 850,140 C950,120 1000,130 1000,130" 
              fill="none" 
              stroke="#5e72e4" 
              strokeWidth="5" 
              strokeLinecap="round"
              className="drop-shadow-lg"
            />
            <path 
              d="M0,140 C100,145 150,110 250,120 C350,130 450,40 550,60 C650,80 750,160 850,140 C950,120 1000,130 1000,130 V200 H0 Z" 
              fill="url(#areaGradient)"
            />
          </svg>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] pointer-events-none">
            <span>Inicio Periodo</span>
            <span>Estadística Consolidada</span>
            <span>Fin Periodo</span>
          </div>
        </div>
      </div>

      {/* Detailed History Table */}
      <div className="soft-card overflow-hidden">
        <div className="p-8 lg:p-10 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-[#32325d] uppercase text-xs tracking-[0.2em]">Registro Histórico Reciente</h3>
          <button 
            onClick={() => setActiveModule('cema576')}
            className="text-[10px] font-black uppercase text-[#5e72e4] hover:tracking-widest transition-all"
          >
            Ver Repositorio Completo
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Instalación / Cliente</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificador (Tag)</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Registro</th>
                <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Severidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">No se han detectado registros en la base de datos</td>
                </tr>
              ) : (
                recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-[13px] font-bold text-[#32325d] group-hover:text-[#5e72e4] transition-colors">{item.clientName}</td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/50">{item.tag}</span>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-bold text-slate-400">{new Date(item.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-[11px] font-black px-4 py-1.5 rounded-full border shadow-sm ${
                        item.severityClass > 3 
                        ? 'bg-red-50 text-[#f5365c] border-red-100' 
                        : 'bg-green-50 text-[#2dce89] border-green-100'
                      }`}>
                        CLASE {item.severityClass}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
