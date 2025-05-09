const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmotionalAnalysis = sequelize.define('EmotionalAnalysis', {
    id_analysis: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_emotion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    analysis_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'EmotionalAnalysis',
    timestamps: false
});

module.exports = EmotionalAnalysis;
