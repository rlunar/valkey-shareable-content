---
theme: default
title: Caching as a Reliability Lever
titleTemplate: '%s · Valkey'
info: |
  Caching as a Reliability Lever (La caché como palanca de confiabilidad). DevOpsDays Bogotá, 23 de octubre de 2026.
  Roberto Luna Rojas, proyecto Valkey, AWS.
canvasWidth: 1200
aspectRatio: 16/9
colorSchema: light
transition: fade-out
clickAnimation: fade
highlighter: shiki
lineNumbers: false
codeCopy: false
mdc: true
layout: cover
class: cover-slide
---

<img class="cover-scene" src="/devopsdays/cover-pipeline-scene.jpg" alt="" />

<div class="cover-content">
  <img class="cover-event-logo" src="/devopsdays/devopsdays-bogota-2026-logo.png" alt="DevOpsDays Bogotá 2026" />

  <h1>Caching as a<br><span>Reliability Lever.</span></h1>
  <p class="cover-subtitle">La caché como palanca de confiabilidad.</p>
  <p class="cover-deck">Reduce el gasto en bases de datos y controla la latencia en los percentiles altos con caché de consultas y caché semántica.</p>

  <div class="cover-speaker">
    <PresenterIdentity class="cover-presenter" />
    <BrandLogo class="cover-company-logo" />
  </div>

  <p class="cover-event">23 · 10 · 2026<br>Compensar Av. 68 · Bogotá</p>
  <p class="cover-hashtag">#DevOpsDaysBogota</p>
</div>

<!--
Arranco sin rodeos: tu base de datos hace el mismo trabajo caro una y otra vez, y tú lo pagas cada vez. Esa es toda la charla en una frase; lo demás son gráficas bonitas y código.
Es una charla L300: los fundamentos van rápido y nos metemos de lleno en arquitectura, código y números reales.
Y voy a ser honesto: les muestro dónde la caché te salva y dónde te muerde la mano.
Control de tiempo: 0:00.
-->

---
layout: default
class: speaker-slide
---

<div class="dod-header">
  <div class="dod-dots dod-dots--small" aria-hidden="true"><i></i><i></i><i></i></div>
  <p class="dod-eyebrow">SOBRE EL PONENTE</p>
</div>
<h1 class="dod-title">Quién soy</h1>

<div class="speaker-grid">
  <img class="speaker-photo" src="/images/rberoj.jpg" alt="Roberto Luna Rojas" />

  <div class="speaker-copy">
    <p class="speaker-name">Roberto Luna Rojas</p>
    <p class="speaker-role">Sr. Open Source Developer Advocate · AWS</p>
    <p class="speaker-bio">Trabajo en el proyecto de código abierto Valkey y me apasionan las bases de datos y los sistemas distribuidos. Desarrollo software desde mediados de la década de 1990, con énfasis en rendimiento, escalabilidad y comunidades de código abierto.</p>
    <a class="speaker-link" href="https://www.linkedin.com/in/robertolunarojas/">linkedin.com/in/robertolunarojas</a>
  </div>

  <div class="speaker-org">
    <div class="speaker-org__frame"><BrandLogo /></div>
    <p>El proyecto de código abierto en el que trabajo</p>
  </div>
</div>

<!--
Soy Roberto. Trabajo en el proyecto Valkey en AWS y escribo software desde mediados de los noventa, siempre del lado del rendimiento y la escalabilidad. O sea, del lado donde suena el pager.
¿Por qué quedarse estos 30 minutos? Porque la caché es la palanca de confiabilidad más barata que tienen a la mano, y la mayoría de los equipos la usa a medias. Les enseño lo que gana y también lo que corta.
Control de tiempo: 0:30.
-->

---
layout: default
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">EL PROBLEMA, SIN RODEOS</p>
  <h1>Tu base de datos hace el mismo trabajo caro una y otra vez.</h1>
</div>

<div class="issue-grid">
  <article class="issue-card" v-click="1">
    <img src="/flaticon/latency.svg" alt="" />
    <span>01 · EN TUS TABLEROS</span>
    <strong>Picos de latencia</strong>
    <p>El p50 se ve bien. El p99 sube justo cuando el tráfico alcanza su máximo.</p>
  </article>
  <article class="issue-card" v-click="2">
    <img src="/flaticon/alarm.svg" alt="" />
    <span>02 · EN TU TELÉFONO</span>
    <strong>Ruido de alertas</strong>
    <p>Los pools se agotan y la CPU vive al 100% por trabajo que ya habías hecho.</p>
  </article>
  <article class="issue-card" v-click="3">
    <img src="/flaticon/money-growth.svg" alt="" />
    <span>03 · EN TU FACTURA</span>
    <strong>El gasto crece más rápido que el tráfico</strong>
    <p>Cada consulta y cada prompt repetidos se cobran otra vez.</p>
  </article>
</div>

<div class="thesis" v-click="4">Una sola causa raíz: trabajo repetido y ningún lugar donde recordar la respuesta.</div>

<!--
Tres síntomas, cada uno con su propia firma.

[click] Picos de latencia. Las mismas lecturas pesadas se repiten y se forman en fila. El p50 se ve precioso, y el p99 se dispara justo cuando el tráfico llega al máximo, porque es exactamente cuando más trabajo repetido hay. Qué coincidencia, ¿verdad?

[click] Ruido de alertas. Las lecturas repetidas saturan la base de datos de origen. Los pools de conexiones se agotan, la CPU se queda al 100% y a la persona de guardia la despiertan por una carga que el sistema ya había calculado hace cinco minutos.

[click] Un gasto que crece más rápido que el tráfico. Cada consulta repetida es cómputo facturado. Cada prompt repetido a un LLM es inferencia facturada. Nadie recuerda la respuesta anterior, así que la pagas otra vez. Y otra. Y otra.

[click] Que no se lleven tres problemas distintos. Son tres caras de lo mismo: trabajo repetido y ningún lugar donde recordar la respuesta. Una capa de caché ataca los tres a la vez; el resto de la charla es cómo jalar esa palanca sin inventarte problemas nuevos.
Control de tiempo: 1:30.
-->

---
layout: default
class: valkey-profile-slide
routeAlias: what-is-valkey
clicks: 3
---

<div class="deck-header deck-header--compact">
  <p class="eyebrow">DÓNDE RECORDAR LA RESPUESTA · QUÉ ES VALKEY</p>
  <h1>Valkey: código abierto, alto rendimiento, para siempre.</h1>
</div>

<ValkeyProfile :step="$clicks" />

<!--
Necesitamos un lugar donde recordar la respuesta. Durante el resto de esta charla, ese lugar será Valkey. ¿Qué es?

[click] Valkey es un almacén clave/valor de código abierto y alto rendimiento. La caché es su trabajo clásico y el tema de hoy, pero también hace colas de mensajes y puede ser tu base de datos primaria.

[click] Licencia BSD y respaldo de Linux Foundation. Traducción: va a seguir siendo de código abierto, y nadie te va a cambiar la licencia un martes cualquiera.

