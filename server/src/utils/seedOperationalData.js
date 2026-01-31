const { User, Doctor, Patient, Appointment, Payment, MedicalRecord } = require('../models');

async function seedOperationalData() {
  console.log('🚀 Iniciando carga de datos operativos de prueba...\n');

  try {
    // 1. Obtener Doctores y Pacientes existentes
    const doctors = await Doctor.findAll({ include: User });
    const patients = await Patient.findAll({ include: User });

    if (doctors.length === 0 || patients.length === 0) {
      console.error('❌ Error: No hay doctores o pacientes creados. Ejecuta primero createTestUsers.js');
      process.exit(1);
    }

    console.log(`ℹ️  Encontrados: ${doctors.length} Doctores y ${patients.length} Pacientes.\n`);

    const appointmentsData = [];
    const paymentsData = [];

    // Helper para fechas
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);
    const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

    // 2. Crear Citas

    // Cita 1: Hoy (Pendiente) -> Aparecerá en "Consultas Pendientes" y "Citas Hoy"
    appointmentsData.push({
      date: new Date(today.setHours(10, 30, 0, 0)),
      reason: 'Control Cardiaca',
      status: 'Pending',
      notes: 'Paciente refiere leve molestia en el pecho.',
      doctorId: doctors[0].id,
      patientId: patients[0].id
    });

    // Cita 2: Mañana (Confirmada) -> Aparecerá en "Próximas Citas"
    appointmentsData.push({
      date: new Date(tomorrow.setHours(14, 0, 0, 0)),
      reason: 'Vacunación Pediátrica',
      status: 'Confirmed',
      notes: 'Traer cartilla de vacunación.',
      doctorId: doctors[1] ? doctors[1].id : doctors[0].id,
      patientId: patients[1] ? patients[1].id : patients[0].id
    });

    // Cita 3: Pasado Mañana (Pendiente) -> Aparecerá en "Próximas Citas"
    appointmentsData.push({
      date: new Date(dayAfter.setHours(9, 15, 0, 0)),
      reason: 'Revisión Dermatológica',
      status: 'Pending',
      notes: 'Consulta por mancha en la piel.',
      doctorId: doctors[2] ? doctors[2].id : doctors[0].id,
      patientId: patients[2] ? patients[2].id : patients[0].id
    });

    // Cita 4: Semana pasada (Completada) -> Para Historial
    const completedApt = await Appointment.create({
      date: new Date(lastWeek.setHours(11, 0, 0, 0)),
      reason: 'Consulta General',
      status: 'Completed',
      notes: 'Paciente recuperado satisfactoriamente.',
      doctorId: doctors[0].id,
      patientId: patients[0].id
    });
    console.log('✅ Cita histórica creada.');

    // Crear las nuevas citas
    for (const apt of appointmentsData) {
      const createdApt = await Appointment.create({
        date: apt.date,
        reason: apt.reason,
        status: apt.status,
        notes: apt.notes,
        doctorId: apt.doctorId,
        patientId: apt.patientId
      });
      console.log(`✅ Cita creada: ${apt.reason} - ${apt.status}`);

      // 3. Crear Pagos (Solo para citas confirmadas o completadas)
      if (apt.status === 'Confirmed' || apt.status === 'Completed') {
        paymentsData.push({
          amount: 50.00,
          method: 'Zelle',
          status: 'Paid',
          reference: 'REF-' + Math.floor(Math.random() * 100000),
          concept: 'Consulta Médica - ' + apt.reason,
          patientId: apt.patientId,
          appointmentId: createdApt.id
        });
      }
    }

    // Pago para la cita histórica
    paymentsData.push({
      amount: 45.00,
      method: 'Cash',
      status: 'Paid',
      concept: 'Consulta General (Histórica)',
      patientId: patients[0].id,
      appointmentId: completedApt.id
    });

    // Insertar Pagos
    for (const pay of paymentsData) {
      await Payment.create(pay);
      console.log(`💰 Pago registrado: $${pay.amount} - ${pay.status}`);
    }

    console.log('\n📊 DATOS GENERADOS:');
    console.log(`   • Citas Creadas: ${appointmentsData.length + 1}`);
    console.log(`   • Pagos Registrados: ${paymentsData.length}`);
    console.log('\n🎉 ¡Datos operativos listos! El Dashboard debería mostrar información ahora.\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al generar datos:', error);
    process.exit(1);
  }
}

seedOperationalData();
