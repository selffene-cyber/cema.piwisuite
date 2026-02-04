# PROMPT — REGISTRO MAESTRO DE TRANSPORTADORES (ENFOQUE CEMA BOOK)

## PRINCIPIO BASE DEL REGISTRO

El sistema debe implementar un **Registro Maestro de Transportadores**, estructurado en capas, donde **cada variable técnica** cumpla obligatoriamente con los siguientes atributos:

- **Nombre técnico**
- **Unidad** (Sistema Internacional + Sistema Imperial opcional)
- **Tipo de dato** (Numérico, Texto, Booleano, Enum)
- **Cardinalidad** (Único / Repetible)
- **Uso típico** (normas, módulos o cálculos que lo utilizan)
- **Estado del dato**:
  - Medido
  - Estimado
  - Desconocido

El registro debe permitir:
- Datos incompletos
- Evolución en el tiempo
- Uso posterior por múltiples módulos normativos (CEMA 575, 576, 502, ISO 5048, DIN 22101, etc.)

---

## 1️⃣ IDENTIDAD Y CONTEXTO (CORE – OBLIGATORIO)

### 1.1 Identificación

| Variable | Unidad | Tipo | Cardinalidad |
|--------|------|------|--------------|
| Cliente | Enum | 1 |
| Faena / Planta | — | Texto | 1 |
| Área / Proceso | — | Texto | 1 |
| Código Transportador | — | Texto | 1 |
| Nombre descriptivo | — | Texto | 1 |
| Tipo de equipo | — | Enum | 1 |

#### Enums recomendados
- **Cliente:** ClienteSelectorModal.tsx ### este corresponde a un componente disponible en la app

#### Tipo de equipo (Enum)
- Transportador convencional
- Alimentador de banda
- Transportador reversible
- Transportador curvo
- Transportador inclinado fuerte
- Pipe / Tubular

**Uso típico:** organización, trazabilidad, reportes, histórico.

---

## 2️⃣ GEOMETRÍA GLOBAL DEL TRANSPORTADOR (MUY USADA)

### 2.1 Dimensiones principales

| Variable | Unidad SI | Unidad Imperial | Tipo |
|--------|-----------|----------------|------|
| Longitud total | m | ft | Num |
| Elevación total | m | ft | Num (+ / -) |
| Inclinación promedio | ° | ° | Num |
| Ancho de correa | mm | in | Num |
| Velocidad nominal | m/s | ft/min | Num |

**Usado en:** ISO 5048, DIN 22101, CEMA Book, CEMA 502, CEMA 576.

---

### 2.2 Perfil del transportador

| Variable | Tipo | Cardinalidad |
|--------|------|--------------|
| Perfil | Enum | 1 |
| Nº tramos inclinados | Num | 1 |
| Longitud tramo inclinado | m | N |
| Longitud tramo horizontal | m | N |

#### Perfil (Enum)
- Horizontal
- Inclinado
- Mixto

**Uso típico:** cálculo de potencia, tensiones, arranque, análisis dinámico.

---

## 3️⃣ MATERIAL TRANSPORTADO (CORE)

### 3.1 Propiedades principales

| Variable | Unidad SI | Tipo | Cardinalidad |
|--------|-----------|------|--------------|
| Material | — | Texto | 1 |
| Densidad aparente | t/m³ | Num | 1 |
| Tamaño máx. partícula | mm | Num | 1 |
| Tamaño medio | mm | Num | 1 |
| Humedad | % | Enum | 1 |
| Fluidez | — | Enum | 1 |
| Abrasividad | — | Enum | 1 |

#### Enums recomendados
- **Material:** MaterialSelectorModal.tsx ### este corresponde a un componentes disponible en la app
- **Fluidez:** libre / media / pobre
- **Abrasividad:** export enum Abrasiveness {
                    MILD = 'Mildly Abrasive (Index 1-17)',
                    MODERATE = 'Moderately Abrasive (Index 18-67)',
                    EXTREME = 'Extremely Abrasive (Index 68-416)'
                    }
- **Humedad:** export enum Moisture {
                DRY = 'Mild/Dry (<2%)',
                MOIST = 'Medium/Moist (2-8%)',
                WET = 'Heavy/Wet (>8%)',
                SLURRY = 'Severe/Wet/Sticky Slurry'
                }
**Usado en:** CEMA 550, CEMA 575, CEMA 576, CEMA 502, CEMA Book cap. 3.

---

## 4️⃣ CAPACIDAD Y OPERACIÓN

### 4.1 Producción

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Capacidad nominal | t/h | Num | 1 |
| Capacidad máxima | t/h | Num | 1 |
| Factor de llenado | % | Num | 1 |
| Régimen operación | — | Enum | 1 |