[click] Y la parte de la comunidad. En marzo de 2024, Redis cambió su licencia. Ocho días después, ocho, la comunidad ya había lanzado Valkey: neutral respecto a proveedores y bajo Linux Foundation. Hoy, el Technical Steering Committee tiene mantenedores de AWS, Google Cloud, Oracle, Alibaba, Tencent, Ericsson, Percona y Apple®. Ocho empresas, un proyecto y nadie que sea su dueño.

***

- Los íconos contienen la descripción. Menciona las cargas de trabajo en lugar de leer cada recuadro.
- Dedica unos 45 segundos a esta parte: la audiencia vino a escuchar sobre caché, no sobre la historia del proyecto.
- El panel muestra los siete logotipos permitidos de afiliaciones del TSC incluidos en MAINTAINERS.md de github.com/valkey-io/valkey; Apple® aparece como texto simple porque esta presentación no tiene permiso para usar el logotipo de Apple.
- Fechas: Redis cambió su licencia el 20 de marzo de 2024; Linux Foundation anunció Valkey el 28 de marzo de 2024.
- Control de tiempo: 2:30.
-->

---
layout: default
class: prime-slide
---

<img class="prime-photo" src="/images/prime-day-boxes.jpg" alt="Paquetes de cartón apilados frente a una puerta el día de la entrega" />
<div class="prime-shade" aria-hidden="true"></div>

<div class="prime-copy">
  <p class="eyebrow eyebrow--dark">POR QUÉ SE DEGRADA UNA APLICACIÓN SIN CACHÉ · UN EJEMPLO DEL COMERCIO MINORISTA DE AMAZON</p>
  <h1>Una página de producto. Muchas lecturas. La misma respuesta para cada comprador.</h1>

  <div class="prime-stat">
    <strong>2.3 mil billones<small>de solicitudes atendidas por ElastiCache en un solo día, Prime Day 2026</small></strong>
    <span>2.1 billones de solicitudes en un minuto durante el pico. Precio, disponibilidad, Buy Box, calificaciones y recomendaciones: una página genera muchas lecturas y, durante una oferta relámpago, casi todas son idénticas para los compradores en el mismo minuto.</span>
  </div>
</div>

<p class="prime-source">Fuente: <a href="https://aws.amazon.com/blogs/aws/all-the-numbers-amazon-prime-day-2026-powered-by-aws/">All the numbers: Amazon Prime Day 2026, powered by AWS</a> (AWS News Blog). Foto: Freepik, con licencia.</p>

<!--
Bajemos esto a algo que todos han visto, probablemente hoy mismo: una página de producto de Amazon.
Una vista de página no equivale a una sola consulta. Genera varias lecturas: precio, disponibilidad, elegibilidad para la Buy Box, calificaciones, cantidad de reseñas y recomendaciones. Cada una consulta un almacén de datos, y la mayoría devuelve la misma respuesta para todas las personas que ven ese producto durante el mismo minuto.

Ahora, la escala. Agárrense. Durante Prime Day 2026, del 23 al 26 de junio, ElastiCache alcanzó más de 2.3 mil billones de solicitudes en un día y 2.1 billones de solicitudes en un solo minuto. Así se ve «servir la respuesta repetida desde memoria» cuando lo haces en serio. Sin esa capa, cada vista de página ejecutaría todas esas lecturas contra las bases de datos de origen.

Siguiente diapositiva: la cadena mecánica que explica, paso a paso, por qué ocurre la degradación.
Control de tiempo: 2:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">LA CASCADA DE DEGRADACIÓN · UN PRODUCTO, 200K COMPRADORES, SIN CACHÉ</p>
  <h1>Cada paso provoca el siguiente, y el paso seis le echa gasolina al paso dos.</h1>
</div>

<DegradationCascade :step="$clicks" />


<!--
Una tarjeta por clic. Las cifras se animan; vean cómo se pone rojo cada indicador.

[click] Trabajo redundante. El precio del artículo no cambió entre el primer comprador y el comprador doscientos mil, pero el origen lo calcula cada vez: analiza, planifica, recorre búferes y páginas, y serializa. Son 8,000 lecturas idénticas por segundo.

[click] Aumenta el tiempo de servicio. Las lecturas idénticas concurrentes se acumulan sobre las mismas filas y páginas activas. La CPU se mantiene al máximo, la caché de búfer pierde eficiencia y los bloqueos internos compiten. 4 milisegundos se convierten en 40.

[click] El pool se agota. Ley de Little: las solicitudes en vuelo equivalen a la tasa de llegada multiplicada por el tiempo de servicio. Son las mismas 8,000 por segundo, con diez veces el tiempo de servicio, por lo que el pool necesita 320 conexiones y tiene 100. A partir de la solicitud 101, las demás se bloquean antes de ejecutar una sola consulta.

[click] Se forman colas. El tiempo de espera se suma al tiempo de servicio. El p50 todavía puede verse aceptable mientras el p99 y el p999 se disparan, porque las solicitudes en cola viven en la cola de la distribución. Sí, el juego de palabras es intencional. Esto es un codo, no una rampa: todo va bien hasta que, de pronto, nada va bien.

[click] Tormenta de reintentos. Las solicitudes superan el tiempo de espera y los clientes reintentan, por lo que la carga aumenta justo cuando ya no queda margen. Señala la flecha granate: los reintentos retroalimentan al paso dos. Ese ciclo es el que convierte «lento» en «caído».

[click] Con la caché. Mismo tráfico, mismo producto, mismo minuto. El 98% de las lecturas se detiene en Valkey, 160 por segundo llegan al origen y cada indicador vuelve al azul. La cadena nunca arranca porque el trabajo repetido se quedó en la caché. La base de datos ni se enteró.
Control de tiempo: 5:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">LAS CUENTAS DEL POOL · LEY DE LITTLE</p>
  <h1>Conexiones en uso = llegadas por segundo × tiempo que se mantiene cada una.</h1>
  <p class="slide-lead">Mantén constante el tráfico en 8,000 solicitudes por segundo. Cambia únicamente cuánto tarda la base de datos en responder.</p>
</div>

<LittlesLawChart :step="$clicks" />

<!--
Esta diapositiva existe para matar una confusión: ¿por qué un tiempo de servicio más lento rompe un pool que tenía el 68% libre?
Ley de Little: L = lambda por W. Las conexiones en uso equivalen a la tasa de llegada multiplicada por el tiempo que cada solicitud retiene una conexión. Al pool no le importa el throughput por sí solo; le importan las llegadas multiplicadas por el tiempo.

[click] Traza la línea para 8,000 solicitudes por segundo. Las conexiones en uso crecen de manera lineal con el tiempo de servicio: 8 conexiones por cada milisegundo.

[click] Estado saludable: 4 milisegundos por 8,000 solicitudes por segundo equivalen a 32 conexiones. Caben y sobran 68.

[click] Ahora el origen se ralentiza a 40 milisegundos debido a la contención. Nada cambió en el tráfico. 8,000 por 40 ms equivalen a 320 conexiones, pero el pool admite 100. El cruce ocurre en 12.5 ms: ese es el codo. Por debajo, el pool se veía tranquilísimo; por encima, todo se bloquea.

