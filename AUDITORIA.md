
# LA ESQUINA DEL TUNCHE

## AUDITORÍA FINAL, CORRECCIÓN INTEGRAL Y CIERRE DEL PROYECTO

### Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

Actúa como un equipo profesional compuesto por:

- Senior Frontend Engineer.
- Senior UI/UX Designer especializado en experiencias gastronómicas.
- Especialista en responsive design y accesibilidad.
- QA Engineer especializado en pruebas funcionales.
- Ingeniero DevOps especializado en GitHub y Vercel.

**Esta es la última fase de desarrollo del proyecto.**

No quiero seguir realizando rediseños sucesivos ni incorporar nuevas funcionalidades innecesarias.

Quiero identificar y corregir de una sola vez los problemas visuales, funcionales y responsive existentes, para entregar una carta digital estable, elegante, intuitiva y lista para producción.

## 1. REFERENCIAS Y FUENTES DE VERDAD

Web publicada:

https://esquinadeltunche.vercel.app/

Repositorio:

https://github.com/reinerjimenez/esquinadeltunche

Referencia del comportamiento de categorías:

https://mirador-tunche.netlify.app/

Inspecciona el proyecto local completo.

Si tienes acceso a un navegador, abre la web publicada, revisa sus secciones y contrástalas con la versión local.

Utiliza capturas reales o automatizadas para verificar los problemas visuales.

**No supongas que la web publicada contiene los últimos cambios locales.**

Comprueba la revisión desplegada y diferencia los problemas de producción de los cambios pendientes de publicación.

Si no puedes abrir alguna web, declara la limitación y continúa utilizando el código disponible y las capturas facilitadas.

No copies diseños ni código de la referencia externa.

---

## 2. OBJETIVO DE CIERRE

La experiencia final debe permitir que el cliente:

1. Entre a la carta y comprenda inmediatamente cómo explorarla.
2. Descubra que existen 15 categorías gastronómicas.
3. Seleccione cualquier categoría con facilidad.
4. Visualice exclusivamente los platos de la categoría seleccionada.
5. Identifique nombre, descripción, fotografía y precio.
6. Agregue y personalice platos.
7. Revise su carrito y envíe su pedido por WhatsApp.
8. Consulte promociones, cupones y fidelización.
9. Encuentre la ubicación y los datos de contacto.
10. Acceda a Instagram y pueda dejar una reseña en Google Maps.

La página debe sentirse como un producto terminado, no como un conjunto de componentes apilados.

**No modificar productos, precios, fotografías, promociones, datos empresariales ni reglas comerciales.**

---

# 3. CORRECCIÓN DEFINITIVA DEL SELECTOR DE CATEGORÍAS

Actualmente se ha implementado:

- Barra horizontal con chips.
- Categoría activa.
- Encabezado «Nuestra carta».
- Contador de categorías.
- Botón «Ver todas las categorías».
- Panel expandible de dos columnas.
- Navegación por teclado.
- Una sola categoría renderizada.

Estas funcionalidades deben conservarse.

### Problema principal

El panel de 15 categorías se despliega dentro del flujo normal de la página y ocupa casi toda la pantalla móvil.

Esto empuja los platos hacia abajo y provoca una sensación de saturación.

### Solución requerida

Transformar «Ver todas las categorías» en un selector superpuesto compacto.

En móviles utilizar preferentemente un **bottom sheet accesible**, con estas características:

- Altura máxima aproximada del 75–80 % del viewport disponible.
- Scroll interno.
- Encabezado «Todas las categorías».
- Botón de cierre claramente identificable.
- Categorías en cuadrícula de dos columnas.
- Nombre completo y cantidad de platos.
- Categoría seleccionada resaltada.
- Fondo y borde coherentes con la identidad del restaurante.
- Respeto de `safe-area-inset-bottom`.
- Sin desbordamiento horizontal.

El panel debe abrirse sin desplazar el contenido principal.

Al seleccionar una categoría:

1. Actualizar el estado.
2. Cerrar el selector.
3. Mostrar los platos correspondientes.
4. Llevar la posición de lectura al comienzo de la categoría cuando corresponda.
5. Conservar el carrito y las demás funciones.

El panel debe poder cerrarse mediante:

- Botón de cerrar.
- Tecla Escape.
- Clic fuera, cuando corresponda.

Gestionar el foco correctamente. Mientras el modal esté abierto, impedir que el teclado interactúe accidentalmente con el contenido situado detrás.

Bloquear el scroll del documento durante la apertura y restaurarlo correctamente al cerrar.

En escritorio puede utilizarse un popover o modal más apropiado, manteniendo el mismo comportamiento y accesibilidad.

No crear dos implementaciones diferentes de lógica comercial.

---

# 4. MEJORAR LA BARRA HORIZONTAL

