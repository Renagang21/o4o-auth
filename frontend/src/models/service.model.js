const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Service extends Model {
    static associate(models) {
      // ServiceAccessControl 관계 설정
      this.hasMany(models.ServiceAccessControl, {
        as: 'access_controls',
        foreignKey: 'service_id'
      });

      // ServiceMembershipRequest 관계 설정
      this.hasMany(models.ServiceMembershipRequest, {
        as: 'membership_requests',
        foreignKey: 'service_id'
      });
    }
  }

  Service.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    access_level: {
      type: DataTypes.ENUM('public', 'private', 'restricted'),
      defaultValue: 'private'
    },
    max_users: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  return Service;
}; 