[click] Misma carga, tasa de aciertos del 98%: solo 160 solicitudes por segundo llegan al origen. Incluso con 40 ms, son 6 conexiones. El pool ni siquiera percibe el aumento. Por eso la caché es una palanca de confiabilidad, no un truco para que la demo se vea rápida.
Control de tiempo: 6:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">EL MODELO MENTAL</p>
  <h1>Cada solicitud es una apuesta. La caché cambia las probabilidades.</h1>
</div>

<MentalModelDiagram :step="$clicks" />

<!--
Respiremos después de la cascada y volvamos a lo básico. Hoy veremos dos veces el mismo patrón: una capa rápida frente a una dependencia costosa.

[click] Consulta primero la caché. Una búsqueda en memoria, en menos de un milisegundo.

[click] Acierto: devuelve la respuesta de inmediato. Es rápido, económico y el origen nunca se entera.

[click] Fallo: realiza una vez el trabajo costoso en el origen, recuerda la respuesta y devuélvela. Hoy el origen es una base de datos y, más adelante en la charla, será un modelo; el patrón es el mismo.

[click] La apuesta. El costo esperado por lectura es la tasa de aciertos multiplicada por el costo bajo, más la tasa de fallos multiplicada por el costo alto. Con un 90% de aciertos, la lectura promedio baja de 8 ms a 1.3 ms. Controlas dos variables: la probabilidad, que es la tasa de aciertos, y el riesgo, que es qué tan desactualizado puede quedar el dato, limitado por TTL e invalidación. Cada sección posterior mejora la probabilidad o limita el riesgo.
Control de tiempo: 7:30.
-->

---
layout: section
class: section-slide
---

<img class="divider-waves" src="/devopsdays/divider-waves.png" alt="" />

<div class="section-content">
  <div class="dod-dots" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="section-number">01</div>
  <h1>Caché de consultas.</h1>
  <p class="section-subtitle">La mitad conocida: cuatro estrategias, una tabla y las partes que muerden.</p>
</div>


<!--
La caché de consultas es la parte que casi todos ya conocen, así que vamos rápido pero sin perder precisión. Es la base de todo lo que viene en la parte semántica.
Control de tiempo: 8:00.
-->

---
layout: default
class: code-slide
---

<div class="deck-header">
  <p class="eyebrow">CACHE-ASIDE · EL CABALLO DE BATALLA</p>
  <h1>La aplicación manda: pregunta a Valkey, si no está va a la base de datos, y guarda la respuesta.</h1>
</div>

<TerminalWindow title="cache_aside.py">

```python {all|1-2|4-6|8-9|11-13|all}
cache = valkey.Valkey(host="cache", port=6379)
db = ProductsDatabase(dsn="products-db")

def get_product(product_id: str) -> Product:
    key = f"product:{product_id}"
    cached = cache.get(key)

    if cached is not None:
        return Product.from_json(cached)            # acierto: sin trabajo en la base de datos

    product = db.load_product(product_id)           # fallo: leer una vez desde el origen
    cache.set(key, product.to_json(), ex=300)       # almacenar en caché por 5 minutos
    return product
```

</TerminalWindow>

<div class="code-map">
  <span>1 · clientes</span><span>2 · construir la clave, consultar Valkey</span><span>3 · acierto</span><span>4 · fallo, cargar, guardar con TTL</span>
</div>

<!--
Cache-aside, también llamado lazy loading. La aplicación controla toda la lógica, y es el patrón que elijo primero casi siempre.
Sigue los resaltados: los dos clientes, la clave y la búsqueda, la ruta del acierto, y luego la ruta del fallo que carga una vez y almacena con un TTL.
Vale la pena mencionar tres propiedades. La caché solo contiene datos que alguien solicitó, por lo que el uso de memoria se ajusta al conjunto de trabajo. Un fallo requiere una llamada de red adicional, así que intercambias un poco de latencia en los fallos por mucha menos latencia en los aciertos. Además, la aplicación debe manejar una caché fría: después de vaciarla o de un despliegue, la primera solicitud de cada clave falla. Retomaremos este punto en la diapositiva sobre stampede.
Los 300 segundos son una decisión, no un número mágico. En la diapositiva de TTL pagamos esa deuda.
Control de tiempo: 9:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">ESTRATEGIA 2 DE 4 · READ-THROUGH</p>
  <h1>Read-through: la capa de caché controla el cargador.</h1>
</div>

<StrategyFlow scenario="read-through" :step="$clicks" />


<!--
La misma ruta de lectura que cache-aside, pero con otro responsable. En read-through, la capa de caché, o un adaptador delgado frente a ella, controla la llamada a la base de datos. La aplicación ve una sola interfaz y nunca sabe si ocurrió un fallo de caché.

[click] La aplicación solicita el producto 42 a la caché.

[click] Fallo: la propia capa de caché ejecuta el cargador contra la base de datos.

[click] El valor se almacena con un TTL. La vigencia sigue siendo una decisión de política.

[click] La caché responde a la aplicación, y esta responde al cliente.

[click] Acierto con la caché caliente: la siguiente lectura nunca llega a la base de datos. El trade-off: tu aplicación queda más limpia, pero la lógica del cargador ahora vive en infraestructura que alguien tiene que desplegar, versionar y, claro, depurar a las 3 a. m.
Control de tiempo: 9:45.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">ESTRATEGIA 3 DE 4 · WRITE-THROUGH</p>
  <h1>Write-through: la caché casi nunca se queda atrás de la base de datos, y lo pagas en latencia de escritura.</h1>
</div>

<StrategyFlow scenario="write-through" :step="$clicks" />


<!--
Write-through necesita un coordinador: un adaptador controlado por la aplicación que espera a ambos sistemas antes de informar que la operación tuvo éxito.

[click] El cliente envía v2.

[click] Confirma primero la transacción en la base de datos. Los dos almacenes no comparten una transacción, así que el orden es una decisión de diseño que debes tomar de forma explícita.

[click] Después, ejecuta SET v2 en Valkey y renueva el TTL. Existe una breve brecha de visibilidad entre ambas escrituras.

[click] El cliente solo recibe la confirmación después de que ambos sistemas responden. La latencia de escritura ahora es la suma de la base de datos y la caché.

[click] El siguiente lector encuentra v2. El punto delicado es este: si SET falla después de confirmar la transacción, la base de datos tiene v2 y la caché podría conservar v1. Registra el trabajo de reparación, devuelve un resultado parcial o indica que la operación se puede reintentar, y nunca informes un éxito completo. Write-through reduce las lecturas desactualizadas, pero no te regala atomicidad entre almacenes. Nadie te la regala.
Control de tiempo: 10:30.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">ESTRATEGIA 4 DE 4 · WRITE-BEHIND</p>
  <h1>Write-behind: escrituras rapidísimas y una ventana de pérdida que eliges a propósito.</h1>
</div>

<StrategyFlow scenario="write-behind" :step="$clicks" />


<!--
Write-behind, también llamado write-back, cambia el momento en que la escritura se considera duradera. Responde al cliente antes de confirmar la transacción en la base de datos y después procesa el búfer de forma asíncrona.

[click] El cliente envía v2.

[click] El adaptador registra v2 junto con la intención de vaciado en Valkey. Un SET simple no es un flujo de write-back; necesitas un protocolo explícito para el trabajo pendiente.

[click] El cliente recibe la confirmación en alrededor de un milisegundo. La base de datos todavía tiene v1.

