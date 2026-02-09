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
    activityData: [],
    inPersonCount: 0,
    videoCount: 0,
    specialtyStats: [],
    incomeDetails: {
      day: { USD: 0, Bs: 0 },
      week: { USD: 0, Bs: 0 },
      month: { USD: 0, Bs: 0 }
    }
  };

  try {
    const now = new Date();
    
    // Time Ranges
    const todayStart = new Date(now);
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23,59,59,999);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0,0,0,0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0,0,0,0);

    // --- BASIC FILTERS ---
    let patientId = null;
    if (userRole === 'PATIENT') {
      const patient = await Patient.findOne({ where: { userId } });
      if (patient) patientId = patient.id;
    }

    // 1. Basic Counts
    const baseWhere = patientId ? { patientId } : {};
    responseData.appointmentsToday = await Appointment.count({ 
      where: { ...baseWhere, date: { [Op.between]: [todayStart, todayEnd] } } 
    });
    responseData.pendingAppointments = await Appointment.count({ 
      where: { ...baseWhere, status: 'Pending' } 
    });

    if (['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole)) {
      responseData.totalPatients = await Patient.count();
    }

    // 2. Specialty Breakdown (Consultations Pending vs Completed)
    const specialties = await Specialty.findAll({
        include: [{
            model: Doctor,
            required: false,
            include: [{
                model: Appointment,
                where: patientId ? { patientId } : {},
                required: false
            }]
        }]
    });

    responseData.specialtyStats = (specialties || []).map(s => {
        let pending = 0;
        let completed = 0;
        (s.Doctors || []).forEach(d => {
            (d.Appointments || []).forEach(a => {
                if (a.status === 'Completed') completed++;
                else if (['Pending', 'Confirmed'].includes(a.status)) pending++;
            });
        });
        return { name: s.name, pending, completed };
    });

    // 3. Income Details (USD / Bs)
    const adminRoles = ['SUPERADMIN', 'ADMINISTRATIVE', 'RECEPTIONIST'];
    const isDoctor = userRole === 'DOCTOR';

    if (adminRoles.includes(userRole) || isDoctor) {
        let paymentWhere = { 
            status: 'Paid',
            createdAt: { [Op.gte]: monthStart }
        };

        let paymentInclude = [];
        if (isDoctor) {
            const doctor = await Doctor.findOne({ where: { userId } });
            if (doctor) {
                paymentWhere.appointmentId = { [Op.ne]: null }; 
                paymentInclude.push({
                    model: Appointment,
                    where: { doctorId: doctor.id },
                    required: true
                });
            } else {
                paymentWhere.id = null; 
            }
        }

        const payments = await Payment.findAll({
            where: paymentWhere,
            include: paymentInclude
        });

        payments.forEach(p => {
            const amount = parseFloat(p.amount);
            const date = new Date(p.createdAt);
            const currency = p.currency === 'Bs' ? 'Bs' : 'USD';

            // Month
            responseData.incomeDetails.month[currency] += amount;

            // Week
            if (date >= weekStart) {
                responseData.incomeDetails.week[currency] += amount;
            }

            // Day
            if (date >= todayStart) {
                responseData.incomeDetails.day[currency] += amount;
            }
        });
        
        responseData.monthlyIncome = responseData.incomeDetails.month.USD; // Backward compatibility
    }

    // 4. Upcoming Appointments
    const upcoming = await Appointment.findAll({
        where: {
            ...baseWhere,
            date: { [Op.gte]: now },
            status: { [Op.in]: ['Pending', 'Confirmed'] }
        },
        include: [
            { model: Patient, include: [{ model: User, attributes: ['firstName', 'lastName'] }] },
            { model: Doctor, include: [{ model: User, attributes: ['firstName', 'lastName'] }, { model: Specialty, attributes: ['name'] }] }
        ],
        order: [['date', 'ASC']],
        limit: 5
    });

    responseData.upcomingAppointments = upcoming.map(apt => ({
        id: apt.id,
        date: apt.date,
        status: apt.status,
        patient: { name: `${apt.Patient?.User?.firstName} ${apt.Patient?.User?.lastName}` },
        doctor: { name: `${apt.Doctor?.User?.firstName} ${apt.Doctor?.User?.lastName}`, specialty: apt.Doctor?.Specialty?.name }
    }));

    // 5. Activity data for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const activity = await Appointment.findAll({
        where: { ...baseWhere, date: { [Op.gte]: sevenDaysAgo } },
        attributes: ['date', 'status'],
        order: [['date', 'ASC']]
    });
    responseData.activityData = activity.map(apt => ({ date: apt.date, status: apt.status }));

    // 6. Type Counts
    responseData.inPersonCount = await Appointment.count({ where: { ...baseWhere, type: 'In-Person' } });
    responseData.videoCount = await Appointment.count({ where: { ...baseWhere, type: 'Video' } });

    res.json(responseData);

  } catch (error) {
    console.error('Fatal Stats error:', error);
    res.status(500).json({ error: error.message });
  }
};
