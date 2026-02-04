# Changelog - Medicus

Todas las modificaciones notables del proyecto serán documentadas en este archivo.

## [1.6.0] - 2026-02-01

### 🔐 Refinamiento UI y Navegación Global

- ✅ **Optimización de Autenticación**: Rediseño de las páginas de Login y Registro para una mejor experiencia de usuario.
- ✅ **Footer Inteligente**: Implementación de un pie de página consistente y funcional en todos los módulos públicos.
- ✅ **Visibilidad de Redes**: Mejora estética y funcional de los iconos de redes sociales y puntos de contacto.
- ✅ **Agendamiento Público Directo**: Integración de acceso rápido a citas desde la pantalla de inicio.
- ✅ **Navegación Fluida**: Implementación de mecanismos globales para regresar al login de forma intuitiva.

---

## [1.5.1] - 2026-02-01

### 📐 Optimización de Interfaz (No-Scroll)

#### Compactación Global

- ✅ **Layout Sin Scroll**: Ajuste de paddings y gaps globales para permitir que el Dashboard principal sea visible en una sola pantalla sin necesidad de scroll vertical en resoluciones estándar.
- ✅ **Dashboard Compacto**: Reducción de tamaño de tarjetas de estadísticas, altura del gráfico de actividad y optimización de la lista de próximas citas.
- ✅ **Navegación Esbelta**: Reducción del grosor de la barra superior (Navbar) y compactación de los elementos del menú lateral (Sidebar).
- ✅ **Legibilidad Mejorada**: Ajuste de jerarquía de títulos (H2 a H3) y uso de fuentes `x-small` para datos secundarios.

---

## [1.5.0] - 2026-02-01

### 🏦 Gestión Financiera Avanzada

#### Instrumentos de Pago y Bancos

- ✅ **Detalle de Transacción**: Añadida la opción de registrar el banco de origen y el instrumento de pago (Transferencia, Pago Móvil, Débito, Crédito).
- ✅ **Soporte de Efectivo Dual**: Implementada la capacidad de registrar pagos en efectivo directamente en **$ (Dólares)** o **Bs. (Bolívares)** con conversión automática a la moneda base.
- ✅ **Registro Directo**: Nueva opción para marcar un pago como "Pagado" en el momento de su emision, ideal para cobros en taquilla.
- ✅ **Recibos Enriquecidos**: Los comprobantes de pago ahora muestran el banco y el método utilizado para una mejor trazabilidad.
- ✅ **Interfaz Dinámica**: El formulario de pago ahora oculta campos irrelevantes (como banco o referencia) cuando se selecciona "Efectivo".

---

## [1.4.2] - 2026-02-01

### 🎨 Simplificación Visual

#### Eliminación de Modo Oscuro

- ✅ **Enfoque en Claridad**: Eliminación completa del motor de temas y del modo oscuro para priorizar una estética médica limpia, brillante y de alto contraste basada en luz natural.
- ✅ **Limpieza de Código**: Remoción de servicios de tema, selectores de UI y más de 100 líneas de CSS específicas para el modo nocturno.

---

## [1.4.1] - 2026-02-01

### 🧠 Psicología del Color y Refinamiento Estético

#### Rediseño del Modo Oscuro (Medical Midnight)

- ✅ **Psicología del Color**: Sustitución de grises genéricos por una paleta de "Medianoche Médica" (`#0b0f1a`) que transmite serenidad, limpieza y profesionalismo.
- ✅ **Contraste Suave**: Optimización de legibilidad mediante el uso de blancos suaves y azules vibrantes optimizados para fondos oscuros.
- ✅ **Componentes Cohesivos**: Ajuste de Glassmorphism, modales (SweetAlert2) y elementos de formulario para integrarse perfectamente en el flujo visual nocturno.
- ✅ **Fondo Dinámico**: Implementación de gradientes radiales adaptativos que evitan la sensación de una interfaz plana y pesada.

---

## [1.4.0] - 2026-02-01

### 🎨 Experiencia de Usuario y Finanzas Globales

#### Gestión de Temas (Claro/Oscuro)

