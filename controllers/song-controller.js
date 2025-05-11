const { User, Emotion, Song, Recommendation, EmotionalAnalysis, sequelize } = require('../models/index');

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
        attributes: ['id_song', 'name', 'artist', 'genre', 'url_spotify'],
        include: [{
          model: Emotion,
          attributes: ['name', 'type']
        }]
      }]
    })

    // Filtrar canciones únicas por id_song
    const uniqueSongs = Array.from(
      new Map(recommendations.map(song => [song.id_song, song])).values()
    )

    res.json(uniqueSongs.map(song => {
      return song.Song
    }))
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error al obtener el historial: ${error}` });
  }
}

exports.getRecommendations = async (req, res) => {
  const { username } = req.body
  const { emotion_name } = req.body
  
  if (!emotion_name || !username) {
    return res.status(400).json({ error: 'Debes proporcionar el username y el nombre de la emoción' });
  }

  try {
    // buscar la emoción por nombre
    const emotion = await Emotion.findOne({
      where: { name: emotion_name }
    })

    if (!emotion) {
      return res.status(404).json({ error: 'Emoción no encontrada' });
    }

    // buscar canciones aleatorias con esa emoción
    const songs = await Song.findAll({
      where: { id_emotion: emotion.id_emotion },
      order: sequelize.random(),
      limit: 3
    })

    // obtener usuario
    const user = await User.findOne({
      where: { username }
    })

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // crear analisis de emocion
    EmotionalAnalysis.create({
      id_user: user.id_user,
      id_emotion: emotion.id_emotion
    })

    // Verificar si se encontraron canciones
    if (songs.length === 0) {
      return res.status(404).json({ error: 'No se encontraron canciones para la emoción especificada' });
    }
    
    // Crear recomendaciones
    const recommendations = songs.map(song => ({
      id_user: user.id_user,
      id_song: song.id_song
    }))

    // Verificar si ya existen recomendaciones para el usuario y las canciones
    const existingRecommendations = await Recommendation.findAll({
      where: {
        id_user: user.id_user,
        id_song: songs.map(song => song.id_song)
      }
    })

    // Filtrar recomendaciones que ya existen
    const newRecommendations = recommendations.filter(recommendation => {
      return !existingRecommendations.some(existing => existing.id_song === recommendation.id_song)
    })

    await Recommendation.bulkCreate(newRecommendations)
      .catch((error) => {
        return res.status(500).json({ error: `Error creando recomendaciones: ${error}` });
      })

    res.json({emotion, songs})
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error al obtener la recomendación: ${error}` });
  }
}