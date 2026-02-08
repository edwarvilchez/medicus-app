# 🏥 MEDICUS - Brief Inicial del Proyecto

## 📋 Resumen Ejecutivo

**Medicus** es un sistema integral de gestión clínica y hospitalaria desarrollado con tecnologías web modernas (Angular + Node.js + PostgreSQL) que optimiza los flujos de trabajo médicos y administrativos, mejorando la experiencia tanto de pacientes como del personal de salud.

**Versión Actual:** 1.6.0  
**Estado:** En producción activa  
**Licencia:** MIT  
**Autor:** Edwar Vilchez

---

## 🎯 Propuesta de Valor

### Problema que Resuelve

Las clínicas y consultorios médicos enfrentan desafíos diarios en:

- ❌ Gestión manual de citas y agendas
- ❌ Historiales médicos en papel o sistemas desconectados
- ❌ Falta de comunicación automatizada con pacientes
- ❌ Control financiero deficiente
- ❌ Acceso limitado a información en tiempo real
- ❌ Cumplimiento de normativas de protección de datos

### Solución Propuesta

Medicus ofrece una plataforma **todo-en-uno** que:

- ✅ Centraliza la gestión de pacientes, doctores y personal
- ✅ Automatiza el agendamiento y las notificaciones
- ✅ Digitaliza historiales médicos con seguridad
- ✅ Proporciona control financiero en tiempo real
- ✅ Cumple con estándares internacionales (ISO 27001, GDPR)
- ✅ Ofrece acceso multiplataforma (escritorio, tablet, móvil)

---

## 🌟 Características Principales

### 1. 👥 Gestión de Usuarios y Roles

**Sistema de Autenticación Robusto:**

- Autenticación JWT (JSON Web Tokens) segura
- Recuperación de contraseña con tokens de un solo uso
- Registro público para pacientes
- Perfiles personalizables por rol

**Roles del Sistema:**

- **SUPERADMIN**: Acceso total al sistema
- **ADMIN**: Gestión administrativa completa
- **DOCTOR**: Acceso a pacientes, citas e historiales
- **NURSE**: Gestión de enfermería y asistencia médica
- **ADMINISTRATIVE**: Personal administrativo y recepción
- **PATIENT**: Acceso limitado a información personal

### 2. 📅 Sistema de Agendamiento Inteligente

**Agendamiento Público:**

- ✅ Reserva de citas **sin necesidad de cuenta**
- ✅ Detección automática de pacientes existentes
- ✅ Selección de especialidad y doctor
- ✅ Calendario interactivo con horarios disponibles
- ✅ Confirmación automática por email

**Gestión de Citas:**

- Estados: Pendiente, Confirmada, Completada, Cancelada
- Calendario visual para doctores y administradores
- Notificaciones automáticas
- Recordatorios programados

### 3. 📧 Sistema de Notificaciones Automatizado

**Canales de Comunicación:**

- ✅ **Email**: Confirmaciones de citas, recuperación de contraseña
- ✅ **WhatsApp**: Recordatorios (integración lista)
- ✅ **Google Calendar**: Enlaces directos para agregar citas

**Tipos de Notificaciones:**

- Confirmación de cita agendada
- Recordatorio 24h antes de la cita
- Cambios en el estado de la cita
- Recuperación de contraseña
- Confirmación de cambio de contraseña

### 4. 🏥 Gestión Médica Completa

**Módulo de Pacientes:**

- Registro completo con datos demográficos
- Historial médico digital
- Resultados de laboratorio
- Historial de citas y tratamientos
- Búsqueda y filtrado avanzado

**Módulo de Doctores:**

- Gestión de perfiles profesionales
- Especialidades médicas
- Horarios de atención
- Estadísticas de consultas
- Agenda personalizada

**Módulo de Enfermería:**

- Gestión de personal de enfermería
- Turnos (Mañana, Tarde, Noche)
- Asignación a departamentos
- Registro de actividades

### 5. 🧪 Laboratorio y Reportes Médicos

