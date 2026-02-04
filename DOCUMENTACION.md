# Documentación del Proyecto: Asistente CEMA

## 1. Descripción General
**Asistente CEMA** es una aplicación técnica diseñada para ingenieros y personal de terreno en la industria minera e industrial. Su función principal es realizar análisis de severidad en sistemas de limpieza de bandas transportadoras, basándose en el estándar internacional **CEMA 576**.

La aplicación permite digitalizar el proceso de evaluación, eliminando el uso de papel y centralizando el historial de inspecciones con marca de tiempo y datos técnicos precisos.

**Módulos Principales:**
- **CEMA 576**: Evaluación de severidad en sistemas de limpieza de bandas transportadoras.
- **Maestro de Transportadores**: Gestión integral de datos técnicos de transportadores (geometría, correa, polines, zonas de carga, limpieza, tambores, accionamiento, take-up, curvas).

---


## 2. Tecnologías y Librerías
La aplicación está construida utilizando un stack moderno enfocado en el rendimiento y la mantenibilidad:

- **React 19**: Biblioteca principal para la construcción de la interfaz de usuario basada en componentes.
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático, asegurando la robustez de los datos técnicos procesados.
- **Tailwind CSS**: Framework de utilidades CSS para un diseño altamente personalizado, rápido y consistente.
- **Google Gemini API (@google/genai)**: Preparada para futuras integraciones de análisis inteligente o procesamiento de lenguaje natural.
- **PWA (Progressive Web App)**: Configurada para funcionar como una aplicación nativa en dispositivos móviles, permitiendo el acceso rápido y una experiencia fluida.
- **Chart.js / react-chartjs-2**: Gráficos interactivos (radar, líneas) para visualización de datos técnicos.

---


## 3. Filosofía de Diseño: Mobile-First & Full Responsive
La aplicación ha sido diseñada bajo la estrategia **Mobile-First**:

1.  **Prioridad Móvil**: La interfaz está optimizada para el uso con una sola mano en terreno (botones grandes, navegación simplificada, formularios por pasos).
2.  **Full Responsive**: Gracias a Tailwind CSS, la aplicación escala perfectamente desde smartphones y tablets hasta estaciones de trabajo con monitores de **27 pulgadas**, aprovechando el ancho de banda para gráficos detallados y tablas de datos extensas.
3.  **Estética Profesional**: Inspirado en los temas de *Creative Tim*, utiliza un fondo blanco limpio, bordes definidos y una paleta de colores sólida (azul institucional, verde éxito y rojo alerta) para una lectura clara bajo condiciones de luz solar en terreno.

---


## 4. Funcionalidades del Sistema

### 4.1 Módulo CEMA 576
- **Historial de Evaluaciones**: Lista completa de evaluaciones con filtros por cliente, tag, clase de severidad y fechas.
- **Formulario de Evaluación**: Proceso en 3 pasos (Identificación, Datos Técnicos, Condiciones del Material).
- **Cálculo de Severidad**: Motor de cálculo automático que determina la **Clase de Severidad (C1-C5)** según estándar CEMA 576.
- **Gráfico Radar**: Visualización de las 5 variables de severidad (Ancho, Velocidad, Empalme, Abrasividad, Humedad).
- **Generación de PDF**: Exportación de evaluaciones en formato PDF.

### 4.2 Módulo Maestro de Transportadores (Nuevo)
El módulo de Maestro de Transportadores permite la gestión integral de datos técnicos de transportadores industriales.