#### Régimen de operación (Enum)
- Continuo
- Intermitente
- Campaña

**Uso típico:** impacto, limpieza, potencia, desgaste.

---

## 5️⃣ CORREA TRANSPORTADORA (CEMA BOOK CAP. 7)

### 5.1 Construcción

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Tipo de correa | — | Enum | 1 |
| Resistencia nominal | kN/m | Num | 1 |
| Nº telas / cables | — | Num | 1 |
| Tipo cubierta superior | — | Enum | 1 |
| Tipo cubierta inferior | — | Enum | 1 |
| Espesor cubierta sup. | mm | Num | 1 |
| Espesor cubierta inf. | mm | Num | 1 |

#### Tipo de correa (Enum)
- **tipo_correa_valor:** '', y ### unidad de medida: export type TipoCorrea = 'EP' | 'ST';
- **Tipo cubierta superior:** export type TipoCubiertaSuperior;
- **Tipo cubierta inferior:** export type TipoCubiertaInferior;

**Usado en:** tensiones, transiciones, selección, vida útil.

---

### 5.2 Empalme

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Tipo empalme | — | Enum | 1 |
| Longitud empalme | mm | Num | 1 |

#### Tipo empalme (Enum)
- export enum SpliceType {
  VULCANIZED = 'Vulcanized',
  MECHANICAL_LOW_SPEED = 'Mechanical < 500 fpm (2.5 m/s)',
  MECHANICAL_HIGH_SPEED = 'Mechanical >= 500 fpm (2.5 m/s) or greater'
}

## 6️⃣ POLINES – IDLERS (CEMA 502, BOOK CAP. 5)

### 6.1 Polines de carga

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Ángulo de artesa | ° | Num | 1 |
| Clase CEMA | — | Enum | 1 |
| Diámetro rodillo | mm | Num | 1 |
| Espaciamiento carga | m | Num | 1 |
| Tipo polín | — | Enum | 1 |

#### Clase CEMA (Enum)
- A / B / C / D / E / F / G / H

#### Tipo de polín (Enum)
- **export type TipoPolinCarga =**
  | 'TROUGHING_STANDARD'     // Polín de carga estándar con rodillos en artesa (20°, 35° o 45°). Es la configuración base según CEMA.
  | 'IMPACT_IDLER'           // Polín de impacto con rodillos amortiguados (anillos de goma). Usado en zonas de carga para absorber impacto.
  | 'TRAINING_IDLER'         // Polín de carga autoalineante. Usado como elemento correctivo para problemas de tracking.
  | 'OFFSET_TROUGHING'       // Polín de carga con rodillos desplazados. Aplicaciones especiales de transición o geometría particular.
  | 'EQUAL_TROUGHING'        // Polín de carga con rodillos laterales iguales. Configuración tradicional reconocida por CEMA.
  | 'PICKUP_IDLER'           // Polín ubicado inmediatamente después de la zona de carga, diseñado para estabilizar la correa cargada.
  | 'TRANSITION_IDLER';      // Polín usado en zonas de transición entre tambor plano y artesa.
---

### 6.2 Polines de retorno

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Tipo retorno | — | Enum | 1 |
| Espaciamiento retorno | m | Num | 1 |
| Diámetro rodillo retorno | mm | Num | 1 |

- **Tipo de polín de retorno:**export type TipoRetorno =
                    | 'FLAT_RETURN'        // Retorno plano con un solo rodillo horizontal. Es el tipo más común y estándar según CEMA.
                    | 'V_RETURN'           // Retorno en V (normalmente 10°–15° por lado). Mejora el centrado de la correa en retornos largos.
                    | 'TRAINING_RETURN'    // Polín de retorno autoalineante. Usado para corregir desalineamientos persistentes.
                    | 'RUBBER_DISK_RETURN' // Rodillo de retorno con discos de goma. Reduce acumulación de material pegajoso (carryback).
                    | 'SPIRAL_RETURN'      // Rodillo de retorno espiralado. Facilita la autolimpieza en materiales húmedos o adhesivos.
                    | 'IMPACT_RETURN';     // Retorno reforzado para zonas con caída de material o limpieza agresiva (uso poco común).
**Usado en:** CEMA 502, CEMA 575, CEMA 576.

---

## 7️⃣ ZONAS DE CARGA / TRANSFERENCIA (CEMA 575, 576)

### 7.1 Geometría de carga

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Nº zonas de carga | — | Num | 1 |
| Altura de caída (diseño) | m | Num | 1 |
| Altura de caída (real) | m | Num | 1 |
| Tipo descarga | — | Enum | 1 |
| Tamaño lump máximo | mm | Num | 1 |

