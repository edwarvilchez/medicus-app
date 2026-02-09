const nodemailer = require('nodemailer');

async function verifyEmailConfig() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.verify();
    console.log('✅ SMTP connection successful. Configuration looks valid.');
    process.exit(0);
  } catch (err) {
    console.error('❌ SMTP verification failed:', err.message || err);
    process.exit(2);
  }
}

verifyEmailConfig();
