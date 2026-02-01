const cron = require('node-cron');
const { Appointment, Patient, Doctor, User } = require('../models');
const whatsapp = require('./whatsapp.service');
const { Op } = require('sequelize');

const startScheduler = () => {
    console.log('⏰ Scheduler iniciado: Comprobando citas cada minuto...');
    
    // Check every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);
            const twentyMinutesLater = new Date(now.getTime() + 20 * 60000); // Window of 5 mins

            // Find appointments happening in 15-20 mins that haven't been reminded
            const appointments = await Appointment.findAll({
                where: {
                    date: {
                        [Op.between]: [fifteenMinutesLater, twentyMinutesLater]
                    },
                    status: 'Confirmed',
                    reminderSent: false
                },
                include: [
                    { model: Patient, include: [User] },
                    { model: Doctor, include: [User] }
                ]
            });

            if (appointments.length > 0) {
                console.log(`🔎 Encontradas ${appointments.length} citas para recordar.`);
            }

            for (const appt of appointments) {
                const patientPhone = appt.Patient.user ? appt.Patient.User.phone : appt.Patient.phone;
                const patientName = `${appt.Patient.User.firstName} ${appt.Patient.User.lastName}`;
                const doctorName = `${appt.Doctor.User.firstName} ${appt.Doctor.User.lastName}`;
                const apptTime = new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                 // Get phone from Patient -> User.phone or Patient.phone if stored there. 
                 // Based on User model, phone is on User.
                 
                if (patientPhone) {
                    await whatsapp.sendAppointmentReminder(patientPhone, {
                        patientName,
                        time: apptTime,
                        doctorName,
                        appointmentId: appt.id
                    });

                    // Mark as sent
                    appt.reminderSent = true;
                    await appt.save();
                }
            }

        } catch (error) {
            console.error('❌ Scheduler Error:', error);
        }
    });
};

module.exports = startScheduler;
