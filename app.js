require('./config/instrument')
const Sentry = require("@sentry/node");

require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const sequelize = require('./config/db');

var indexRouter = require('./routes/index')
const authRoutes = require('./routes/auth-routes')
const songRoutes = require('./routes/song-routes')
const awsRoutes = require('./routes/aws-routes')
const sentryRoutes = require('./routes/sentry-routes')
const statisticsRoutes = require('./routes/statistics-routes')

var app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use('/', indexRouter)
app.use('/api/auth', authRoutes)
app.use('/api/song', songRoutes)
app.use('/api/statistics', statisticsRoutes)
app.use('/aws/rekognition', awsRoutes)
app.use('/sentry', sentryRoutes)

Sentry.setupExpressErrorHandler(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
