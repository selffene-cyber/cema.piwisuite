
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_R2_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export enum SpliceType {
  VULCANIZED = 'Vulcanized',
  MECHANICAL_LOW_SPEED = 'Mechanical < 500 fpm (2.5 m/s)',
  MECHANICAL_HIGH_SPEED = 'Mechanical >= 500 fpm (2.5 m/s) or greater'
}

export enum Abrasiveness {
  MILD = 'Mildly Abrasive (Index 1-17)',
  MODERATE = 'Moderately Abrasive (Index 18-67)',
  EXTREME = 'Extremely Abrasive (Index 68-416)'
}

export enum Moisture {
  DRY = 'Mild/Dry (<2%)',
  MOIST = 'Medium/Moist (2-8%)',
  WET = 'Heavy/Wet (>8%)',
  SLURRY = 'Severe/Wet/Sticky Slurry'
}

export interface Evaluation {
  id: string;
  timestamp: string;
  clientName: string;
  clientId?: string; // ID del cliente para referencia
  tag: string;
  faena: string;
  tipo_correa: TipoCorrea;
  tipo_correa_valor?: string;
  capacidad_valor: number;
  capacidad: Capacidad;
  tipo_material: TipoMaterial;
  beltWidthValue: number;
  beltWidthUnit: AnchoUnidad;
  beltSpeedValue: number;
  beltSpeedUnit: VelocidadUnidad;
  spliceType: SpliceType;
  abrasiveness: Abrasiveness;
  moisture: Moisture;
  totalScore: number;
  severityClass: number;
  module?: 'CEMA 576' | 'Impacto';
}

