const express = require('express')
const router = express.Router()
const { getHistory, getRecommendations, getLastRecommendations } = require('../controllers/song-controller')
const authMiddleware = require('../middleware/auth-middleware')

router.get('/history', authMiddleware, getHistory)
router.post('/recommendation', authMiddleware, getRecommendations)
router.get('/last-recommendations', authMiddleware, getLastRecommendations)

module.exports = router