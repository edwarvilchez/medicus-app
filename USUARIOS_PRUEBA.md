# 👥 Usuarios de Prueba - Sistema Medicus

Este documento contiene las credenciales de todos los usuarios de prueba creados en el sistema para realizar testing.

## 📋 Tabla Completa de Usuarios

### ✅ TODOS LOS USUARIOS DEL SISTEMA

| TIPO               | NOMBRE                    | EMAIL                     | USERNAME       | PASSWORD     |
| ------------------ | ------------------------- | ------------------------- | -------------- | ------------ |
| **🔐 SUPERADMIN**  | **Administrador Sistema** | **admin@medicus.com**     | **superadmin** | **admin123** |
| **DOCTOR**         | Carlos Martínez           | dr.martinez@medicus.com   | dr.martinez    | doctor123    |
| **DOCTOR**         | Ana Rodríguez             | dr.rodriguez@medicus.com  | dr.rodriguez   | doctor123    |
| **DOCTOR**         | Miguel López              | dr.lopez@medicus.com      | dr.lopez       | doctor123    |
| **NURSE**          | María García              | enf.garcia@medicus.com    | enf.garcia     | nurse123     |
| **NURSE**          | Laura Fernández           | enf.fernandez@medicus.com | enf.fernandez  | nurse123     |
| **NURSE**          | Carmen Torres             | enf.torres@medicus.com    | enf.torres     | nurse123     |
| **ADMINISTRATIVE** | Pedro Ramírez             | staff.ramirez@medicus.com | staff.ramirez  | staff123     |
| **ADMINISTRATIVE** | Sofía Morales             | staff.morales@medicus.com | staff.morales  | staff123     |
| **ADMINISTRATIVE** | Roberto Silva             | staff.silva@medicus.com   | staff.silva    | staff123     |
| **PATIENT**        | Juan González             | pac.gonzalez@email.com    | pac.gonzalez   | patient123   |
| **PATIENT**        | Elena Pérez               | pac.perez@email.com       | pac.perez      | patient123   |
| **PATIENT**        | Luis Díaz                 | pac.diaz@email.com        | pac.diaz       | patient123   |

**Total: 13 usuarios (1 SUPERADMIN + 12 usuarios de prueba)**

---

## 🔐 Usuario Administrador

| TIPO           | EMAIL             | USERNAME   | PASSWORD |
| -------------- | ----------------- | ---------- | -------- |
| **SUPERADMIN** | admin@medicus.com | superadmin | admin123 |

---

## 📊 Detalles por Perfil

### 👨‍⚕️ Doctores (3)

1. **Dr. Carlos Martínez**
   - Email: `dr.martinez@medicus.com`
   - Password: `doctor123`
   - Especialidad: Cardiología
   - Licencia: MED-001
   - Teléfono: +58412-1111111

2. **Dra. Ana Rodríguez**
   - Email: `dr.rodriguez@medicus.com`
   - Password: `doctor123`
   - Especialidad: Pediatría
   - Licencia: MED-002
   - Teléfono: +58412-2222222

3. **Dr. Miguel López**
   - Email: `dr.lopez@medicus.com`
   - Password: `doctor123`
   - Especialidad: Dermatología
   - Licencia: MED-003
   - Teléfono: +58412-3333333

---

### 👩‍⚕️ Enfermeras (3)

1. **Enf. María García**
   - Email: `enf.garcia@medicus.com`
   - Password: `nurse123`
   - Especialización: Cuidados Intensivos
   - Turno: Mañana
   - Licencia: ENF-001
   - Teléfono: +58412-4444444

2. **Enf. Laura Fernández**
   - Email: `enf.fernandez@medicus.com`
   - Password: `nurse123`
   - Especialización: Pediatría
   - Turno: Tarde
   - Licencia: ENF-002
   - Teléfono: +58412-5555555

3. **Enf. Carmen Torres**
   - Email: `enf.torres@medicus.com`
   - Password: `nurse123`
   - Especialización: Emergencias
   - Turno: Noche
   - Licencia: ENF-003
   - Teléfono: +58412-6666666

---

### 👔 Personal Administrativo (3)

1. **Pedro Ramírez**
   - Email: `staff.ramirez@medicus.com`
   - Password: `staff123`
   - Cargo: Recepcionista
   - Departamento: Recepción
   - ID Empleado: EMP-001
   - Teléfono: +58412-7777777

2. **Sofía Morales**
   - Email: `staff.morales@medicus.com`
   - Password: `staff123`
   - Cargo: Contador
   - Departamento: Contabilidad
   - ID Empleado: EMP-002
   - Teléfono: +58412-8888888

3. **Roberto Silva**
   - Email: `staff.silva@medicus.com`
   - Password: `staff123`
   - Cargo: Coordinador
   - Departamento: Administración
   - ID Empleado: EMP-003
   - Teléfono: +58412-9999999

---

### 🏥 Pacientes (3)

1. **Juan González**
   - Email: `pac.gonzalez@email.com`
   - Password: `patient123`
   - Documento: V-11111111
   - Fecha de Nacimiento: 15/05/1985
   - Género: Masculino
   - Dirección: Av. Principal, Caracas
   - Contacto de Emergencia: María González - +58424-1111112
   - Teléfono: +58424-1111111

2. **Elena Pérez**
   - Email: `pac.perez@email.com`
   - Password: `patient123`
   - Documento: V-22222222
   - Fecha de Nacimiento: 22/08/1990
   - Género: Femenino
   - Dirección: Calle 5, Valencia
   - Contacto de Emergencia: Carlos Pérez - +58424-2222223
   - Teléfono: +58424-2222222

3. **Luis Díaz**
   - Email: `pac.diaz@email.com`
   - Password: `patient123`
   - Documento: V-33333333
   - Fecha de Nacimiento: 10/12/1978
   - Género: Masculino
   - Dirección: Urb. Los Pinos, Maracay
   - Contacto de Emergencia: Ana Díaz - +58424-3333334
   - Teléfono: +58424-3333333

---

## 🧪 Casos de Prueba Sugeridos

### Test 1: Login por Rol

- Probar login con cada tipo de usuario
- Verificar que cada rol tenga acceso a sus módulos correspondientes

### Test 2: Gestión de Doctores

- Login como SUPERADMIN
- Crear, editar y eliminar doctores
- Verificar filtros por especialidad

### Test 3: Gestión de Enfermería

- Crear, editar y eliminar enfermeras
- Verificar filtros por turno

### Test 4: Gestión de Pacientes

- Crear, editar y eliminar pacientes
- Verificar filtros por género

### Test 5: Gestión de Staff

- Crear, editar y eliminar personal administrativo
- Verificar filtros por departamento

### Test 6: Dashboard

- Verificar que las estadísticas se carguen correctamente
- Verificar que las próximas citas se muestren

---

## 🔄 Regenerar Usuarios

Para regenerar los usuarios de prueba, ejecuta:

```bash
cd server
node src/utils/createTestUsers.js
```

El script omitirá automáticamente los usuarios que ya existen.

---

## 📝 Notas

- Todos los passwords son simples para facilitar el testing
- En producción, estos usuarios deben ser eliminados o sus contraseñas cambiadas
- El script verifica duplicados antes de crear usuarios
- Los roles deben existir en la base de datos antes de ejecutar el script

---

**Última actualización:** 31 de Enero de 2026
