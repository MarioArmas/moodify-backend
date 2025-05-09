const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Emotion = require('./Emotion');

const Song = sequelize.define('Song', {
    id_song: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING
    },
    url_spotify: {
        type: DataTypes.STRING
    },
    id_emotion: {
        type: DataTypes.INTEGER,
        references: {
            model: Emotion,
            key: 'id_emotion'
        }
    }
}, {
    tableName: 'Song',
    timestamps: false
});

module.exports = Song;