**Generación de Reportes PDF:**

- ✅ Creación dinámica de documentos clínicos
- ✅ Detección automática de valores anormales (resaltados en rojo)
- ✅ Diseño profesional con membrete institucional
- ✅ Visualización instantánea en navegador
- ✅ Descarga y archivo digital

**Características Técnicas:**

- Generación client-side (sin carga en servidor)
- Formato estandarizado
- Integración con historial del paciente

### 6. 💰 Gestión Financiera Avanzada

**Módulo de Pagos:**

- ✅ Emisión de cobros y facturación
- ✅ Múltiples métodos de pago:
  - Transferencia bancaria
  - Pago móvil
  - Tarjeta de débito/crédito
  - Efectivo (USD/VES)
- ✅ Registro de banco y referencia
- ✅ Estados: Pendiente / Pagado
- ✅ Búsqueda reactiva por referencia, paciente o concepto

**Reportes Financieros:**

- ✅ Exportación a CSV para auditorías
- ✅ Recibos digitales con impresión
- ✅ Visualización dual de montos (USD/VES)
- ✅ Dashboard con KPIs financieros

**Sistema Multimoneda:**

- Conversión automática USD ↔ VES
- Tasa de cambio configurable
- Visualización dual en tablas y recibos
- Persistencia de preferencias

### 7. 📊 Dashboard y Estadísticas

**Panel de Control Inteligente:**

- Vista diferenciada por rol (Staff vs Paciente)
- Métricas en tiempo real
- Gráficos interactivos (Chart.js)
- Próximas citas
- Alertas y notificaciones

**Estadísticas Disponibles:**

- Total de pacientes activos
- Citas del día/semana/mes
- Ingresos y pagos pendientes
- Ocupación de doctores
- Tendencias y análisis

### 8. 🌍 Globalización

**Soporte Multi-idioma (i18n):**

- ✅ Español (ES) - Idioma principal
- ✅ Inglés (EN) - Idioma secundario
- ✅ Cambio instantáneo sin recarga
- ✅ Persistencia de preferencias
- ✅ Motor basado en Angular Signals

**Sistema Multimoneda:**

- ✅ Dólar estadounidense (USD)
- ✅ Bolívar venezolano (VES)
- ✅ Conversión en tiempo real
- ✅ Visualización dual

### 9. 🎨 Experiencia de Usuario (UI/UX)

**Diseño Moderno y Profesional:**

- ✅ Interfaz responsiva (móvil, tablet, escritorio)
- ✅ Estética médica limpia y brillante
- ✅ Glassmorphism en componentes clave
- ✅ Animaciones suaves y micro-interacciones
- ✅ Formularios optimizados sin scroll
- ✅ Branding consistente en todas las páginas

**Navegación Intuitiva:**

- Sidebar off-canvas responsivo
- Navbar compacto con accesos rápidos
- Breadcrumbs contextuales
- Búsqueda global

---

## 🛡️ Seguridad y Cumplimiento

### Estándares Internacionales

**ISO/IEC 27001 - Seguridad de la Información:**

- ✅ Confidencialidad: Encriptación de datos sensibles
- ✅ Integridad: Validación de esquemas y sanitización
- ✅ Disponibilidad: Arquitectura escalable

**GDPR/RGPD - Protección de Datos:**

- ✅ Consentimiento explícito en registro
- ✅ Acceso limitado por roles
- ✅ Derecho al olvido (eliminación de datos)
- ✅ Transparencia en el uso de información

**ISO 9001:2015 - Gestión de Calidad:**

- ✅ Enfoque en el usuario
- ✅ Mejora continua
- ✅ Mantenimiento preventivo

### Medidas de Seguridad Técnicas

- 🔒 Autenticación JWT con tokens de corta duración
- 🔒 Hashing de contraseñas con bcryptjs (salt rounds: 10)
- 🔒 Tokens de recuperación de un solo uso (1 hora de validez)
- 🔒 Validación de inputs en frontend y backend
- 🔒 CORS configurado
- 🔒 Protección contra SQL Injection (ORM Sequelize)
- 🔒 HTTPS en producción

