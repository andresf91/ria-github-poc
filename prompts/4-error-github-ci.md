# Fix fallas de CI en GitHub Actions por package-lock.json corrupto

## Prompt

ayudame a resolver las fallas de los tests de CI: https://github.com/andresf91/ria-github-poc/actions/runs/26720363085/job/78746187475?pr=11

[adjunto: logs de CI descargados de GitHub Actions]

## Response

Causa raíz: el `package-lock.json` estaba corrupto con versiones mezcladas de esbuild. GitHub Actions usa `npm ci`, que requiere que `package.json` y `package-lock.json` estén perfectamente sincronizados — cualquier inconsistencia aborta la instalación con `EUSAGE`.

El lock file tenía esta situación:

```
node_modules/esbuild:             0.25.12   ← versión principal
node_modules/@esbuild/linux-x64:  0.28.0    ← binario de plataforma
node_modules/@esbuild/win32-x64:  0.28.0    ← binario de plataforma
node_modules/@esbuild/darwin-arm64: 0.25.12 ← (único binario correcto, el de Mac)
...
```

Esto ocurrió en dos pasos:
1. El lock file fue generado originalmente en macOS (Apple Silicon), por lo que solo incluyó `@esbuild/darwin-arm64@0.25.12`.
2. Al correr `npm install` luego en Linux para intentar arreglarlo, npm agregó los binarios de las demás plataformas pero resolvió una versión diferente (0.28.0), dejando el archivo en estado inconsistente.

El fix fue regenerar el lock file completamente desde cero en Linux:

```bash
rm package-lock.json
rm -rf node_modules
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

Resultado: todas las plataformas de esbuild quedan en `0.25.12` de forma consistente. `npm ci` pasa sin errores y los 33 tests unitarios corren correctamente.

**Lección:** el `package-lock.json` no debe generarse ni modificarse en macOS si el entorno de CI es Linux. Si se agrega una dependencia nueva en Mac y se hace commit del lock file, los binarios opcionales de plataforma quedan incompletos o en versiones distintas a las que npm resuelve en Linux. La solución definitiva es regenerarlo siempre en Linux (o en CI mismo).