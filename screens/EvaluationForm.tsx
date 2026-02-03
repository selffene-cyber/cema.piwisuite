
import React, { useState, useRef, useEffect } from 'react';
import { SpliceType, Abrasiveness, Moisture, Evaluation, TipoCorrea, Capacidad, TipoMaterial, ClienteIndustrial, AnchoUnidad, VelocidadUnidad } from '../types';
import { calculateScores, convertBeltWidthToInches, convertBeltSpeedToFPM, getBeltWidthScore, getBeltSpeedScore, getAbrasivenessScore, getMoistureScore, getSpliceTypeScore } from '../utils/calculator';
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

const CLIENTE_LABELS: Record<ClienteIndustrial, string> = {
  'colbun': 'Colbún',
  'codelco_andina': 'Codelco Andina',
  'codelco_chuquicamata': 'Codelco Chuquicamata',
  'codelco_el_teniente': 'Codelco El Teniente',
  'codelco_radomiro_tomic': 'Codelco Radomiro Tomic',
  'codelco_ministro_hales': 'Codelco Ministro Hales',
  'codelco_gabriela_mistral': 'Codelco Gabriela Mistral',
  'codelco_el_salvador': 'Codelco El Salvador',
  'bhp_escondida': 'BHP Escondida',
  'bhp_spence': 'BHP Spence',
  'los_pelambres': 'Los Pelambres',
  'centinela': 'Centinela',
  'antucoya': 'Antucoya',
  'zaldivar': 'Zaldívar',
  'los_bronces': 'Los Bronces',
  'collahuasi': 'Collahuasi',
  'el_abra': 'El Abra',
  'candelaria': 'Candelaria',
  'caserones': 'Caserones',
  'quebrada_blanca': 'Quebrada Blanca',
  'carmen_andacollo': 'Carmen de Andacollo',
  'la_coipa': 'La Coipa',
  'mantoverde': 'Mantoverde',
  'minera_carola': 'Minera Carola',
  'atacama_kozan': 'Atacama Kozan',
  'punta_del_cobre': 'Punta del Cobre',
  'granate': 'Granate',
  'atacama_minerals': 'Atacama Minerals',
  'tres_valles': 'Tres Valles',
  'sierra_gorda': 'Sierra Gorda',
  'cerro_negro_norte': 'Cerro Negro Norte',
  'el_romeral': 'El Romeral',
  'los_colorados': 'Los Colorados',
  'puerto_punta_totoralillo': 'Puerto Punta Totoralillo',
  'minera_del_pacifico': 'Minera del Pacífico',
  'santa_barbara': 'Santa Bárbara',
  'sqm': 'SQM',
  'albemarle': 'Albemarle',
  'guacolda': 'Guacolda',
  'engie': 'Engie',
  'aes_andes': 'AES Andes',
  'enel': 'Enel',
  'arauco': 'Arauco',
  'cmpc': 'CMPC',
  'cementos_bio_bio': 'Cementos Bío Bío',
  'melon': 'Melón',
  'polpaico': 'Polpaico',
  'calera_san_antonio': 'Calera San Antonio',
  'calderas_chile': 'Calderas Chile',
  'puerto_ventanas': 'Puerto Ventanas',
  'puerto_angamos': 'Puerto Angamos',
  'puerto_mejillones': 'Puerto Mejillones',
  'terminal_puerto_coquimbo': 'Terminal Puerto Coquimbo',
  'tps_valparaiso': 'TPS Valparaíso',
  'aguas_cap': 'Aguas CAP',
  'aguas_antofagasta': 'Aguas Antofagasta',
  'hmc': 'HMC',
  'cemin': 'CEMIN',
  'otro': 'Otro',
};

