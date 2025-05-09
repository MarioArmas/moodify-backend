const express = require('express')
const router = express.Router()
const { getHistory, getRecommendations } = require('../controllers/song-controller')
const authMiddleware = require('../middleware/auth-middleware')

router.get('/history', authMiddleware, getHistory)
router.get('/recommendation', authMiddleware, getRecommendations)

module.exports = router