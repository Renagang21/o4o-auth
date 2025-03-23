const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAdminRole = sequelize.define('UserAdminRole', {
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
    admin_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'admin_roles',
            key: 'id'
        }
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'services',
            key: 'id'
        }
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    tableName: 'user_admin_roles',
    timestamps: true,
    createdAt: 'created_at',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'admin_role_id', 'service_id', 'store_id']
        }
    ]
});

module.exports = UserAdminRole; 