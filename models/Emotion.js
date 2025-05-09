const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Emotion = sequelize.define('Emotion', {
    id_emotion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'Emotion',
    timestamps: false
});

module.exports = Emotion;
