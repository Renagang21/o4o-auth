require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('../models');

beforeAll(async () => {
  // 테스트 데이터베이스 연결
  await sequelize.authenticate();
  console.log('테스트 데이터베이스 연결 성공');
});

afterAll(async () => {
  // 테스트 데이터베이스 연결 종료
  await sequelize.close();
  console.log('테스트 데이터베이스 연결 종료');
}); 