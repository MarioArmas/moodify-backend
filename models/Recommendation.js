const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recommendation = sequelize.define('Recommendation', {
    id_recomendation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_song: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recomendation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Recommendation',
    timestamps: false
});

module.exports = Recommendation;
