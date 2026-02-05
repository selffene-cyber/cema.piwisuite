
import React, { useState, useMemo } from 'react';
import { Evaluation, User, UserRole } from '../types';

interface HomeProps {
  evaluations: Evaluation[];
  setActiveModule: (module: string) => void;
  currentUser?: User;
}

// Helper function to format date based on period
const formatDateKey = (date: Date, period: 'Día' | 'Semana' | 'Mes' | 'Año'): string => {
  switch (period) {
    case 'Día':
      return date.toISOString().slice(0, 13); // Hourly for day view
    case 'Semana':
      return date.toISOString().slice(0, 10); // Daily for week view
    case 'Mes':
      return date.toISOString().slice(0, 10); // Daily for month view
    case 'Año':
      return date.toISOString().slice(0, 7); // Monthly for year view
  }
};

// Helper function to get date label
const getDateLabel = (dateKey: string, period: 'Día' | 'Semana' | 'Mes' | 'Año'): string => {
  const date = new Date(dateKey);
  switch (period) {
    case 'Día':
      return date.getHours().toString().padStart(2, '0') + ':00';
    case 'Semana':
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    case 'Mes':
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    case 'Año':
      return date.toLocaleDateString('es-ES', { month: 'short' });
  }
};

// Get date range for the selected period
const getDateRange = (period: 'Día' | 'Semana' | 'Mes' | 'Año'): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now);
  let start: Date;

  switch (period) {
    case 'Día':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'Semana':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'Mes':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'Año':
      start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }

  return { start, end };
};

// Generate all date keys for the period (including zeros)
const generateDateKeys = (period: 'Día' | 'Semana' | 'Mes' | 'Año'): string[] => {
  const { start, end } = getDateRange(period);
  const keys: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    keys.push(formatDateKey(current, period));
    switch (period) {
      case 'Día':
        current.setHours(current.getHours() + 1);
        break;
      case 'Semana':
      case 'Mes':
        current.setDate(current.getDate() + 1);
        break;
      case 'Año':
        current.setMonth(current.getMonth() + 1);
        break;
    }
  }

  return keys;
};

// Aggregate evaluations by date
const aggregateEvaluations = (
  evaluations: Evaluation[],
  period: 'Día' | 'Semana' | 'Mes' | 'Año',
  moduleFilter: 'Todos' | 'CEMA 576' | 'Impacto'
): Map<string, number> => {
  const filtered = moduleFilter === 'Todos'
    ? evaluations
    : evaluations.filter(e => e.module === moduleFilter);

  const aggregation = new Map<string, number>();

  filtered.forEach(evalItem => {
    const dateKey = formatDateKey(new Date(evalItem.timestamp), period);
    aggregation.set(dateKey, (aggregation.get(dateKey) || 0) + 1);
  });

  return aggregation;
};

// Generate SVG path from data points with smooth bezier curve
const generateSVGPath = (dataPoints: number[], maxValue: number, width: number, height: number, padding: number): string => {
  if (dataPoints.length === 0) return '';

  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  const xStep = chartWidth / (Math.max(dataPoints.length - 1, 1));
  const yScale = chartHeight / (maxValue || 1);

  // Generate smooth curve using optimized cubic bezier
  let path = `M${padding},${height - padding - (dataPoints[0] * yScale)}`;

  for (let i = 0; i < dataPoints.length; i++) {
    const x = padding + (i * xStep);
    const y = height - padding - (dataPoints[i] * yScale);

    if (i === 0) {
      path = `M${x},${y}`;
    } else {
      // Calculate optimized control points for smoother curve
      const prevX = padding + ((i - 1) * xStep);
      const prevY = height - padding - (dataPoints[i - 1] * yScale);
      const nextX = padding + ((i + 1) * xStep);
      const nextY = height - padding - (dataPoints[Math.min(i + 1, dataPoints.length - 1)] * yScale);
      
      // Use tension-based control points for smoother curve
      const tension = 0.3;
      const cp1x = prevX + (x - prevX) * tension;
      const cp1y = prevY;
      const cp2x = x - (nextX - x) * tension;
      const cp2y = y;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }
  }

  return path;
};

