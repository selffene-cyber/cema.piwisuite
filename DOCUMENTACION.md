# Documentación del Proyecto: Asistente CEMA

## 1. Descripción General
**Asistente CEMA** es una aplicación técnica diseñada para ingenieros y personal de terreno en la industria minera e industrial. Su función principal es realizar análisis de severidad en sistemas de limpieza de bandas transportadoras, basándose en el estándar internacional **CEMA 576**.

La aplicación permite digitalizar el proceso de evaluación, eliminando el uso de papel y centralizando el historial de inspecciones con marca de tiempo y datos técnicos precisos.

---

## 2. Tecnologías y Librerías
La aplicación está construida utilizando un stack moderno enfocado en el rendimiento y la mantenibilidad:

- **React 19**: Biblioteca principal para la construcción de la interfaz de usuario basada en componentes.
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático, asegurando la robustez de los datos técnicos procesados.
- **Tailwind CSS**: Framework de utilidades CSS para un diseño altamente personalizado, rápido y consistente.
- **Google Gemini API (@google/genai)**: Preparada para futuras integraciones de análisis inteligente o procesamiento de lenguaje natural.
- **PWA (Progressive Web App)**: Configurada para funcionar como una aplicación nativa en dispositivos móviles, permitiendo el acceso rápido y una experiencia fluida.

---

## 3. Filosofía de Diseño: Mobile-First & Full Responsive
La aplicación ha sido diseñada bajo la estrategia **Mobile-First**:

1.  **Prioridad Móvil**: La interfaz está optimizada para el uso con una sola mano en terreno (botones grandes, navegación simplificada, formularios por pasos).
2.  **Full Responsive**: Gracias a Tailwind CSS, la aplicación escala perfectamente desde smartphones y tablets hasta estaciones de trabajo con monitores de **27 pulgadas**, aprovechando el ancho de banda para gráficos detallados y tablas de datos extensas.
3.  **Estética Profesional**: Inspirado en los temas de *Creative Tim*, utiliza un fondo blanco limpio, bordes definidos y una paleta de colores sólida (azul institucional, verde éxito y rojo alerta) para una lectura clara bajo condiciones de luz solar en terreno.

---

## 4. Funcionalidades del Sistema
- **Login de Usuario**: Acceso seguro para personal autorizado.
- **Dashboard de Inicio**:
    - Acceso rápido a módulos.
    - Gráfico de actividad con filtros por período (Día, Semana, Mes, Año) y módulo.
    - Resumen histórico de las últimas evaluaciones.
- **Módulo CEMA 576**:
    - Historial completo de evaluaciones por cliente y tag.
    - Formulario de evaluación en 3 pasos (Identificación, Datos Técnicos, Condiciones del Material).
    - **Toggle Vista Lista/Tarjeta**: Cambiar entre visualización en lista o tarjetas en el historial.
    - **Filtros Avanzados**: Filtrar por nombre de cliente, clase de severidad, rango de fechas y ancho de banda.
    - **Vista de Detalle**: Página de detalle con gráfico radar y información completa de la evaluación.
    - **Eliminar Evaluación**: Funcionalidad de eliminación con modal de confirmación.
- **Cálculo de Severidad**: Motor de cálculo automático que determina la **Clase de Severidad (C1 a C5)**.

---

## 5. Lógica y Variables Técnicas
El corazón de la aplicación utiliza las siguientes variables para determinar el score de severidad:

| Variable | Descripción | Impacto en Score |
| :--- | :--- | :--- |
| **Ancho de Banda** | De 18" hasta 120" | A mayor ancho, mayor score. |
| **Velocidad** | Medida en FPM (Feet Per Minute) | Velocidades altas aumentan la severidad. |
| **Tipo de Empalme** | Vulcanizado vs Mecánico | Los empalmes mecánicos penalizan el score. |
| **Abrasividad** | Índice de abrasividad del material | Escala según el tipo de mineral. |
| **Humedad** | Estado del material (Seco, Húmedo, Wet, Slurry) | La humedad crítica (sticky) eleva el score. |

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
- [ ] Análisis de Impacto (En construcción)
- [ ] Calculadora Técnica (En construcción)

---

## 7. Configuración PWA

La aplicación está configurada como Progressive Web App (PWA), permitiendo su instalación en dispositivos móviles y escritorio como una aplicación nativa.

### Tecnologías PWA
- **Vite Plugin PWA**: Plugin de Vite para generación automática de Service Worker y manifest
- **Service Worker**: Registro automático para funcionamiento offline
- **Web App Manifest**: Metadatos para instalación en dispositivo

### Archivos de Configuración
| Archivo | Propósito |
| :--- | :--- |
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

### 8.1 Arquitectura General
- **Frontend**: Cloudflare Pages (cema-frontend)
- **API**: Cloudflare Worker (cema-worker)
- **Base de Datos**: Cloudflare D1 (cema_database)
- **Almacenamiento**: Cloudflare R2 (cema-files)

### 8.2 URLs y Endpoints
| Servicio | URL | Propósito |
|----------|-----|-----------|
| Frontend | https://cema.piwisuite.cl | Interfaz de usuario |
| Worker API | https://cema-worker.jeans-selfene.workers.dev/api/* | API REST |
| Pages Preview | https://fcb45036.cema-frontend.pages.dev | Preview de despliegues |

### 8.3 Endpoints de la API
- **POST /api/auth/login** - Autenticación
- **POST /api/auth/register** - Registro
- **GET/POST /api/evaluations** - Evaluaciones CEMA
- **GET /api/evaluations/:id** - Obtener evaluación por ID
- **DELETE /api/evaluations/:id** - Eliminar evaluación por ID
- **GET/POST/DELETE /api/files** - Archivos en R2
- **GET /api/stats** - Estadísticas del dashboard

### 8.4 Flujo de Datos
```
Usuario → cema.piwisuite.cl (Pages)
    ↓ (render React)
    ├─→ /api/* → cema-worker.jeans-selfene.workers.dev (Worker)
    ↓         ├─→ D1 (consultas SQL)
    ↓         └─→ R2 (archivos)
```

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

### 9.3 Flujo de Usuario
1. Desde el Dashboard, el usuario puede ver el historial de evaluaciones.
2. Al seleccionar una evaluación, se navega a la página de detalle.
3. En la página de detalle, el usuario puede ver el gráfico radar con las métricas.
4. Si desea eliminar, confirma la acción en el modal de confirmación.

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

### 11.1 Comandos de Despliegue
```bash
# Desplegar Worker (API)
npm run deploy

# Desplegar Frontend (Pages)
npm run build ; npx wrangler pages deploy deployment --project-name=cema-frontend
```

### 11.2 Ramas Git
- **main**: Rama de producción (desplegada automáticamente)
- **desarrollo**: Rama de desarrollo local

### 11.3 Flujo de Trabajo
1. Trabajar en rama `desarrollo`
2. Hacer commits locales
3. Mergear a `main` para desplegar

---

*Este documento es parte del repositorio oficial del Asistente CEMA.*
