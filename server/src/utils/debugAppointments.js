const { Appointment, Patient, Doctor, User, Specialty } = require('../models');
const { Op } = require('sequelize');

async function checkUpcomingAppointments() {
  try {
    console.log('🔍 Diagnosticando consulta de Próximas Citas...\n');
    const now = new Date();
    console.log(`📅 Fecha/Hora Servidor: ${now.toISOString()}`);

    // 1. Ver si hay citas futuras CRUDAS (sin includes)
    const rawUpcoming = await Appointment.findAll({
      where: {
        date: { [Op.gte]: now },
        status: { [Op.in]: ['Pending', 'Confirmed'] }
      }
    });
    console.log(`\n📊 Citas futuras simples encontradas: ${rawUpcoming.length}`);
    if (rawUpcoming.length > 0) {
      rawUpcoming.forEach(a => console.log(`   - ID: ${a.id} | Fecha: ${a.date} | Status: ${a.status}`));
    }

    // 2. Intentar la consulta COMPLEJA (con includes)
    console.log('\n🔄 Probando consulta con relaciones (Includes)...');
    try {
      const fullUpcoming = await Appointment.findAll({
        where: {
          date: { [Op.gte]: now },
          status: { [Op.in]: ['Pending', 'Confirmed'] }
        },
        include: [
          {
            model: Patient,
            required: false,
            include: [{ model: User, attributes: ['firstName', 'lastName'], required: false }]
          },
          {
            model: Doctor,
            required: false,
            include: [
              { model: User, attributes: ['firstName', 'lastName'], required: false },
              { model: Specialty, attributes: ['name'], required: false }
            ]
          }
        ],
        order: [['date', 'ASC']],
        limit: 5
      });
      
      console.log(`✅ Consulta compleja exitosa. Registros: ${fullUpcoming.length}`);
      fullUpcoming.forEach(apt => {
        const pName = apt.Patient?.User?.firstName || 'N/A';
        const dName = apt.Doctor?.User?.firstName || 'N/A';
        const sName = apt.Doctor?.Specialty?.name || 'N/A';
        console.log(`   - [${apt.date.toISOString()}] Paciente: ${pName} | Doctor: ${dName} (${sName})`);
      });

    } catch (includeError) {
      console.error('❌ ERROR en consulta compleja:');
      console.error(includeError.message);
      // Imprimir detalles si es posible
      if (includeError.parent) console.error('   SQL Error:', includeError.parent.sqlMessage);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

checkUpcomingAppointments();