#### Tipo de descarga (Enum)
- Central
- Desviada
- En cascada

---

### 7.2 Control de impacto

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Cama de impacto instalada | — | Bool | 1 |
| Tipo cama impacto | — | Enum | 1 |
| Largo cama impacto | m | Num | 1 |

### Enum Tipo cama impacto:
- **Tipos:** IMPACT_IDLER_SET, SLIDER_BED, IMPACT_CRADLE, IMPACT_CRADLE_WITH_CENTER_ROLL, NO_IMPACT_PROTECTION

**CEMA 575 utiliza principalmente este bloque.**

---

## 8️⃣ LIMPIEZA Y CONTROL DE MATERIAL (CEMA 576)

### 8.1 Limpieza

| Variable | Tipo | Cardinalidad |
|--------|------|--------------|
| Limpieza primaria | Bool | 1 |
| Limpieza secundaria | Bool | 1 |
| Tipo limpiador | Enum | 1 |
| Zona de instalación | Enum | 1 |

---

### 8.2 Problemas operacionales

| Variable | Tipo | Cardinalidad |
|--------|------|--------------|
| Carryback | Enum | 1 |
| Derrames | Enum | 1 |
| Acumulación retorno | Enum | 1 |

### Enum Carryback
- **Niveles Carryback:** LEVEL_I:
                                min_g_m2: 250
                                max_g_m2: null
                                descripcion: "Carryback alto, aplicaciones abiertas, no críticas"

                        LEVEL_II:
                                min_g_m2: 100
                                max_g_m2: 250
                                descripcion: "Carryback moderado, minería a rajo abierto"

                        LEVEL_III:
                                min_g_m2: 10
                                max_g_m2: 100
                                descripcion: "Carryback bajo, estándar industrial"

                        LEVEL_IV:
                                min_g_m2: 2
                                max_g_m2: 10
                                descripcion: "Carryback muy bajo, aplicaciones críticas"

### Enum Derrames
- **Derrames:**   export type NivelDerrames =
  | 'NONE- No se observan derrames. Condición limpia y controlada.'
  | 'LOW - Derrames ocasionales y localizados. No afectan la operación.'
  | 'MODERATE- Derrames continuos en zonas específicas. Requieren limpieza rutinaria.'
  | 'HIGH - Derrames frecuentes y extendidos. Impactan mantenimiento y disponibilidad.'
  | 'SEVERE - Derrames masivos o constantes. Condición crítica según CEMA 576.';

- **Acumulacion retorno:** export type NivelAcumulacionRetorno =
  | 'NONE - No hay acumulación visible. Retorno limpio.'
  | 'LOW - Acumulación leve y localizada. No interfiere con la operación.'
  | 'MODERATE - Acumulación continua en puntos definidos. Requiere limpieza periódica.'
  | 'HIGH - Acumulación significativa. Afecta polines, estructura y acceso.'
  | 'SEVERE - Acumulación crítica. Riesgo operativo y de seguridad.';
---

## 9️⃣ TAMBORES Y EJES (BOOK CAP. 8 / CEMA B105.1)

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Tipo tambor | — | Enum | 1 |
| Diámetro tambor | mm | Num | 1 |
| Ancho de cara | mm | Num | 1 |
| Revestimiento | — | Enum | 1 |
| Tipo eje | — | Enum | 1 |

### Enum a utilizar
- **Tipo tambor:** DRIVE (Tambor motriz que transmite potencia a la correa), 
                   TAIL (Tambor de cola, punto de retorno del transportador),
                   SNUB Tambor auxiliar para aumentar ángulo de envolvente en motriz,
                   BEND (Tambor de desvío para cambiar dirección de la correa), 
                   TAKEUP (Tambor asociado al sistema de take-up), 
                   DEFLECTOR (Tambor pequeño de desvío, no portante)

- **Revestimiento:** NONE (Tambor sin revestimiento),
                     RUBBER_PLAIN (Caucho liso),
                     RUBBER_GROOVED	(Caucho ranurado),
                     CERAMIC	(Revestimiento cerámico alta fricción)

- **Tipo eje:** STRAIGHT (Eje recto menos común en grandes diámetros).
                STEPPED	(Eje escalonado, más común en CEMA),
                TAPERED	Eje cónico (aplicaciones especiales),

---

## 🔟 ACCIONAMIENTO (CEMA BOOK CAP. 13)

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Potencia instalada | kW | Num | 1 |
| Nº motores | — | Num | 1 |
| Tipo de arranque | — | Enum | 1 |
| Reductor | — | Texto | 1 |
| Backstop | — | Bool | 1 |
| Freno | — | Bool | 1 |