[click] Un proceso en segundo plano procesa el lote, persiste los cambios de forma idempotente y después confirma la tarea pendiente. Una falla entre la persistencia y la confirmación provoca una nueva entrega; por eso importa la idempotencia.

[click] El riesgo. Si pierdes el búfer antes del vaciado, v2 desaparece después de haberle informado al cliente que la operación tuvo éxito. El desalojo ordinario de la caché no escribe los valores pendientes en la base de datos. Usa un registro duradero que permita reprocesar las escrituras, o acepta este patrón únicamente donde la ventana de pérdida sea tolerable. De las cuatro, este es el cuchillo más filoso. Úsenlo con guantes.
Control de tiempo: 11:15.
-->

---
layout: default
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">CUÁNDO GANA LA CACHÉ DE CONSULTAS Y CUÁNDO SOLO AÑADE SOBRECARGA</p>
  <h1>La tasa de aciertos lo decide todo. Mídela antes de celebrar.</h1>
</div>

<table>
<thead><tr><th>Señal en tu carga de trabajo</th><th>¿Almacenarlo en caché?</th></tr></thead>
<tbody>
<tr v-click="1"><td>Predominio de lecturas, claves repetidas (catálogo, configuración, sesiones)</td><td class="hl">Sí, caché de consultas</td></tr>
<tr v-click="2"><td>Agregaciones costosas que se recalculan con frecuencia</td><td class="hl">Sí, almacena el resultado en caché, no las filas</td></tr>
<tr v-click="3"><td>Tasa de aciertos baja, lecturas casi siempre únicas</td><td class="red">No, la capa es pura sobrecarga</td></tr>
<tr v-click="4"><td>Predominio de escrituras con read-after-write estricto</td><td>Solo con write-through o una invalidación cuidadosa</td></tr>
</tbody>
</table>

<div class="thesis" v-click="5">Por debajo de la tasa de aciertos de equilibrio, la búsqueda adicional en cada fallo te vuelve más lento y no reduce el costo.</div>

<!--
La diapositiva honesta: la caché no es gratis y no siempre es la respuesta. Lo siento.

[click] Predominio de lecturas, claves repetidas: el caso clásico donde gana.

[click] Agregaciones costosas: almacena en caché el resultado calculado, no las filas subyacentes.

[click] Tasa de aciertos baja, lecturas casi siempre únicas: la fila que todos ignoran y luego lamentan en el postmortem. Si la mayoría de las búsquedas falla, agregaste un salto de red y un segundo sistema a cambio de nada.

[click] Predominio de escrituras con read-after-write estricto: únicamente con write-through o invalidación cuidadosa, y con total honestidad sobre la ruta de falla parcial que acabamos de ver.

[click] Cierra con la idea central: mide primero la tasa de aciertos. Esta define tanto la economía como el impacto en la confiabilidad.
Control de tiempo: 12:00.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">TTL E INVALIDACIÓN · LA PARTE DIFÍCIL</p>
  <h1>El tiempo limita la antigüedad. Los eventos la cortan antes. El jitter evita que el reloj te ataque.</h1>
</div>

<TtlTimeline :step="$clicks" />

<!--
Una caché es una segunda copia de tus datos. Todo el problema es mantener honesta esa copia.

[click] Ejecuta SET product:42 con EX 300. Durante cinco minutos, la clave está vigente.

[click] Las lecturas dentro de la ventana son aciertos. La copia puede quedar desactualizada hasta por cinco minutos, y esa es una cifra que tú elegiste.

[click] A los 300 segundos, la clave desaparece. La siguiente lectura falla, vuelve a cargar el valor una sola vez y abre una ventana nueva. Los TTL cortos limitan la antigüedad, pero reducen la tasa de aciertos; los TTL largos aumentan la tasa de aciertos, pero permiten que los datos desactualizados permanezcan más tiempo.

[click] Invalidación explícita: una escritura elimina la clave en lugar de esperar al reloj. La trampa son las claves de las que dependen muchas otras claves. Una escritura en el producto 42 también debe invalidar la lista de la categoría que lo contiene. Registra esas dependencias de forma explícita; no esperes que un TTL te salve.

[click] La franja inferior. Un despliegue llena al mismo tiempo 1,000 claves y todas vencen juntas: 1,000 fallos en el mismo segundo. Felicidades: construiste tu propio stampede.

[click] Jitter. EX 300 con más o menos 60 segundos aleatorios distribuye los mismos fallos durante dos minutos. Es el seguro más barato que vas a comprar. Ponlo como default en el wrapper de tu cliente.
Control de tiempo: 13:30.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">MODO DE FALLA 1 DE 3 · STAMPEDE</p>
  <h1>Una clave caliente vence y todos la vuelven a calcular al mismo tiempo.</h1>
</div>

<FailureModeDiagram mode="stampede" :step="$clicks" />

<!--
Apréndanse estos tres nombres; los van a escuchar en postmortems por el resto de su carrera.

[click] Mientras la clave caliente está vigente, doce lectores producen doce aciertos y el origen permanece inactivo.

[click] El TTL vence en el momento de mayor actividad.

[click] Los doce fallan al mismo tiempo y ejecutan la misma consulta costosa. Se calcula doce veces la misma respuesta, y el indicador del origen se pone rojo.

[click] La solución: single-flight. El primer fallo toma un bloqueo corto con SET NX EX y vuelve a calcular el valor. Los demás esperan unos milisegundos y leen el valor recién cargado. Una consulta en lugar de doce. Serve-stale-while-revalidate es otra buena respuesta cuando resulta aceptable usar un valor un poco desactualizado.
Control de tiempo: 14:15.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">SINGLE-FLIGHT · TODO EL TRUCO ESTÁ EN <code>nx=True</code></p>
  <h1>Una llamada vuelve a calcular el valor de la clave caliente. Las demás esperan un instante.</h1>
</div>

<TerminalWindow title="single_flight.py">

```python {all|2-3|5|6-9|10-12|all}
def get_with_singleflight(key: str, loader, ttl: int = 300):
    value = cache.get(key)
    if value is not None:
        return value                                  # acierto

    if cache.set(f"lock:{key}", "1", nx=True, ex=10):  # solo una llamada gana
        try:
            value = loader()                          # la única llamada costosa
            cache.set(key, value, ex=ttl)
            return value
        finally:
            cache.delete(f"lock:{key}")

    time.sleep(0.05)                                  # las demás esperan 50 ms
    return get_with_singleflight(key, loader, ttl)    # y leen la clave recién cargada
```

</TerminalWindow>

<!--
El código es el diagrama. Primero, la ruta normal del acierto. En un fallo, SET NX con expiración de diez segundos: exactamente una llamada recibe True. Esa llamada ejecuta el loader, llena la clave y libera el bloqueo en el finally, así que una excepción no deja el bloqueo colgado; si el proceso muere a la mitad, el EX 10 limpia solo.
Las demás esperan 50 milisegundos y reintentan, y casi siempre caen en la clave ya recargada.
Letra chiquita para producción: este DEL libera el bloqueo sin verificar que todavía es tuyo. Si el loader tarda más de diez segundos, el bloqueo expira, otra llamada lo toma y tú le borras el suyo. Guarda un token aleatorio como valor y libéralo con un script que compare y borre. Y ponle presupuesto a los reintentos, porque esa recursión no tiene freno.
Control de tiempo: 15:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">MODO DE FALLA 2 DE 3 · PENETRACIÓN</p>
  <h1>Las solicitudes de claves inexistentes pasan de largo por la caché cada vez.</h1>
