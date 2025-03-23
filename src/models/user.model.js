const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Role 관계 설정
      this.belongsToMany(models.Role, {
        through: 'UserRoles',
        as: 'roles',
        foreignKey: 'user_id'
      });

      // SocialAccount 관계 설정
      this.hasMany(models.SocialAccount, {
        as: 'social_accounts',
        foreignKey: 'user_id'
      });

      // Pharmacist 관계 설정
      this.hasOne(models.Pharmacist, {
        as: 'pharmacist',
        foreignKey: 'user_id'
      });

      // ServiceAccessControl 관계 설정
      this.hasMany(models.ServiceAccessControl, {
        as: 'service_access_controls',
        foreignKey: 'user_id'
      });

      // ServiceMembershipRequest 관계 설정
      this.hasMany(models.ServiceMembershipRequest, {
        as: 'service_requests',
        foreignKey: 'user_id'
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // 소셜 로그인의 경우 비밀번호가 없을 수 있음
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true // soft delete 사용
  });

  return User;
}; 