### Tipo de arranque ENUM
- **Tipo de arranque:** export type TipoArranque =
  | 'DIRECT_ON_LINE - Arranque directo en línea (DOL). Torque alto e inmediato. Usado en transportadores cortos o de baja inercia.'
  | 'STAR_DELTA - Arranque estrella-triángulo. Reduce corriente y torque inicial. Limitado para transportadores cargados.'
  | 'SOFT_STARTER - Arrancador suave por control de tensión. Incremento progresivo de torque. Común en correas convencionales.'
  | 'VFD - Variador de frecuencia. Control total de velocidad, torque y rampas de arranque y parada.'
  | 'FLUID_COUPLING - Acoplamiento hidráulico. Arranque progresivo por deslizamiento del fluido. Usado en aplicaciones pesadas.'
  | 'MAGNETIC_COUPLING - Acoplamiento magnético. Transmisión progresiva de torque sin contacto mecánico directo.'
  | 'WOUND_ROTOR - Motor de rotor bobinado con resistencias externas. Alto torque de arranque controlado (tecnología tradicional).'
  | 'EDDY_CURRENT - Acoplamiento de corrientes parásitas. Arranque suave en sistemas de alta inercia.';

---

## 1️⃣1️⃣ TAKE-UP (CEMA BOOK CAP. 15)

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Tipo take-up | — | Enum | 1 |
| Carrera disponible | m | Num | 1 |
| Ubicación | — | Enum | 1 |

### Enum de Take-UP
-**Tipo take-up:** export type TipoTakeUp =
  | 'SCREW_TAKEUP - Take-up de tornillo (manual). Ajuste mecánico fijo mediante husillos. Usado en transportadores cortos y de baja potencia.'
  | 'GRAVITY_TAKEUP - Take-up por gravedad con contrapeso. Mantiene tensión constante en la correa. Es el sistema preferido por CEMA para transportadores largos.'
  | 'HORIZONTAL_GRAVITY_TAKEUP - Take-up por gravedad horizontal. Variante del contrapeso cuando no hay altura disponible.'
  | 'VERTICAL_GRAVITY_TAKEUP - Take-up por gravedad vertical. Configuración más eficiente para mantener tensión constante.'
  | 'HYDRAULIC_TAKEUP - Take-up hidráulico. Control activo de la tensión. Usado en aplicaciones especiales y transportadores de alta dinámica.'
  | 'WINCH_TAKEUP - Take-up por huinche o cabrestante. Ajuste controlado, común en sistemas largos o temporales.'
  | 'FIXED_TAKEUP - Take-up fijo sin compensación automática. Uso limitado y no recomendado para transportadores de longitud significativa.';

-**Unicacion:** export type UbicacionTakeUp =
  | 'HEAD - Take-up ubicado en la cabeza (head pulley). Mejora el control de tensiones en el tramo cargado.'
  | 'TAIL - Take-up ubicado en la cola (tail pulley). Configuración común en transportadores simples.'
  | 'DRIVE - Take-up ubicado en la estación motriz. Usado cuando el accionamiento no está en cabeza.'
  | 'RETURN - Take-up ubicado en el tramo de retorno. Común en configuraciones con gravedad horizontal.'
  | 'INTERMEDIATE - Take-up ubicado en una posición intermedia del transportador. Usado en sistemas largos o especiales.';


  //Para una relación correcta seria:
    interface TakeUp {
    tipoTakeUp: TipoTakeUp;
    ubicacionTakeUp: UbicacionTakeUp;
    carreraDisponible_m: number;
    } //
---

## 1️⃣2️⃣ CURVAS (CEMA BOOK CAP. 9)

| Variable | Unidad | Tipo | Cardinalidad |
|--------|-------|------|--------------|
| Curvas horizontales | — | Bool | 1 |
| Radio horizontal | m | Num | 1 |
| Curvas verticales | — | Bool | 1 |
| Radio vertical | m | Num | 1 |

---

## 1️⃣3️⃣ METADATOS (CLAVE PARA HISTÓRICO Y TRAZABILIDAD)

| Variable | Tipo |
|--------|------|
| Fecha levantamiento |
| Usuario |
| Fuente del dato |
| Nivel de confianza |
| Comentarios |

---

## PRINCIPIO FINAL

El registro **NO es un cálculo**, es un **repositorio técnico vivo**.
Los módulos normativos **leen del registro**, solicitan solo los datos faltantes
y generan **evaluaciones con histórico asociado al transportador**.
