# Acciones de seguridad realizadas y recomendaciones

Fecha: 2026-02-09

## Acciones ejecutadas
- Inicié y apliqué migraciones con `sequelize-cli` (migrations aplicadas:
  - `20260209120000-create-roles`
  - `20260209120001-create-users`)
- Ejecuté `npm audit fix` y `npm audit fix --force` en `server` y `client`.
  - `server`: `nodemailer` actualizado a `8.0.1` (audit resuelto). Actualicé el uso en `server/src/utils/sendEmail.js` de `createTransporter` a `createTransport`.
  - `client`: la vulnerabilidad `xlsx` (Prototype Pollution / ReDoS) no tiene fix disponible.

## Resultados
- Migraciones: aplicadas correctamente contra la base de datos accesible desde el entorno.
- Server: sin vulnerabilidades detectadas tras `audit fix --force`.
- Client: persiste 1 vulnerabilidad de alta severidad en `xlsx` sin fix disponible.

## Recomendaciones (prioritarias)
1. Sustituir `xlsx` por alternativa segura para procesamiento de Excel en el cliente o mover la lógica de parsing al backend con sanitización (ej.: `exceljs`, `SheetJS` alternativas, o `xlsx-populate`).
2. Si mantener `xlsx` es inevitable, mitigar:
   - Validar y limitar tamaño máximo de archivos antes de parsear.
   - Procesar archivos en un servicio aislado/sandbox en backend.
   - Revisar y sanitizar contenido antes de exponerlo a la aplicación.
3. Revisar el código que usa `nodemailer` (envíos, plantillas, adjuntos) y probar envíos en staging, ya que la actualización a v8 puede introducir cambios en comportamientos avanzados.
4. Añadir escaneo automático de dependencias en CI (npm audit / Snyk) y crear tareas para revisar dependencias con vulnerabilidades sin fix.

## Tareas propuestas (puedes pedirme ejecutar)
- Crear PR para reemplazar `xlsx` por `exceljs` y ajustar código que depende de su API.
- Añadir validaciones y límites de upload en endpoints que reciben archivos (`multer` config).
- Agregar un job de CI que haga `npm audit` y falle si hay vulnerabilidades de alta severidad.
