const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialAccount = sequelize.define('SocialAccount', {
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
        allowNull: false,
        validate: {
            isIn: [['google', 'naver', 'kakao']]
        }
    },
    provider_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'social_accounts',
    timestamps: true,
    createdAt: 'created_at',
    indexes: [
        {
            unique: true,
            fields: ['provider', 'provider_id']
        }
    ]
});

module.exports = SocialAccount; 