
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

// =============================================================================
// ETAPA 1: TIPOS BASE Y ENUMS PARA MAESTRO DE TRANSPORTADORES (CEMA)
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ENUMS DE CONFIGURACIÓN GENERAL DEL TRANSPORTADOR
// -----------------------------------------------------------------------------

/**
 * Tipo de equipo transportador según su configuración mecánica.
 * Clasificación basada en las configuraciones típicas según CEMA.
 */
export enum TipoEquipo {
  TRANSPORTADOR_CONVENCIONAL = 'TRANSPORTADOR_CONVENCIONAL',
  ALIMENTADOR_BANDA = 'ALIMENTADOR_BANDA',
  TRANSPORTADOR_REVERSIBLE = 'TRANSPORTADOR_REVERSIBLE',
  TRANSPORTADOR_CURVO = 'TRANSPORTADOR_CURVO',
  TRANSPORTADOR_INCLINADO_FUERTE = 'TRANSPORTADOR_INCLINADO_FUERTE',
  PIPE_TUBULAR = 'PIPE_TUBULAR'
}

/**
 * Perfil geométrico del transportador.
 * Define la disposición espacial del sistema.
 */
export enum Perfil {
  HORIZONTAL = 'HORIZONTAL',
  INCLINADO = 'INCLINADO',
  MIXTO = 'MIXTO'
}

/**
 * Régimen de operación del transportador.
 * Define el patrón temporal de funcionamiento.
 */
export enum RegimenOperacion {
  CONTINUO = 'CONTINUO',
  INTERMITENTE = 'INTERMITENTE',
  CAMPAÑA = 'CAMPAÑA'
}

// -----------------------------------------------------------------------------
// 2. ENUMS DE CUBIERTAS DE CORREA (CEMA Steel Cord Ratings)
// -----------------------------------------------------------------------------

/**
 * Grado de cubierta superior según clasificación CEMA para correas con cables de acero.
 * Clasificación basada en resistencia a abrasión según estándar CEMA.
 * Nota: Renombrado para evitar conflicto con TipoCubiertaSuperior existente.
 */
export enum GradoCubiertaST {
  ST20 = 'ST20',
  ST25 = 'ST25',
  ST30 = 'ST30',
  ST40 = 'ST40',
  ST50 = 'ST50',
  ST60 = 'ST60',
  ST70 = 'ST70',
  ST80 = 'ST80',
  ST100 = 'ST100',
  ST125 = 'ST125',
  ST150 = 'ST150',
  ST180 = 'ST180',
  ST200 = 'ST200',
  ST250 = 'ST250',
  ST300 = 'ST300',
  ST400 = 'ST400',
  ST500 = 'ST500',
  ST540 = 'ST540',
  ST560 = 'ST560',
  ST630 = 'ST630',
  ST650 = 'ST650',
  ST700 = 'ST700',
  ST750 = 'ST750',
  ST800 = 'ST800',
  ST900 = 'ST900',
  ST1000 = 'ST1000',
  ST1250 = 'ST1250',
  ST1400 = 'ST1400',
  ST1600 = 'ST1600',
  ST1800 = 'ST1800',
  ST2000 = 'ST2000',
  ST2500 = 'ST2500',
  ST3000 = 'ST3000',
  ST3500 = 'ST3500',
  ST4000 = 'ST4000',
  ST4500 = 'ST4500',
  ST5000 = 'ST5000'
}

/**
 * Espesor de cubierta inferior según clasificación métrica.
 * Clasificación basada en espesor de cubierta en milímetros.
 * Nota: Renombrado para evitar conflicto con TipoCubiertaInferior existente.
 */
export enum EspesorCubiertaMetrico {
  M1 = 'M1 (3mm)',
  M2 = 'M2 (5mm)',
  M3 = 'M3 (6mm)',
  M4 = 'M4 (8mm)',
  M5 = 'M5 (10mm)',
  M6 = 'M6 (12mm)',
  M7 = 'M7 (15mm)',
  M8 = 'M8 (18mm)',
  M9 = 'M9 (20mm)',
  M10 = 'M10 (25mm)'
}

/**
 * Clase CEMA para polines de carga.
 * Clasificación según CEMA Book 7ª edición - Capítulo 4 (Idlers).
 * Define la capacidad de carga y aplicación del polín.
 */
export enum ClaseCEMA {
  A = 'A',  // Servicio ligero - CEMA Class A
  B = 'B',  // Servicio ligero a mediano - CEMA Class B
  C = 'C',  // Servicio mediano - CEMA Class C
  D = 'D',  // Servicio mediano a pesado - CEMA Class D
  E = 'E',  // Servicio pesado - CEMA Class E
  F = 'F',  // Servicio muy pesado - CEMA Class F
  G = 'G',  // Servicio extremo - CEMA Class G
  H = 'H'   // Servicio máximo - CEMA Class H
}

