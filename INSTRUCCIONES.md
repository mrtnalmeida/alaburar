# Cuota — puesta en marcha

Tres pasos. El primero es opcional pero es el que hace que valga la pena.

---

## 1. El Google Sheet de feriados

Es lo único compartido. Vos lo actualizás, a los cuatro se les actualiza solo.

1. Creá un Sheet nuevo.
2. Pegá el contenido de `feriados-ejemplo.csv` (o importalo: **Archivo → Importar → Subir**).
3. Tienen que quedar tres columnas, en este orden: **fecha, nombre, tipo**.
   - `fecha`: `2027-03-24` o `24/03/2027`, las dos funcionan.
   - `tipo`: `Feriado` o `Turístico`. Los turísticos se pueden apagar desde la app.
   - La primera fila puede ser el encabezado; se ignora sola.
4. **Archivo → Compartir → Publicar en la web**.
5. Elegí la hoja, formato **valores separados por comas (.csv)**, y dale Publicar.
6. Copiá la URL que te da. Termina en `output=csv`.

Después, en la app: pestaña **Sheet** → pegá la URL → **Guardar y sincronizar**.

Dos cosas a tener en cuenta:

- El CSV publicado puede tardar unos minutos en reflejar un cambio. No es instantáneo.
- Publicar en la web hace esa hoja pública para cualquiera que tenga el link. Son feriados, no hay nada sensible, pero que no te agarre de sorpresa.

Si no configurás el Sheet, la app funciona igual con la lista de feriados que trae adentro. Solo que para actualizarla hay que tocar el archivo.

---

## 2. Netlify

Sin build, sin terminal, sin repo.

1. Entrá a **app.netlify.com** y creá la cuenta.
2. En **Sites**, buscá la zona de **Deploy manually** / "arrastrá tu carpeta acá".
3. Arrastrá la carpeta `sitio` entera. No un zip, no los archivos sueltos: la carpeta.
4. Te queda algo como `nombre-raro-123.netlify.app`.
5. En **Site configuration → Change site name** le ponés algo decente.

Para actualizarla después: **Deploys → Drag and drop** y arrastrás la carpeta de nuevo.

Si preferís conectarlo a GitHub, funciona igual: no hay build command y el publish directory es la raíz. El `netlify.toml` ya está.

---

## 3. Instalarla en el teléfono

1. Abrí el sitio en **Chrome** en tu Android.
2. Menú ⋮ → **Instalar app** (a veces aparece como *Agregar a pantalla principal*).
3. Queda con ícono propio, sin barra de navegador, y abre sin conexión.

En Android instalarla no es solo estético: pesa en la heurística con la que Chrome decide marcar tu almacenamiento como persistente, que es lo que lo blinda contra el desalojo por falta de espacio.

En la pestaña **Datos** de la app vas a ver en qué estado está: *Protegidos* (verde) o *Se guardan, pero sin protección explícita* (amarillo). Si sale amarillo, hay un botón para pedirlo. Chrome lo concede solo cuando ya considera importante el sitio, así que puede tardar unos usos en activarse.

Si alguno del grupo usa iPhone, ahí la regla es distinta y más dura: en Safari, un sitio sin interacción durante 7 días de uso del navegador pierde todo el almacenamiento. Agregarlo a la pantalla de inicio lo exime de eso, así que en iPhone es obligatorio, no opcional.

---

## Cómo se usa

| Acción | Cómo |
|---|---|
| Cambiar un día | Tocá el día en el calendario, o el chip en las listas de abajo |
| Marcar licencia o vacaciones | Mantené apretado el día |
| Deshacer tus cambios del mes | Botón *Volver al sugerido* |
| Cambiar tu regla | Pestaña *Regla* |
| Llevar tu config a otro teléfono | Pestaña *Sheet* → *Copiar código* → pegarlo allá en *Restaurar* |

Cada persona guarda lo suyo en su propio navegador. Nadie ve ni pisa la configuración de otro.

---

## Antes de repartirla

**Confirmá con RRHH si las vacaciones bajan el denominador.** La app asume que sí: un día de licencia sale del total de hábiles y por lo tanto baja tu mínimo. Si en el banco lo cuentan como ausencia sobre el total del mes, el cálculo va al revés y hay que cambiarlo.

**Los feriados 2027 todavía no tienen decreto.** La lista trae los que son fijos por ley y los que se derivan de Pascua (28/03/2027), que ésos no se mueven. Faltan los trasladables: Güemes, San Martín, Diversidad Cultural y Soberanía Nacional. Cargalos en el Sheet cuando salgan.

---

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | La app entera. Todo el código está acá. |
| `sw.js` | Hace que funcione sin conexión. |
| `manifest.json` | Ícono y nombre en la pantalla de inicio. |
| `icono.png` | El ícono. |
| `netlify.toml` | Evita que Netlify cachee versiones viejas. |
| `feriados-ejemplo.csv` | El formato exacto para el Sheet. |