---

## 🚀 Stack Tecnológico

### Frontend

| Tecnología          | Versión  | Propósito                                             |
| ------------------- | -------- | ----------------------------------------------------- |
| **Angular**         | 21.1.0   | Framework principal (Standalone Components + Signals) |
| **Bootstrap**       | 5.3.8    | Framework CSS y componentes UI                        |
| **Bootstrap Icons** | 1.13.1   | Iconografía                                           |
| **RxJS**            | 7.8.0    | Programación reactiva                                 |
| **Chart.js**        | 4.5.1    | Gráficos y visualizaciones                            |
| **ng2-charts**      | 8.0.0    | Wrapper de Chart.js para Angular                      |
| **jsPDF**           | 4.0.0    | Generación de PDFs                                    |
| **jspdf-autotable** | 5.0.7    | Tablas en PDFs                                        |
| **SweetAlert2**     | 11.26.17 | Alertas y modales elegantes                           |

### Backend

| Tecnología     | Versión | Propósito                     |
| -------------- | ------- | ----------------------------- |
| **Node.js**    | 18+     | Runtime JavaScript            |
| **Express**    | 5.2.1   | Framework web RESTful         |
| **Sequelize**  | 6.37.7  | ORM para base de datos        |
| **PostgreSQL** | 14+     | Base de datos relacional      |
| **JWT**        | 9.0.3   | Autenticación stateless       |
| **Bcryptjs**   | 3.0.3   | Encriptación de contraseñas   |
| **Nodemailer** | -       | Envío de emails               |
| **Morgan**     | 1.10.1  | Logger HTTP                   |
| **CORS**       | 2.8.6   | Cross-Origin Resource Sharing |
| **node-cron**  | 4.2.1   | Tareas programadas            |

### Base de Datos

**PostgreSQL 14+**

- Modelo relacional normalizado
- Relaciones definidas con Sequelize
- Migraciones controladas
- Seeds para datos de prueba

---

## 📐 Arquitectura del Sistema

### Patrón de Diseño

**Cliente-Servidor (REST API)**

- Frontend: SPA (Single Page Application) con Angular
- Backend: API RESTful con Express
- Comunicación: HTTP/HTTPS con JSON

**Backend: MVC (Modelo-Vista-Controlador)**

- **Modelos**: Definición de datos y relaciones (Sequelize)
- **Controladores**: Lógica de negocio
- **Rutas**: Endpoints de la API

**Frontend: Arquitectura de Componentes**

- **Servicios**: Comunicación HTTP (Singleton)
- **Componentes**: Lógica de presentación
- **Guards**: Protección de rutas
- **Interceptors**: Manejo de tokens y errores

### Modelo de Datos (Relaciones Principales)

```
User (Central)
├── 1:1 → Doctor (especialidad, licencia)
├── 1:1 → Patient (historial, tipo de sangre)
├── 1:1 → Nurse (turno, departamento)
└── 1:1 → Staff (cargo, departamento)

Appointment
├── N:1 → Doctor
├── N:1 → Patient
└── Estados: Pending, Confirmed, Completed, Cancelled

Payment
├── N:1 → Patient
└── Estados: Pending, Paid

LabResult
└── N:1 → Patient

MedicalRecord
├── N:1 → Doctor
└── N:1 → Patient
```

---

## 📦 Estructura del Proyecto