// -----------------------------------------------------------------------------
// 3. ENUMS DE TAMBORES
// -----------------------------------------------------------------------------

/**
 * Tipo de tambor según su función en el transportador.
 * Clasificación según CEMA Book 7ª edición.
 */
export enum TipoTambor {
  DRIVE = 'DRIVE',         // Tambor motriz - Transmite la fuerza motriz a la correa
  TAIL = 'TAIL',           // Tambor de cola - Punto de retorno de la correa
  SNUB = 'SNUB',           // Tambor deflector - Cambia el ángulo de tensión
  BEND = 'BEND',           // Tambor de curva - Cambia dirección de la correa
  TAKEUP = 'TAKEUP',       // Tambor de take-up - Proporciona tensión
  DEFLECTOR = 'DEFLECTOR'  // Tambor deflector - Desvia la correa
}

/**
 * Tipo de revestimiento de tambor.
 * Define el material de recubrimiento del tambor.
 */
export enum Revestimiento {
  NONE = 'NONE',
  RUBBER_PLAIN = 'RUBBER_PLAIN',
  RUBBER_GROOVED = 'RUBBER_GROOVED',
  CERAMIC = 'CERAMIC'
}

/**
 * Tipo de eje de tambor.
 * Define la geometría del eje según aplicación.
 */
export enum TipoEje {
  STRAIGHT = 'STRAIGHT',     // Eje recto - Aplicación estándar
  STEPPED = 'STEPPED',       // Eje escalonado - Para diferentes диаметры
  TAPERED = 'TAPERED'        // Eje cónico - Para cargas axiales
}

// -----------------------------------------------------------------------------
// 4. ENUMS DE PROBLEMAS OPERACIONALES
// -----------------------------------------------------------------------------

/**
 * Nivel de carryback (material pegajoso en retorno).
 * Clasificación según severidad CEMA.
 */
export enum NivelCarryback {
  LEVEL_I = 'LEVEL_I',  // Mínimo - Sin acumulación significativa
  LEVEL_II = 'LEVEL_II', // Leve - Acumulación controlada
  LEVEL_III = 'LEVEL_III', // Moderado - Requiere atención
  LEVEL_IV = 'LEVEL_IV'   // Severo - Afecta operación
}

// -----------------------------------------------------------------------------
// 5. ENUMS DE SISTEMA DE LIMPIEZA
// -----------------------------------------------------------------------------

/**
 * Tipo de limpieza de correa.
 */
export enum TipoLimpieza {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY'
}

/**
 * Zona de instalación de componentes.
 */
export enum ZonaInstalacion {
  HEAD = 'HEAD',
  TAIL = 'TAIL',
  RETURN = 'RETURN',
  CARGO = 'CARGO'
}

// -----------------------------------------------------------------------------
// 6. ENUMS DE ZONA DE CARGA
// -----------------------------------------------------------------------------

/**
 * Tipo de cama de impacto.
 */
export enum TipoCamaImpacto {
  IMPACT_IDLER_SET = 'IMPACT_IDLER_SET',
  SLIDER_BED = 'SLIDER_BED',
  IMPACT_CRADLE = 'IMPACT_CRADLE',
  IMPACT_CRADLE_WITH_CENTER_ROLL = 'IMPACT_CRADLE_WITH_CENTER_ROLL',
  NO_IMPACT_PROTECTION = 'NO_IMPACT_PROTECTION'
}

/**
 * Tipo de descarga del material.
 */
export enum TipoDescarga {
  CENTRAL = 'CENTRAL',
  DESVIADA = 'DESVIADA',
  CASCADA = 'CASCADA'
}

// -----------------------------------------------------------------------------
// 7. ENUMS DE FUENTE DE DATOS
// -----------------------------------------------------------------------------

/**
 * Fuente del dato de medición.
 */
export enum FuenteDato {
  MEDIDO = 'MEDIDO',
  ESTIMADO = 'ESTIMADO',
  DESCONOCIDO = 'DESCONOCIDO'
}

// -----------------------------------------------------------------------------
// 8. TIPOS COMPUESTOS
// -----------------------------------------------------------------------------

/**
 * Dato de medición con metadatos.
 * Para manejar datos con estado y trazabilidad.
 */
export interface DatoMedicion<T> {
  valor: T;
  fuente: FuenteDato;
  fecha?: string;
  observaciones?: string;
}

/**
 * Configuración del sistema take-up.
 */