La barra de categorías debe comunicar visualmente que tiene desplazamiento horizontal.

Requisitos:

- Categoría activa claramente resaltada.
- Chips de dimensiones proporcionadas.
- Nombres legibles.
- Desplazamiento suave.
- Indicadores de overflow dinámicos.
- No mostrar indicadores cuando no exista contenido oculto.
- Evitar que un degradado tape palabras o controles.
- Centrar o revelar automáticamente la categoría activa.
- Mantener navegación por teclado.

La barra debe permitir identificar inmediatamente que se puede explorar más contenido.

No implementar carruseles automáticos ni animaciones que distraigan.

Revisar especialmente que una categoría parcialmente visible no parezca un botón defectuoso.

---

# 5. ELIMINAR DUPLICACIONES VISUALES

Revisar conjuntamente:

- `CategoryNav.tsx`
- `MenuSection.tsx`
- `app/page.tsx`
- `app/globals.css`

Actualmente aparecen varias informaciones relacionadas:

- Nuestra carta.
- Explora nuestras 15 categorías.
- Categoría 3 de 15.
- Número de platos.
- Nombre de la categoría.

Conserva lo útil, pero evita que cada elemento tenga protagonismo excesivo.

Jerarquía deseada:

**Nuestra carta**
Texto secundario: Explora nuestras 15 categorías.

Barra horizontal + botón para elegir otra categoría.

Después:

**Makis**
8 platos disponibles.

La posición «3 de 15» es opcional y debe mantenerse únicamente si aporta utilidad sin saturar.

No duplicar títulos, etiquetas ni separadores innecesarios.

---

# 6. CORREGIR HEADER, STICKY Y DESPLAZAMIENTO

Inspecciona:

- `Header.tsx`
- `CategoryNav.tsx`
- `app/page.tsx`
- `HeroSection.tsx`
- `globals.css`

Verifica todos los flujos de desplazamiento:

- Desde la portada al catálogo.
- Desde una categoría a otra.
- Desde el final del listado al selector.
- Desde un enlace con hash.
- Desde resultados de búsqueda.
- Desde el Club del Tunche.
- Desde botones de navegación interna.

Actualmente `app/page.tsx` calcula manualmente alturas de Header y navegación.

Revisa estos cálculos para evitar inconsistencias cuando cambia el ancho o el contenido del encabezado.

Utiliza una estrategia consistente para sticky offsets y scroll.

No deben quedar títulos, precios, botones o nombres de productos escondidos detrás del Header.

Evita saltos bruscos y desplazamientos repetidos.

Respeta `prefers-reduced-motion`.

No implementes soluciones basadas únicamente en valores mágicos de píxeles.

---

# 7. CORRECCIÓN DEL BOTÓN FLOTANTE DE WHATSAPP/CARRITO

Inspecciona:

- `CartButton.tsx`
- `CartSheet.tsx`
- `ShareBlock.tsx`
- `DishCard.tsx`
- `globals.css`

En las capturas actuales, el botón verde flotante invade visualmente varias tarjetas y llega a cubrir contenido.

Debes solucionar esto de manera definitiva.

Requisitos:

- Mantener acceso rápido al carrito.
- Mantener el contador de productos.
- Mantener WhatsApp como canal de pedido.
- Conservar accesibilidad.
- Área táctil mínima de 44 × 44 px.
- Evitar animaciones permanentes.
- Respetar safe areas.
- No cubrir botones de agregar.
- No cubrir precios.
- No interferir con el selector de categorías.
- No interferir con los bottom sheets.
- No tapar las acciones de compartir.

Considera ocultar temporalmente el botón flotante cuando se abra otro modal o bottom sheet, siempre que exista una forma correcta de gestionar su estado.

El botón no debe competir con acciones que ya estén visibles en pantalla.

Comprueba la solución en móviles pequeños, no solamente en escritorio.

---

# 8. PULIDO DE LAS TARJETAS GASTRONÓMICAS

Inspecciona `DishCard.tsx`, `DishSheet.tsx` y sus estilos.

Revisar:

- Espaciado entre tarjetas.
- Márgenes internos.
- Alineación de precios.
- Descripciones demasiado largas.
- Botones de agregar.
- Etiquetas gastronómicas.
- Fotografías.
- Radios y bordes.
- Distribución de contenido.

El cliente debe poder identificar claramente el nombre y precio de un plato sin abrir su detalle.

Evita tarjetas innecesariamente altas que alarguen demasiado una categoría.

No reduzcas tanto los espacios que vuelva a aparecer amontonamiento.

Debe existir una relación equilibrada entre densidad de información y facilidad de lectura.

En tarjetas con fotografía, conserva el protagonismo de la imagen.

No alterar ningún dato de `data/menu.ts`.

---

