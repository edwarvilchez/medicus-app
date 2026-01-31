const { Appointment, Patient, Doctor, Payment, User, Specialty } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  const userRole = req.user.role ? req.user.role.toUpperCase() : 'GUEST';
  const userId = req.user.id;

  const responseData = {
    appointmentsToday: 0,
    totalPatients: 0,
    monthlyIncome: 0,
    pendingAppointments: 0,
    upcomingAppointments: [],
    activityData: []
  };

  try {
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    // --- FILTROS SEGÚN ROL ---
    let appointmentWhere = { date: { [Op.between]: [todayStart, todayEnd] } };
    let pendingWhere = { status: 'Pending' };

    // Si es Paciente, necesitamos filtrar por SU ID
    let patientId = null;
    if (userRole === 'PATIENT') {
      const patient = await Patient.findOne({ where: { userId } });
      if (patient) {
        patientId = patient.id;
        appointmentWhere.patientId = patientId;
        pendingWhere.patientId = patientId;
      }
    }

    // 1. Estadísticas Básicas (Citas Hoy)
    try {
      responseData.appointmentsToday = await Appointment.count({ where: appointmentWhere });
    } catch (e) { console.error('Error counting today appointments:', e); }

    // 2. Total Pacientes (Solo Admin ve el total real, Paciente ve 0 o N/A)
    if (['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR'].includes(userRole)) {
      try {
        responseData.totalPatients = await Patient.count();
      } catch (e) { console.error('Error counting patients:', e); }
    }
    
    // 3. Ingresos (Solo Admin ve ingresos)
    if (['SUPERADMIN', 'ADMINISTRATIVE'].includes(userRole)) {
      try {
        responseData.monthlyIncome = await Payment.sum('amount', {
          where: { 
            status: 'Paid',
            createdAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
          }
        });
        responseData.monthlyIncome = responseData.monthlyIncome || 0;
      } catch (e) { console.error('Error calculating income:', e); }
    }

    // 4. Citas Pendientes
    try {
      responseData.pendingAppointments = await Appointment.count({ where: pendingWhere });
    } catch (e) { console.error('Error counting pending:', e); }

    // 5. Próximas Citas (Filtradas por rol)
    try {
      const upcomingWhere = {
        date: { [Op.gte]: new Date() },
        status: { [Op.in]: ['Pending', 'Confirmed'] }
      };

      if (userRole === 'PATIENT' && patientId) {
        upcomingWhere.patientId = patientId;
      }

      const upcoming = await Appointment.findAll({
        where: upcomingWhere,
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

      responseData.upcomingAppointments = upcoming.map(apt => {
        const patientName = apt.Patient && apt.Patient.User 
          ? `${apt.Patient.User.firstName} ${apt.Patient.User.lastName}` 
          : 'Paciente Desconocido';
          
        const doctorName = apt.Doctor && apt.Doctor.User 
          ? `${apt.Doctor.User.firstName} ${apt.Doctor.User.lastName}` 
          : 'Doctor Asignado';
          
        const specialty = apt.Doctor && apt.Doctor.Specialty 
          ? apt.Doctor.Specialty.name 
          : 'Medicina General';

        return {
          id: apt.id,
          date: apt.date,
          time: apt.time,
          status: apt.status,
          patient: { name: patientName },
          doctor: { name: doctorName, specialty: specialty }
        };
      });
    } catch (e) {
      console.error('Error fetching upcoming appointments:', e.message);
    }

    // 6. Actividad Reciente (Gráfico)
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activityWhere = { date: { [Op.gte]: sevenDaysAgo } };
      if (userRole === 'PATIENT' && patientId) {
        activityWhere.patientId = patientId;
      }

      const activity = await Appointment.findAll({
        where: activityWhere,
        attributes: ['date', 'status'],
        order: [['date', 'ASC']]
      });

      responseData.activityData = activity.map(apt => ({
        date: apt.date,
        status: apt.status
      }));
    } catch (e) { console.error('Error fetching activity:', e); }

    res.json(responseData);

  } catch (error) {
    console.error('Fatal Stats error:', error);
    res.status(500).json({ error: error.message });
  }
};
