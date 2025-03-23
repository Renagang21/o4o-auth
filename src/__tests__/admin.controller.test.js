const request = require('supertest');
const app = require('../app');
const { User, Role, Service, Pharmacist } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Admin Controller Tests', () => {
  let testAdmin;
  let testUser;
  let testPharmacist;
  let adminToken;
  let pharmacistRole;

  beforeAll(async () => {
    // 테스트용 관리자 생성
    const hashedPassword = await bcrypt.hash('test123', 10);
    testAdmin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Test Admin',
      phone: '010-1234-5678'
    });

    // 테스트용 일반 사용자 생성
    testUser = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '010-8765-4321'
    });

    // 테스트용 약사 생성
    testPharmacist = await User.create({
      email: 'pharmacist@example.com',
      password: hashedPassword,
      name: 'Test Pharmacist',
      phone: '010-9999-8888'
    });

    // 역할 조회 및 할당
    pharmacistRole = await Role.findOne({ where: { name: 'pharmacist' } });
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    await testAdmin.addRole(adminRole);
    await testPharmacist.addRole(pharmacistRole);

    // 약사 정보 생성
    await Pharmacist.create({
      user_id: testPharmacist.id,
      license_number: '12345',
      pharmacy_name: 'Test Pharmacy',
      pharmacy_address: 'Test Address',
      is_verified: false
    });

    // 관리자 토큰 생성
    adminToken = jwt.sign(
      { id: testAdmin.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  });

  afterAll(async () => {
    await User.destroy({ where: { id: testAdmin.id } });
    await User.destroy({ where: { id: testUser.id } });
    await User.destroy({ where: { id: testPharmacist.id } });
  });

  describe('GET /api/admin/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${jwt.sign({ id: testUser.id }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/admin/pharmacists/pending', () => {
    it('should return pending pharmacists', async () => {
      const response = await request(app)
        .get('/api/admin/pharmacists/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('is_verified', false);
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .get('/api/admin/pharmacists/pending')
        .set('Authorization', `Bearer ${jwt.sign({ id: testUser.id }, process.env.JWT_SECRET)}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/admin/pharmacists/:pharmacistId/verify', () => {
    it('should verify pharmacist', async () => {
      const response = await request(app)
        .put(`/api/admin/pharmacists/${testPharmacist.id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          is_verified: true,
          verification_note: 'Test verification'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('is_verified', true);
      expect(response.body).toHaveProperty('verification_note', 'Test verification');
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .put(`/api/admin/pharmacists/${testPharmacist.id}/verify`)
        .set('Authorization', `Bearer ${jwt.sign({ id: testUser.id }, process.env.JWT_SECRET)}`)
        .send({
          is_verified: true,
          verification_note: 'Test verification'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/admin/services', () => {
    it('should create new service', async () => {
      const response = await request(app)
        .post('/api/admin/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Service',
          description: 'Test Description',
          is_active: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Test Service');
      expect(response.body).toHaveProperty('description', 'Test Description');
      expect(response.body).toHaveProperty('is_active', true);
    });

    it('should return 403 without admin role', async () => {
      const response = await request(app)
        .post('/api/admin/services')
        .set('Authorization', `Bearer ${jwt.sign({ id: testUser.id }, process.env.JWT_SECRET)}`)
        .send({
          name: 'Test Service',
          description: 'Test Description',
          is_active: true
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 