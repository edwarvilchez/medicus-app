# 🏥 Medicus - Sistema de Gestión Clínica

Sistema completo de gestión para clínicas médicas desarrollado con Angular y Node.js.

![Version](https://img.shields.io/badge/version-1.7.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Características Principales

### 👥 Gestión de Usuarios

- ✅ Sistema de autenticación con JWT
- ✅ Roles y permisos (Admin, Doctor, Paciente)
- ✅ **Recuperación de contraseña** con tokens seguros
- ✅ Registro público de pacientes
- ✅ Perfiles de usuario personalizables

### 📅 Agendamiento de Citas

- ✅ **Agendamiento público** sin necesidad de cuenta
- ✅ Sistema inteligente de detección de pacientes existentes
- ✅ Calendario interactivo
- ✅ Gestión de horarios disponibles
- ✅ Estados de citas (Confirmada, Completada, Cancelada)
- ✅ Notificaciones automáticas

### 📧 Sistema de Notificaciones

- ✅ **Emails de confirmación** de citas
- ✅ **Emails de recuperación** de contraseña
- ✅ WhatsApp simulado (listo para integración real)
- ✅ Recordatorios automáticos
- ✅ Enlaces a Google Calendar

### 🏥 Gestión Médica

- ✅ Registro de pacientes con historial
- ✅ Gestión de doctores y especialidades
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Reportes y análisis

### 🎨 Interfaz de Usuario

- ✅ **Diseño moderno y responsivo**
- ✅ **Branding consistente** en todas las páginas
- ✅ Formularios optimizados sin scroll
- ✅ Animaciones suaves
- ✅ Modo oscuro (próximamente)

## 🛡️ Estándares y Cumplimiento Internacional

Medicus está diseñado siguiendo los más altos estándares internacionales para garantizar la seguridad de la información y la calidad del servicio:

- 🔒 **ISO/IEC 27001**: Implementamos controles de seguridad de la información para proteger la confidencialidad, integridad y disponibilidad de los datos médicos.
- 💎 **ISO 9001:2015**: Procesos orientados a la gestión de calidad y mejora continua de la experiencia del paciente y doctor.
- 🇪🇺 **GDPR (RGPD)**: Cumplimiento estricto del Reglamento General de Protección de Datos, asegurando el derecho a la privacidad, acceso y olvido de los usuarios.
- ⚖️ **Protección Legal Internacional**: Uso de marcos legales vigentes para la protección de propiedad intelectual y datos sensibles.

## 🚀 Tecnologías

### Frontend

- **Angular 18** - Framework principal
- **Bootstrap 5** - Estilos y componentes
- **Bootstrap Icons** - Iconografía
- **RxJS** - Programación reactiva
- **SweetAlert2** - Alertas elegantes

### Backend

- **Node.js** - Runtime
- **Express** - Framework web
- **Sequelize** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/edwarvilchez/medicus-app.git
cd medicus-app
```

### 2. Configurar Backend

```bash
cd server
npm install
```

Crear archivo `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicus
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

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

**Nota sobre Gmail:**
Para usar Gmail, necesitas generar una "Contraseña de Aplicación":

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (actívala si no la tienes)
3. Contraseñas de aplicaciones → Generar
4. Usa esa contraseña en `SMTP_PASSWORD`

Iniciar servidor:

```bash
npm run dev
```

### 3. Configurar Frontend

```bash
cd client
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📱 Uso

### Acceso Público

- **Agendar Cita**: `http://localhost:4200/agendar-cita`
- **Registrarse**: `http://localhost:4200/register`
- **Recuperar Contraseña**: `http://localhost:4200/forgot-password`

### Usuarios del Sistema

- **Login**: `http://localhost:4200/login`

Credenciales por defecto:

```
Admin:
Email: admin@medicus.com
Password: admin123
```

## 🔐 Recuperación de Contraseña

El sistema incluye un flujo completo de recuperación:

1. Usuario solicita recuperación en `/forgot-password`
2. Ingresa su email registrado
3. Recibe email con enlace de recuperación
4. El enlace es válido por 1 hora
5. Usuario establece nueva contraseña
6. Recibe confirmación por email
7. Puede iniciar sesión con la nueva contraseña

## 📧 Configuración de Emails

El sistema usa Nodemailer para enviar:

- ✅ Confirmaciones de citas
- ✅ Enlaces de recuperación de contraseña
- ✅ Confirmaciones de cambio de contraseña

### Proveedores Soportados

- Gmail (configurado por defecto)
- Outlook/Hotmail
- SendGrid
- Mailgun
- Cualquier servidor SMTP

## 📊 Estructura del Proyecto

```
medicus-app/
├── client/                 # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   └── styles/
│   └── package.json
│
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
│
├── CHANGELOG.md           # Historial de cambios
└── README.md             # Este archivo
```

## 🔄 Flujo de Git

El proyecto usa tres ramas principales:

- **develop**: Desarrollo activo
- **staging**: Pre-producción
- **master**: Producción

### Workflow

```bash
# Desarrollo
git checkout develop
git add .
git commit -m "feat: nueva característica"
git push origin develop

# Staging
git checkout staging
git merge develop
git push origin staging

# Producción
git checkout master
git merge staging
git push origin master
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de cambios.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👨‍💻 Autor

**Edwar Vilchez**

- GitHub: [@edwarvilchez](https://github.com/edwarvilchez)
- Email: edwarvilchez1977@gmail.com

## 🙏 Agradecimientos

- Angular Team
- Node.js Community
- Bootstrap Team
- Todos los contribuidores

---

**Desarrollado con ❤️ para mejorar la gestión de clínicas médicas**
