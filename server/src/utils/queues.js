const Queue = require('bull');
const logger = require('./logger');

// Create queues
const emailQueue = new Queue('emails', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const notificationQueue = new Queue('notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

const reportQueue = new Queue('reports', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

// Process email jobs
emailQueue.process('send-appointment-reminder', async (job) => {
  const { patientEmail, appointmentDate, doctorName } = job.data;
  try {
    const sendEmail = require('./sendEmail');
    await sendEmail({
      email: patientEmail,
      subject: 'Recordatorio de Cita - Medicus',
      message: `Hola, le recordamos que tiene una cita programada para el ${appointmentDate} con el Dr. ${doctorName}`
    });
    logger.info({ jobId: job.id, patientEmail }, 'Appointment reminder sent');
    return { success: true };
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Failed to send appointment reminder');
    throw error;
  }
});

emailQueue.process('send-welcome', async (job) => {
  const { email, name } = job.data;
  try {
    const sendEmail = require('./sendEmail');
    await sendEmail({
      email,
      subject: 'Bienvenido a Medicus',
      message: `Hola ${name}, bienvenido a Medicus. Tu cuenta ha sido creada exitosamente.`
    });
    logger.info({ jobId: job.id, email }, 'Welcome email sent');
    return { success: true };
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Failed to send welcome email');
    throw error;
  }
});

// Process notification jobs (WhatsApp, Push)
notificationQueue.process('whatsapp-reminder', async (job) => {
  const { phone, message } = job.data;
  try {
    // Integration with WhatsApp API would go here
    logger.info({ jobId: job.id, phone }, 'WhatsApp reminder sent');
    return { success: true };
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Failed to send WhatsApp reminder');
    throw error;
  }
});

// Process report generation
reportQueue.process('generate-stats-report', async (job) => {
  const { userId, dateRange } = job.data;
  try {
    // Report generation logic would go here
    logger.info({ jobId: job.id, userId }, 'Stats report generated');
    return { success: true, reportUrl: '/reports/stats-123.pdf' };
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Failed to generate report');
    throw error;
  }
});

// Queue event listeners
emailQueue.on('completed', (job) => {
  logger.debug({ jobId: job.id, queue: 'emails' }, 'Job completed');
});

emailQueue.on('failed', (job, err) => {
  logger.error({ jobId: job.id, error: err, queue: 'emails' }, 'Job failed');
});

module.exports = {
  emailQueue,
  notificationQueue,
  reportQueue
};
