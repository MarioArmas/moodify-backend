const { User, Emotion, Song, Recommendation, sequelize } = require('../models/index');

// Obtener historial de canciones recomendadas por usuario
exports.getHistory = async (req, res) => {
  const { username } = req.query

  if (!username) {
    return res.status(400).json({ error: 'Debes proporcionar un username' });
  }
  
  try {
    // Buscar id_user
    const user = await User.findOne({
      where: { username }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const recommendations = await Recommendation.findAll({
      where: { id_user: user.id_user },
      include: [{
        model: Song,
        attributes: ['name', 'artist', 'genre', 'url_spotify'],
        include: [{
          model: Emotion,
          attributes: ['name', 'type']
        }]
      }]
    })

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error al obtener el historial: ${error}` });
  }
}

exports.getRecommendations = async (req, res) => {
  const { emotion_name } = req.query
  
  if (!emotion_name) {
    return res.status(400).json({ error: 'Debes proporcionar el nombre de la emoción' });
  }

  try {
    // Buscamos la emoción por nombre
    const emotion = await Emotion.findOne({
      where: { name: emotion_name }
    });

    if (!emotion) {
      return res.status(404).json({ error: 'Emoción no encontrada' });
    }

    // Buscamos 5 canciones aleatorias con esa emoción
    const songs = await Song.findAll({
      where: { id_emotion: emotion.id_emotion },
      order: sequelize.random(),
      limit: 5
    });

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error al obtener la recomendación: ${error}` });
  }
}