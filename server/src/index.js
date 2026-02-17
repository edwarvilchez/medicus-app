const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();
const sequelize = require('./config/db.config');
const models = require('./models');
const seedRoles = require('./utils/seeder');
const seedTestData = require('./utils/testSeeder');
const { initializeSocket } = require('./sockets/videoSocket');
const logger = require('./utils/logger');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const server = http.createServer(app);

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MEDICUS API',
      version: '1.8.0',
      description: 'Sistema integral de gestión clínica y hospitalaria',
      contact: {
        name: 'Edwar Vilchez',
        email: 'edwarvilchez1977@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 1. CORS - DEBE IR PRIMERO QUE TODO
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir si no hay origen (como apps móviles o curl) 
    // o si el origen coincide con nuestros patrones
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        origin.includes('.easypanel.host') || 
        origin.includes('.nominusve.com')) {
      callback(null, true);
    } else {
      logger.warn({ origin }, 'CORS Blocked');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 2. Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting for Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Aumentado para debug
  message: 'Demasiados intentos de autenticación, por favor intente nuevamente en 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/', apiLimiter);

// Input Sanitization (prevent NoSQL injection and XSS)
app.use(mongoSanitize());
app.use(xss());

// Other Middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/uploads', express.static('uploads'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MEDICUS API Docs',
}));

// Test DB Connection
sequelize.authenticate()
  .then(() => logger.info('Database connected successfully'))
  .catch(err => logger.error({ err }, 'Database connection error'));

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
app.use('/api/video-consultations', require('./routes/videoConsultation.routes'));
app.use('/api/bulk', require('./routes/bulk.routes'));
app.use('/api/team', require('./routes/team.routes'));

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.8.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  try {
    // Check database connection
    await sequelize.authenticate();
    healthcheck.database = 'connected';
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.database = 'disconnected';
    healthcheck.message = 'ERROR';
    logger.error({ error }, 'Health check failed');
    res.status(503).json(healthcheck);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medicus API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Log error internally
  logger.error({
    err,
    path: req.path,
    method: req.method,
    ip: req.ip,
  }, 'Global error handler caught error');

  // Send response (hide details in production)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(isDevelopment && {
      error: err.message,
      stack: err.stack,
    }),
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ force: false })
  .then(async () => {
    await seedRoles();
    await seedTestData();

    // Inicializar Socket.io para videoconsultas
    initializeSocket(server);

    // Start Scheduler
    require('./utils/scheduler')();
  })
  .catch(err => logger.warn({ err }, 'Error syncing database (Ignoring)'))
  .finally(() => {
    server.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info('🎥 WebSocket server ready for video consultations');
      logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔐 Security features enabled: Helmet, CORS, Rate Limiting`);
    });
  });

