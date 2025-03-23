const request = require('supertest');
const app = require('../app');
const { User, Role, Service, ServiceAccessControl, ServiceMembershipRequest } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Service Controller Tests', () => {
  let testUser;
  let testAdmin;
  let testService;
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // 테스트용 사용자 생성
    const hashedPassword = await bcrypt.hash('test123', 10);
    testUser = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '010-1234-5678'
    });

    // 테스트용 관리자 생성
    testAdmin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Test Admin',
      phone: '010-8765-4321'
    });

    // 역할 조회 및 할당
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    await testAdmin.addRole(adminRole);

    // 테스트용 서비스 생성
    testService = await Service.create({
      name: 'Test Service',
      description: 'Test Description',
      is_active: true
    });

    // 토큰 생성
    userToken = jwt.sign(
      { id: testUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    adminToken = jwt.sign(
      { id: testAdmin.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });

  afterAll(async () => {
    await User.destroy({ where: { id: testUser.id } });
    await User.destroy({ where: { id: testAdmin.id } });
    await Service.destroy({ where: { id: testService.id } });
  });

  describe('GET /api/services', () => {
    it('should return available services', async () => {
      const response = await request(app)
        .get('/api/services')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('is_active', true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/services');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/services/:serviceId/request', () => {
    it('should create service access request', async () => {
      const response = await request(app)
        .post(`/api/services/${testService.id}/request`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          request_reason: 'Test request reason'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('request_reason', 'Test request reason');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post(`/api/services/${testService.id}/request`)
        .send({
          request_reason: 'Test request reason'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/services/:serviceId/request-status', () => {
    it('should return service request status', async () => {
      // 먼저 요청 생성
      await ServiceMembershipRequest.create({
        user_id: testUser.id,
        service_id: testService.id,
        request_reason: 'Test request reason',
        status: 'pending'
      });

      const response = await request(app)
        .get(`/api/services/${testService.id}/request-status`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('request_reason', 'Test request reason');
    });

    it('should return 404 for non-existent request', async () => {
      const response = await request(app)
        .get(`/api/services/999999/request-status`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/services/:serviceId/access', () => {
    it('should check service access permission', async () => {
      // 먼저 접근 권한 생성
      await ServiceAccessControl.create({
        user_id: testUser.id,
        service_id: testService.id,
        is_active: true,
        reason: 'Test access reason'
      });

      const response = await request(app)
        .get(`/api/services/${testService.id}/access`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('hasAccess', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('reason');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get(`/api/services/${testService.id}/access`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 