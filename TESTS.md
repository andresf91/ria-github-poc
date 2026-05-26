# Documentación de Tests — GitHub Explorer RIA

## Herramientas

| Herramienta | Rol |
|---|---|
| **Vitest** | Runner de tests (API 100% compatible con Jest) |
| **@testing-library/react** | Renderizado de componentes y queries de DOM |
| **jsdom** | Simulación de entorno de navegador |
| **vi (Vitest mock)** | Equivalente a `jest.fn()` / `jest.mock()` |

> **Nota:** Aunque el enunciado menciona Jest, el proyecto usa **Vitest** que es drop-in compatible. Los tests se escriben con la misma API (`describe`, `it`, `expect`, `vi.mock`, etc.) y corren con `npm test`.

---

## Ejecutar los tests

```bash
# Todos los tests
npm test

# Modo watch (re-corre al guardar)
npm run test -- --watch

# Con cobertura
npm run test -- --coverage
```

---

## Archivos de test

```
tests/
├── Home.test.jsx           # Búsqueda de usuarios (4 casos)
├── DetalleRepo.test.jsx    # Detalle de repositorio + favoritos (4 casos)
├── Popular.test.jsx        # Página de trending (5 casos)
└── github.service.test.js  # Servicio de GitHub API (6 casos)
```

---

## Descripción de cada suite

### `Home.test.jsx`

Prueba el componente principal de búsqueda de usuarios.

| Test | Descripción |
|---|---|
| Renderiza el formulario | Verifica que el input de búsqueda está presente en el DOM |
| Mensaje inicial | Muestra el hint "Ingresa un nombre de usuario" antes de buscar |
| Búsqueda exitosa | Llama a `searchUsers` y renderiza los resultados |
| Error de red | Muestra mensaje de error cuando la API falla |

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

## Estrategia de mocking

Todos los tests **mockean la capa de red** (`axios` o el módulo `github.js`) para:

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
