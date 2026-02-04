
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

export type TipoCubiertaSuperior =
  | 'DIN_X (Alta resistencia a abrasión. Uso en minería severa y materiales altamente abrasivos).' 
  | 'DIN_Y (Resistencia media a abrasión. Uso industrial general).'
  | 'DIN_Z (Servicio liviano. Materiales poco abrasivos).'
  | 'RMA_1'              // Alta resistencia a abrasión y corte según RMA (equivalente aproximado a DIN X).
  | 'RMA_2'              // Servicio general según RMA (equivalente aproximado a DIN Y / Z).
  | 'OIL_RESISTANT (Compuesto resistente a aceites, grasas e hidrocarburos).'
  | 'HEAT_RESISTANT (Diseñada para transporte de material a alta temperatura).'
  | 'DIN K (Cubierta retardante al fuego para aplicaciones con requisitos de seguridad.).'
  | 'CHEMICAL_RESISTANT (Resistente a ambientes o materiales químicamente agresivos).'
  | 'FOOD_GRADE (Cumple requisitos sanitarios para aplicaciones alimentarias).';

export type TipoCubiertaInferior =
  | 'DIN_X (Alta resistencia a abrasión para retornos con fuerte desgaste por carryback).'
  | 'DIN_Y (Cubierta inferior estándar para la mayoría de los transportadores).'
  | 'DIN_Z (Servicio liviano, bajas exigencias mecánicas en retorno).' 
  | 'RMA_1'              // Alta resistencia al desgaste en retornos severos.
  | 'RMA_2'              // Retorno de uso general según RMA.
  | 'LOW_FRICTION (Bajo coeficiente de fricción. Requerida para camas deslizantes (slider beds)).'
  | 'OIL_RESISTANT (Resistente a aceites y grasas en el retorno).'      // .
  | 'DIN K (Cubierta retardante al fuego para aplicaciones con requisitos de seguridad.).'
  | 'FOOD_GRADE (Cumple requisitos sanitarios para aplicaciones alimentarias).'
  | 'CHEMICAL_RESISTANT (Resistente a ambientes o materiales químicamente agresivos).';

  /**
 * Tipo de polín de retorno.
 * Clasificación según CEMA Book 7ª edición.
 * Define la geometría y función del soporte de la correa en el tramo de retorno.
 */
export type TipoRetorno =
  | 'FLAT_RETURN'        // Retorno plano con un solo rodillo horizontal. Es el tipo más común y estándar según CEMA.
  | 'V_RETURN'           // Retorno en V (normalmente 10°–15° por lado). Mejora el centrado de la correa en retornos largos.
  | 'TRAINING_RETURN'    // Polín de retorno autoalineante. Usado para corregir desalineamientos persistentes.
  | 'RUBBER_DISK_RETURN' // Rodillo de retorno con discos de goma. Reduce acumulación de material pegajoso (carryback).
  | 'SPIRAL_RETURN'      // Rodillo de retorno espiralado. Facilita la autolimpieza en materiales húmedos o adhesivos.
  | 'IMPACT_RETURN';     // Retorno reforzado para zonas con caída de material o limpieza agresiva (uso poco común).

  /**
 * Tipo de polín de carga.
 * Clasificación según CEMA Book 7ª edición.
 * Define la geometría, función y comportamiento del soporte de la correa en el tramo de carga.
 */
export type TipoPolinCarga =
  | 'TROUGHING_STANDARD'     // Polín de carga estándar con rodillos en artesa (20°, 35° o 45°). Es la configuración base según CEMA.
  | 'IMPACT_IDLER'           // Polín de impacto con rodillos amortiguados (anillos de goma). Usado en zonas de carga para absorber impacto.
  | 'TRAINING_IDLER'         // Polín de carga autoalineante. Usado como elemento correctivo para problemas de tracking.
  | 'OFFSET_TROUGHING'       // Polín de carga con rodillos desplazados. Aplicaciones especiales de transición o geometría particular.
  | 'EQUAL_TROUGHING'        // Polín de carga con rodillos laterales iguales. Configuración tradicional reconocida por CEMA.
  | 'PICKUP_IDLER'           // Polín ubicado inmediatamente después de la zona de carga, diseñado para estabilizar la correa cargada.
  | 'TRANSITION_IDLER';      // Polín usado en zonas de transición entre tambor plano y artesa.

