# Documentación de Tests — GitHub Explorer RIA

## Herramientas

| Herramienta | Rol |
|---|---|
| **Vitest** | Runner de tests unitarios (API 100% compatible con Jest) |
| **@testing-library/react** | Renderizado de componentes y queries de DOM |
| **jsdom** | Simulación de entorno de navegador |
| **vi (Vitest mock)** | Equivalente a `jest.fn()` / `jest.mock()` |
| **Playwright** | Tests E2E contra la app corriendo en el navegador real |

> **Nota:** Aunque el enunciado menciona Jest, el proyecto usa **Vitest** que es drop-in compatible. Los tests se escriben con la misma API (`describe`, `it`, `expect`, `vi.mock`, etc.) y corren con `npm test`.

---

## Ejecutar los tests

```bash
# Tests unitarios (Vitest) — 33 casos
npm test

# Modo watch (re-corre al guardar)
npm run test -- --watch

# Con cobertura
npm run test -- --coverage

# Tests E2E (Playwright) — 3 casos
npm run test:e2e

# E2E con interfaz visual (Playwright UI)
npm run test:e2e:ui

# E2E con navegador visible
npm run test:e2e:headed
```

> Los tests E2E requieren tener instalados los browsers de Playwright.
> La primera vez correr: `npx playwright install chromium`

---

## Tests unitarios (Vitest)

```
tests/
├── Home.test.jsx             # Búsqueda de usuarios (4 casos)
├── DetalleUsuario.test.jsx   # Detalle de usuario (10 casos)
├── DetalleRepo.test.jsx      # Detalle de repositorio + favoritos (4 casos)
├── Popular.test.jsx          # Página de trending (5 casos)
└── github.service.test.js    # Servicio de GitHub API (6 casos)
```

---

### `Home.test.jsx`

Prueba el componente principal de búsqueda de usuarios.

| Test | Descripción |
|---|---|
| Renderiza el formulario | Verifica que el input de búsqueda está presente en el DOM |
| Mensaje inicial | Muestra el hint "Ingresa un nombre de usuario" antes de buscar |
| Búsqueda exitosa | Llama a `searchUsers` y renderiza los resultados |
| Error de red | Muestra mensaje de error cuando la API falla |

---

### `DetalleUsuario.test.jsx`

Prueba el componente de detalle de perfil de usuario.

| Test | Descripción |
|---|---|
| Spinner de carga | Muestra indicador mientras las promesas están pendientes |
| Nombre del usuario | Renderiza el nombre completo del perfil |
| Handle de usuario | Muestra el handle `@username` |
| Stats del perfil | Renderiza repositorios, seguidores y siguiendo |
| Sección de actividad | Muestra eventos recientes cuando existen |
| Repositorios destacados | Lista los repos del usuario |
| Sin actividad | Oculta la sección si no hay eventos |
| Sin repos | Oculta la sección si no hay repositorios |
| Error de carga | Muestra mensaje de error si la API falla |
| Volver al home | El botón "← Volver" está presente |

---

### `DetalleRepo.test.jsx`

Prueba el detalle de un repositorio individual y la funcionalidad de favoritos.

| Test | Descripción |
|---|---|
| Spinner de carga | Muestra indicador mientras la promesa está pendiente |
| Datos del repo | Renderiza nombre, descripción, lenguaje y licencia |
| Toggle favoritos | Agrega al `localStorage` y lo quita en el segundo click |
| Error de carga | Muestra mensaje de error si `getRepositoryDetails` falla |

---

### `Popular.test.jsx`

Prueba la página de repositorios trending.

| Test | Descripción |
|---|---|
| Título de página | El encabezado "Repositorios Populares" está presente |
| Lista de repos | Renderiza los nombres y lenguajes recibidos de la API |
| Sin resultados | Muestra alerta cuando el array viene vacío |
| Error de API | Muestra mensaje de error si `getTrendingRepositories` falla |
| Llamada al mount | Verifica que la API se llama exactamente una vez al montar |

---

### `github.service.test.js`

Prueba el servicio de comunicación con la GitHub API directamente.

| Test | Descripción |
|---|---|
| `searchUsers` éxito | Retorna `{ users, total }` correctamente mapeados |
| `searchUsers` error | Propaga la excepción hacia el llamador |
| `getUserDetails` | Retorna los datos del perfil de usuario |
| `getTrendingRepositories` éxito | Retorna `{ repositories, total }` |
| `getTrendingRepositories` params | Verifica que el query incluye `created:>` y `stars:>100` |
| `getUserActivity` tolerante a fallos | Retorna `[]` en lugar de lanzar error (comportamiento defensivo) |

---

## Tests E2E (Playwright)

```
tests/e2e/
├── busqueda-usuario.spec.js    # Flujo de búsqueda y navegación a perfil (1 caso)
└── trending-favoritos.spec.js  # Flujo de trending y toggle de favoritos (2 casos)
```

Los tests E2E usan `page.route()` de Playwright para interceptar las llamadas a la GitHub API y devolver fixtures predefinidos. Esto elimina la dependencia del rate limit de la API real y hace los tests deterministas.

### `busqueda-usuario.spec.js`

| Test | Descripción |
|---|---|
| Busca un usuario y navega a su perfil | Tipea en el input → hace submit → verifica card → navega a `/user/octocat` → verifica nombre y handle |

### `trending-favoritos.spec.js`

| Test | Descripción |
|---|---|
| Navega a trending y accede al detalle de un repositorio | Va a `/trending` → verifica lista → click en repo → verifica `/repo/octocat/Hello-World` con nombre y descripción |
| El botón de favorito persiste entre recargas | Agrega favorito en `/repo/octocat/Hello-World` → recarga → verifica que el `localStorage` persiste el estado |

### Estrategia de mocking E2E

```js
// Interceptar la API real con fixtures
await page.route('https://api.github.com/search/users*', (route) =>
  route.fulfill({ json: MOCK_USERS })
)
```

Las rutas más específicas se registran primero para evitar que el patrón genérico las capture antes (ej: `/users/octocat/repos*` antes de `/users/octocat`).

### Debugging de tests E2E

Cuando un test falla en GitHub Actions, se sube automáticamente un artefacto `playwright-report` con:
- **Trace Viewer**: replay paso a paso con screenshots, network y console logs
- **Screenshots** de la pantalla al momento del fallo
- **Videos** de la ejecución (solo en el primer reintento)

Para abrir el trace localmente:
```bash
npx playwright show-trace test-results/<nombre-del-test>/trace.zip
```

---

## Estrategia de mocking (tests unitarios)

Todos los tests unitarios **mockean la capa de red** (`axios` o el módulo `github.js`) para:

- Aislar los componentes de la red real
- Controlar las respuestas (éxito, error, vacío)
- Mantener los tests rápidos y deterministas

```js
// Ejemplo: mockear una respuesta exitosa
vi.mock('../services/github', () => ({
  searchUsers: vi.fn(),
}))

github.searchUsers.mockResolvedValueOnce({ users: [...], total: 1 })

// Ejemplo: mockear un error
github.searchUsers.mockRejectedValueOnce(new Error('Network error'))
```

---

## Cobertura objetivo

| Área | Cobertura mínima esperada |
|---|---|
| Componentes (`pages/`) | > 70% |
| Servicio (`github.js`) | > 80% |
| Componentes auxiliares | > 60% |

---

*Última actualización: Mayo 2026*
