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
    - Gráfico de actividad con filtros (Día, Semana, Mes, Año).
    - Resumen histórico de las últimas evaluaciones.
- **Módulo CEMA 576**:
    - Historial completo de evaluaciones por cliente y tag.
    - Formulario de evaluación en 3 pasos (Identificación, Datos Técnicos, Condiciones del Material).
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

## 9. Despliegue

### 9.1 Comandos de Despliegue
```bash
# Desplegar Worker (API)
npm run deploy

# Desplegar Frontend (Pages)
npm run build ; npx wrangler pages deploy deployment --project-name=cema-frontend
```

### 9.2 Ramas Git
- **main**: Rama de producción (desplegada automáticamente)
- **desarrollo**: Rama de desarrollo local

### 9.3 Flujo de Trabajo
1. Trabajar en rama `desarrollo`
2. Hacer commits locales
3. Mergear a `main` para desplegar

---

*Este documento es parte del repositorio oficial del Asistente CEMA.*