# 9. REVISIÓN COMPLETA DEL CLUB DEL TUNCHE

Conservar las tres pestañas:

- Mis visitas.
- Cupones.
- Especiales.

Revisar el diseño interior y confirmar que:

- Los sellos no se compriman.
- El contador de visitas se alinee correctamente.
- Los botones tengan espacio suficiente.
- Los textos no se superpongan.
- Las condiciones de uso sean legibles.
- Las funciones de registro y reinicio sigan operativas.
- El cupón CLUBTUNCHE se pueda aplicar correctamente.
- Los enlaces de consulta funcionen.

No modificar reglas de fidelización ni aparentar que las visitas locales están verificadas automáticamente.

No reconstruir el Club si su implementación actual ya cumple los criterios.

---

# 10. MAPA, RESEÑAS, INSTAGRAM Y COMPARTIR

Revisar el diseño final de:

- `MapSection.tsx`
- `ShareBlock.tsx`
- `Footer.tsx`
- `data/config.ts`

Confirmar que existan y funcionen los siguientes accesos:

Google Maps:
https://maps.app.goo.gl/iU27zBfXCvB18uW66?g_st=ic

Ficha para reseñas:
https://maps.app.goo.gl/X7MXjDFJNnvYPpH68?g_st=ic

Instagram:
https://www.instagram.com/esquinadeltunche?srtk=bWN6cmJuY2FlMmQy&utm_source=qr

No asumir que el enlace de reseñas abre directamente el formulario de valoración. Si solo abre la ficha del establecimiento, mantener una descripción precisa.

Revisar que no haya espacios excesivos entre mapa, botones, tarjeta de reseñas, compartir y Footer.

Conservar Web Share API, copiar enlace y compartir por WhatsApp.

No duplicar funcionalidades ni convertirlas en botones gigantes.

---

# 11. LIMPIEZA FINAL DE CSS Y COMPONENTES

El archivo `app/globals.css` contiene estilos acumulados durante varias fases del proyecto.

Realiza una revisión cuidadosa para identificar:

- Selectores duplicados.
- Reglas sobreescritas innecesariamente.
- Valores contradictorios.
- Estilos que ya no se utilizan.
- Media queries redundantes.
- Animaciones innecesarias.
- Valores fijos que generan problemas móviles.

Elimina únicamente CSS demostrado como obsoleto.

No reescribas por completo el sistema visual.

No utilices `!important` como solución sistemática.

Conserva las variables de marca y la compatibilidad con Tailwind v4.

Prioriza cambios simples y mantenibles.

---

# 12. PRUEBAS RESPONSIVE OBLIGATORIAS

Ejecuta pruebas reales de renderizado, cuando dispongas de navegador, en:

- 320 × 667
- 360 × 740
- 375 × 812
- 390 × 844
- 430 × 932
- 768 × 1024
- 1440 × 900

Para cada resolución, verificar:

- Header.
- Selector cerrado.
- Selector abierto.
- Categorías parcialmente visibles.
- Primera tarjeta.
- Tarjetas con fotografía.
- Carrito flotante.
- Modal de platos.
- Carrito abierto.
- Club del Tunche.
- Mapa y Footer.

No debe existir ningún desbordamiento horizontal del documento.

Los elementos sticky y fixed no deben ocultar información esencial.

Comprobar también zoom de navegador y ampliación de texto.

Genera capturas de evidencia y guárdalas en:

`artifacts/final-qa/`

Como mínimo:

- mobile-menu.png
- mobile-categories-open.png
- mobile-dish-card.png
- mobile-cart.png
- mobile-club.png
- mobile-footer.png
- desktop-menu.png

No incluyas las capturas en Git salvo que sea necesario y esté justificado.

---

# 13. PRUEBAS FUNCIONALES DE EXTREMO A EXTREMO

Simula un recorrido completo del cliente:

1. Abrir la carta.
2. Llegar al catálogo.
3. Abrir todas las categorías.
4. Seleccionar una categoría.
5. Cambiar a otra.
6. Buscar un plato de una categoría distinta.
7. Abrir detalles.
8. Seleccionar variantes y extras.
9. Agregar al carrito.
10. Agregar un segundo producto.
11. Modificar cantidades.
12. Eliminar un producto.
13. Aplicar un cupón válido.
14. Comprobar el total.
15. Verificar la persistencia al recargar.
16. Generar el enlace y texto de WhatsApp.
17. Verificar que el mensaje represente correctamente el pedido.
18. Consultar el Club.
19. Comprobar los enlaces del mapa, reseñas e Instagram.
20. Probar las funciones de compartir.

No es necesario enviar un pedido real al restaurante.

Puedes validar la URL y los parámetros del enlace de WhatsApp sin completar el envío.

Las pruebas deben demostrar que los cambios visuales no han afectado la lógica comercial.