</div>

<FailureModeDiagram mode="penetration" :step="$clicks" />

<!--
La penetración es la silenciosa. No hace ruido, solo te cobra.

[click] Primero llega una solicitud para obtener product:999, que no existe. La caché no tiene una entrada, la base de datos indica que no existe esa fila y no se almacena nada.

[click] Por lo tanto, la siguiente solicitud repite el recorrido, y también todas las posteriores. Los enlaces incorrectos, los rastreadores automatizados o un atacante que adivina identificadores convierten al origen en la ruta principal.

[click] Solución A: almacena la ausencia en caché. Guarda «product:999 = nada» con un TTL corto para que las repeticiones se detengan en la caché.

[click] Solución B: un filtro de Bloom al frente responde «definitivamente no está aquí» sin tocar la caché ni el origen. Puede dar falsos positivos, pero nunca falsos negativos, siempre que le agregues cada clave nueva al crearla. Por eso es seguro como filtro previo.
Control de tiempo: 15:45.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">MODO DE FALLA 3 DE 3 · AVALANCHA</p>
  <h1>Todo el conjunto de trabajo desaparece al mismo tiempo.</h1>
</div>

<FailureModeDiagram mode="avalanche" :step="$clicks" />

<!--
La avalancha es la cascada del inicio, pero esta vez la provocó tu propia caché. Ironía nivel experto.

[click] El mismo despliegue llenó todas las claves con el mismo TTL, por lo que todas vencen en el mismo segundo. También puede ocurrir que un nodo falle y se lleve todas las claves.

[click] El origen recibe al mismo tiempo todo el conjunto de trabajo en forma de fallos.

[click] Soluciones: el jitter del TTL distribuye las recargas durante varios minutos, y una réplica en otra zona de disponibilidad toma el control cuando se pierde un nodo, de modo que las claves nunca desaparecen juntas. La parte 3 muestra el failover.

[click] También limita la cantidad de recargas concurrentes del lado del origen. Así, una caché fría te pone lento, nunca caído.
Control de tiempo: 16:30.
-->

---
layout: section
class: section-slide
---

<img class="divider-waves" src="/devopsdays/divider-waves.png" alt="" />

<div class="section-content">
  <div class="dod-dots" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="section-number">02</div>
  <h1>Caché semántica.</h1>
  <p class="section-subtitle">La mitad nueva, para IA y RAG: busca coincidencias por significado, no por bytes.</p>
</div>


<!--
Transición a la parte que casi nadie en la sala ha construido todavía. Baja el ritmo.
Control de tiempo: 17:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">CACHÉ SEMÁNTICA · RECORRIDO DE UNA SOLICITUD</p>
  <h1>La respuesta segura más cercana se convierte en la ruta rápida.</h1>
</div>

<SemanticCacheDiagram :step="$clicks" />


<!--
La caché por coincidencia exacta no sirve para tráfico de LLM: «¿Cómo restablezco mi contraseña?» y «Olvidé mi contraseña, ¿qué hago ahora?» son cadenas distintas con la misma intención. Para un GET son dos claves; para un humano, es la misma pregunta.

[click] Generación del embedding: convierte el prompt en un vector. Usa siempre el mismo modelo de embeddings para escrituras y lecturas, o los vectores no serán comparables.

[click] Búsqueda: Valkey encuentra los vectores de prompts almacenados en caché más cercanos mediante una consulta KNN. El índice y tu caché existente forman una sola capa.

[click] Acierto: si la coincidencia cumple el umbral definido, devuelve la respuesta almacenada en caché. No hay llamada de inferencia.

[click] Fallo: no existe una coincidencia segura, invoca el modelo una vez.

[click] Almacenamiento: guarda el embedding nuevo y la respuesta con un TTL. Sigue el mismo flujo que cache-aside: consulta, acierto, realiza el trabajo costoso ante un fallo y recuerda. Ojo: el embedding no es gratis; lo que el acierto te ahorra es la generación, que es muchísimo más cara.
Control de tiempo: 18:30.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">VALKEY COMO ALMACÉN DE VECTORES · MISMA FORMA, NUEVA FUNCIÓN DE COINCIDENCIA</p>
  <h1>Caché semántica en once líneas. Detente en la línea uno.</h1>
</div>

<TerminalWindow title="semantic_cache.py">

```python {all|1|4-5|6-7|9-11|all}
THRESHOLD = 0.92          # similitud del coseno: decisión de exactitud, no valor predeterminado

def semantic_get(prompt: str) -> str:
    vector = embed(prompt)                            # siempre el mismo modelo
    hit = vstore.knn(vector, k=1)                     # vecino más cercano en Valkey Search
    if hit and hit.score >= THRESHOLD:
        return hit.answer                             # acierto: sin inferencia

    answer = model.complete(prompt)                   # fallo: generar una vez
    vstore.add(vector, answer, ttl=3600)              # almacenar vector + respuesta en caché
    return answer
```

</TerminalWindow>

<div class="code-map">
  <span>Valkey Search: FT.CREATE ... VECTOR HNSW ... DISTANCE_METRIC COSINE</span><span>almacenar la respuesta junto al vector</span><span>TTL + multi-AZ + fail open, igual que la caché de consultas</span>
</div>

<!--
La ventaja operativa es tener una sola capa tanto para la caché clásica como para el índice vectorial: no estás operando una base de datos vectorial independiente.
El código conserva a propósito la estructura de la caché de consultas. Solo cambió la función de coincidencia: el vecino más cercano por encima de un umbral, en lugar de una clave exacta.
Resalta primero la constante del umbral y haz una pausa. La siguiente diapositiva se dedica por completo a ella. Después, muestra la vectorización y la búsqueda KNN, la rama del acierto y la rama del fallo que almacena el vector y la respuesta con un TTL.
Menciona la métrica y su dirección en el código y los tableros: algunas API exponen distancia, donde un valor menor significa mayor cercanía, y otras exponen similitud, donde un valor mayor significa mayor cercanía.
Control de tiempo: 19:30.
-->

---
layout: default
clicks: 2
---

<div class="deck-header">
  <p class="eyebrow">EL UMBRAL LO DEFINE TODO</p>
  <h1>Ajusta juntas la tasa de aciertos y la exactitud. Nunca una sin la otra.</h1>
</div>

<ThresholdDial :step="$clicks" />

<!--
El umbral es un control entre ahorro y exactitud, y es una decisión tuya, no un valor predeterminado.
Empieza con un umbral estricto: proteges la calidad de las respuestas, obtienes pocos aciertos y la caché aporta poco valor.

[click] Si priorizas la tasa de aciertos, relajas el umbral: entregas una respuesta almacenada en caché para un prompt que solo se parecía de forma superficial. Ahorrarte una fracción de centavo con una respuesta casi correcta es la forma más cara de perder la confianza de un usuario.