- ✅ **Modo Oscuro Nativo**: Implementado soporte completo para tema oscuro mediante variables CSS y persistencia en LocalStorage.
- ✅ **Conmutador en Navbar**: Botón inteligente en la barra de navegación para alternar modos visuales con micro-animaciones.

#### Soporte Multimoneda (Dual Currency)

- ✅ **Conversión en Tiempo Real**: Implementado motor financiero para mostrar montos en USD ($) y VES (Bs.) simultáneamente.
- ✅ **Visualización Dual**: La tabla de pagos ahora muestra el monto en la moneda principal y su equivalente estimado en la secundaria.
- ✅ **Recibos Multimoneda**: Los comprobantes de pago ahora reflejan el cobro en ambas denominaciones para mayor transparencia legal.

---

## [1.3.1] - 2026-02-01

### 🌎 Soporte Multi-idioma (i18n)

#### Sistema de Traducción

- ✅ **Motor Reactivo**: Implementado sistema de traducción basado en Angular Signals para un cambio de idioma instantáneo sin recarga de página.
- ✅ **Idiomas Soportados**: Lanzamiento inicial con Español e Inglés (ES/EN).
- ✅ **Interfaz de Usuario**: Añadido selector de idioma en la barra de navegación.
- ✅ **Cobertura Inicial**: Traducción completa de los módulos de Login, Sidebar y Control de Pagos.
- ✅ **Persistencia**: El idioma seleccionado se guarda en el almacenamiento local del navegador.

---

## [1.3.0] - 2026-02-01

### 💰 Inteligencia Financiera y Gestión de Pagos

#### Módulo de Pagos (Funcionalidad Total)

- ✅ **Búsqueda Reactiva**: Implementada búsqueda instantánea por referencia, nombre de paciente o concepto utilizando Signals de Angular.
- ✅ **Comprobantes Digitales**: Visualización detallada de recibos con modal dinámico (SweetAlert2) y opción de impresión.
- ✅ **Exportación de Datos**: Añadida funcionalidad de exportación a formato CSV para auditoría y reportes contables externos.
- ✅ **Carga de Datos Operacionales**: Seed de datos reales para validación inmediata de flujos financieros complejos.

---

## [1.2.9] - 2026-02-01

### 💰 Gestión Financiera Activa

#### Módulo de Pagos

- ✅ **Emisión de Pagos**: Implementada la funcionalidad para crear nuevos cobros desde la interfaz, con selector de pacientes e integración de conceptos y montos.
- ✅ **Flujo de Cobro**: Mejora en la interacción para marcar pagos como "Pagados" mediante SweetAlert2.
- ✅ **Datos Operacionales**: Inyección de datos de prueba para validación de flujos financieros y reportes.

---

## [1.2.8] - 2026-02-01

### 🛠️ Mejoras de Usabilidad y Navegación

#### Sidebar (Navegación Lateral)

- ✅ **Scroll Interno**: Se ha habilitado el desplazamiento vertical en la barra lateral para asegurar el acceso a todas las secciones administrativas y médicas en pantallas de menor resolución.
- ✅ **Estilo Premium**: Aplicada la clase `custom-scrollbar` para mantener la coherencia visual con el resto de la aplicación.

---

## [1.2.7] - 2026-02-01

### 🚀 Interactividad en Login y Soporte Legal

#### Pantalla de Inicio de Sesión

- ✅ **Seguridad Total Activa**: El botón ahora despliega un listado detallado de las leyes y estándares internacionales (ISO 27001, ISO 9001, GDPR, HIPAA) que protegen la aplicación.
- ✅ **Recordatorios Inteligentes**: Implementada la lógica para el botón de recordatorios, informando al usuario sobre el requisito de tener una cita activa y estar autenticado para recibirlos vía WhatsApp.
- ✅ **Feedback Visual**: Añadidas animaciones y estados hover (`hover-scale`) a las tarjetas informativas de la página de login.

---

## [1.2.6] - 2026-02-01

### 🔐 Funcionalidad y Control de Acceso

#### Historial Digital

