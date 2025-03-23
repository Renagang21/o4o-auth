const request = require('supertest');
const app = require('../app');
const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Auth Controller Tests', () => {
  let testUser;
  let testToken;

  beforeAll(async () => {
    // 테스트용 사용자 생성
    const hashedPassword = await bcrypt.hash('test123', 10);
    testUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '010-1234-5678'
    });

    // 테스트용 토큰 생성
    testToken = jwt.sign(
      { id: testUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });

  afterAll(async () => {
    await User.destroy({ where: { id: testUser.id } });
  });

  describe('POST /api/auth/token', () => {
    it('should generate JWT token with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/token')
        .send({
          email: 'test@example.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/token')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user information', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout user', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 