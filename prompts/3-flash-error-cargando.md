# Fix flash con mensaje de error mientras busca API

## Prompt
Hay un problema cuando navego por ejemplo a un perfil de usuario o a un repositorio, durante algunos milisegundos aparece un cartel que entiendo podría ser un MessageError que dice "... no encontrado", con rojo.
No puedo sacarle captura porque es muy rápido.
Puede que el API de GitHub demore un poco en responder, cuando lo hace, se muestra lo que se busca bien.
Cómo podemos solucionar para eso? porque es un problema.

## Response
Causa raíz: React StrictMode (activo en desarrollo) monta cada componente dos veces para detectar efectos mal escritos. Lo que pasa en cada navegación:

    1. useEffect arranca → setLoading(true) → empieza el fetch
    2. StrictMode cancela el primer efecto → controller.abort() → llega CanceledError
    3. El catch lo detecta correctamente y no llama a setError()
    4. Pero el finally siempre corre → setLoading(false)
    5. Estado resultante: loading=false, user=null, error=null → renderiza "No encontrado" 💥
    6. El segundo efecto arranca, fetcha bien, todo vuelve a la normalidad

El fix: sacar setLoading(false) del finally y ponerlo solo donde corresponde: en el éxito y en errores reales.

Vale aclarar: este flash solo ocurre en desarrollo porque StrictMode es lo que provoca el doble montado. En producción el build no incluye StrictMode y no hubiera aparecido. Pero era un bug real de todas formas — la regla de no llamar a setLoading(false) en un efecto cancelado es correcta independientemente del entorno.