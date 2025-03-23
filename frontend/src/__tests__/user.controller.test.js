const request = require('supertest');
const app = require('../app');
const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('User Controller Tests', () => {
  let testUser;
  let testAdmin;
  let testToken;
  let adminToken;
  let pharmacistRole;

  beforeAll(async () => {
    // 테스트용 일반 사용자 생성
    const hashedPassword = await bcrypt.hash('test123', 10);
    testUser = await User.create({
      email: 'test@example.com',
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

    // 역할 조회
    pharmacistRole = await Role.findOne({ where: { name: 'pharmacist' } });
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    // 관리자 역할 할당
    await testAdmin.addRole(adminRole);

    // 테스트용 토큰 생성
    testToken = jwt.sign(
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
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('phone');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'Updated Name',
          phone: '010-9999-8888'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.phone).toBe('010-9999-8888');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({
          name: 'Updated Name',
          phone: '010-9999-8888'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/pharmacist', () => {
    it('should register pharmacist', async () => {
      const response = await request(app)
        .post('/api/users/pharmacist')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          license_number: '12345',
          pharmacy_name: 'Test Pharmacy',
          pharmacy_address: 'Test Address'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('license_number');
      expect(response.body).toHaveProperty('pharmacy_name');
      expect(response.body).toHaveProperty('pharmacy_address');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/users/pharmacist')
        .send({
          license_number: '12345',
          pharmacy_name: 'Test Pharmacy',
          pharmacy_address: 'Test Address'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/:userId/roles', () => {
    it('should assign role to user', async () => {
      const response = await request(app)
        .post(`/api/users/${testUser.id}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          role_id: pharmacistRole.id
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .post(`/api/users/${testUser.id}/roles`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          role_id: pharmacistRole.id
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/:userId/roles/:roleId', () => {
    it('should remove role from user', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}/roles/${pharmacistRole.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}/roles/${pharmacistRole.id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 