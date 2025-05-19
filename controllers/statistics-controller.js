const { EmotionalAnalysis, Emotion, User } = require('../models')
const { Op } = require('sequelize')

exports.getUserEmotionsLast7Days = async (req, res) => {
  const { username } = req.query
  if (!username) return res.status(400).json({ error: 'Debes proporcionar un username' })

  try {
    const user = await User.findOne({ where: { username } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const analyses = await EmotionalAnalysis.findAll({
      where: {
        id_user: user.id_user,
        analysis_date: { [Op.gte]: sevenDaysAgo }
      },
      include: [{ model: Emotion, attributes: ['name', 'type'] }],
      order: [['analysis_date', 'ASC']]
    })

    res.json(analyses.map(a => ({
      emotion: a.Emotion.name,
      type: a.Emotion.type,
      date: a.analysis_date
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}