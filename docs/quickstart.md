# 🚀 Quick Start - GitHub Explorer RIA

## ⚡ Inicio en 5 minutos

### Opción 1: Desarrollo Local (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd github-explorer-ria

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# La app se abrirá automáticamente en http://localhost:5173
```

### Opción 2: Con Docker

```bash
# Build de imagen
docker build -t github-explorer .

# Ejecutar contenedor
docker run -p 3000:80 github-explorer

# Acceder a http://localhost:3000
```

### Opción 3: Con Docker Compose

```bash
# Ejecutar aplicación
docker-compose up

# Acceder a http://localhost:3000
```

---

## 📋 Verificación de Instalación

Después de `npm install`, verifica que tienes:

```bash
# Ver versión de Node
node --version  # Debe ser >= 16

# Ver dependencias instaladas
npm ls react react-router-dom bootstrap

# Ejecutar test
npm test  # Debe pasar sin errores
```

---

## 🧪 Primeras Pruebas

### Test 1: Búsqueda de usuario
1. Abre http://localhost:5173
2. Ingresa "torvalds" en la búsqueda
3. Presiona buscar o Enter
4. Deberías ver a Linus Torvalds en los resultados

### Test 2: Perfil de usuario
1. Click en la tarjeta de usuario
2. Verás su perfil con:
   - Avatar y nombre
   - Estadísticas (repos, followers)
   - Últimos eventos
   - Repositorios destacados

### Test 3: Trending
1. Click en "Trending" en la barra de navegación
2. Verás repositorios populares del último mes
3. Click en un repo para ver detalles

### Test 4: Favoritos
1. En una página de detalle de repo
2. Click en el botón ⭐ (star)
3. El estado se guarda en LocalStorage

---

## 📁 Estructura de Archivos (Vista Rápida)

```
github-explorer-ria/
├── src/
│   ├── App.jsx                 ← Router principal
│   ├── pages/                  ← 4 páginas principales
│   ├── components/             ← Componentes reutilizables
│   ├── services/               ← github.js (API calls)
│   └── index.css               ← Estilos tema oscuro
├── tests/                      ← Tests unitarios
├── docker/                     ← Dockerfile + nginx.conf
├── prompts/                    ← Registro de uso de IA
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔌 Verificar Conexión a API

Para asegurar que la API de GitHub funciona:

```bash
# Desde terminal
curl https://api.github.com/search/users?q=torvalds&per_page=5

# Deberías obtener JSON con usuarios
```

Si obtienes error 403: Ya alcanzaste el rate limit de 60 req/hora.

---

## 🎨 Vista Rápida de Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home.jsx | 🔍 Búsqueda de usuarios |
| `/user/:username` | UserDetail.jsx | 👤 Perfil de usuario |
| `/trending` | Trending.jsx | 📈 Repos populares |
| `/repo/:owner/:repo` | RepositoryDetail.jsx | 📦 Detalle de repo |

---

## ⚙️ Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Build para producción (dist/)
npm run preview      # Vista previa de build
npm test             # Ejecutar tests
npm run lint         # Verificar código (ESLint)
```

---

## 🐛 Troubleshooting Rápido

### ❌ Error: "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Error: "Rate limit exceeded"
Esperá 1 hora o agrega un GitHub Token en `.env.local`:
```
VITE_GITHUB_TOKEN=tu_token_aqui
```

### ❌ Puerto 5173 ya está en uso
```bash
npm run dev -- --port 3000
```

### ❌ Build falla
```bash
npm run build -- --debug
```

---

## 📊 Verificar Performance

En la app corriendo:
1. Abre DevTools (F12)
2. Pestaña "Lighthouse"
3. Click "Analyze page load"
4. Objetivo: >80 en todas categorías

---

## 🔐 Variables de Entorno (Opcional)

Crea `.env.local` en la raíz:

```env
# GitHub Token (opcional, aumenta rate limit a 5000 req/hora)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Modo
VITE_ENV=development
```

**Nota**: Sin token funciona bien para el PoC.

---

## 📱 Responsive Design

Prueba en diferentes tamaños:
- 📱 Mobile: 375px (iPhone)
- 📱 Tablet: 768px (iPad)
- 🖥️ Desktop: 1920px (Monitor)

Devtools → Emulate device → Toggle responsive

---

## 🎓 Próximos Pasos

1. ✅ App funcionando localmente
2. 📝 Crear mockups (Figma)
3. 🧪 Escribir tests
4. 📊 Verificar Lighthouse
5. 🎬 Grabar video de 30 seg
6. 📊 Preparar presentación PPT
7. 🚀 Desplegar en Vercel/Netlify

---

## 📞 Soporte Rápido

**GitHub API Docs**: https://docs.github.com/en/rest  
**React Docs**: https://react.dev  
**React Router**: https://reactrouter.com  
**Bootstrap**: https://getbootstrap.com  
**Vite**: https://vitejs.dev

---

**¡La app está lista para desarrollar! 🎉**

Cualquier duda, consulta el README.md completo o la carpeta `/docs/`