[click] Define el punto de operación a partir de pares de prompts etiquetados de tu dominio, nunca por intuición. Protecciones: delimita la caché por intención y tenant; nunca almacenes respuestas personalizadas en la caché semántica, a menos que la clave incluya al usuario; registra cada acierto con su puntuación; excluye respuestas en las que la vigencia o el cumplimiento normativo sean críticos, o protégelas con un TTL muy corto. «¿Cuál es mi saldo?» no es la misma pregunta para distintos usuarios, incluso cuando los vectores son casi idénticos.
Control de tiempo: 20:30.
-->

---
layout: section
class: section-slide
---

<img class="divider-waves" src="/devopsdays/divider-waves.png" alt="" />

<div class="section-content">
  <div class="dod-dots" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="section-number">03</div>
  <h1>Confiabilidad y cifras.</h1>
  <p class="section-subtitle">Haz failover, opera con fail open, rechaza parte de la carga, observa seis indicadores y demuéstralo con dos casos de estudio.</p>
</div>


<!--
Tercer acto: conecta la caché con SRE y después con el dinero, mediante casos de estudio reales.
Control de tiempo: 21:00.
-->

---
layout: default
class: diagram-slide
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">VALKEY MULTI-AZ · HAZ FAILOVER Y OPERA CON FAIL OPEN DURANTE EL PROCESO</p>
  <h1>Si pierdes una zona, se promueve una réplica. Si pierdes la caché, el sistema se vuelve lento, pero no se cae.</h1>
</div>

<FailoverDiagram :step="$clicks" />

<!--
Dos ideas en un diagrama: multi-AZ para que la pérdida de un nodo o una zona no implique perder la caché, y fail open para que la pérdida de la caché nunca se convierta en una caída en cascada de la base de datos. De forma deliberada, usamos multi-AZ, no una arquitectura multirregional.

[click] Estado estable: aciertos desde el nodo primario en AZ a, replicación continua hacia AZ b y AZ c, y el origen solo recibe fallos.

[click] Se pierde AZ a. Las llamadas a la caché vencen tras un tiempo de espera breve y deliberado. Timeout corto, siempre: una caché que responde en 3 segundos es peor que no tener caché. Es una base de datos lenta con pasos extra.

[click] Fail open: el adaptador ignora el error de tiempo de espera y ejecuta el cargador contra el origen. Los usuarios perciben lentitud, no una caída. El origen debe estar protegido mientras esto ocurre, y ese es el tema de la siguiente diapositiva.

[click] La réplica en AZ b se promueve en segundos. Los datos ya estaban allí. La réplica restante sigue al nuevo nodo primario.

[click] Los clientes se reconectan, se reanudan los aciertos y el origen vuelve a recibir únicamente fallos. AZ a se reincorpora después como réplica.
Control de tiempo: 22:00.
-->

---
layout: default
class: diagram-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">SIN CACHÉ POR UN MOMENTO · EL BORDE DEBE RECHAZAR PARTE DE LA CARGA</p>
  <h1>Fail open quitó el freno. Limita la tasa en el API gateway mientras Valkey se recupera.</h1>
</div>

<GatewayShedDiagram :step="$clicks" />

<!--
Fail open tiene un costo escondido: manda cada lectura al origen y, en un día de tráfico pico, ese es exactamente el tráfico que tumbó la base de datos en la cascada del inicio.

[click] La caché no está disponible: una ventana de failover, un reinicio en frío o un despliegue erróneo de configuración. Ahora llegan 8,000 solicitudes por segundo a una base de datos que admite 2,000. Se satura en segundos. La caída que evitaste entra por la puerta trasera.

[click] Regula en el borde. El API gateway admite lo que el origen puede atender y rechaza el resto con 429 y Retry-After. Los usuarios reciben un «no» rápido en lugar de una espera larga que termina en error, y la base de datos se mantiene ocupada pero saludable.

[click] La caché vuelve vacía. Cada fallo admitido recarga una clave, por lo que la tasa de aciertos sube hacia el 98% y la carga del origen baja al mismo tiempo.

[click] Liberación: aumenta el límite a medida que se recupera la tasa de aciertos. Funcionan tanto un algoritmo token bucket por cliente como un presupuesto global. El limitador es el freno que vuelves a agregar de forma deliberada porque fail open eliminó el freno natural.
Control de tiempo: 23:00.
-->

---
layout: default
class: code-slide code-slide--dense
---

<div class="deck-header">
  <p class="eyebrow">FAIL OPEN EN CÓDIGO · TIMEOUTS CORTOS, ERRORES IGNORADOS, LLENADO DE MEJOR ESFUERZO</p>
  <h1>Una caída de la caché nunca debe convertirse en una caída de la base de datos.</h1>
</div>

<TerminalWindow title="fail_open.py">

```python {all|1|3-7|9|10-13|all}
cache = valkey.Valkey(host="cache", socket_timeout=0.05)   # 50 ms, a propósito

def cached_read(key: str, loader, ttl: int = 300):
    try:
        value = cache.get(key)
        if value is not None:
            return value
    except CacheUnavailable:
        pass                                 # fail open: continuar hacia el origen

    value = loader()                         # llamada al origen (con límite de tasa aguas arriba)
    try:
        cache.set(key, value, ex=ttl)
    except CacheUnavailable:
        pass                                 # llenado de caché de mejor esfuerzo
    return value
```

</TerminalWindow>

<!--
Este es el adaptador por el que pasa cada llamada a la caché. Un tiempo de espera del socket de 50 milisegundos, elegido a propósito. Ante cualquier error de la caché en la ruta de lectura, el adaptador continúa hacia el cargador. El llenado de la caché es de mejor esfuerzo: si la caché no está disponible, el valor igual le llega al usuario. Ojo con el nombre: esto no es write-back, es solo volver a llenar la caché después de leer.
CacheUnavailable aquí representa las excepciones de conexión y timeout de tu cliente; en valkey-py son ConnectionError y TimeoutError.
Combina esto con el limitador del API gateway de la diapositiva anterior. Fail open sin limitador es solo una forma elegante de mudar la caída de la caché a la base de datos.
Control de tiempo: 23:30.
-->

---
layout: default
class: diagram-slide
clicks: 6
---

<div class="deck-header">
  <p class="eyebrow">QUÉ OBSERVAR · OBJETIVOS OPERATIVOS PARA UNA CAPA DE CACHÉ CON PREDOMINIO DE LECTURAS</p>
  <h1>Seis indicadores. La tasa de aciertos es el indicador adelantado; todo lo demás es confirmación.</h1>
</div>

<MetricGauges :step="$clicks" />

<!--
Si no puedes verlo, no puedes operarlo. Estos objetivos son para una aplicación con predominio de lecturas; ajústalos a tu carga de trabajo, pero no omitas ninguno.

[click] Tasa de aciertos, por clase de clave. 90% o más para tráfico con predominio de lecturas; los catálogos a escala de Amazon operan entre 95 y 99%. Una tasa descendente es la advertencia temprana de que los TTL o la invalidación cambiaron la economía.

[click] p99 por debajo de un milisegundo en la ruta de aciertos, medido por separado de la ruta del origen, para que puedas observar cómo cambia cada una.

