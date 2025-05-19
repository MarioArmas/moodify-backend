const express = require('express')
const router = express.Router()
const { getUserEmotionsLast7Days } = require('../controllers/statistics-controller')
const authMiddleware = require('../middleware/auth-middleware')

router.get('/user-emotions', authMiddleware, getUserEmotionsLast7Days)

module.exports = router