- ✅ **Interactividad Implementada**: La tarjeta de "Historial Digital" ahora es funcional y cuenta con efectos visuales (`hover-scale`, `cursor-pointer`).
- ✅ **Control de Acceso (Seguridad)**: Se ha implementado una validación visual que informa al usuario que el acceso al historial médico está restringido solo a pacientes registrados y autenticados, cumpliendo con la norma **ISO 27001**.
- ✅ **Flujo de Usuario**: Integración con el sistema de navegación para redirigir al login si el usuario desea consultar su historial.

---

## [1.2.4] - 2026-02-01

### 🛡️ Cumplimiento y Protección Legal

#### Estándares Internacionales (Compliance)

- ✅ **ISO 27001 & ISO 9001**: Actualización de la arquitectura y documentación para alinearse con estándares de Seguridad de la Información y Gestión de Calidad.
- ✅ **GDPR / RGPD**: Implementación de consentimiento explícito en el registro para la protección de datos personales.
- ✅ **Registro de Usuario**: Añadido checkbox de aceptación de términos con mención explícita a normas internacionales para blindaje legal.
- ✅ **Documentación Técnica**: Actualización de `ARCHITECTURE.md` y `README.md` con las nuevas políticas de seguridad y cumplimiento.

---

## [1.2.3] - 2026-02-01

### 🎉 Estabilidad y Ajustes de Layout

#### Formulario de Registro (Optimización de Altura)

- ✅ **Contenedor Scrollable Interno**: Implementación de un área de scroll interna para los campos del formulario (`max-height: 62vh`), garantizando que la cabecera (branding) y el botón de acción siempre sean visibles.
- ✅ **Scrollbar Premium**: Añadidos estilos personalizados para una barra de desplazamiento delgada y elegante que coincide con la identidad visual de Medicus.
- ✅ **Ajustes de Espaciado**: Refinamiento de paddings y márgenes para evitar el corte de contenido en pantallas con resolución limitada.

---

## [1.2.2] - 2026-02-01

### 🎉 Refinamiento Visual y Legibilidad

#### Formulario de Registro (Mejoras Finales)

- ✅ **Ensanchamiento del Formulario**: Incrementado el ancho del formulario (`col-lg-7`) para mayor comodidad visual.
- ✅ **Legibilidad Restaurada**:
  - Regreso a tamaños de fuente estándar (`small`) en etiquetas.
  - Eliminación de controles compactos (`form-control-sm`) para mejor visibilidad.
  - Incremento del espaciado interno y gaps para un diseño menos saturado.
- ✅ **Hero Section Rediseñada**:
  - ✨ **Stack de Tarjetas**: Las tarjetas de "Agenda Fácil" e "Historial Digital" ahora se muestran verticalmente.
  - ✨ **Mejor Layout Interno**: Íconos y texto alineados horizontalmente para mejor lectura.
  - ✨ **Textos Multilínea**: Títulos y descripciones ajustados para un flujo de lectura más natural.

---

## [1.2.1] - 2026-01-31

### 🎉 Mejoras de UI/UX (Refinamiento Extremo)

#### Rediseño del Registro

- ✅ **Layout de 2 Columnas**: Implementación de sección Hero (izquierda) y Formulario (derecha) para paridad visual con el Login.
- ✅ **Compactación Ultra**:
  - Uso de `form-control-sm` y `form-select-sm` en todos los campos.
  - Implementación de fuente `.x-small` para etiquetas de formulario.
  - Reducción de gaps (`g-1`) y márgenes (`mb-1`) para máxima eficiencia de espacio.
- ✅ **Alineación Inteligente**: Cambio a `align-items-start` para evitar recortes superiores en formularios largos.
- ✅ **Navegación Fluida**: La sección "Agenda Fácil" ahora es un enlace interactivo hacia la página de agendamiento público.

#### Mejoras Globales

- ✅ **Habilitación de Scroll**: Ajustes en `styles.css` para permitir el desplazamiento natural en páginas con mucho contenido.
- ✅ **Interactividad mejorada**: Nuevas clases de utilidad para efectos hover y transiciones animadas.

---

## [1.2.0] - 2026-01-31

### 🎉 Nuevas Características

#### Sistema de Recuperación de Contraseña

