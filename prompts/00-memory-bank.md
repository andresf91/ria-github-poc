# 🧠 Memory Bank - GitHub Explorer RIA

## Información General del Proyecto

**Nombre**: GitHub Explorer RIA  
**Objetivo**: Aplicación web que consume GitHub API v3 REST  
**Curso**: Rich Internet Applications 2026  
**Docente**: Andrés Pastorini  
**Fecha de Inicio**: Mayo 2026  
**Fase Actual**: Prueba de Concepto (PoC)

---

## 📋 Requisitos Clave del Laboratorio

✅ **Framework**: React 18 + Vite  
✅ **UI**: Bootstrap 5 + Custom CSS (tema oscuro)  
✅ **Rutas Mínimas**: 4 rutas implementadas
- `/` - Home (búsqueda)
- `/user/:username` - Detalle usuario
- `/trending` - Repos populares
- `/repo/:owner/:repo` - Detalle repo

✅ **API**: GitHub API pública (sin autenticación)  
✅ **Storage**: LocalStorage para favoritos (sin BD persistente)  
✅ **Criterios de Evaluación**:
- Mockups: 15 pts
- Navegación: 20 pts
- API: 25 pts
- Código & Git: 10 pts
- Testing & Performance: 20 pts
- Documentación: 10 pts

---

## 🏗️ Arquitectura

### Componentes
```
App.jsx (Router)
├── Navbar
├── Home
│   └── UserCard (list)
├── UserDetail
│   ├── UserProfile
│   ├── ActivityFeed
│   └── RepositoryList
├── Trending
│   └── RepositoryCard (list)
└── RepositoryDetail
    ├── RepoHeader
    ├── RepoStats
    └── RepoLinks
```

### Flujo de Datos
```
User Input
  ↓
Component State (useState)
  ↓
API Service Call (github.js)
  ↓
API Response
  ↓
Update UI / LocalStorage
```

---

## 🔌 Endpoints de GitHub API Utilizados

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/search/users?q=...` | GET | Búsqueda de usuarios |
| `/users/{username}` | GET | Detalle de usuario |
| `/users/{username}/repos` | GET | Repositorios del usuario |
| `/users/{username}/events/public` | GET | Actividad reciente |
| `/search/repositories?q=...` | GET | Repos trending |
| `/repos/{owner}/{repo}` | GET | Detalle de repositorio |

**Rate Limit**: 60 req/hora (sin auth)

---

## 📁 Estructura de Archivos Clave

```
src/
├── App.jsx              # Router principal
├── main.jsx             # Entry point
├── index.css            # Tema oscuro global
├── components/
│   ├── Navbar.jsx
│   ├── Loading.jsx
│   └── ErrorMessage.jsx
├── pages/
│   ├── Home.jsx
│   ├── UserDetail.jsx
│   ├── Trending.jsx
│   └── RepositoryDetail.jsx
└── services/
    └── github.js        # API calls + axios interceptors
```

---

## 🎨 Paleta de Colores (Tema GitHub Oscuro)

| Variable | Valor | Uso |
|----------|-------|-----|
| bg-primary | `#0d1117` | Fondo principal |
| bg-secondary | `#161b22` | Cards/Superficies |
| color-primary | `#238636` | Botones principales |
| color-accent | `#58a6ff` | Links, acentos |
| text-primary | `#c9d1d9` | Texto normal |
| text-muted | `#8b949e` | Texto secundario |
| border | `#30363d` | Bordes |

---

## 🔧 Dependencias Core

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "bootstrap": "^5.3.0",
  "axios": "^1.6.0"
}
```

**Devs**: Vite, Vitest, ESLint

---

## 📝 Funcionalidades Principales

### 1. Home (Búsqueda de Usuarios)
- Input de búsqueda
- Grid de usuarios (cards)
- Link a perfil de usuario
- Botón "Ver en GitHub"

### 2. UserDetail (Perfil)
- Avatar + nombre + bio
- Estadísticas (repos, followers, following)
- Últimos eventos públicos (máx 5)
- Repositorios destacados (máx 6, ordenados por stars)
- Link al perfil de GitHub

### 3. Trending (Repos Populares)
- Repos creados último mes, ordenados por ⭐
- Card con: nombre, descripción, lenguaje, stars, forks
- Link a detalle de repo
- Link directo a GitHub

### 4. RepositoryDetail (Detalles Repo)
- Header: nombre, owner, botón favorito
- Descripción
- Estadísticas: ⭐ stars, 🍴 forks, 👁️ watchers, ⚠️ issues
- Lenguaje, licencia, topics (tags)
- Fechas: creado, último commit
- Links: GitHub, sitio web

### 5. LocalStorage (Favoritos)
```javascript
localStorage.favoriteRepos = JSON.stringify([
  { id, name, owner, url }
])
```

---

## 🧪 Testing Strategy

### Unit Tests
- Servicio GitHub (mocking axios)
- Componentes (rendering, props)
- Hooks custom (si existen)

### Integration Tests
- Flow: Búsqueda → Perfil → Trending → Detalle

### Performance
- Lighthouse: >80 en todas las categorías
- Lazy loading de imágenes
- Code splitting (vite automático)

---

## 📊 Criterios de Aceptación (PoC)

✅ Búsqueda de usuarios funcional  
✅ Navegación entre 4 rutas sin errores  
✅ Llamadas a API exitosas (datos reales)  
✅ Tema oscuro consistente  
✅ Responsive design (mobile + desktop)  
✅ Manejo de errores (network, 404, etc)  
✅ LocalStorage funcional (favoritos)  
✅ README.md completo  
✅ Código limpio y comentado  
✅ Git con commits significativos  

---

## 🚀 Próximos Pasos (Post-PoC)

1. **Mockups finales** (Figma)
2. **Tests unitarios** completos
3. **Documentación adicional** (architecture.md)
4. **Video demo** (30 seg)
5. **Presentación PPT** (7+ diapositivas)
6. **Despliegue** (Vercel/Netlify)
7. **Registro de prompts** (carpeta `/prompts/`)

---

## 🛠️ Comandos Importantes

```bash
# Desarrollo
npm run dev

# Build
npm run build
npm run preview

# Testing
npm test
npm run coverage

# Linting
npm run lint

# Git
git add .
git commit -m "feat: descripción"
git push
```

---

## 📌 Notas Importantes

1. **No usar API privadas**: Solo endpoints públicos
2. **Manejo de errores**: Mostrar mensajes al usuario
3. **Rate limiting**: Considerar para búsquedas frecuentes
4. **Accesibilidad**: Alt text en imágenes, contrast ratios
5. **Performance**: Evitar renders innecesarios
6. **Git**: Commits pequeños y descriptivos
7. **Documentación**: Mantener README actualizado

---

## 🤖 Registro de Prompts IA

Este archivo servirá como base para documentar:
- Prompts utilizados
- Respuestas importantes
- Decisiones de diseño generadas por IA
- Optimizaciones sugeridas

Ver carpeta `/prompts/` para detalle.

---

**Última actualización**: Mayo 2026  
**Estado**: Prueba de Concepto Activa