const Home: React.FC<HomeProps> = ({ evaluations, setActiveModule, currentUser }) => {
  const isAuditor = currentUser?.role === UserRole.AUDITOR;
  const [timeFilter, setTimeFilter] = useState<'Día' | 'Semana' | 'Mes' | 'Año'>('Mes');
  const [moduleFilter, setModuleFilter] = useState<'Todos' | 'CEMA 576' | 'Impacto'>('Todos');
  const recentItems = evaluations.slice(0, 6);

  // Calculate chart dimensions
  const svgWidth = 1000;
  const svgHeight = 200;
  const chartPadding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartHeight = svgHeight - chartPadding.top - chartPadding.bottom;
  const chartWidth = svgWidth - chartPadding.left - chartPadding.right;

  // Calculate chart data
  const { chartData, maxValue, dateLabels } = useMemo(() => {
    const dateKeys = generateDateKeys(timeFilter);
    const aggregation = aggregateEvaluations(evaluations, timeFilter, moduleFilter);

    const dataPoints = dateKeys.map(key => aggregation.get(key) || 0);
    const maxValue = Math.max(...dataPoints, 1); // At least 1 to avoid division by zero
    const labels = dateKeys.map(key => getDateLabel(key, timeFilter));

    return {
      chartData: dataPoints,
      maxValue,
      dateLabels: labels
    };
  }, [evaluations, timeFilter, moduleFilter]);

  // Generate SVG paths
  const linePath = generateSVGPath(chartData, maxValue, svgWidth, svgHeight, chartPadding.left);
  const areaPath = linePath + ` V${svgHeight - chartPadding.bottom} H${chartPadding.left} Z`;

  // Sample labels for x-axis (show first, middle, and last)
  const sampleLabels = useMemo(() => {
    if (dateLabels.length <= 3) return dateLabels;
    const step = Math.floor(dateLabels.length / 2);
    return [
      dateLabels[0],
      dateLabels[step],
      dateLabels[dateLabels.length - 1]
    ];
  }, [dateLabels]);

  // Generate Y-axis labels and reference lines
  const yAxisLabels = useMemo(() => {
    const labels: number[] = [];
    const steps = 4; // Number of reference lines
    for (let i = steps; i >= 0; i--) {
      labels.push(Math.round((maxValue * i) / steps));
    }
    return labels;
  }, [maxValue]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 w-full pb-10">
      {/* Read-Only Mode Indicator for Auditors */}
      {isAuditor && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">Modo Solo Lectura</p>
            <p className="text-xs text-amber-600">Como Auditor, puedes visualizar y exportar datos, pero no puedes crear ni modificar evaluaciones.</p>
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <button 
          onClick={() => setActiveModule('transportadores')}
          className="soft-card p-8 text-left group hover:bg-slate-50 transition-all border-l-[6px] border-l-[#0090A8] active:scale-[0.99]"
        >
          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Módulo Maestro</span>
          <h3 className="text-sm font-extrabold text-[#32325d] tracking-widest uppercase group-hover:text-[#0090A8] transition-colors">TRANSPORTADORES</h3>
        </button>

        <button 
          onClick={() => setActiveModule('cema576')}
          className={`soft-card p-8 text-left group hover:bg-slate-50 transition-all border-l-[6px] border-l-[#2dce89] active:scale-[0.99] ${isAuditor ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={isAuditor}
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
        <div className="flex flex-col w-full">
          {/* Chart Section */}
          <div className="relative w-full">
            <svg className="w-full h-auto" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5e72e4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#5e72e4" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Y-axis labels on the left */}
              <g className="text-[9px] font-bold text-slate-300">
                {yAxisLabels.map((label, index) => {
                  const y = chartPadding.top + (index * (chartHeight / (yAxisLabels.length - 1)));
                  return (
                    <g key={index}>
                      <line 
                        x1={chartPadding.left} 
                        y1={y} 
                        x2={svgWidth - chartPadding.right} 
                        y2={y} 
                        stroke="#f8f9fa" 
                        strokeWidth="1" 
                        strokeDasharray="4,4" 
                      />
                      <text 
                        x={chartPadding.left - 8} 
                        y={y + 3} 
                        textAnchor="end" 
                        className="uppercase tracking-[0.1em] fill-slate-300"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </g>
              
              {/* Y-axis line */}
              <line 
                x1={chartPadding.left} 
                y1={chartPadding.top} 
                x2={chartPadding.left} 
                y2={svgHeight - chartPadding.bottom} 
                stroke="#e2e8f0" 
                strokeWidth="2" 
              />
              
              {/* Data Area Fill */}
              {chartData.some(d => d > 0) ? (
                <path 
                  d={areaPath} 
                  fill="url(#areaGradient)" 
                />
              ) : (
                <path 
                  d={`M${chartPadding.left},${svgHeight - chartPadding.bottom} L${svgWidth - chartPadding.right},${svgHeight - chartPadding.bottom} L${svgWidth - chartPadding.right},${svgHeight - chartPadding.bottom} Z`} 
                  fill="url(#areaGradient)" 
                />
              )}
              
              {/* Data Line */}
              {chartData.some(d => d > 0) ? (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#5e72e4" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="drop-shadow-lg"
                />
              ) : (
                <path 
                  d={`M${chartPadding.left},${svgHeight - chartPadding.bottom} L${svgWidth - chartPadding.right},${svgHeight - chartPadding.bottom}`} 
                  fill="none" 
                  stroke="#5e72e4" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="drop-shadow-lg"
                />
              )}
              

              
              {/* X-axis labels */}
              <g className="text-[9px] font-bold text-slate-300">
                {sampleLabels.map((label, index) => {
                  let x: number;
                  if (sampleLabels.length === 1) {
                    x = chartPadding.left;
                  } else if (index === 0) {
                    x = chartPadding.left;
                  } else if (index === sampleLabels.length - 1) {
                    x = svgWidth - chartPadding.right;
                  } else {
                    x = chartPadding.left + chartWidth / 2;
                  }
                  return (
                    <text 
                      key={index}
                      x={x} 
                      y={svgHeight - 8} 
                      textAnchor="middle" 
                      className="uppercase tracking-[0.1em] fill-slate-300"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>
          
          {/* Stats Footer */}
          <div className="flex justify-center gap-8 sm:gap-12 md:gap-16 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#5e72e4]">{chartData.reduce((a, b) => a + b, 0)}</span>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Total</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#2dce89]">{Math.max(...chartData)}</span>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Máximo</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#fb6340]">
                {chartData.filter(d => d > 0).length}
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Días Act.</span>
            </div>
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
