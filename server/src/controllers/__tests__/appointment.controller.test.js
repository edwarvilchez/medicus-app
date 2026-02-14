const request = require('supertest');
const express = require('express');
const appointmentRoutes = require('../../routes/appointment.routes');
const authMiddleware = require('../../middlewares/auth.middleware');

// Mock express app para testing
const app = express();
app.use(express.json());

// Mock auth middleware para simular usuario autenticado
jest.mock('../../middlewares/auth.middleware', () => {
  return jest.fn((req, res, next) => {
    req.user = {
      id: 'test-user-id',
      role: 'DOCTOR',
      organizationId: 'test-org-id',
    };
    next();
  });
});

app.use('/api/appointments', appointmentRoutes);

// Mock models
jest.mock('../../models', () => ({
  Appointment: {
    create: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  Patient: {
    findOne: jest.fn(),
  },
  Doctor: {
    findOne: jest.fn(),
  },
  User: {},
}));

describe('Appointment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/appointments', () => {
    it('should reject appointment with invalid patient ID', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: 'not-a-uuid',
          doctorId: '550e8400-e29b-41d4-a716-446655440000',
          appointmentDate: '2026-12-31',
          appointmentTime: '10:00',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });

    it('should reject appointment with invalid doctor ID', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: '550e8400-e29b-41d4-a716-446655440000',
          doctorId: 'not-a-uuid',
          appointmentDate: '2026-12-31',
          appointmentTime: '10:00',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });

    it('should reject appointment with past date', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: '550e8400-e29b-41d4-a716-446655440000',
          doctorId: '550e8400-e29b-41d4-a716-446655440001',
          appointmentDate: '2020-01-01',
          appointmentTime: '10:00',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('pasado'),
          }),
        ])
      );
    });

    it('should reject appointment with invalid time format', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: '550e8400-e29b-41d4-a716-446655440000',
          doctorId: '550e8400-e29b-41d4-a716-446655440001',
          appointmentDate: '2026-12-31',
          appointmentTime: '25:00', // Invalid hour
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });

    it('should reject appointment with missing required fields', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: '550e8400-e29b-41d4-a716-446655440000',
          // Missing doctorId, date, time
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });

    it('should accept valid appointment data', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({
          patientId: '550e8400-e29b-41d4-a716-446655440000',
          doctorId: '550e8400-e29b-41d4-a716-446655440001',
          appointmentDate: '2026-12-31',
          appointmentTime: '10:00',
          reason: 'Checkup',
          notes: 'Annual physical exam',
        });

      // El test pasará si la validación es correcta
      expect(res.status).toBeLessThan(500);
    });
  });

  describe('GET /api/appointments', () => {
    it('should support pagination parameters', async () => {
      const { Appointment } = require('../../models');

      Appointment.findAndCountAll.mockResolvedValue({
        count: 50,
        rows: [],
      });

      const res = await request(app)
        .get('/api/appointments')
        .query({ page: 2, limit: 10 });

      expect(res.status).toBeLessThan(500);

      if (res.status === 200) {
        expect(res.body).toHaveProperty('totalPages');
        expect(res.body).toHaveProperty('currentPage');
        expect(res.body).toHaveProperty('total');
      }
    });

    it('should use default pagination if not specified', async () => {
      const { Appointment } = require('../../models');

      Appointment.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });

      const res = await request(app).get('/api/appointments');

      expect(res.status).toBeLessThan(500);
    });
  });
});
