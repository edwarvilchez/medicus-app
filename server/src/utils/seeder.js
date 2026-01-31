const { Role } = require('../models');

const seedRoles = async () => {
  const roles = [
    { name: 'SUPERADMIN', description: 'Acceso total al sistema' },
    { name: 'DOCTOR', description: 'Médicos con acceso a historial y consultas' },
    { name: 'NURSE', description: 'Enfermería con acceso a signos vitales e indicaciones' },
    { name: 'RECEPTIONIST', description: 'Gestión de citas y facturación' },
    { name: 'ADMINISTRATIVE', description: 'Gestión administrativa y reportes' },
    { name: 'PATIENT', description: 'Pacientes del sistema' }
  ];

  try {
    for (const role of roles) {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
    }
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};

module.exports = seedRoles;
