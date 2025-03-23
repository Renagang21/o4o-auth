const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AccessControlLog = sequelize.define('AccessControlLog', {
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
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['grant', 'revoke', 'request']]
        }
    },
    reason: {
        type: DataTypes.TEXT
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'access_control_logs',
    timestamps: true,
    createdAt: 'created_at',
    indexes: [
        {
            fields: ['user_id', 'service_id']
        }
    ]
});

module.exports = AccessControlLog; 