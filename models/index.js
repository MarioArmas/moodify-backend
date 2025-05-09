const sequelize = require('../config/db');

const User = require('./User');
const Emotion = require('./Emotion');
const Song = require('./Song');
const Recommendation = require('./Recommendation');
const EmotionalAnalysis = require('./EmotionalAnalysis');

// Relaciones:
User.hasMany(Recommendation, { foreignKey: 'id_user' });
Recommendation.belongsTo(User, { foreignKey: 'id_user' });

Song.hasMany(Recommendation, { foreignKey: 'id_song' });
Recommendation.belongsTo(Song, { foreignKey: 'id_song' });  // << ESTA ES CLAVE

Emotion.hasMany(Song, { foreignKey: 'id_emotion' });
Song.belongsTo(Emotion, { foreignKey: 'id_emotion' });

Emotion.hasMany(EmotionalAnalysis, { foreignKey: 'id_emotion' });
EmotionalAnalysis.belongsTo(Emotion, { foreignKey: 'id_emotion' });

User.hasMany(EmotionalAnalysis, { foreignKey: 'id_user' });
EmotionalAnalysis.belongsTo(User, { foreignKey: 'id_user' });

module.exports = {
    sequelize,
    User,
    Emotion,
    Song,
    Recommendation,
    EmotionalAnalysis
};