#### 4.2.1 Secciones del Formulario
| # | Sección | Descripción |
|---|---------|-------------|
| 1 | **Identidad** | Código transportador, nombre descriptivo, cliente, faena, área, fecha levantamiento |
| 2 | **Geometría** | Longitud total, elevación, inclinación, ancho banda, velocidad nominal, perfil |
| 3 | **Material** | Tipo material, densidad aparente, tamaño partículas, humedad, abrasividad |
| 4 | **Capacidad** | Capacidad nominal/máxima, factor llenado, régimen operación |
| 5 | **Correa** | Tipo correa, resistencia nominal, cubiertas (superior/inferior), espesores, empalme |
| 6 | **Polines** | Polines de carga y retorno (múltiples estaciones configurables) |
| 7 | **Zona de Carga** | Zonas de carga con altura caída, tipo descarga, cama impacto dinámica |
| 8 | **Limpieza** | Sistema de raspadores (múltiples por posición) y problemas operacionales |
| 9 | **Tambores** | Configuración de tambores (drive, tail, snub, bend, etc.) |
| 10 | **Accionamiento** | Potencia instalada, número motores, tipo arranque, reductor |
| 11 | **Take-Up** | Tipo y ubicación del sistema tensor |
| 12 | **Curvas** | Curvas horizontales y verticales con radios |

#### 4.2.2 Características del Formulario
- **Navegación por Pestañas**: 12 pestañas para organización de datos
- **Persistencia de Estado**: Los cambios se preservan al navegar entre pestañas
- **Campos Dinámicos**: Secciones como Zona de Carga y Limpieza permiten agregar múltiples elementos
- **Indicador de Progreso**: Barra de progreso circular mostrando % de completitud
- **Edición y Duplicación**: Posibilidad de editar o duplicar transportadores existentes

#### 4.2.3 Vista de Detalle
La página de detalle muestra información completa del transportador:
- Header con datos principales (código, nombre, cliente, faena)
- Secciones expandibles con progreso de completitud
- Detalle completo de cada sección (polines, zonas, raspadores, tambores)
- Exportación a JSON
- Botones de editar, duplicar y eliminar

---


## 5. Lógica y Variables Técnicas

### 5.1 CEMA 576 - Score de Severidad
El corazón de la aplicación utiliza las siguientes variables para determinar el score de severidad:

| Variable | Descripción | Impacto en Score |
|----------|-------------|------------------|
| **Ancho de Banda** | De 18" hasta 120" | A mayor ancho, mayor score. |
| **Velocidad** | Medida en FPM (Feet Per Minute) | Velocidades altas aumentan la severidad. |
| **Tipo de Empalme** | Vulcanizado vs Mecánico | Los empalmes mecánicos penalizan el score. |
| **Abrasividad** | Índice de abrasividad del material | Escala según el tipo de mineral. |
| **Humedad** | Estado del material (Seco, Húmedo, Wet, Slurry) | La humedad crítica (sticky) eleva el score. |

### 5.2 Campos Dinámicos - Zona de Carga
La sección de Zona de Carga incluye campos dinámicos según el tipo de cama de impacto:

| Tipo Cama Impacto | Campo Adicional |
|-------------------|-----------------|
| IMPACT_IDLER_SET | Número de Polines de Impacto |
| SLIDER_BED | Largo Cama Deslizante |
| IMPACT_CRADLE / IMPACT_CRADLE_WITH_CENTER_ROLL | Número de Estaciones |

**Campos comunes:**
- Largo Zona de Impacto (mm, m, in, ft)
- Marca / Fabricante (opcional)

---


## 6. Estado de Desarrollo
- [x] Login Funcional
- [x] Módulo CEMA 576 (Completo)
- [x] Historial con Timestamp
- [x] Gráficos de Actividad
- [x] Diseño Mobile-First / PWA
- [x] Toggle Vista Lista/Tarjeta
- [x] Filtros Avanzados (cliente, severidad, fecha, ancho de banda)
- [x] Página de Detalle con Gráfico Radar
- [x] Eliminación con Confirmación
- [x] Gráfico con Filtros de Período
- [x] Deployment Unified (Worker + Static Files)
- [x] **Módulo Maestro de Transportadores (NUEVO)**
  - [x] Formulario completo de 12 secciones
  - [x] Campos dinámicos para zonas de carga
  - [x] Sistema de raspadores múltiples por posición
  - [x] Vista de detalle completa
  - [x] Optimización Mobile First
  - [x] Preservación de estado en navegación
  - [x] Exportación JSON
  - [x] Duplicación de transportadores

