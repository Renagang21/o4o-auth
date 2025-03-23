const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ServiceMembershipRequest extends Model {
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

      // Reviewer 관계 설정
      this.belongsTo(models.User, {
        as: 'reviewer',
        foreignKey: 'reviewed_by'
      });
    }
  }

  ServiceMembershipRequest.init({
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
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    request_reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    review_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requested_access_level: {
      type: DataTypes.ENUM('read', 'write', 'admin'),
      defaultValue: 'read'
    }
  }, {
    sequelize,
    modelName: 'ServiceMembershipRequest',
    tableName: 'service_membership_requests',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['user_id', 'service_id', 'status']
      }
    ]
  });

  return ServiceMembershipRequest;
}; 