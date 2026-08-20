# Cuota — contexto del proyecto

App personal que calcula cuántos días hay que ir a la oficina cada mes para cumplir una cuota
de presencialidad, y cuáles conviene que sean. La usan 4 personas. Se consulta una vez por semana.

## Restricciones — no cambiar sin que te lo pidan explícitamente

Estas decisiones están tomadas a propósito. Si algo parece "mal hecho", probablemente sea una de estas.

- **Un solo archivo HTML, sin build.** `index.html` tiene el HTML, el CSS y el JS adentro.
  No agregues bundler, transpilador, `package.json`, ni `node_modules`.
  El deploy es arrastrar la carpeta a Netlify. Eso tiene que seguir siendo cierto.
- **Sin frameworks ni dependencias.** JS vanilla. No React, no Vue, no Alpine, no jQuery.
  Lo único externo son las fuentes de Google Fonts.
- **Sin backend, sin base de datos, sin autenticación.** No hay servidor. No lo agregues.
- **Los datos de cada persona viven en `localStorage`.** No se sincronizan entre dispositivos
  y está bien así: nadie necesita ver la configuración de otro. El respaldo se exporta a mano.
- **El Google Sheet es solo lectura.** Se lee como CSV publicado. No metas la API de Sheets,
  ni Apps Script, ni credenciales. Si hiciera falta escribir, primero preguntá.
- **El diseño visual es intencional.** Paleta, tipografías y espaciado están definidos en `:root`
  y en el bloque `<style>`. No lo reemplaces por Tailwind ni por un tema genérico.
- **Todo el texto de interfaz está en castellano rioplatense.** Voseo. Mantenelo.

## Cómo está organizado el `index.html`

El `<script>` va en este orden, con separadores en comentarios:

1. `FERIADOS_LOCAL` — lista de respaldo si el Sheet no está configurado o no responde.
2. Constantes y helpers de fecha (`key`, `lunesDe`).
3. Estado: `cfg` (config del usuario), `feriadosRemotos`, `cursor` (mes en pantalla), `tab`.
4. Persistencia: `cargar`, `guardar`, `esInstalada`, `pruebaEscritura`, `pedirPersistencia`.
5. Google Sheet: `normalizarUrl`, `parseCSV`, `aFecha`, `sincronizar`.
6. Cálculo: `mapaFeriados`, `calcular` — el corazón.
7. Acciones: `toggleDia`, `toggleLicencia`, `agruparLicencias`, `descargarIcs`, `resumenTexto`.
8. Render: `pintar` (todo), `pintarTabs` (los cuatro paneles).
9. Eventos.

Cada cambio de estado llama a `guardar()` y después a `pintar()`. `pintar()` redibuja todo.
Es ineficiente y no importa: son 30 celdas.

## El algoritmo (`calcular`)

1. Arma los días del mes. Un día es **hábil** si es lunes a viernes, no es feriado y no es licencia.
2. `base = ceil(hábiles × meta%)`. `requeridos = base + colchón`.
3. Toma los **días fijos** del usuario (por defecto lunes, martes, viernes) que sean hábiles.
4. Si alcanzan de más, saca los que generen fin de semana más largo (`puente`).
5. Si faltan, agrega días de refuerzo priorizando: **semana con menos días fijos** primero
   (ahí es donde pegó un feriado), después el orden de refuerzo configurado, después la fecha.
6. Aplica los **overrides manuales** del usuario encima del resultado. `cfg.overrides` está
   indexado por mes (`"2026-09"`) y guarda `fecha → true/false`.

Lunes+martes+viernes es exactamente 3/5 = 60%, así que el mínimo casi nunca cae justo:
el redondeo hacia arriba suele pedir un día extra. Eso es correcto, no es un bug.

## Cosas abiertas

- **Feriados 2027 incompletos.** Están los fijos por ley y los derivados de Pascua (28/03/2027).
  Faltan los trasladables (Güemes, San Martín, Diversidad Cultural, Soberanía Nacional):
  dependen de un decreto que todavía no salió. Se cargan en el Sheet, no en el código.
- **Las licencias bajan el denominador.** Un día de vacaciones sale del total de hábiles y por
  lo tanto baja el mínimo. Esto está sin confirmar con RRHH. Si resulta que se cuentan como
  ausencia sobre el total del mes, hay que invertirlo en `calcular` (paso 1 y 2).
- La divergencia con la planilla `.xlsx` en semanas partidas entre dos meses es conocida:
  el desempate para elegir el día de refuerzo difiere. El total y el porcentaje coinciden.

## Verificación

No hay tests. Para chequear un cambio en el cálculo, comparar contra estos valores conocidos
(meta 60%, días fijos lun/mar/vie, sin colchón, sin licencias):

| Mes | Hábiles | Mínimo | Oficina | % |
|---|---|---|---|---|
| sep-2026 | 22 | 14 | 14 | 64% |
| oct-2026 | 21 | 13 | 13 | 62% |
| nov-2026 | 20 | 12 | 12 | 60% |
| dic-2026 | 20 | 12 | 12 | 60% |

En diciembre 2026 los dos días de refuerzo tienen que caer en la semana del 7 al 11,
que es la que pierde lunes y martes por feriado.

Con vacaciones del 14 al 25 de septiembre de 2026 (10 días hábiles):
septiembre pasa a 12 hábiles y el mínimo baja a 8.
