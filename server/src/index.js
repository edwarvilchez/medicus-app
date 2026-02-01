const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const sequelize = require('./config/db.config');
const models = require('./models');
const seedRoles = require('./utils/seeder');
const seedTestData = require('./utils/testSeeder');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB Connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/public', require('./routes/public.routes')); // Public routes (no auth)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/doctors', require('./routes/doctor.routes'));
app.use('/api/nurses', require('./routes/nurse.routes'));
app.use('/api/staff', require('./routes/staff.routes'));
app.use('/api/medical-records', require('./routes/medicalRecord.routes'));
app.use('/api/lab-results', require('./routes/labResult.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/specialties', require('./routes/specialty.routes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medicus API' });
});

// Port
const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ force: false })
  .then(async () => {
    await seedRoles();
    await seedTestData();
    
    // Start Scheduler
    require('./utils/scheduler')();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => console.log('Error syncing database: ' + err));
