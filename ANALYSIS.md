# Análisis rápido del proyecto Medicus

## Resumen
Aplicación full-stack para gestión clínica: frontend en Angular (v21) y backend en Node/Express con Sequelize + PostgreSQL. Soporta websockets para videoconsulta.

## Entrypoints
- Frontend: `client/src/main.ts` (inicia la aplicación Angular)
- Backend: `server/src/index.js` (inicia Express + sockets)

## Endpoints principales (mapeadas desde `server/src/index.js`)
- `/api/public`  — Rutas públicas (agendamiento, registros públicos)
- `/api/auth` — Autenticación (login, refresh, recovery)
- `/api/appointments` — Gestión de citas
- `/api/patients` — CRUD pacientes
- `/api/doctors` — CRUD doctores
- `/api/nurses` — CRUD enfermería
- `/api/staff` — Personal administrativo
- `/api/medical-records` — Historias clínicas
- `/api/lab-results` — Resultados de laboratorio
- `/api/payments` — Pagos y facturación
- `/api/stats` — Estadísticas y dashboard
- `/api/specialties` — Especialidades médicas
- `/api/video-consultations` — Videoconsultas (Socket.io)
- `/api/bulk` — Operaciones masivas
- `/api/team` — Gestión de equipos

## Prioridades de tests
1. Autenticación: login, token expiración, recuperación de contraseña
2. Endpoints críticos: creación/actualización de `appointments`, `patients`, `medical-records`
3. Validación de inputs: pruebas de límites y datos malformados
4. Scheduler y jobs (recordatorios / emails)
5. Integración de sockets (videoconsultas): conexión, flujo básico

## Problemas y mejoras detectadas (acciones rápidas)
- Añadir `nodemailer` a `server/package.json` (ya añadido).
- Mover `nodemon` a `devDependencies` (ya movido).
- Reemplazar `sequelize.sync()` por migraciones en producción.
- Añadir `helmet`, `express-rate-limit`, validación y límites de upload.
- Configurar CI (tests, lint, build) y Docker para reproducibilidad (se añadió `server/Dockerfile` y `docker-compose.yml`).
- Añadir `SECURITY_CHECKLIST.md` y plantilla de PR para integrarlo en revisión de código.

## Siguientes pasos recomendados
- Crear migraciones con Sequelize CLI o Umzug.
- Añadir pruebas unitarias y de integración (Vitest/Jest + supertest).
- Añadir un workflow de GitHub Actions para CI (lint + tests + build).
- Considerar desplegar artefactos con Docker y usar un secret manager para variables.

## Release / Merge Log

Fecha: 2026-02-09

- Rama `chore/refactor-import-tests` creada y cambios principales:
	- Reemplazo de `xlsx` por `exceljs` en cliente (mejor compatibilidad)
	- Nuevo `importService` en backend para parsing CSV/XLSX y validaciones
	- Middleware centralizado de uploads con límites y filtros
	- Migraciones iniciales para `Roles` y `Users`
	- CI y seguridad: audit steps, PR template, security checklist
	- Tests básicos y runner para validación local

Acciones realizadas: los cambios fueron integrados y empujados a la rama remota `chore/refactor-import-tests`.

Pasos recomendados para release:
- Revisar PR en GitHub y abrir revisión de código.
- Probar en entorno staging antes de fusionar a `master`.

