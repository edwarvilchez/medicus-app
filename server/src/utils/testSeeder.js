const { Role, User, Patient, Doctor, Specialty, Department } = require('../models');

const seedTestData = async () => {
  try {
    // 1. Ensure Roles (Fetched from DB, seeded by seeds.js)
    const roles = {};
    const roleNames = ['SUPERADMIN', 'DOCTOR', 'NURSE', 'ADMINISTRATIVE', 'PATIENT'];
    
    for (const name of roleNames) {
        roles[name] = await Role.findOne({ where: { name } });
        if (!roles[name]) {
            console.warn(`Role ${name} not found, skipping related users.`);
        }
    }

    // --- USERS DATA ---
    const users = [
        // NEW SAAS MULTI-ENTITY PROFILES
        {
            username: 'dr.mendez', email: 'dr.mendez@medicus.com', password: 'doctor123',
            firstName: 'Javier', lastName: 'Méndez', role: 'DOCTOR',
            accountType: 'PROFESSIONAL',
            specialtyConfig: { name: 'Traumatología', license: 'MED-777', phone: '+58414-9998877' }
        },
        {
            username: 'clinica.salud', email: 'contacto@saludexpress.com', password: 'clinica123',
            firstName: 'Admin', lastName: 'SaludExpress', role: 'ADMINISTRATIVE',
            accountType: 'CLINIC',
            businessName: 'Centro Médico Salud Express'
        },
        {
            username: 'hgc.admin', email: 'admin@hgc.com', password: 'hospital123',
            firstName: 'Dirección', lastName: 'HGC', role: 'ADMINISTRATIVE',
            accountType: 'HOSPITAL',
            businessName: 'Hospital General del Centro'
        },
        // SUPERADMIN
        {
            username: 'superadmin', email: 'admin@medicus.com', password: 'admin123',
            firstName: 'Administrador', lastName: 'Sistema', role: 'SUPERADMIN'
        },
        // DOCTORS
        {
            username: 'dr.martinez', email: 'dr.martinez@medicus.com', password: 'doctor123',
            firstName: 'Carlos', lastName: 'Martínez', role: 'DOCTOR',
            specialtyConfig: { name: 'Cardiología', license: 'MED-001', phone: '+58412-1111111' }
        },
        {
            username: 'dr.rodriguez', email: 'dr.rodriguez@medicus.com', password: 'doctor123',
            firstName: 'Ana', lastName: 'Rodríguez', role: 'DOCTOR',
            specialtyConfig: { name: 'Pediatría', license: 'MED-002', phone: '+58412-2222222' }
        },
        {
            username: 'dr.lopez', email: 'dr.lopez@medicus.com', password: 'doctor123',
            firstName: 'Miguel', lastName: 'López', role: 'DOCTOR',
            specialtyConfig: { name: 'Dermatología', license: 'MED-003', phone: '+58412-3333333' }
        },
        // NURSES
        {
            username: 'enf.garcia', email: 'enf.garcia@medicus.com', password: 'nurse123',
            firstName: 'María', lastName: 'García', role: 'NURSE'
        },
        {
            username: 'enf.fernandez', email: 'enf.fernandez@medicus.com', password: 'nurse123',
            firstName: 'Laura', lastName: 'Fernández', role: 'NURSE'
        },
        {
            username: 'enf.torres', email: 'enf.torres@medicus.com', password: 'nurse123',
            firstName: 'Carmen', lastName: 'Torres', role: 'NURSE'
        },
        // ADMINISTRATIVE
        {
            username: 'staff.ramirez', email: 'staff.ramirez@medicus.com', password: 'staff123',
            firstName: 'Pedro', lastName: 'Ramírez', role: 'ADMINISTRATIVE'
        },
        {
            username: 'staff.morales', email: 'staff.morales@medicus.com', password: 'staff123',
            firstName: 'Sofía', lastName: 'Morales', role: 'ADMINISTRATIVE'
        },
        {
            username: 'staff.silva', email: 'staff.silva@medicus.com', password: 'staff123',
            firstName: 'Roberto', lastName: 'Silva', role: 'ADMINISTRATIVE'
        },
        // PATIENTS
        {
            username: 'pac.gonzalez', email: 'pac.gonzalez@email.com', password: 'patient123',
            firstName: 'Juan', lastName: 'González', role: 'PATIENT',
            patientConfig: { documentId: 'V-11111111', phone: '+58424-1111111', gender: 'Male' }
        },
        {
            username: 'pac.perez', email: 'pac.perez@email.com', password: 'patient123',
            firstName: 'Elena', lastName: 'Pérez', role: 'PATIENT',
            patientConfig: { documentId: 'V-22222222', phone: '+58424-2222222', gender: 'Female' }
        },
        {
            username: 'pac.diaz', email: 'pac.diaz@email.com', password: 'patient123',
            firstName: 'Luis', lastName: 'Díaz', role: 'PATIENT',
            patientConfig: { documentId: 'V-33333333', phone: '+58424-3333333', gender: 'Male' }
        }
    ];

    for (const userData of users) {
        if (!roles[userData.role]) continue;

        console.log(`Processing user: ${userData.username} (${userData.email})...`);
        const [user, created] = await User.findOrCreate({
            where: { email: userData.email }, // Check by email to avoid duplicates
            defaults: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                businessName: userData.businessName,
                accountType: userData.accountType || 'PATIENT',
                roleId: roles[userData.role].id
            }
        });

        console.log(`User ${userData.username}: created=${created}, id=${user.id}`);

        // Handle specific role data
        if (userData.role === 'DOCTOR' && userData.specialtyConfig) {
            const [dept] = await Department.findOrCreate({ 
                where: { name: userData.specialtyConfig.name }, 
                defaults: { name: userData.specialtyConfig.name } 
            });
            const [spec] = await Specialty.findOrCreate({ 
                where: { name: userData.specialtyConfig.name, departmentId: dept.id }, 
                defaults: { name: userData.specialtyConfig.name, departmentId: dept.id } 
            });
            
            await Doctor.findOrCreate({
                where: { userId: user.id },
                defaults: {
                    userId: user.id,
                    licenseNumber: userData.specialtyConfig.license,
                    phone: userData.specialtyConfig.phone,
                    specialtyId: spec.id
                }
            });
        }

        if (userData.role === 'PATIENT' && userData.patientConfig) {
             await Patient.findOrCreate({
                where: { userId: user.id },
                defaults: {
                    userId: user.id,
                    documentId: userData.patientConfig.documentId,
                    phone: userData.patientConfig.phone,
                    gender: userData.patientConfig.gender
                }
            });
        }
    }

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
};

module.exports = seedTestData;
