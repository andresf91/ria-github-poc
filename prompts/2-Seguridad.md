# Mejoras en Seguridad

## Optimización

Herramienta usada: Claude Code - Modelo Sonnet 4.6 (Alto)

### Prompt
SPA React que consume la API publica de GitHub, sin backend propio. Contexto: proyecto academico, no hay deploy publico activo.

Aplicar las siguientes correcciones de seguridad e infraestructura:

docker/nginx.conf: agregar CSP restringida a los dominios que la app efectivamente usa (api.github.com, avatars.githubusercontent.com), HSTS, Permissions-Policy. Sacar X-XSS-Protection que esta deprecado.
index.html: agregar el mismo CSP como meta tag (fallback si nginx no sirve los headers).
docker-compose.yml: el servicio dev monta todo el directorio del host. Restringirlo a src/, public/ e index.html.
package.json: reemplazar todos los rangos ^ por versiones exactas tomadas del lockfile actual.
Crear .npmrc con save-exact=true para que futuras instalaciones no vuelvan a usar rangos flotantes.
Crear .github/dependabot.yml con schedule semanal para npm.

No modificar tests. No modificar logica de la aplicacion.