[click] Uso del pool del origen por debajo del 60%. Ese margen es lo que absorbe el aumento de tráfico y una caché fría.

[click] CPU del origen por debajo del 50% en estado estable. Esta es la confirmación de que la caché realmente protege la base de datos.

[click] Desalojos cercanos a cero con uso de memoria por debajo del 75%. Los desalojos significan que el conjunto de trabajo superó la capacidad de la caché y que tu tasa de aciertos está por caer.

[click] Para cachés semánticas: exactitud del 90% o más en muestras de aciertos cercanos al umbral. Registra cada acierto con su puntuación y audita los que están cerca del límite. Así detectas cuando el umbral se desplaza hacia respuestas incorrectas.
Control de tiempo: 24:30.
-->

---
layout: default
clicks: 3
---

<div class="deck-header">
  <p class="eyebrow">LAS CIFRAS · COSTO POR MILLÓN DE LECTURAS</p>
  <h1>Ese 55% es un techo que alcanzas mediante la tasa de aciertos, no algo garantizado.</h1>
</div>

<div class="numbers-layout">
  <div class="big-stat">
    <small>HASTA</small>
    <strong>55%</strong>
    <span>menor costo de base de datos para datos consultados con frecuencia</span>
    <em>Objetivo de la carga de trabajo, no un valor de referencia ni una garantía. Requiere una tasa de aciertos medida y dimensionamiento correcto después de la validación.</em>
  </div>
  <div class="chart-panel">
    <CostPerMillion :step="$clicks" />
  </div>
</div>

<!--
Dilo fuerte, porque alguien le va a tomar foto a ese 55% y lo va a pegar en una propuesta: es un techo que alcanzas con la tasa de aciertos, no una garantía.

[click] Sin caché, el millón completo de lecturas llega a la base de datos. Usa un dólar por millón como referencia para esa factura.

[click] Con una tasa de aciertos del 90%, solo 100,000 lecturas llegan al origen.

[click] La línea de la base de datos no baja al 10% porque su costo depende de la capacidad, no de cada lectura: todavía atiendes escrituras y conservas margen. Con el dimensionamiento correcto, llega aproximadamente al 45% del original, que corresponde al ahorro del 55%. Agrega la capa de Valkey y la factura total baja alrededor de un 45%. Los costos unitarios son ilustrativos; lo importante es la relación entre los costos. Calcula el costo de tu propia carga de trabajo con la calculadora de precios y después demuéstralo con mediciones anteriores y posteriores.
Control de tiempo: 25:30.
-->

---
layout: default
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">CASO DE ESTUDIO 1 · AMAZON ADS EN ELASTICACHE FOR VALKEY</p>
  <h1>Una caché de consultas a escala de Amazon, actualizada sin tiempo fuera de servicio.</h1>
</div>

<div class="stat-grid">
  <article class="stat-card stat-card--purple" v-click="1"><span>AUDIENCIA</span><strong>300M+</strong><p>personas alcanzadas solo en USA</p></article>
  <article class="stat-card stat-card--purple" v-click="1"><span>LECTURAS</span><strong>10M+ / s</strong><p>decenas de millones de lecturas por segundo y miles de millones de impresiones al día</p></article>
  <article class="stat-card stat-card--blue" v-click="2"><span>LATENCIA</span><strong>&lt; 5 ms</strong><p>p99, con 99.99% de disponibilidad, incluso en los picos de Prime Day</p></article>
  <article class="stat-card stat-card--blue" v-click="2"><span>ESCALAMIENTO HORIZONTAL</span><strong>500</strong><p>nodos por clúster, un clúster por método de consulta</p></article>
</div>

<div class="stat-grid">
  <article class="stat-card stat-card--red" v-click="3"><span>COSTO DE INFRAESTRUCTURA</span><strong>-45%</strong><p>tras actualizar a ElastiCache for Valkey 8.0 en Graviton</p></article>
  <article class="stat-card stat-card--red" v-click="3"><span>RENDIMIENTO</span><strong>+12%</strong><p>con la misma carga de trabajo</p></article>
  <article class="stat-card" v-click="4"><span>TIEMPO FUERA DE SERVICIO</span><strong>0</strong><p>dual-write, cambio gradual de lecturas y rollback disponible</p></article>
  <article class="stat-card" v-click="4"><span>CAMBIOS DE CÓDIGO</span><strong>0</strong><p>reemplazo directo compatible con la API de Redis OSS</p></article>
</div>

<p class="source-note">Fuente: <a href="https://aws.amazon.com/blogs/database/amazon-ads-upgrades-to-amazon-elasticache-for-valkey-to-achieve-12-higher-throughput-and-save-over-45-in-infrastructure-costs/">Amazon Ads upgrades to Amazon ElastiCache for Valkey to achieve 12% higher throughput and save over 45% in infrastructure costs</a> (AWS Database Blog, 2025).</p>

<!--
Ahora, un resultado real, en producción, a escala de Amazon. Nada de benchmarks de laboratorio.

[click] Amazon Sponsored Products alcanza a más de 300 millones de personas solo en USA y atiende decenas de millones de lecturas por segundo, además de miles de millones de impresiones de anuncios al día.

[click] p99 por debajo de 5 milisegundos con 99.99% de disponibilidad, incluso durante Prime Day y las fiestas de fin de año. El servicio de administración de caché, Horus, escala un clúster a 500 nodos y aísla cada método de consulta en su propio clúster.

[click] La actualización a ElastiCache for Valkey 8.0 en Graviton redujo el costo de infraestructura en más del 45% y aumentó el rendimiento en 12%. Se combinaron dos palancas: la eficiencia de Valkey y el precio de Graviton; sepáralas cuando modeles tu propio caso.

[click] Cero tiempo fuera de servicio y cero cambios de código: dual-write en ambos clústeres, cambio gradual de las lecturas y rollback disponible. Esa receta de migración se puede reutilizar para cualquier cambio de capa de caché bajo carga.
Control de tiempo: 26:30.
-->

---
layout: default
class: diagram-slide tradeoff-slide
clicks: 4
---

<div class="deck-header">
  <p class="eyebrow">CASO DE ESTUDIO 2 · RESULTADOS MEDIDOS DE LA CACHÉ SEMÁNTICA CON AMAZON BEDROCK</p>
  <h1>Hasta 86% menos en costo y 88% menos en latencia. El umbral determina el equilibrio entre ahorro y exactitud.</h1>
</div>

<ThresholdTradeoffChart :step="$clicks" />

<p class="source-note">63,796 consultas reales de un chatbot · Titan Text Embeddings V2 · Claude 3 Haiku · cache.r7g.large. Fuente: <a href="https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/">Lower cost and latency for AI using Amazon ElastiCache as a semantic cache with Amazon Bedrock</a> (AWS Database Blog). Los resultados dependen del modelo, el embedding, los datos, el umbral y la caché.</p>

<!--
La evaluación cuantifica el efecto del umbral. 63,796 consultas reales de un chatbot, reproducidas para simular un día de tráfico, usando Titan Text Embeddings V2 y Claude 3 Haiku.

[click] Los ahorros aumentan a medida que se relaja el umbral: 16% con 0.99, 52% con 0.95, 72% con 0.90 y 86% con 0.75.

