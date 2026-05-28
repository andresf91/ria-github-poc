# 📁 Estructura del Proyecto - GitHub Explorer RIA

## Árbol de Directorios Recomendado

```
github-explorer-ria/
│
├── src/
│   ├── components/                    # Componentes reutilizables
│   │   ├── Navbar.jsx                # Barra de navegación principal
│   │   ├── Loading.jsx               # Spinner de carga
│   │   └── ErrorMessage.jsx          # Componente de manejo de errores
│   │
│   ├── pages/                         # Páginas/Vistas principales
│   │   ├── Home.jsx                  # Página de búsqueda de usuarios
│   │   ├── UserDetail.jsx            # Detalle de usuario
│   │   ├── Trending.jsx              # Repositorios trending
│   │   └── RepositoryDetail.jsx      # Detalle de repositorio
│   │
│   ├── services/                      # Servicios y llamadas a API
│   │   └── github.js                 # Servicio de GitHub API
│   │
│   ├── App.jsx                        # Componente raíz + Router
│   ├── main.jsx                       # Punto de entrada de React
│   └── index.css                      # Estilos globales (tema oscuro)
│
├── tests/                             # Pruebas unitarias e integración
│   ├── Home.test.jsx
│   ├── UserDetail.test.jsx
│   ├── github.service.test.js
│   └── ... (más tests)
│
├── docs/                              # Documentación adicional
│   ├── mockups-desktop.figma
│   ├── mockups-mobile.figma
│   ├── architecture.md
│   └── api-guide.md
│
├── docker/                            # Configuración Docker
│   ├── Dockerfile
│   └── nginx.conf
│
├── prompts/                           # Registro de prompts IA
│   ├── 00-memory-bank.md
│   ├── 01-setup-inicial.md
│   ├── 02-componentes.md
│   └── ... (más prompts)
│
├── index.html                         # Archivo HTML principal
├── vite.config.js                    # Configuración de Vite
├── vitest.config.js                  # Configuración de Vitest
├── package.json                       # Dependencias y scripts
├── .gitignore                         # Archivos ignorados por Git
├── .eslintrc.json                    # Configuración ESLint (opcional)
├── docker-compose.yml                 # Composición Docker
└── README.md                          # Documentación principal

```

## 📦 Descripción de Carpetas

### `/src`
Código fuente de la aplicación. Punto de entrada para el desarrollo.

### `/src/components`
Componentes React reutilizables:
- **Navbar**: Navegación global
- **Loading**: Spinner de carga
- **ErrorMessage**: Manejo de errores

### `/src/pages`
Páginas/Vistas principales mapeadas a rutas:
- **Home**: Búsqueda de usuarios (ruta: `/`)
- **UserDetail**: Perfil de usuario (ruta: `/user/:username`)
- **Trending**: Repositorios populares (ruta: `/trending`)
- **RepositoryDetail**: Detalle de repo (ruta: `/repo/:owner/:repo`)

### `/src/services`
Servicios de aplicación. Contiene la lógica de llamadas a APIs.

### `/tests`
Pruebas unitarias e integración:
```
tests/
├── unit/
│   ├── services/
│   │   └── github.service.test.js
│   └── utils/
│       └── formatters.test.js
├── integration/
│   ├── Home.integration.test.jsx
│   └── UserDetail.integration.test.jsx
└── e2e/
    └── user-flow.test.js
```

### `/docs`
Documentación:
- Mockups (Figma, Excalidraw)
- Guías de arquitectura
- Documentación de API
- Guías de deployment

### `/prompts`
Registro de uso de IA:
```
prompts/
├── 00-memory-bank.md          # Contexto del proyecto
├── 01-setup-inicial.md        # Setup y estructura
├── 02-componentes-react.md    # Generación de componentes
├── 03-servicio-github-api.md  # Integración de API
├── 04-testing.md              # Tests unitarios
└── 05-documentacion.md        # README y docs
```

### `/docker`
Configuración para containerización:
- **Dockerfile**: Imagen de Node.js + Vite
- **nginx.conf**: Configuración de servidor web

## 🚀 Cómo Organizar tu Código

### Paso 1: Clonar y Estructurar
```bash
mkdir github-explorer-ria
cd github-explorer-ria

# Crear estructura de carpetas
mkdir -p src/{components,pages,services}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs
mkdir -p docker
mkdir -p prompts
```

### Paso 2: Copiar Archivos
```
1. App.jsx y main.jsx → src/
2. Components → src/components/
3. Pages → src/pages/
4. Services → src/services/
5. Tests → tests/
6. Configuración → raíz del proyecto
```

### Paso 3: Instalar y Ejecutar
```bash
npm install
npm run dev
```

## 📝 Convenciones de Nombres

### Componentes React
```javascript
// ✅ Correcto
MyComponent.jsx
MyComponent.module.css

// ❌ Incorrecto
myComponent.jsx
styles.css
```

### Servicios
```javascript
// ✅ Correcto
github.js (servicio)
github.service.js

// ❌ Incorrecto
api.js
utils.js
```

### Tests
```javascript
// ✅ Correcto
Home.test.jsx
github.service.test.js
user-flow.e2e.js

// ❌ Incorrecto
Home.spec.js
test.js
```

## 🔗 Importaciones Recomendadas

```javascript
// Componentes
import Home from '@/pages/Home'
import Navbar from '@/components/Navbar'

// Servicios
import { searchUsers } from '@/services/github'

// Librerías
import { useParams } from 'react-router-dom'
import axios from 'axios'
```

## 💡 Tips de Organización

1. **Mantén componentes pequeños**: Un archivo = Un componente principal
2. **Agrupa por funcionalidad**: No por tipo de archivo
3. **Usa carpetas de característica**: Para proyectos mayores
4. **Centraliza configuración**: `src/config/` para variables globales
5. **Documenta cada carpeta**: Incluye un `README.md` en carpetas complejas

## 📊 Límites de Tamaño Recomendados

- **Componente**: < 300 líneas
- **Página**: < 500 líneas
- **Servicio**: < 400 líneas
- **Test**: < 250 líneas

Si excedes estos límites, considera dividir el archivo.

---

**Última actualización**: Mayo 2026