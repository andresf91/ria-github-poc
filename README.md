# GitHub Explorer - Prueba de Concepto RIA 2026

Aplicación **Rich Internet Application** que permite explorar usuarios y repositorios de GitHub en tiempo real.

## 🎯 Características

- **Búsqueda de Usuarios**: Encuentra usuarios de GitHub por nombre
- **Detalles de Usuario**: Visualiza perfil, actividad reciente y repositorios destacados
- **Repositorios Trending**: Descubre repositorios populares creados recientemente
- **Detalles del Repositorio**: Información completa, estadísticas y enlaces
- **Favoritos**: Guarda repositorios favoritos en LocalStorage
- **Tema Oscuro**: Interfaz moderna inspirada en GitHub

## 🛠 Stack Tecnológico

- **Framework**: React 19
- **Router**: React Router v7
- **UI Framework**: Bootstrap 5
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library + Playwright (E2E)
- **Styling**: CSS personalizado con variables

### APIs Utilizadas

- **GitHub API** (v3 REST): https://api.github.com
  - `/search/users` - Búsqueda de usuarios
  - `/users/{username}` - Detalles de usuario
  - `/users/{username}/repos` - Repositorios del usuario
  - `/users/{username}/events/public` - Actividad reciente
  - `/search/repositories` - Repositorios trending

## 📋 Rutas y Navegación

| Ruta | Descripción |
|------|-------------|
| `/` | Home - Búsqueda de usuarios |
| `/user/:username` | Detalle de usuario con actividad y repositorios |
| `/trending` | Repositorios populares del último mes |
| `/repo/:owner/:repo` | Detalle completo del repositorio |

## ⚙️ Instalación

### Requisitos previos
- Node.js >= 20
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd github-explorer-ria

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. La aplicación se abrirá en http://localhost:5173
```

### Build para producción

```bash
npm run build
npm run preview
```

### Con Docker

Requisitos previos: tener **Docker Desktop** instalado y en ejecución.

```bash
# Construir la imagen y levantar el contenedor
docker-compose up --build
```

La aplicación quedará disponible en `http://localhost:3000`.

Para detenerlo:

```bash
docker-compose down
```

## 🧪 Testing y Performance

### Tests unitarios (Vitest)

```bash
# Correr los 33 tests unitarios
npm test

# Modo watch
npm run test -- --watch

# Con cobertura
npm run test -- --coverage
```

### Tests E2E (Playwright)

```bash
# Primera vez: instalar browsers
npx playwright install chromium

# Correr los tests E2E
npm run test:e2e

# Con interfaz visual (recomendado para debug)
npm run test:e2e:ui

# Con navegador visible
npm run test:e2e:headed
```

Los tests E2E cubren 2 flujos críticos: búsqueda de usuarios y repositorios trending con toggle de favoritos. Usan mocks de red via `page.route()` para no depender del rate limit de GitHub.

Cuando un test falla en CI (GitHub Actions), se sube automáticamente un reporte con screenshots, videos y trace interactivo.

### Auditoría Lighthouse

> Correr siempre contra el **build de producción**, nunca contra `npm run dev`. El servidor de desarrollo no minifica ni comprime, lo que produce resultados distorsionados.

**Con Vite preview (puerto 4173):**

```bash
# Terminal 1
npm run build
npm run preview

# Terminal 2
npm run lighthouse
```

**Con Docker (puerto 3000):**

```bash
# Terminal 1
docker-compose up --build

# Terminal 2
npm run lighthouse:docker
```

En ambos casos se genera `informe-lighthouse.html` en la raíz del proyecto y se abre automáticamente en el navegador.

**Scores actuales y mínimos esperados:**

| Categoría | Score actual | Mínimo esperado |
|---|---|---|
| Rendimiento | 99 | 80 |
| Accesibilidad | 100 | 80 |
| Prácticas recomendadas | 100 | 80 |
| SEO | 100 | 80 |

## 📁 Estructura del Proyecto

