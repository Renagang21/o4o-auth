const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ServiceAccessControl extends Model {
    static associate(models) {
      // User 관계 설정
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      });

      // Service 관계 설정
      this.belongsTo(models.Service, {
        as: 'service',
        foreignKey: 'service_id'
      });
    }
  }

  ServiceAccessControl.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    access_level: {
      type: DataTypes.ENUM('read', 'write', 'admin'),
      defaultValue: 'read'
    },
    granted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    granted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ServiceAccessControl',
    tableName: 'service_access_controls',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'service_id']
      }
    ]
  });

  return ServiceAccessControl;
}; 