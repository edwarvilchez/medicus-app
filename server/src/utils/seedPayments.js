const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Payment, Patient, User } = require('../models');

async function seedPayments() {
  try {
    const patients = await Patient.findAll({ include: [User] });
    
    if (patients.length === 0) {
      console.log('No patients found to relate payments to.');
      process.exit(0);
    }

    const testPayments = [
      {
        reference: 'REF-10023',
        amount: 45.00,
        concept: 'Consulta General - Evaluación Trimestral',
        status: 'Paid',
        patientId: patients[0].id
      },
      {
        reference: 'REF-55091',
        amount: 120.50,
        concept: 'Examen de Laboratorio - Perfil 20',
        status: 'Pending',
        patientId: patients[0].id
      },
      {
        reference: 'REF-33012',
        amount: 75.00,
        concept: 'Sesión de Fisioterapia - Rehabilitación Lumbar',
        status: 'Paid',
        patientId: patients[1]?.id || patients[0].id
      },
      {
        reference: 'REF-99044',
        amount: 30.00,
        concept: 'Suministro de Medicación - Kit Post-Operatorio',
        status: 'Pending',
        patientId: patients[1]?.id || patients[0].id
      },
      {
        reference: 'REF-22088',
        amount: 200.00,
        concept: 'Derechos de Quirófano - Intervención Menor',
        status: 'Pending',
        patientId: patients[2]?.id || patients[0].id
      }
    ];

    for (const paymentData of testPayments) {
      await Payment.create(paymentData);
    }

    console.log('✅ Test payments seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding payments:', error);
    process.exit(1);
  }
}

seedPayments();
