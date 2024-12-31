import express, { Express, Request, Response, NextFunction } from 'express'
import path from 'path'
import cors from 'cors'
import { errorHandler } from './middlewares/error.handler'
import { tokenServer } from './middlewares/jwt'
import authRouter from './routes/admin/auth.route'
import userRouter from './routes/admin/user.route'
import aliossRouter from './routes/admin/alioss.route'
import blogRouter from './routes/admin/blog.route'
import roleRouter from './routes/admin/role.route'
import menuRouter from './routes/admin/menu.route'
import homeRouter from './routes/admin/home.route'
import articleRouter from './routes/admin/article.route'
// 前台
import receptionHomeRouter from './routes/reception/home.route'
import receptionAuthRouter from './routes/reception/auth.route'
import receptionArticleRouter from './routes/reception/article.route'
import receptionCommentRouter from './routes/reception/comment.route'
const app: Express = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
app.use(tokenServer.verify)

// 添加路由处理
app.get('/', (req, res) => {
  res.render('index', { title: '欢迎来到博客后端' })
})
app.use('/api/auth', authRouter)
app.use('/api/home', homeRouter)
app.use('/api/users', userRouter)
app.use('/api/menus', menuRouter)
app.use('/api/role', roleRouter)
app.use('/api/alioss', aliossRouter)
app.use('/api/blog', blogRouter)
app.use('/api/article', articleRouter)

// 前台
app.use('/api/reception/home', receptionHomeRouter)
app.use('/api/reception/auth', receptionAuthRouter)
app.use('/api/reception/article', receptionArticleRouter)
app.use('/api/reception/comment', receptionCommentRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    code: 404,
    message: '未找到请求的资源'
  })
})

// 错误处理中间件
app.use(errorHandler)

export default app
