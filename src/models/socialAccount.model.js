const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SocialAccount extends Model {
    static associate(models) {
      // User 관계 설정
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      });
    }
  }

  SocialAccount.init({
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
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SocialAccount',
    tableName: 'social_accounts',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['provider', 'provider_id']
      }
    ]
  });

  return SocialAccount;
}; 