```
github-explorer-ria/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Barra de navegación
│   │   ├── Loading.jsx        # Spinner de carga
│   │   └── ErrorMessage.jsx   # Componente de error
│   ├── pages/
│   │   ├── Home.jsx           # Búsqueda de usuarios
│   │   ├── UserDetail.jsx     # Detalle de usuario
│   │   ├── Trending.jsx       # Repositorios trending
│   │   └── RepositoryDetail.jsx # Detalle de repositorio
│   ├── services/
│   │   └── github.js          # Servicio de GitHub API
│   ├── App.jsx                # Componente raíz
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── tests/
│   ├── e2e/
│   │   ├── busqueda-usuario.spec.js  # E2E: búsqueda → perfil de usuario
│   │   └── trending-favoritos.spec.js # E2E: trending → detalle → favoritos
│   └── ... (tests unitarios e integración)
├── .github/
│   └── workflows/
│       └── playwright.yml     # CI: corre tests E2E en cada push/PR
├── index.html
├── vite.config.js
├── playwright.config.js       # Configuración de Playwright
├── package.json
├── .gitignore
└── README.md
```

## 🎨 Diseño y Mockups

Los mockups fueron creados en **Figma** y están disponibles en:
- `docs/mockups-desktop.figma`
- `docs/mockups-mobile.figma`

### Paleta de Colores
- **Fondo**: `#0d1117`
- **Superficie**: `#161b22`
- **Primario**: `#238636` (Verde GitHub)
- **Acento**: `#58a6ff` (Azul)
- **Texto**: `#c9d1d9`

## 💾 LocalStorage

### Favoritos (Repositorios)

```javascript
// Estructura
localStorage.favoriteRepos = JSON.stringify([
  {
    id: 12345,
    name: "react",
    owner: "facebook",
    url: "https://github.com/facebook/react"
  }
])
```

## 🔍 Consideraciones de API

- **Rate Limit**: 60 requests/hora sin autenticación
- **Auth Token** (Opcional): Agrega `Authorization: token <tu_token>` para 5000 req/hora
- **Timeout**: 10 segundos por request
- **CORS**: Habilitado para acceso desde navegadores

## 📝 Registro de Prompts IA

Se utilizaron herramientas de IA bajo las siguientes condiciones:
- ✅ Prompts registrados en `/prompts/`
- ✅ Memory Bank en `00-memory-bank.md`
- ✅ Declarado en esta sección del README

### Herramientas utilizadas
- Claude (Anthropic) - Generación de código y documentación
- Figma - Diseño de mockups

## 🚀 Despliegue

### Opciones recomendadas

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
# Configurar en Settings > Pages > Deploy from branch
```

## 📊 Video Demo

Video de 30 segundos mostrando:
1. Búsqueda de usuario (ej: "agesic")
2. Navegación a detalle de usuario
3. Visualización de repositorios trending
4. Acceso a detalles de repositorio

📹 Link: [Video](https://drive.google.com/file/d/1ewMkM0jVKI5A4yjPm-4oQ4fVa4byEGAL/view?usp=drive_link)

## 🎓 Presentación

**PPT con mínimo 7 diapositivas:**
1. Portada
2. Mockups (Desktop + Mobile)
3. Arquitectura de Componentes
4. APIs y Flujo de Datos
5. Testing y Performance
6. Demostración en Vivo
7. Conclusiones y Próximos Pasos

📊 Link: [Presentación](https://docs.google.com/presentation/d/17qpOX5XQrkksjObsX6lkRmM9O3HXaWLngQU1XhXg44o/edit?usp=sharing)

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"
```bash
npm install
```

### Rate limit alcanzado
Agrega un GitHub Token en las variables de entorno:
```bash
# .env.local
VITE_GITHUB_TOKEN=tu_token_aqui
```

### Aplicación lenta
1. Verifica Lighthouse (F12 > Lighthouse)
2. Activa "Minimize JavaScript"
3. Optimiza imágenes
4. Implementa lazy loading

## 📄 Licencia

MIT License - Proyecto académico RIA 2026

## ✨ Créditos

- **Estudiantes**: Nicolás Correa Bardanca - Andrés Fernández
- **Docente**: Andrés Pastorini
- **Curso**: Rich Internet Applications 2026
- **Carrera**: Tecnólogo en Informática
- **Institución**: UTU - UDELAR - UTEC

---

**Última actualización**: Mayo 2026
**Versión**: 1.0.0 (Prueba de Concepto)