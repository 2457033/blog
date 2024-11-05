import { nanoid } from 'nanoid'
import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('@/views/Home'))
const Layout = lazy(() => import('@/views/Layout'))
const Article = lazy(() => import('@/views/Article'))
const NotFound = lazy(() => import('@/views/AbNormal/NotFound'))
const Login = lazy(() => import('@/views/Login'))

const routes: RouteObject[] = [
  {
    id: nanoid(),
    path: '/',
    element: <Layout />,
    children: [
      {
        id: nanoid(),
        path: '/', // 根路径重定向到 /home
        element: (
          <Navigate
            to="/home"
            replace
          />
        )
      },
      {
        id: nanoid(),
        path: '/home',
        element: <Home />
      },
      /** 文章 */
      {
        id: nanoid(),
        path: '/article/:id',
        element: <Article />
      },
      {
        id: nanoid(),
        path: '*', // 404 路由
        element: <NotFound />
      }
    ]
  },
  /** 登录 */
  {
    id: nanoid(),
    path: '/login',
    element: <Login />
  }
]

export default routes
