'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        description: '시스템 관리자',
        created_at: now,
        updated_at: now
      },
      {
        name: 'pharmacist',
        description: '약사',
        created_at: now,
        updated_at: now
      },
      {
        name: 'user',
        description: '일반 사용자',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
}; 