```
medicus-app/
├── client/                      # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Componentes visuales
│   │   │   │   ├── dashboard/
│   │   │   │   ├── doctors/
│   │   │   │   ├── patients/
│   │   │   │   ├── appointments/
│   │   │   │   ├── lab-results/
│   │   │   │   ├── payments/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── shared/      # Sidebar, Navbar, Footer
│   │   │   ├── services/        # Lógica de negocio
│   │   │   ├── guards/          # Protección de rutas
│   │   │   ├── models/          # Interfaces TypeScript
│   │   │   └── app.routes.ts    # Configuración de rutas
│   │   └── styles/              # CSS global
│   └── package.json
│
├── server/                      # Backend Node.js
│   ├── src/
│   │   ├── config/              # Configuración DB
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── models/              # Modelos Sequelize
│   │   ├── routes/              # Endpoints API
│   │   ├── middlewares/         # Auth, validación
│   │   ├── utils/               # Utilidades y seeds
│   │   └── index.js             # Punto de entrada
│   ├── .env                     # Variables de entorno
│   └── package.json
│
├── ARCHITECTURE.md              # Documentación técnica
├── CHANGELOG.md                 # Historial de cambios
├── README.md                    # Guía de instalación
├── CREDENCIALES_TESTING.txt     # Usuarios de prueba
├── USUARIOS_PRUEBA.md           # Documentación de usuarios
└── ESPECIALIDADES.md            # Catálogo de especialidades
```

---

## 🔄 Flujo de Trabajo

### Flujo de Usuario (Paciente)

1. **Acceso Público:**
   - Visita la página de agendamiento
   - Selecciona especialidad y doctor
   - Elige fecha y hora disponible
   - Ingresa datos personales
   - Recibe confirmación por email

2. **Usuario Registrado:**
   - Inicia sesión
   - Ve sus próximas citas
   - Consulta resultados de laboratorio
   - Descarga reportes médicos
   - Actualiza perfil

### Flujo de Usuario (Doctor)

1. **Inicio de Sesión:**
   - Accede con credenciales
   - Ve dashboard con estadísticas
   - Revisa agenda del día

2. **Gestión de Consultas:**
   - Atiende citas programadas
   - Registra historial médico
   - Solicita exámenes de laboratorio
   - Emite recetas y reposos

3. **Reportes:**
   - Genera reportes de laboratorio
   - Consulta historial de pacientes
   - Revisa estadísticas personales

### Flujo de Usuario (Administrativo)

1. **Gestión Operativa:**
   - Registra nuevos pacientes
   - Agenda citas manualmente
   - Confirma/cancela citas
   - Gestiona pagos y facturación

2. **Reportes Financieros:**
   - Consulta ingresos del día/mes
   - Exporta reportes a CSV
   - Emite recibos de pago
   - Controla pagos pendientes

---

## 🎯 Casos de Uso Principales

### CU-01: Agendar Cita (Público)

**Actor:** Paciente no registrado  
**Flujo:**

1. Accede a `/agendar-cita`
2. Selecciona especialidad
3. Elige doctor disponible
4. Selecciona fecha y hora
5. Ingresa datos personales
6. Sistema detecta si ya existe como paciente
7. Confirma cita
8. Recibe email de confirmación

### CU-02: Recuperar Contraseña

**Actor:** Usuario registrado  
**Flujo:**

1. Accede a `/forgot-password`
2. Ingresa email registrado
3. Recibe email con enlace de recuperación
4. Accede al enlace (válido 1 hora)
5. Establece nueva contraseña
6. Recibe confirmación por email

### CU-03: Generar Reporte de Laboratorio

**Actor:** Doctor  
**Flujo:**

1. Accede al módulo de laboratorio
2. Selecciona paciente
3. Ingresa resultados de exámenes
4. Sistema detecta valores anormales
5. Genera PDF con formato profesional
6. Visualiza en navegador
7. Descarga o imprime

### CU-04: Gestionar Pago

**Actor:** Personal administrativo  
**Flujo:**

1. Accede al módulo de pagos
2. Crea nuevo cobro
3. Selecciona paciente y concepto
4. Ingresa monto y método de pago
5. Registra banco y referencia (si aplica)
6. Marca como pagado (opcional)
7. Genera recibo digital

---

## 📊 Métricas y KPIs

### Dashboard Principal (Staff)

**Métricas Operativas:**

- 📈 Total de pacientes activos
- 📅 Citas del día
- 📅 Citas de la semana
- 👨‍⚕️ Doctores activos
- 👩‍⚕️ Personal de enfermería