---

# 14. ACCESIBILIDAD

Revisar:

- Navegación por teclado.
- Foco visible.
- Orden de tabulación.
- Roles ARIA.
- Etiquetas de botones.
- Gestión de foco en modales.
- Restauración del foco al cerrar.
- Escape.
- Scroll locking.
- Contraste.
- Tamaños táctiles.
- Movimiento reducido.

Si se usa `role="dialog"`, implementar el comportamiento esperado de un modal accesible.

No basta con asignar atributos ARIA sin gestionar correctamente el comportamiento.

---

# 15. ESTABILIDAD Y PRODUCCIÓN

Comprobar:

- Versión de Node.js.
- Compatibilidad con Next.js.
- Dependencias multiplataforma.
- Package lock.
- Configuración de Vercel.
- Recursos estáticos.
- Manifest.
- Metadata.
- Imágenes.
- Rutas.
- Imports.

No introducir dependencias binarias específicas de Windows como dependencias obligatorias.

Si existe `scripts/patch-readlink.cjs`, revisar su necesidad y documentar su justificación. No eliminarlo sin validar la compilación.

Ejecutar:

```bash
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Si tienes acceso a Linux, comprobar también instalación limpia con `npm ci`.

No afirmar compatibilidad con Vercel únicamente porque funciona en Windows.

---

# 16. REGLAS PARA EVITAR NUEVAS ITERACIONES INNECESARIAS

Esta fase debe ser de **estabilización y cierre**, no de experimentación.

Por tanto:

- No rediseñar elementos que ya funcionan correctamente.
- No incorporar nuevas secciones.
- No añadir efectos decorativos.
- No cambiar la identidad de marca.
- No instalar bibliotecas innecesarias.
- No alterar la estructura de datos del menú.
- No modificar las reglas de negocio.
- No cambiar el contenido comercial.
- No eliminar funcionalidades.
- No introducir nuevos patrones de navegación distintos de los solicitados.
- No hacer cambios cosméticos sin un problema concreto que resolver.

Corrige cada problema detectado y verifica su resultado antes de pasar al siguiente.

No consideres terminado un problema solamente porque el código compile.

---

# 17. CRITERIOS DE ACEPTACIÓN FINAL

El proyecto podrá considerarse listo cuando:

1. El cliente comprenda que existen 15 categorías.
2. Pueda acceder a cualquiera con máximo dos interacciones desde el selector.
3. El panel de categorías no empuje todo el contenido de la página hacia abajo.
4. Solo se renderice la categoría gastronómica seleccionada.
5. La búsqueda global funcione.
6. El carrito conserve productos, cantidades, opciones y cupones.
7. Los platos sean completamente utilizables.
8. No existan superposiciones que oculten controles esenciales.
9. No existan desbordamientos horizontales.
10. Los apartados de Club, ubicación, reseñas, Instagram y compartir funcionen.
11. El diseño conserve la identidad amazónica.
12. Las pruebas técnicas finalicen correctamente.
13. Los principales recorridos del usuario hayan sido verificados.
14. Las capturas móviles muestren una interfaz coherente y equilibrada.
15. No queden errores críticos ni altos pendientes.

Si queda un error crítico o alto, corrígelo y vuelve a verificarlo.

No ocultes fallos ni reportes pruebas no ejecutadas como exitosas.

---

# 18. INFORME FINAL DE ENTREGA

Cuando termines, entrega un informe estructurado:

**A. Diagnóstico confirmado**
Problemas encontrados realmente en el código o las pruebas visuales.

**B. Correcciones**
Qué se modificó y por qué.

**C. Archivos**
Listado de archivos intervenidos.

**D. Evidencia**
Capturas de la versión corregida.

**E. Pruebas**
Tabla con PASS, FAIL y NO VERIFICADO.

**F. Compilación**
Resultados de lint, TypeScript, build y compatibilidad multiplataforma.

**G. Riesgos**
Problemas pendientes, si existen.

**H. Cierre**
Indicar claramente una de estas dos conclusiones:

- LISTO PARA PUBLICACIÓN.
- NO LISTO PARA PUBLICACIÓN, indicando los bloqueos concretos.

No realices commit, push ni despliegue automáticamente.

---

# INSTRUCCIÓN FINAL

Tienes autorización para implementar todas las correcciones necesarias dentro del alcance indicado, sin solicitar aprobación para cada cambio menor.

Trabaja sobre el proyecto actual.

Conserva todas las funcionalidades.

Realiza las pruebas.

No finalices únicamente con un resumen de archivos modificados: necesito un producto revisado, verificable y preparado para su publicación.

**Objetivo definitivo: terminar La Esquina del Tunche como una carta digital profesional, intuitiva, visualmente equilibrada y estable, sin continuar con ciclos indefinidos de rediseño.**