export interface TakeUp {
  tipoTakeUp: TipoTakeUp;
  ubicacionTakeUp: UbicacionTakeUp;
  carreraDisponible_m: number;
}

/**
 * Configuración de polín de carga.
 */
export interface PolinCarga {
  anguloArtesa: number;
  claseCEMA: ClaseCEMA;
  diametroRodillo_mm: number;
  espaciamiento_m: number;
  tipo: TipoPolinCarga;
}

/**
 * Configuración de polín de retorno.
 */
export interface PolinRetorno {
  tipo: TipoRetorno;
  espaciamiento_m: number;
  diametroRodillo_mm: number;
}

/**
 * Configuración de tambor.
 */
export interface Tambor {
  tipo: TipoTambor;
  diametro_mm: number;
  ancho_mm: number;
  revestimiento: Revestimiento;
  tipoEje: TipoEje;
}

/**
 * Configuración de zona de carga.
 */
export interface ZonaCarga {
  alturaCaidaDiseno_m: number;
  alturaCaidaReal_m: number;
  tipoDescarga: TipoDescarga;
  tamanoLumpMax_mm: number;
  camaImpacto: boolean;
  tipoCamaImpacto?: TipoCamaImpacto;
  largoCamaImpacto_m?: number;
}

/**
 * Sistema de limpieza de correa.
 */
export interface SistemaLimpieza {
  limpiezaPrimaria: boolean;
  limpiezaSecundaria: boolean;
  tipolimpieza?: string;
  zonaInstalacion?: ZonaInstalacion;
}

/**
 * Problemas operacionales del transportador.
 */
export interface ProblemasOperacionales {
  carryback: NivelCarryback;
  derrames: NivelDerrames;
  acumulacionRetorno: NivelAcumulacionRetorno;
}

/**
 * Sistema de accionamiento del transportador.
 */
export interface Accionamiento {
  potenciaInstalada_kW: number;
  numMotores: number;
  tipoArranque: TipoArranque;
  reductor: string;
  backstop: boolean;
  freno: boolean;
}

// =============================================================================
// ETAPA 2: IDENTIDAD Y CONTEXTO DEL TRANSPORTADOR
// =============================================================================

// -----------------------------------------------------------------------------
// 1. FUENTE DE LEVANTAMIENTO (Sección 13)
// -----------------------------------------------------------------------------

export type FuenteLevantamiento =
  | 'levantamiento_campo'
  | 'datos_proyecto'
  | 'revision_dibujo'
  | 'especificacion_tecnica'
  | 'otro';

// -----------------------------------------------------------------------------
// 2. INTERFAZ DE IDENTIDAD DEL TRANSPORTADOR (Sección 1)
// -----------------------------------------------------------------------------

export interface TransportadorIdentity {
  // Identificación (sección 1.1)
  cliente: ClienteIndustrial | '';
  clienteNombre?: string; // Nombre descriptivo del cliente
  faena: string;
  area: string;
  codigoTransportador: string;
  nombreDescriptivo: string;
  tipoEquipo: TipoEquipo;
  
  // Metadatos (sección 13)
  fechaLevantamiento: string;
  usuario: string;
  fuenteDato: FuenteLevantamiento;
  nivelConfianza: number; // 0-100
  comentarios?: string;
}

// Estado del registro del transportador
export type RegistroEstado =
  | 'borrador'
  | 'completo'
  | 'validado'
  | 'archivado';

// =============================================================================
// ETAPA 3: GEOMETRÍA, MATERIAL Y CAPACIDAD DEL TRANSPORTADOR
// =============================================================================

// -----------------------------------------------------------------------------
// 1. INTERFAZ DE GEOMETRÍA DEL TRANSPORTADOR (Sección 2)
// -----------------------------------------------------------------------------

export interface TransportadorGeometria {
  // Dimensiones principales (2.1)
  longitudTotal_m: number;
  elevacionTotal_m: number;  // positivo = ascendente, negativo = descendente
  inclinacionPromedio_grados: number;
  anchoBanda_mm: number;
  velocidadNominal_ms: number;
  
  // Perfil (2.2)
  perfil: Perfil;
  numTramosInclinados: number;
  tramosInclinados?: number[];  // longitudes en metros
  tramosHorizontal?: number[];  // longitudes en metros
}

// -----------------------------------------------------------------------------
// 2. INTERFAZ DE MATERIAL TRANSPORTADO (Sección 3)
// -----------------------------------------------------------------------------

