# Test Suite Overview

```
tests/
├── Home.test.jsx                        — Search page component + GitHub service smoke test
│   ├── Home Component
│   │   ├── debería renderizar el formulario de búsqueda
│   │   ├── debería mostrar mensaje cuando no hay búsqueda
│   │   ├── debería buscar usuarios al enviar el formulario
│   │   └── debería mostrar error cuando falla la búsqueda
│   └── GitHub Service
│       └── debería construir la URL correcta para búsqueda de usuarios
│
├── Popular.test.jsx                     — Trending repositories page component
│   └── Popular (Trending) Component
│       ├── debería mostrar el título de la página
│       ├── debería listar los repositorios trending recibidos
│       ├── debería mostrar mensaje cuando no hay repositorios
│       ├── debería mostrar error si la API falla
│       └── debería llamar a getTrendingRepositories al montar el componente
│
├── github.service.test.js               — Unit tests for the GitHub API service layer
│   ├── GitHub Service - searchUsers
│   │   ├── debería retornar users y total cuando la API responde correctamente
│   │   └── debería propagar el error cuando la API falla
│   ├── GitHub Service - getUserDetails
│   │   └── debería retornar los datos del usuario
│   ├── GitHub Service - getTrendingRepositories
│   │   ├── debería retornar repositories y total
│   │   └── debería usar un filtro de fecha del último mes
│   ├── GitHub Service - getUserRepositories
│   │   ├── debería retornar el array de repositorios del usuario
│   │   ├── debería solicitar los repos ordenados por estrellas descendente
│   │   └── debería propagar el error cuando la API falla
│   └── GitHub Service - getUserActivity
│       └── debería retornar array vacío si la API falla (comportamiento tolerante a fallos)
│
├── DetalleRepo.test.jsx                 — Repository detail page component
│   └── DetalleRepo Component
│       ├── debería mostrar el spinner mientras carga
│       ├── debería renderizar los datos del repositorio correctamente
│       ├── debería agregar y quitar de favoritos en localStorage
│       └── debería mostrar mensaje de error cuando falla la carga
│
└── DetalleUsuario.test.jsx              — User profile page component
    └── DetalleUsuario Component
        ├── debería mostrar el spinner mientras carga
        ├── debería renderizar el perfil del usuario correctamente
        ├── debería mostrar el login como título cuando el usuario no tiene nombre
        ├── debería mostrar el botón de blog solo cuando el usuario tiene blog
        ├── debería mostrar mensaje de error cuando falla la carga
        ├── debería mostrar la sección de actividad reciente cuando hay eventos
        ├── debería ocultar la sección de actividad cuando no hay eventos
        ├── debería mostrar la sección de repositorios destacados
        ├── debería mostrar como máximo 6 repositorios aunque la API devuelva más
        └── debería llamar a los tres servicios al montar con el username correcto
```

---

## How to run

```bash
# Watch mode (re-runs on file changes — default)
npm test

# Single run, no watch
npm test -- --run

# Single run with verbose output (shows each test name)
npm test -- --run --reporter=verbose

# With coverage report (outputs to coverage/)
npm test -- --run --coverage
```