const TIPO_MATERIAL_VALUES: TipoMaterial[] = [
  // Minerales Metálicos
  'Minerales Metálicos (ROM, concentrados y productos intermedios)',
  'Mineral de Cobre (ROM / Crudo)',
  'Concentrado de Cobre',
  'Mineral de Cobre Sulfurado',
  'Mineral de Cobre Oxidado',
  'Ripios de Lixiviación',
  'Mineral de Oro (ROM)',
  'Concentrado de Oro',
  'Relave de Oro',
  'Mineral de Plata',
  'Mineral de Zinc',
  'Mineral de Plomo',
  'Mineral de Molibdeno',
  'Mineral de Hierro',
  'Concentrado de Hierro',
  'Pellets de Hierro',
  'Finos de Hierro',
  'Sinter Feed',
  'Mineral de Manganeso',
  'Mineral de Níquel',
  'Mineral Polimetálico',
  // Minerales Energéticos
  'Carbón Térmico',
  'Carbón Metalúrgico',
  'Carbón Pulverizado',
  'Coque',
  'Petcoke',
  'Biomasa Industrial (general)',
  'Biomasa Forestal',
  'Astillas de Madera',
  'Chips de Madera',
  'Bagazo',
  'Residuos Orgánicos Secos (RDF/SRF)',
  // Minerales No Metálicos / Construcción
  'Caliza',
  'Caliza Triturada',
  'Cal Viva',
  'Cal Hidratada',
  'Dolomita',
  'Yeso',
  'Caolín',
  'Feldespato',
  'Arena Silícea',
  'Grava',
  'Áridos',
  'Agregados',
  'Hormig\u00f3n Seco (premezcla)',
  'Bentonita',
  'Baritina',
  // Cemento y Procesos Industriales
  'Clinker de Cemento',
  'Crudo de Cemento (Raw Meal)',
  'Cemento Portland',
  'Polvo de Cemento',
  'Harina Cruda',
  'Material de Retorno (Bypass)',
  'Polvos de Filtro / CKD',
  'Escoria de Alto Horno',
  'Escoria Granulada',
  // Sales, Litio y Químicos Sólidos
  'Sal Gruesa',
  'Sal Fina',
  'Sal Industrial',
  'Cloruro de Sodio',
  'Nitrato de Sodio',
  'Sulfato de Sodio',
  'Carbonato de Litio',
  'Hidróxido de Litio',
  'Sales de Litio (generales)',
  'Boratos',
  'Sulfatos',
  'Fertilizantes Granulados',
  'Fertilizantes en Polvo',
  // Relaves, Residuos y Subproductos
  'Relave de Cobre',
  'Relave de Oro',
  'Relave Espesado',
  'Relave Filtrado',
  'Polvos Industriales',
  'Cenizas Volantes',
  'Cenizas de Fondo',
  'Escorias',
  'Residuos Mineros Secos',
  'Residuos Industriales Sólidos',
  // Graneles y Logística Portuaria
  'Concentrado Mineral (genérico)',
  'Granel Sólido Mineral',
  'Granel Industrial',
  'Granel Abrasivo',
  'Granel Húmedo',
  'Granel Seco',
  'Stockpile Material',
  'Material de Transferencia Portuaria',
  // Otros
  'Material Mixto',
  'Material Abrasivo Especial',
  'Material Pegajoso',
  'Material Húmedo',
  'Otro (especificar manualmente)',
];