---


## 7. Configuración PWA

La aplicación está configurada como Progressive Web App (PWA), permitiendo su instalación en dispositivos móviles y escritorio como una aplicación nativa.

### Tecnologías PWA
- **Vite Plugin PWA**: Plugin de Vite para generación automática de Service Worker y manifest
- **Service Worker**: Registro automático para funcionamiento offline
- **Web App Manifest**: Metadatos para instalación en dispositivo

### Archivos de Configuración
| Archivo | Propósito |
|---------|-----------|
| `vite.config.ts` | Configuración del plugin VitePWA |
| `public/manifest.json` | Manifest con metadatos de la aplicación |
| `index.html` | Enlace al manifest y meta tags PWA |

### Características PWA
- **Instalación**: Disponible en navegadores Chrome, Edge, Safari (mobile/desktop)
- **Modo Offline**: Service Worker permite funcionamiento sin conexión
- **Iconos Requeridos**:
  - `icon-192.png` (192x192 px) - Icono para pantalla de inicio
  - `icon-512.png` (512x512 px) - Icono de alta resolución

### Desarrollo Local
```bash
npm run dev    # Servidor con hot reload en http://localhost:3000
npm run build  # Build de producción con optimización PWA
```

---


## 8. Infraestructura Cloudflare

### 8.1 Arquitectura Unificada (Worker + Frontend)

