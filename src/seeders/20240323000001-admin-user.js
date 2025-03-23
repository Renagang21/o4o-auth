'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 관리자 사용자 생성
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [adminUser] = await queryInterface.bulkInsert('Users', [{
      email: 'admin@o4o.com',
      password: hashedPassword,
      name: '관리자',
      phone: '010-1234-5678',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true });

    // 관리자 역할 ID 조회
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1`
    );

    // 사용자-역할 관계 생성
    await queryInterface.bulkInsert('UserRoles', [{
      user_id: adminUser.id,
      role_id: adminRole[0].id,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    // 관리자 사용자-역할 관계 삭제
    await queryInterface.sequelize.query(
      `DELETE FROM UserRoles WHERE user_id IN (SELECT id FROM Users WHERE email = 'admin@o4o.com')`
    );

    // 관리자 사용자 삭제
    await queryInterface.bulkDelete('Users', { email: 'admin@o4o.com' }, {});
  }
}; 