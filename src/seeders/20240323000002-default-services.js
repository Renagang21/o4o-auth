'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    await queryInterface.bulkInsert('services', [
      {
        name: '처방전 관리 서비스',
        description: '처방전을 관리하고 조회할 수 있는 서비스입니다.',
        is_active: true,
        access_level: 'restricted',
        max_users: 1000,
        settings: JSON.stringify({
          allowPrescriptionUpload: true,
          requirePharmacistVerification: true,
          autoExpireAfterDays: 30
        }),
        created_at: now,
        updated_at: now
      },
      {
        name: '약국 찾기 서비스',
        description: '주변 약국을 찾고 정보를 조회할 수 있는 서비스입니다.',
        is_active: true,
        access_level: 'public',
        max_users: null,
        settings: JSON.stringify({
          enableLocationSearch: true,
          maxSearchRadius: 5000,
          showPharmacistInfo: true
        }),
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', {
      name: {
        [Sequelize.Op.in]: ['처방전 관리 서비스', '약국 찾기 서비스']
      }
    });
  }
}; 