export interface TransportadorMaterial {
  // Propiedades principales (3.1)
  material: string;  // Usar MaterialSelectorModal existente
  materialNombre?: string; // Nombre descriptivo del material
  densidadAparante_tm3: number;
  tamanoMaxParticula_mm: number;
  tamanoMedio_mm: number;
  humedad: Moisture;
  fluidez: 'libre' | 'media' | 'pobre';
  abrasividad: Abrasiveness;
}

// -----------------------------------------------------------------------------
// 3. INTERFAZ DE CAPACIDAD DEL TRANSPORTADOR (Sección 4)
// -----------------------------------------------------------------------------

export interface TransportadorCapacidad {
  // Producción (4.1)
  capacidadNominal_th: number;
  capacidadMaxima_th: number;
  factorLlenado_pct: number;
  regimenOperacion: RegimenOperacion;
}

// Interface principal del transportador (combinada)
export interface Transportador {
  id: string;
  identity: TransportadorIdentity;
  geometria?: TransportadorGeometria;
  material?: TransportadorMaterial;
  capacidad?: TransportadorCapacidad;
  correa?: TransportadorCorrea;
  polines?: TransportadorPolines;
  zonaCarga?: TransportadorZonaCarga;
  limpieza?: TransportadorLimpieza;
  tambores?: TransportadorTambores;
  accionamiento?: TransportadorAccionamiento;
  takeUp?: TransportadorTakeUp;
  curvas?: TransportadorCurvas;
  estado: RegistroEstado;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// =============================================================================
// ETAPA 4: COMPONENTES TÉCNICOS DEL TRANSPORTADOR
// =============================================================================

// -----------------------------------------------------------------------------
// 5. INTERFAZ DE CORREA DEL TRANSPORTADOR (Sección 5)
// -----------------------------------------------------------------------------

export interface TransportadorCorrea {
  // Construcción (5.1)
  tipo: 'EP' | 'ST';
  resistenciaNominal_kNm: number;
  numTelasCables: number;
  tipoCubiertaSuperior: string;
  tipoCubiertaInferior: string;
  espesorCubiertaSup_mm: number;
  espesorCubiertaInf_mm: number;
  
  // Empalme (5.2)
  tipoEmpalme: SpliceType;
  longitudEmpalme_mm: number;
}

// -----------------------------------------------------------------------------
// 6. INTERFAZ DE POLINES DEL TRANSPORTADOR (Sección 6)
// -----------------------------------------------------------------------------

export interface TransportadorPolines {
  // Polines de carga (6.1)
  polinesCarga: PolinCarga[];
  
  // Polines de retorno (6.2)
  polinesRetorno: PolinRetorno[];
}

// -----------------------------------------------------------------------------
// 7. INTERFAZ DE ZONA DE CARGA DEL TRANSPORTADOR (Sección 7)
// -----------------------------------------------------------------------------

export interface TransportadorZonaCarga {
  // Geometría de carga (7.1)
  numZonasCarga: number;
  zonas: ZonaCarga[];
}

// -----------------------------------------------------------------------------
// 8. INTERFAZ DE LIMPIEZA DEL TRANSPORTADOR (Sección 8)
// -----------------------------------------------------------------------------

export interface TransportadorLimpieza {
  // Limpieza (8.1)
  limpiezaPrimaria: boolean;
  limpiezaSecundaria: boolean;
  tipoLimpiador?: string;
  zonaInstalacion?: ZonaInstalacion;
  
  // Problemas operacionales (8.2)
  problemas: ProblemasOperacionales;
}

// -----------------------------------------------------------------------------
// 9. INTERFAZ DE TAMBORES DEL TRANSPORTADOR (Sección 9)
// -----------------------------------------------------------------------------

export interface TransportadorTambores {
  tambores: Tambor[];
}

// -----------------------------------------------------------------------------
// 10. INTERFAZ DE ACCIONAMIENTO DEL TRANSPORTADOR (Sección 10)
// -----------------------------------------------------------------------------

export interface TransportadorAccionamiento {
  potenciaInstalada_kW: number;
  numMotores: number;
  tipoArranque: TipoArranque;
  reductor: string;
  backstop: boolean;
  freno: boolean;
}

// -----------------------------------------------------------------------------
// 11. INTERFAZ DE TAKE-UP DEL TRANSPORTADOR (Sección 11)
// -----------------------------------------------------------------------------

export interface TransportadorTakeUp {
  takeUp: TakeUp;
}

// -----------------------------------------------------------------------------
// 12. INTERFAZ DE CURVAS DEL TRANSPORTADOR (Sección 12)
// -----------------------------------------------------------------------------

export interface TransportadorCurvas {
  curvasHorizontales: boolean;
  radioHorizontal_m: number;
  curvasVerticales: boolean;
  radioVertical_m: number;
}