[click] La exactitud de las respuestas almacenadas en caché se mantiene en el rango bajo de los noventa durante todo el recorrido hasta 0.75.

[click] El punto de inflexión: con 0.75, 86.3% menos costo, 88.3% menos latencia promedio y 91.2% de exactitud. Cada acierto es hasta 59 veces más rápido: los segundos se convierten en una décima de segundo.

[click] El precipicio: relajar el umbral a 0.50 aporta 1.7 puntos adicionales de ahorro y pierde 3.7 puntos de exactitud. Esta es la gráfica más importante de la mitad sobre IA: el dial tiene un punto dulce y, pasándolo, lo que pagas es la confianza de tus usuarios.
Control de tiempo: 27:30.
-->

---
layout: default
clicks: 5
---

<div class="deck-header">
  <p class="eyebrow">LO QUE TE LLEVAS</p>
  <h1>Misma palanca, dos cargas de trabajo, una disciplina: mide aciertos contra costo y acota la antigüedad.</h1>
</div>

<ImpactBoard :step="$clicks" />

<!--
Cierra con las cifras, no con viñetas.

[click] Hasta 55% menos costo de base de datos para datos consultados con frecuencia, obtenido mediante la tasa de aciertos y el dimensionamiento correcto.

[click] 86% menos costo de inferencia con una caché semántica, con 91% de exactitud, en la evaluación de AWS.

[click] 88% menos latencia de extremo a extremo en respuestas de IA, y un solo acierto es hasta 59 veces más rápido.

[click] 45% menos costo de infraestructura para la propia capa de caché en Amazon Ads, con 12% más rendimiento.

[click] Y la cifra importante para esta sala: menos alertas a las 3 a. m. El aumento de tráfico se detiene en la caché, por lo que no hay pool agotado, ni tormenta de reintentos, ni nada que te despierte. Esa es la métrica que de verdad nos importa.
Control de tiempo: 28:30.
-->

---
layout: default
class: monday-slide
---

<div class="deck-header">
  <p class="eyebrow">EMPIEZA EL LUNES POR LA MAÑANA</p>
  <h1>No pagues dos veces <span>por el mismo trabajo.</span></h1>
</div>

<div class="monday-steps">
  <div><b>01</b>Encuentra la repetición: tu lectura más activa o tu prompt más repetido. Empieza con una sola ruta y mídela.</div>
  <div><b>02</b>Agrega la capa: caché de consultas para lecturas, caché semántica para prompts y un TTL que puedas defender.</div>
  <div><b>03</b>Observa la tasa de aciertos frente al costo y el p99. Demuestra el resultado antes de ampliar.</div>
</div>

<div class="monday-links">
  <span>SIGUE LEYENDO</span>
  <a href="https://valkey.io/">valkey.io</a>
  <a href="https://valkey.io/blog/introducing-valkey-search/">Valkey Search</a>
  <a href="https://aws.amazon.com/blogs/database/amazon-ads-upgrades-to-amazon-elasticache-for-valkey-to-achieve-12-higher-throughput-and-save-over-45-in-infrastructure-costs/">Caso de estudio de Amazon Ads</a>
  <a href="https://aws.amazon.com/blogs/database/lower-cost-and-latency-for-ai-using-amazon-elasticache-as-a-semantic-cache-with-amazon-bedrock/">Evaluación de la caché semántica con Bedrock</a>
</div>

<!--
Cierra con acciones, no con un resumen. Tres pasos concretos que pueden realizar en su escritorio el lunes: encontrar una ruta repetida, almacenarla en caché y medirla con honestidad.
Los enlaces de la parte inferior son las fuentes que respaldan cada cifra de la charla.
Control de tiempo: 29:00.
-->

---
layout: default
class: resources-slide
---

<div class="dod-header">
  <div class="dod-dots dod-dots--small" aria-hidden="true"><i></i><i></i><i></i></div>
  <p class="dod-eyebrow">RECURSOS</p>
</div>
<h1 class="dod-title">Continúa después de la charla</h1>

<div class="resources-grid">
  <dl class="resources-list">
    <div>
      <dt>Valkey en GitHub</dt>
      <dd><a href="https://github.com/valkey-io/valkey">github.com/valkey-io/valkey</a></dd>
    </div>
    <div>
      <dt>Estas diapositivas</dt>
      <dd><a href="https://tinyurl.com/DevOpsDaysBogota26-Caching">tinyurl.com/DevOpsDaysBogota26-Caching</a></dd>
    </div>
    <div>
      <dt>Dónde encontrarme</dt>
      <dd><a href="https://www.linkedin.com/in/robertolunarojas/">linkedin.com/in/robertolunarojas</a></dd>
    </div>
  </dl>

  <a class="resources-qr" href="https://www.linkedin.com/in/robertolunarojas/" aria-label="Abrir el perfil de LinkedIn de Roberto">
    <img src="/qr/qr-linkedin.svg" alt="Código QR del perfil de Roberto Luna Rojas en LinkedIn" />
    <span>Escanea para conectarte</span>
  </a>
</div>

<!--
Tres lugares para continuar. En el repositorio de Valkey en GitHub puedes darle una estrella, revisar las incidencias y consultar la breve guía para contribuir. Estas diapositivas están disponibles en el enlace corto, con todas las fuentes vinculadas. También puedes encontrarme en LinkedIn. El código QR lleva directamente a mi perfil. Y mándenme sus tasas de aciertos: las buenas y, sobre todo, las malas.
Control de tiempo: 29:15.
-->

---
layout: default
class: closing-slide
---

<img class="closing-scene" src="/devopsdays/closing-workshop-scene.jpg" alt="" />
<img class="closing-veil" src="/devopsdays/closing-veil.png" alt="" />

<div class="closing-content">
  <img class="closing-event-logo" src="/devopsdays/devopsdays-bogota-2026-logo.png" alt="DevOpsDays Bogotá 2026" />

  <p class="closing-eyebrow">CIERRE</p>
  <h1>Gracias</h1>
  <p class="closing-questions">¿Preguntas?</p>
  <PresenterIdentity class="closing-presenter" />

  <div class="closing-qr">
    <a class="qr-card" href="https://www.linkedin.com/in/robertolunarojas/" aria-label="Abrir el perfil de LinkedIn de Roberto">
      <img src="/qr/qr-linkedin.svg" alt="Código QR del perfil de Roberto Luna Rojas en LinkedIn" />
      <strong>Conectemos</strong>
      <span>linkedin.com/in/robertolunarojas</span>
    </a>
    <a class="qr-card" href="https://valkey.io" aria-label="Abrir valkey.io">
      <img src="/qr/qr-valkey.svg" alt="Código QR para valkey.io" />
      <strong>Explora Valkey</strong>
      <span>valkey.io</span>
    </a>
  </div>

  <p class="closing-tags">#DevOpsDaysBogota · devopsdaysbogota.org</p>
</div>

<p class="closing-event">23 OCT 2026 · COMPENSAR AV. 68</p>

<!--
¡Gracias, Bogotá! Señala los dos códigos QR: conecta conmigo en LinkedIn y explora Valkey. Mantén esta imagen durante la sesión de preguntas y respuestas.
Control de tiempo: 29:30, después preguntas.
-->