export interface User {
  id: string;
  name: string;
  email: string;
  telefono?: string;
  cargo?: string;
  role: UserRole;
  estado: UserEstado;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'Admin' | 'Manager' | 'Técnico' | 'Auditor';
export type UserEstado = 'Activo' | 'Inactivo';

export type TipoCorrea = 'EP' | 'ST';
export type Capacidad = 'ton/h' | 'kg/h' | 'STPH' | 't/día';

export type AnchoUnidad = 'in' | 'mm';
export type VelocidadUnidad = 'm/s' | 'fpm';

export type TipoMaterial =
  // Minerales Metálicos
  | 'Minerales Metálicos (ROM, concentrados y productos intermedios)'
  | 'Mineral de Cobre (ROM / Crudo)'
  | 'Concentrado de Cobre'
  | 'Mineral de Cobre Sulfurado'
  | 'Mineral de Cobre Oxidado'
  | 'Ripios de Lixiviación'
  | 'Mineral de Oro (ROM)'
  | 'Concentrado de Oro'
  | 'Relave de Oro'
  | 'Mineral de Plata'
  | 'Mineral de Zinc'
  | 'Mineral de Plomo'
  | 'Mineral de Molibdeno'
  | 'Mineral de Hierro'
  | 'Concentrado de Hierro'
  | 'Pellets de Hierro'
  | 'Finos de Hierro'
  | 'Sinter Feed'
  | 'Mineral de Manganeso'
  | 'Mineral de Níquel'
  | 'Mineral Polimetálico'
  // Minerales Energéticos
  | 'Carbón Térmico'
  | 'Carbón Metalúrgico'
  | 'Carbón Pulverizado'
  | 'Coque'
  | 'Petcoke'
  | 'Biomasa Industrial (general)'
  | 'Biomasa Forestal'
  | 'Astillas de Madera'
  | 'Chips de Madera'
  | 'Bagazo'
  | 'Residuos Orgánicos Secos (RDF/SRF)'
  // Minerales No Metálicos / Construcción
  | 'Caliza'
  | 'Caliza Triturada'
  | 'Cal Viva'
  | 'Cal Hidratada'
  | 'Dolomita'
  | 'Yeso'
  | 'Caolín'
  | 'Feldespato'
  | 'Arena Silícea'
  | 'Grava'
  | 'Áridos'
  | 'Agregados'
  | 'Hormigón Seco (premezcla)'
  | 'Bentonita'
  | 'Baritina'
  // Cemento y Procesos Industriales
  | 'Clinker de Cemento'
  | 'Crudo de Cemento (Raw Meal)'
  | 'Cemento Portland'
  | 'Polvo de Cemento'
  | 'Harina Cruda'
  | 'Material de Retorno (Bypass)'
  | 'Polvos de Filtro / CKD'
  | 'Escoria de Alto Horno'
  | 'Escoria Granulada'
  // Sales, Litio y Químicos Sólidos
  | 'Sal Gruesa'
  | 'Sal Fina'
  | 'Sal Industrial'
  | 'Cloruro de Sodio'
  | 'Nitrato de Sodio'
  | 'Sulfato de Sodio'
  | 'Carbonato de Litio'
  | 'Hidróxido de Litio'
  | 'Sales de Litio (generales)'
  | 'Boratos'
  | 'Sulfatos'
  | 'Fertilizantes Granulados'
  | 'Fertilizantes en Polvo'
  // Relaves, Residuos y Subproductos
  | 'Relave de Cobre'
  | 'Relave de Oro'
  | 'Relave Espesado'
  | 'Relave Filtrado'
  | 'Polvos Industriales'
  | 'Cenizas Volantes'
  | 'Cenizas de Fondo'
  | 'Escorias'
  | 'Residuos Mineros Secos'
  | 'Residuos Industriales Sólidos'
  // Graneles y Logística Portuaria
  | 'Concentrado Mineral (genérico)'
  | 'Granel Sólido Mineral'
  | 'Granel Industrial'
  | 'Granel Abrasivo'
  | 'Granel Húmedo'
  | 'Granel Seco'
  | 'Stockpile Material'
  | 'Material de Transferencia Portuaria'
  // Otros
  | 'Material Mixto'
  | 'Material Abrasivo Especial'
  | 'Material Pegajoso'
  | 'Material Húmedo'
  | 'Otro (especificar manualmente)';

export type ClienteIndustrial =
  // Minería – Cobre y Metales
  | 'codelco_andina'
  | 'codelco_chuquicamata'
  | 'codelco_el_teniente'
  | 'codelco_radomiro_tomic'
  | 'codelco_ministro_hales'
  | 'codelco_gabriela_mistral'
  | 'codelco_el_salvador'
  | 'bhp_escondida'
  | 'bhp_spence'
  | 'los_pelambres'
  | 'centinela'
  | 'antucoya'
  | 'zaldivar'
  | 'los_bronces'
  | 'collahuasi'
  | 'el_abra'
  | 'candelaria'
  | 'caserones'
  | 'quebrada_blanca'
  | 'carmen_andacollo'
  | 'la_coipa'
  | 'mantoverde'
  | 'minera_carola'
  | 'atacama_kozan'
  | 'punta_del_cobre'
  | 'granate'
  | 'atacama_minerals'
  | 'tres_valles'
  | 'sierra_gorda'
  // Minería – Hierro y No Metálica
  | 'cerro_negro_norte'
  | 'el_romeral'
  | 'los_colorados'
  | 'puerto_punta_totoralillo'
  | 'minera_del_pacifico'
  | 'santa_barbara'
  // Litio y Sales
  | 'sqm'
  | 'albemarle'
  // Energía
  | 'guacolda'
  | 'engie'
  | 'aes_andes'
  | 'colbun'
  | 'enel'
  | 'arauco'
  | 'cmpc'
  // Cemento, Cal y Áridos
  | 'cementos_bio_bio'
  | 'melon'
  | 'polpaico'
  | 'calera_san_antonio'
  | 'calderas_chile'
  // Puertos y Graneles
  | 'puerto_ventanas'
  | 'puerto_angamos'
  | 'puerto_mejillones'
  | 'terminal_puerto_coquimbo'
  | 'tps_valparaiso'
  // Otros / Industriales
  | 'aguas_cap'
  | 'aguas_antofagasta'
  | 'hmc'
  | 'cemin'
  // Otro
  | 'otro';