**Métricas Financieras:**

- 💰 Ingresos del mes
- 💳 Pagos pendientes
- 📊 Gráfico de actividad (últimos 7 días)

**Próximas Citas:**

- Lista de citas del día
- Estado de cada cita
- Información del paciente y doctor

### Dashboard Paciente

**Vista Simplificada:**

- 📅 Mis próximas citas
- 🧪 Mis resultados de laboratorio
- 📄 Historial médico
- 👤 Mi perfil

---

## 🔐 Usuarios de Prueba

### SUPERADMIN

- **Email:** admin@medicus.com
- **Password:** admin123
- **Acceso:** Total al sistema

### Doctores (Password: doctor123)

1. dr.martinez@medicus.com - Cardiología
2. dr.rodriguez@medicus.com - Pediatría
3. dr.lopez@medicus.com - Dermatología

### Enfermeras (Password: nurse123)

1. enf.garcia@medicus.com - Cuidados Intensivos
2. enf.fernandez@medicus.com - Pediatría
3. enf.torres@medicus.com - Emergencias

### Personal Administrativo (Password: staff123)

1. staff.ramirez@medicus.com - Recepcionista
2. staff.morales@medicus.com - Contador
3. staff.silva@medicus.com - Coordinador

### Pacientes (Password: patient123)

1. pac.gonzalez@email.com - Juan González
2. pac.perez@email.com - Elena Pérez
3. pac.diaz@email.com - Luis Díaz

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn
- Cuenta de Gmail (para emails)

### Configuración Backend

1. **Instalar dependencias:**

```bash
cd server
npm install
```

2. **Configurar variables de entorno (.env):**

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=medicus_dev
DB_USER=medicus_app_admin
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_super_seguro_123

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password
FROM_NAME=Clínica Medicus
FROM_EMAIL=tu_email@gmail.com

# Frontend URL
CLIENT_URL=http://localhost:4200
```

3. **Iniciar servidor:**

```bash
npm run dev
```

### Configuración Frontend

1. **Instalar dependencias:**

```bash
cd client
npm install
```

2. **Iniciar aplicación:**

```bash
npm start
```

3. **Acceder:**

- URL: http://localhost:4200/
- Login: admin@medicus.com / admin123

---

## 🌐 URLs Principales

### Páginas Públicas (Sin autenticación)

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de pacientes
- `/agendar-cita` - Agendamiento público
- `/forgot-password` - Recuperar contraseña
- `/reset-password/:token` - Restablecer contraseña

### Páginas Privadas (Requieren autenticación)

- `/dashboard` - Panel principal
- `/patients` - Gestión de pacientes
- `/doctors` - Gestión de doctores
- `/nurses` - Gestión de enfermeras
- `/staff` - Personal administrativo
- `/appointments` - Gestión de citas
- `/lab-results` - Resultados de laboratorio
- `/payments` - Gestión de pagos
- `/medical-records` - Historiales médicos

---

## 📈 Roadmap y Futuras Mejoras

### Versión 1.7.0 (Próxima)

- [ ] Integración real con WhatsApp Business API
- [ ] Módulo de inventario médico
- [ ] Reportes avanzados con filtros personalizados
- [ ] Integración con pasarelas de pago
- [ ] App móvil nativa (iOS/Android)

### Versión 2.0.0 (Futuro)

- [ ] Telemedicina (videoconsultas)
- [ ] Inteligencia Artificial para diagnósticos
- [ ] Integración con dispositivos médicos IoT
- [ ] Sistema de facturación electrónica
- [ ] Multi-tenant (múltiples clínicas)

---

## 🤝 Soporte y Contacto

**Desarrollador:** Edwar Vilchez  
**Email:** edwarvilchez1977@gmail.com  
**GitHub:** [@edwarvilchez](https://github.com/edwarvilchez)

**Repositorio:** https://github.com/edwarvilchez/medicus-app

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ para mejorar la gestión de clínicas médicas**

_Última actualización: Febrero 2026 - Versión 1.6.0_