- ✅ **Forgot Password**: Endpoint para solicitar restablecimiento de contraseña
- ✅ **Reset Password**: Endpoint para cambiar contraseña con token seguro
- ✅ **Tokens Seguros**: Generación de tokens con expiración de 1 hora
- ✅ **Notificaciones Email**:
  - Email con enlace de recuperación
  - Email de confirmación al cambiar contraseña
- ✅ **Componentes Frontend**:
  - `ForgotPassword`: Formulario para solicitar recuperación
  - `ResetPassword`: Formulario para establecer nueva contraseña
  - Validación de contraseñas coincidentes
  - Toggles de visibilidad de contraseña

#### Mejoras de UI/UX

- ✅ **Branding Consistente**: Logo y nombre "MEDICUS" en todas las páginas públicas
- ✅ **Layouts Optimizados**: Formularios sin scroll en pantallas normales
- ✅ **Páginas Públicas Limpias**: Sin sidebar/navbar en:
  - Login
  - Registro
  - Agendamiento público
  - Recuperación de contraseña
  - Restablecimiento de contraseña

#### Sistema de Notificaciones Mejorado

- ✅ **Email de Confirmación**: Envío automático al agendar citas públicas
- ✅ **Formato Profesional**: Emails con detalles completos y formato atractivo
- ✅ **WhatsApp Simulado**: Mensajes en consola con enlace a Google Calendar
- ✅ **Logs Mejorados**: Indicadores visuales de éxito/error en notificaciones

### 🔧 Mejoras Técnicas

#### Backend

- **Modelo User**: Agregados campos `resetToken` y `resetExpires`
- **Auth Controller**: Métodos `forgotPassword` y `resetPassword`
- **Email Service**: Configurado con Nodemailer y Gmail
- **Public Controller**: Envío de emails de confirmación de citas
- **Migración DB**: Script para agregar columnas de reset a tabla Users

#### Frontend

- **Rutas**: Agregadas `/forgot-password` y `/reset-password/:token`
- **Componentes**: Nuevos componentes standalone de Angular
- **Validación**: Formularios reactivos con validación en tiempo real
- **Navegación**: Enlaces integrados en login y registro

#### Configuración

- **Variables de Entorno**: Configuración SMTP completa
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_EMAIL=edwarvilchez1977@gmail.com
  SMTP_PASSWORD=[App Password]
  FROM_NAME=Clínica Medicus
  FROM_EMAIL=edwarvilchez1977@gmail.com
  CLIENT_URL=http://localhost:4200
  ```

### 🎨 Diseño

#### Componentes Optimizados

- **Login**: Branding agregado, layout mejorado
- **Register**: Formulario compacto sin scroll
- **PublicBooking**: Diseño en 2 pasos optimizado
- **ForgotPassword**: Header con branding y diseño limpio
- **ResetPassword**: Validación visual de contraseñas

#### Espaciado y Tipografía

- Padding reducido en todos los formularios públicos
- Títulos más compactos (h5, h6 en lugar de h2, h3)
- Espaciado entre campos optimizado (g-2 en lugar de g-3)
- Botones con padding uniforme (py-2)

### 🔒 Seguridad

- ✅ Tokens de un solo uso con expiración
- ✅ Hashing de contraseñas con bcryptjs
- ✅ Validación de email en backend
- ✅ Protección contra tokens expirados

### 📝 Documentación

- Actualizado CHANGELOG.md
- Documentadas variables de entorno necesarias
- Instrucciones de configuración de email

### 🐛 Correcciones

- Corregido script de migración SQL usando queryInterface de Sequelize
- Mejorado manejo de errores en envío de emails
- Logs más descriptivos para debugging

---

## [1.1.0] - 2026-01-30

### Características Previas

- Sistema de agendamiento público
- Gestión de pacientes, doctores y citas
- Dashboard con estadísticas
- Sistema de roles y permisos
- Notificaciones WhatsApp (simuladas)

---

## Formato del Changelog

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de Cambios

- **Added** (Agregado): Nuevas características
- **Changed** (Cambiado): Cambios en funcionalidad existente
- **Deprecated** (Obsoleto): Características que serán removidas
- **Removed** (Removido): Características removidas
- **Fixed** (Corregido): Corrección de bugs
- **Security** (Seguridad): Cambios de seguridad
