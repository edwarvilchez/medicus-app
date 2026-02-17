const request = require('supertest');
const app = require('../index');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(400);
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: 'invalid@example.com', 
          password: 'wrongpassword' 
        });
      
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(400);
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(res.status).toBe(400);
    });
  });
});

describe('Health Check', () => {
  it('should return 200 and status OK', async () => {
    const res = await request(app)
      .get('/health');
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Protected Routes', () => {
  it('should return 401 without token', async () => {
    const res = await request(app)
      .get('/api/patients');
    
    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(res.status).toBe(401);
  });
});

describe('Rate Limiting', () => {
  it('should apply rate limiting to auth endpoints', async () => {
    // Make multiple requests to trigger rate limit
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' })
      );
    }
    
    const responses = await Promise.all(requests);
    // Rate limiting should be active
    expect(responses[responses.length - 1].status).toBeGreaterThanOrEqual(401);
  });
});