interface EvaluationFormProps {
  onSave: (evalItem: Evaluation) => void;
  onCancel: () => void;
  onSaveComplete?: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ onSave, onCancel, onSaveComplete }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientId: '' as ClienteIndustrial | '',
    clientManual: '',
    tag: '',
    faena: '',
    tipo_correa: 'EP' as TipoCorrea,
    tipo_correa_valor: '',
    capacidad_valor: 0,
    capacidad: 'ton/h' as Capacidad,
    tipo_material: '' as TipoMaterial,
    beltWidthValue: 36,
    beltWidthUnit: 'in' as AnchoUnidad,
    beltSpeedValue: 400,
    beltSpeedUnit: 'fpm' as VelocidadUnidad,
    spliceType: SpliceType.VULCANIZED,
    abrasiveness: Abrasiveness.MILD,
    moisture: Moisture.DRY,
  });

  const [liveScores, setLiveScores] = useState({
    beltWidth: 0,
    beltSpeed: 0,
    spliceType: 0,
    abrasiveness: 0,
    moisture: 0,
  });

  const [result, setResult] = useState<{ total: number; severityClass: number; breakdown: { beltWidth: number; beltSpeed: number; spliceType: number; abrasiveness: number; moisture: number } } | null>(null);
  const [saving, setSaving] = useState(false);

  const chartRef = useRef<any>(null);

  const updateLiveScores = () => {
    const widthInches = convertBeltWidthToInches(formData.beltWidthValue, formData.beltWidthUnit);
    const speedFPM = convertBeltSpeedToFPM(formData.beltSpeedValue, formData.beltSpeedUnit);
    setLiveScores({
      beltWidth: getBeltWidthScore(widthInches),
      beltSpeed: getBeltSpeedScore(speedFPM),
      spliceType: getSpliceTypeScore(formData.spliceType),
      abrasiveness: getAbrasivenessScore(formData.abrasiveness),
      moisture: getMoistureScore(formData.moisture),
    });
  };

  useEffect(() => {
    updateLiveScores();
  }, [formData.beltWidthValue, formData.beltWidthUnit, formData.beltSpeedValue, formData.beltSpeedUnit, formData.spliceType, formData.abrasiveness, formData.moisture]);

  const handleCalculate = () => {
    const widthInches = convertBeltWidthToInches(formData.beltWidthValue, formData.beltWidthUnit);
    const speedFPM = convertBeltSpeedToFPM(formData.beltSpeedValue, formData.beltSpeedUnit);
    const calc = calculateScores(
      widthInches,
      speedFPM,
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
      severityClass: result.severityClass,
    };
    
    setSaving(true);
    await onSave(newEval);
    setSaving(false);
    if (onSaveComplete) {
      onSaveComplete();
    }
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
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                value={formData.clientId}
                onChange={e => { 
                  const selectedId = e.target.value as ClienteIndustrial;
                  setFormData({
                    ...formData, 
                    clientId: selectedId,
                    clientName: selectedId ? CLIENTE_LABELS[selectedId] : ''
                  }); 
                  setResult(null);
                }}
              >
                <option value="">Seleccionar cliente...</option>
                {Object.entries(CLIENTE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
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
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Faena / Planta</label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                placeholder="Ej. Planta Concentradora"
                value={formData.faena}
                onChange={e => { setFormData({...formData, faena: e.target.value}); setResult(null); }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Tipo Correa Valor</label>
                <input
                  type="text"
                  className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                  placeholder="Ej. 1000/4"
                  value={formData.tipo_correa_valor}
                  onChange={e => { setFormData({...formData, tipo_correa_valor: e.target.value}); setResult(null); }}
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Tipo Correa</label>
                <select
                  className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5"
                  value={formData.tipo_correa}
                  onChange={e => { setFormData({...formData, tipo_correa: e.target.value as TipoCorrea}); setResult(null); }}
                >
                  <option value="EP">EP (Poliester/Poliamida)</option>
                  <option value="ST">ST (Steel/Cable de acero)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Capacidad */}
        <section className="space-y-3">
          <div className="flex items-center space-x-5 border-b border-gray-100 pb-3">
            <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">02</span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.25em]">Capacidad de Transporte</h2>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Capacidad</label>
              <input
                type="number"
                className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-4"
                placeholder="5000"
                value={formData.capacidad_valor || ''}
                onChange={e => { setFormData({...formData, capacidad_valor: parseFloat(e.target.value) || 0}); setResult(null); updateLiveScores(); }}
              />
            </div>
            <div className="w-24">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Unidad</label>
              <select
                className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-3 cursor-pointer"
                value={formData.capacidad}
                onChange={e => { setFormData({...formData, capacidad: e.target.value as Capacidad}); setResult(null); updateLiveScores(); }}
              >
                <option value="ton/h">ton/h</option>
                <option value="kg/h">kg/h</option>
                <option value="STPH">STPH</option>
                <option value="t/día">t/día</option>
              </select>
            </div>
          </div>
        </section>

        {/* Especificaciones Técnicas */}
        <section className="space-y-8">
          <div className="flex items-center space-x-5 border-b border-gray-100 pb-3">
            <span className="text-[11px] font-black text-white w-7 h-7 rounded-lg bg-[#5e72e4] flex items-center justify-center shadow-lg shadow-blue-500/20">02</span>
            <h2 className="text-[12px] font-black text-[#32325d] uppercase tracking-[0.25em]">Diseño del Transportador</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Ancho de Correa */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Ancho de Correa</label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    min="18"
                    max="120"
                    className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-4"
                    value={formData.beltWidthValue}
                    onChange={e => { setFormData({...formData, beltWidthValue: parseFloat(e.target.value) || 0}); setResult(null); updateLiveScores(); }}
                  />
                </div>
                <div className="w-24">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Unidad</label>
                  <select
                    className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-3 cursor-pointer"
                    value={formData.beltWidthUnit}
                    onChange={e => { setFormData({...formData, beltWidthUnit: e.target.value as AnchoUnidad}); setResult(null); updateLiveScores(); }}
                  >
                    <option value="in">pulgadas</option>
                    <option value="mm">milímetros</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  liveScores.beltWidth <= 2 ? 'bg-green-100 text-green-700' :
                  liveScores.beltWidth <= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Score: {liveScores.beltWidth}/8
                </span>
              </div>
            </div>

            {/* Velocidad de Correa */}
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Velocidad de Correa</label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max="1500"
                    className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-4"
                    value={formData.beltSpeedValue}
                    onChange={e => { setFormData({...formData, beltSpeedValue: parseFloat(e.target.value) || 0}); setResult(null); updateLiveScores(); }}
                  />
                </div>
                <div className="w-24">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block mb-1">Unidad</label>
                  <select
                    className="w-full h-11 bg-gray-50/50 border-gray-100 text-[13px] font-bold rounded-xl px-3 cursor-pointer"
                    value={formData.beltSpeedUnit}
                    onChange={e => { setFormData({...formData, beltSpeedUnit: e.target.value as VelocidadUnidad}); setResult(null); updateLiveScores(); }}
                  >
                    <option value="fpm">fpm</option>
                    <option value="m/s">m/s</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  liveScores.beltSpeed <= 2 ? 'bg-green-100 text-green-700' :
                  liveScores.beltSpeed <= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Score: {liveScores.beltSpeed}/8
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 block ml-1">Metodología de Empalme</label>
            <select
              className="w-full md:w-1/2 bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer"
              value={formData.spliceType}
              onChange={e => { setFormData({...formData, spliceType: e.target.value as SpliceType}); setResult(null); updateLiveScores(); }}
            >
              {Object.values(SpliceType).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <div className="mt-2 text-right">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                liveScores.spliceType <= 2 ? 'bg-green-100 text-green-700' :
                liveScores.spliceType <= 5 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                Score: {liveScores.spliceType}/8
              </span>
            </div>
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
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Tipo de Material</label>
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer"
                value={formData.tipo_material}
                onChange={e => { setFormData({...formData, tipo_material: e.target.value as TipoMaterial}); setResult(null); updateLiveScores(); }}
              >
                <option value="">Seleccionar material...</option>
                {TIPO_MATERIAL_VALUES.map(v => (
                  <option key={v} value={v}>{v.length > 50 ? v.substring(0, 50) + '...' : v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nivel de Abrasividad</label>
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer"
                value={formData.abrasiveness}
                onChange={e => { setFormData({...formData, abrasiveness: e.target.value as Abrasiveness}); setResult(null); updateLiveScores(); }}
              >
                {Object.values(Abrasiveness).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <div className="mt-2 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  liveScores.abrasiveness <= 2 ? 'bg-green-100 text-green-700' :
                  liveScores.abrasiveness <= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Score: {liveScores.abrasiveness}/8
                </span>
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Gradiente de Humedad</label>
              <select
                className="w-full bg-gray-50/50 border-gray-100 text-[13px] font-bold py-4 rounded-xl px-5 cursor-pointer"
                value={formData.moisture}
                onChange={e => { setFormData({...formData, moisture: e.target.value as Moisture}); setResult(null); updateLiveScores(); }}
              >
                {Object.values(Moisture).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <div className="mt-2 text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  liveScores.moisture <= 2 ? 'bg-green-100 text-green-700' :
                  liveScores.moisture <= 5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Score: {liveScores.moisture}/8
                </span>
              </div>
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
          </>
        )}

        {/* Acciones del Formulario */}
        <div className="pt-10 flex flex-col items-center gap-6">
          {/* Primera fila: Calcular y Guardar */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-5 justify-center">
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
          {/* Segunda fila: Descargar PDF */}
          <div className="flex justify-center">
            <button
              onClick={handleDownloadPDF}
              disabled={!result}
              className="px-10 py-5 bg-[#2dce89] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#28b37f] transition-all active:scale-[0.98] disabled:opacity-20"
            >
              Descargar PDF
            </button>
          </div>
          {/* Tercera fila: Cancelar */}
          <button
            onClick={onCancel}
            className="px-10 py-4 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-[#f5365c] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar Proceso
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
