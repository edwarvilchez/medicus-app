# Checklist de Seguridad

Use esta lista antes de mergear cambios que toquen autenticación, autorización, uploads, datos sensibles o infra.

- [ ] Variables sensibles no commiteadas (usar `.env` / secret manager)
- [ ] `helmet` y cabeceras de seguridad habilitadas en producción
- [ ] Rate limiting para endpoints de autenticación y rutas públicas
- [ ] Validación y saneamiento de entradas (Joi / zod / express-validator)
- [ ] Límite y validación de tipos/tamaños de `uploads`
- [ ] Revisar inyección SQL / uso correcto de ORM (Sequelize parametrizado)
- [ ] Revisar JWT expirations y revocación cuando aplique
- [ ] Escapar/validar datos que se muestran en la UI para prevenir XSS
- [ ] Logs sin datos sensibles (no guardar contraseñas o tokens)
- [ ] Configuración segura de CORS (evitar `*` en producción)
- [ ] Revisar dependencias con vulnerabilidades (usar `npm audit` / Snyk)
- [ ] Revisar endpoints públicos (`/api/public`) para abuso

Referencias rápidas:
- OWASP Top 10
- Buenas prácticas de seguridad en Node.js