export type NivelDerrames =
  | 'NONE- No se observan derrames. Condición limpia y controlada.'
  | 'LOW - Derrames ocasionales y localizados. No afectan la operación.'
  | 'MODERATE- Derrames continuos en zonas específicas. Requieren limpieza rutinaria.'
  | 'HIGH - Derrames frecuentes y extendidos. Impactan mantenimiento y disponibilidad.'
  | 'SEVERE - Derrames masivos o constantes. Condición crítica según CEMA 576.';

  export type NivelAcumulacionRetorno =
  | 'NONE - No hay acumulación visible. Retorno limpio.'
  | 'LOW - Acumulación leve y localizada. No interfiere con la operación.'
  | 'MODERATE - Acumulación continua en puntos definidos. Requiere limpieza periódica.'
  | 'HIGH - Acumulación significativa. Afecta polines, estructura y acceso.'
  | 'SEVERE - Acumulación crítica. Riesgo operativo y de seguridad.';

  /**
 * Tipo de arranque del accionamiento del transportador.
 * Según CEMA Book 7ª edición – Capítulo 13 (Conveyor Motor Drives and Controls).
 * El texto descriptivo forma parte del valor del enum para uso directo en UI.
 */
export type TipoArranque =
  | 'DIRECT_ON_LINE - Arranque directo en línea (DOL). Torque alto e inmediato. Usado en transportadores cortos o de baja inercia.'
  | 'STAR_DELTA - Arranque estrella-triángulo. Reduce corriente y torque inicial. Limitado para transportadores cargados.'
  | 'SOFT_STARTER - Arrancador suave por control de tensión. Incremento progresivo de torque. Común en correas convencionales.'
  | 'VFD - Variador de frecuencia. Control total de velocidad, torque y rampas de arranque y parada.'
  | 'FLUID_COUPLING - Acoplamiento hidráulico. Arranque progresivo por deslizamiento del fluido. Usado en aplicaciones pesadas.'
  | 'MAGNETIC_COUPLING - Acoplamiento magnético. Transmisión progresiva de torque sin contacto mecánico directo.'
  | 'WOUND_ROTOR - Motor de rotor bobinado con resistencias externas. Alto torque de arranque controlado (tecnología tradicional).'
  | 'EDDY_CURRENT - Acoplamiento de corrientes parásitas. Arranque suave en sistemas de alta inercia.';

  /**
 * Tipo de sistema de take-up del transportador.
 * Según CEMA Book 7ª edición – Capítulo 15 (Belt Takeups).
 * El texto descriptivo forma parte del valor del enum para uso directo en la UI.
 */
export type TipoTakeUp =
  | 'SCREW_TAKEUP - Take-up de tornillo (manual). Ajuste mecánico fijo mediante husillos. Usado en transportadores cortos y de baja potencia.'
  | 'GRAVITY_TAKEUP - Take-up por gravedad con contrapeso. Mantiene tensión constante en la correa. Es el sistema preferido por CEMA para transportadores largos.'
  | 'HORIZONTAL_GRAVITY_TAKEUP - Take-up por gravedad horizontal. Variante del contrapeso cuando no hay altura disponible.'
  | 'VERTICAL_GRAVITY_TAKEUP - Take-up por gravedad vertical. Configuración más eficiente para mantener tensión constante.'
  | 'HYDRAULIC_TAKEUP - Take-up hidráulico. Control activo de la tensión. Usado en aplicaciones especiales y transportadores de alta dinámica.'
  | 'WINCH_TAKEUP - Take-up por huinche o cabrestante. Ajuste controlado, común en sistemas largos o temporales.'
  | 'FIXED_TAKEUP - Take-up fijo sin compensación automática. Uso limitado y no recomendado para transportadores de longitud significativa.';

  /**
 * Ubicación del sistema de take-up en el transportador.
 * Según CEMA Book 7ª edición – Capítulo 15.
 * La ubicación influye directamente en la distribución de tensiones de la correa.
 */
export type UbicacionTakeUp =
  | 'HEAD - Take-up ubicado en la cabeza (head pulley). Mejora el control de tensiones en el tramo cargado.'
  | 'TAIL - Take-up ubicado en la cola (tail pulley). Configuración común en transportadores simples.'
  | 'DRIVE - Take-up ubicado en la estación motriz. Usado cuando el accionamiento no está en cabeza.'
  | 'RETURN - Take-up ubicado en el tramo de retorno. Común en configuraciones con gravedad horizontal.'
  | 'INTERMEDIATE - Take-up ubicado en una posición intermedia del transportador. Usado en sistemas largos o especiales.';

