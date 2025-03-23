const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pharmacist extends Model {
    static associate(models) {
      // User 관계 설정
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      });
    }
  }

  Pharmacist.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    license_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    pharmacy_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pharmacy_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verification_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verification_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Pharmacist',
    tableName: 'pharmacists',
    underscored: true,
    timestamps: true,
    paranoid: true
  });

  return Pharmacist;
}; 