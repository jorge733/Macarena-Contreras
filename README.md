# Es de Tela

Vitrina de los trabajos hechos a mano de Maca (Macarena Contreras). Sitio estático (HTML/CSS/JS) publicado en Vercel.

No es una tienda: no hay carrito ni pago en la página. Cada trabajo tiene un botón **«Lo quiero»** que abre WhatsApp con el nombre del trabajo (y la tela, si se eligió una) ya escrito. El pago se hace por transferencia o link de pago y el envío por Blue Express, como se explica en *Cómo comprar*.

Todos los textos, trabajos, telas, fotos y datos de contacto están en `content.js`.

## Secciones

Se muestra una a la vez según el `#` de la dirección:

- `#inicio`: bienvenida, colecciones, bloque de upcycling (foto + texto, lleva a `#upcycling`) y pasos para comprar.
- `#trabajos` (y `#trabajos/<colección>` para filtrar): catálogo.
- `#trabajo/<id>`: ficha de un trabajo, con selector de tela y botón «Lo quiero».
- `#upcycling`: piezas únicas hechas con tela de prendas rescatadas (foto, precio y «Lo quiero»; las vendidas quedan en gris).
- `#telas`, `#como-comprar`, `#sobre-mi`, `#contacto`.

Mientras no haya número de WhatsApp en *Datos de contacto*, los botones de WhatsApp llevan a Contacto y el botón flotante no aparece.

## Panel de edición (`/admin`)

En `/admin` Maca entra con una contraseña y edita el contenido sin tocar código: trabajos y colecciones, telas (disponible o agotada), piezas upcycling (vendida o no), datos de contacto, inicio, cómo comprar, sobre mí y contacto. Al apretar **Guardar y publicar**, la función `api/admin.js` guarda `content.js` (y las fotos nuevas, en `img/`) como un commit en GitHub, y Vercel vuelve a publicar el sitio en 1 o 2 minutos. Las fotos se achican en el navegador (WebP, máx. 1600 px) antes de subirse.

Configuración (una sola vez):

1. En GitHub, crea un token en *Settings → Developer settings → Personal access tokens → Fine-grained tokens*, con acceso solo al repositorio `Macarena-Contreras` y el permiso **Contents: Read and write**.
2. En Vercel, en el proyecto: *Settings → Environment Variables*, agrega:
   - `ADMIN_PASSWORD`: la contraseña del panel (usa una larga).
   - `GITHUB_TOKEN`: el token del paso 1.
   - Opcionales: `GITHUB_REPO` (por defecto `jorge733/Macarena-Contreras`) y `GITHUB_BRANCH` (por defecto `main`).
3. Vuelve a publicar (*Deployments → Redeploy*) para que tome las variables.

## Pendiente de Macarena

- Instagram y correo (*Datos de contacto*).
- Precios de referencia (hoy todos dicen «Precio a consultar»).
- Fotos reales de sus telas: las de ahora son recortes de las fotos de sus trabajos.