La aplicación utiliza una arquitectura unificada donde **el Worker sirve tanto la API como los archivos estáticos del frontend** mediante el binding `ASSETS`:

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Worker                         │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │   ASSETS        │  │         API Routes               │  │
│  │   Binding       │  │  /api/auth/*                     │  │
│  │  (Static Files) │  │  /api/evaluations/*              │  │
│  │                 │  │  /api/transportadores/*           │  │
│  │  • index.html   │  │  /api/files/*                     │  │
│  │  • /assets/*    │  │  /api/stats/*                    │  │
│  │  • /sw.js       │  └─────────────────────────────────┘  │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
          ↓                    ↓                    ↓
     ┌─────────────────────────────────────────────────────┐
     │              Cloudflare Services                      │
     │  • D1 Database (cema_database)                       │
     │  • R2 Bucket (cema-files)                            │
     └─────────────────────────────────────────────────────┘
```

### 8.2 URLs y Endpoints
| Servicio | URL | Propósito |
|----------|-----|-----------|
| **Frontend + API** | https://cema.piwisuite.cl | Aplicación completa (dominio personalizado) |
| **Worker Directo** | https://cema-piwisuite.jeans-selfene.workers.dev | Worker API + Static Files |
| **D1 Studio** | Cloudflare Dashboard | Administración de base de datos |

### 8.3 Configuración del Worker

**wrangler.toml:**
```toml
name = "cema-piwisuite"
main = "src/worker.ts"
compatibility_date = "2025-02-03"

[[assets]]
binding = "ASSETS"
directory = "deployment"
first_party_hook = true

[[d1_databases]]
binding = "DB"
database_name = "cema_database"
database_id = "..."

[[r2_buckets]]
binding = "FILES"
bucket_name = "cema-files"
```

### 8.4 Endpoints de la API
- **POST /api/auth/login** - Autenticación
- **POST /api/auth/register** - Registro
- **GET/POST /api/evaluations** - Evaluaciones CEMA
- **GET /api/evaluations/:id** - Obtener evaluación por ID
- **DELETE /api/evaluations/:id** - Eliminar evaluación por ID
- **GET/POST /api/transportadores** - Transportadores
- **GET /api/transportadores/:id** - Obtener transportador por ID
- **PUT /api/transportadores/:id** - Actualizar transportador
- **DELETE /api/transportadores/:id** - Eliminar transportador
- **GET/POST/DELETE /api/files** - Archivos en R2
- **GET /api/stats** - Estadísticas del dashboard

### 8.5 Flujo de Datos
```
Usuario → cema.piwisuite.cl (Custom Domain → Worker)
    ↓
    ├─→ Solicitud no-API → ASSETS binding → Serve static file
    ├─→ /api/* → API Handler → D1 (consultas SQL)
    └─→ /files/* → R2 Bucket (archivos)
```

---


## 9. Página de Detalle de Evaluación (EvaluationDetail)

La página de detalle de evaluación proporciona una vista completa e interactiva de cada evaluación CEMA realizada.

### 9.1 Características Principales
- **Visualización Completa**: Muestra todos los datos de la evaluación en formato estructurado.
- **Gráfico Radar**: Visualización gráfica de las métricas de severidad permitiendo comparar rápidamente diferentes aspectos de la evaluación.
- **Score de Severidad**: Display prominente del score calculado y la clase asignada (C1-C5).
- **Información del Cliente**: Datos de identificación del cliente y ubicación del equipo.
- **Datos Técnicos**: Información detallada del equipo evaluado (ancho de banda, velocidad, tipo de empalme).
- **Condiciones del Material**: Datos de abrasividad y humedad.

### 9.2 Acciones Disponibles
- **Ver Detalle**: Acceso a toda la información de la evaluación.
- **Eliminar**: Eliminación de la evaluación con modal de confirmación.
- **Volver**: Navegación de regreso al historial.

---


## 10. Filtros y Vistas del Dashboard

### 10.1 Toggle Vista Lista/Tarjeta
El Dashboard ofrece dos modos de visualización para el historial de evaluaciones:
- **Vista Tarjeta**: Muestra las evaluaciones en formato de tarjetas compactas con información clave visible de un vistazo.
- **Vista Lista**: Muestra las evaluaciones en formato de tabla con columnas ordenadas para comparación rápida.

### 10.2 Filtros Avanzados
El sistema incluye un panel de filtros para optimizar la búsqueda de evaluaciones:

| Filtro | Descripción | Tipo |
|--------|-------------|------|
| **Nombre Cliente** | Filtrar por nombre del cliente evaluado | Texto |
| **Clase Severidad** | Filtrar por clase CEMA (C1-C5) | Selección múltiple |
| **Rango Fechas** | Filtrar por período de evaluación | Fecha inicio/fin |
| **Ancho Banda** | Filtrar por ancho de banda del equipo | Rango o selección |

### 10.3 Aplicación de Filtros
- Los filtros se aplican en tiempo real mientras el usuario escribe o selecciona opciones.
- Es posible combinar múltiples filtros simultáneamente.
- El botón "Limpiar Filtros" reinicia todos los filtros a sus valores por defecto.

---


## 11. Despliegue

### 11.1 Flujo de Trabajo Git

```bash
# 1. Trabajar en rama desarrollo
git checkout desarrollo
git pull origin desarrollo

# 2. Hacer cambios y commit
git add -A
git commit -m "feat: Descripción del cambio"

# 3. Push a desarrollo
git push origin desarrollo

# 4. Merge a main y push (para deployment)
git checkout main
git merge desarrollo
git push origin main

# 5. Deploy del Worker (opcional, ya que Pages auto-deploya)
npx wrangler deploy
```

### 11.2 Deployment Automático

| Acción | Método | Trigger |
|--------|--------|---------|
| **Frontend** | Cloudflare Pages | Push a rama `main` (auto-deploy) |
| **Worker** | Cloudflare Workers | `npx wrangler deploy` (manual) |

### 11.3 Ramas Git
- **main**: Rama de producción (Pages auto-deploya en cada push)
- **desarrollo**: Rama de desarrollo local

### 11.4 Dominio Personalizado

El dominio `cema.piwisuite.cl` está configurado en Cloudflare para apuntar al Worker.

**Para configurar el dominio:**
1. Cloudflare Dashboard → Workers & Pages → cema-piwisuite
2. Settings → Custom Domains
3. Agregar `cema.piwisuite.cl`

---


## 12. Base de Datos D1

### 12.1 Esquema Principal

```sql
-- Tabla de evaluaciones CEMA
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT DEFAULT (datetime('now')),
    client TEXT NOT NULL,
    tag TEXT,
    severity_class TEXT,
    belt_width_value REAL,
    belt_width_unit TEXT,
    belt_speed_value REAL,
    belt_speed_unit TEXT,
    splice_type TEXT,
    material_abrasivity TEXT,
    material_moisture TEXT,
    faena TEXT,
    tipo_material TEXT,
    tipo_correa_valor TEXT,
    capacidad_valor REAL,
    capacidad TEXT,
    score REAL
);

-- Tabla de transportadores (NUEVO)
CREATE TABLE transportadores (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    estado TEXT DEFAULT 'borrador',
    identity TEXT NOT NULL,
    geometria TEXT,
    material TEXT,
    capacidad TEXT,
    correa TEXT,
    polines TEXT,
    zonaCarga TEXT,
    limpieza TEXT,
    tambores TEXT,
    accionamiento TEXT,
    takeUp TEXT,
    curvas TEXT
);

-- Tabla de usuarios
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
```

### 12.2 Comandos D1

```bash
# Ejecutar schema en base de datos remota
npx wrangler d1 execute cema_database --file=schema.sql --remote

# Abrir D1 Studio
npm run db:studio
```

---


## 13. Componentes Principales

### 13.1 Formularios del Módulo Transportadores
| Componente | Descripción |
|------------|-------------|
| `TransportadorIdentityForm` | Datos de identidad y ubicación |
| `TransportadorGeometriaForm` | Dimensiones y perfil del transportador |
| `TransportadorMaterialForm` | Propiedades del material transportado |
| `TransportadorCapacidadForm` | Capacidad de transporte |
| `TransportadorCorreaForm` | Características de la correa |
| `TransportadorPolinesForm` | Configuración de polines |
| `TransportadorZonaCargaForm` | Zonas de carga y cama de impacto |
| `TransportadorLimpiezaForm` | Sistema de raspadores |
| `TransportadorTamboresForm` | Configuración de tambores |
| `TransportadorAccionamientoForm` | Sistema de accionamiento |
| `TransportadorTakeUpForm` | Sistema tensor |
| `TransportadorCurvasForm` | Curvas horizontales y verticales |

### 13.2 Interfaces de Selección
| Componente | Descripción |
|------------|-------------|
| `ClienteSelectorModal` | Selección de cliente industrial |
| `MaterialSelectorModal` | Selección de tipo de material |

---


## 14. Historial de Cambios

### v2.0.0 - Módulo Maestro de Transportadores
**Fecha**: Febrero 2026

**Nuevas Funcionalidades:**
- ✅ Implementación completa del módulo Maestro de Transportadores
- ✅ 12 secciones de formulario con navegación por pestañas
- ✅ Sistema de raspadores múltiples por posición
- ✅ Campos dinámicos para zonas de carga
- ✅ Vista de detalle completa con secciones expandibles
- ✅ Exportación JSON de transportadores
- ✅ Duplicación de transportadores existentes
- ✅ Indicador de progreso circular (% completitud)

**Mejoras:**
- ✅ Optimización Mobile First responsive
- ✅ Botones con iconos para navegación móvil
- ✅ Bug fix: Preservación de estado al navegar entre pestañas
- ✅ Integración de acceso rápido desde Home

**Archivos Modificados:**
- `App.tsx`
- `screens/Home.tsx`
- `screens/TransportadorForm.tsx`
- `screens/TransportadorDetail.tsx`
- `types.ts`
- `components/Transportador*.tsx` (12 componentes)

---


*Este documento es parte del repositorio oficial del Asistente CEMA.*
