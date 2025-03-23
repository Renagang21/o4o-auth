const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminRole = sequelize.define('AdminRole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isIn: [['SYSTEM', 'SERVICE', 'STORE']]
        }
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'admin_roles',
    timestamps: true,
    createdAt: 'created_at'
});

module.exports = AdminRole; 