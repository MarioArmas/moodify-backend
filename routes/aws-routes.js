const express = require('express')
const router = express.Router()
const { getAnalysis } = require('../controllers/aws-controller')
const authMiddleware = require('../middleware/auth-middleware')

router.get('/analysis', authMiddleware, getAnalysis)

module.exports = router