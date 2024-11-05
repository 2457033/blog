var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
require('dotenv').config()
// const { createServer } = require("http");

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('trust proxy', true)

// 将uploads文件夹中的内容公开
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.use(express.json())

// 身份验证
const tokenServer = require('./utils/token')
app.use(tokenServer.verify)

/** 后台 */
var indexRouter = require('./routes/index')
var menusRouter = require('./routes/backend/menus')
var usersRouter = require('./routes/backend/users/users')
var roleRouter = require('./routes/backend/role')
var uploadUserRouter = require('./routes/backend/users/upload_user')
var homeRouter = require('./routes/backend/home')
var blogRouter = require('./routes/backend/blog/blog')
var blogCategoryRouter = require('./routes/backend/blog/blog_category')
var blogSwiperRouter = require('./routes/backend/blog/blog_swiper')
var uploadImageRouter = require('./routes/backend/upload/upload_image')
var aliOssRouter = require('./routes/backend/alioss')
/////////////////////////////////
/** 前台 */
var receptionBlogRouter = require('./routes/reception/article')
var receptionCommonRouter = require('./routes/reception/article/common')
var receptionUsersRouter = require('./routes/reception/users')
var receptionHomeRouter = require('./routes/reception/home')
/** 后台 */
app.use('/', indexRouter)
app.use('/api/menus', menusRouter)
app.use('/api/users', usersRouter)
app.use('/api/role', roleRouter)
app.use('/api/upload_user', uploadUserRouter)
app.use('/api/home', homeRouter)
app.use('/api/blog', blogRouter)
app.use('/api/blog_swiper', blogSwiperRouter)
app.use('/api/blog_category', blogCategoryRouter)
app.use('/api/upload_image', uploadImageRouter)
app.use('/api/alioss', aliOssRouter)
/** 前台 */
app.use('/api/backend/article', receptionBlogRouter)
app.use('/api/backend/users', receptionUsersRouter)
app.use('/api/backend/home', receptionHomeRouter)
app.use('/api/backend/article/common', receptionCommonRouter)

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
