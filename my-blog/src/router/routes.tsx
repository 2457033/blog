import { nanoid } from 'nanoid'
import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('@/views/Home'))
const Layout = lazy(() => import('@/views/Layout'))
const ArticleDetail = lazy(() => import('@/views/Article/detail'))
const NotFound = lazy(() => import('@/views/AbNormal/NotFound'))
const Login = lazy(() => import('@/views/Login'))
const Timeline = lazy(() => import('@/views/Timeline'))
const Tags = lazy(() => import('@/views/Tags'))
const Essay = lazy(() => import('@/views/Essay'))
const Life = lazy(() => import('@/views/Life'))
const PhotoAlbumPage = lazy(() => import('@/views/PhotoAlbum'))
const About = lazy(() => import('@/views/About'))
const Profile = lazy(() => import('@/views/Profile'))
const Topic = lazy(() => import('@/views/Topic'))
const TopicDetail = lazy(() => import('@/views/Topic/components/TopicDetail'))

const Routes = () => {
  const routes: RouteObject[] = [
    {
      id: nanoid(),
      path: '/',
      element: <Layout />,
      children: [
        {
          id: nanoid(),
          path: '/',
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
        {
          id: nanoid(),
          path: '/article/:id',
          element: <ArticleDetail />
        },
        {
          id: nanoid(),
          path: '/timeline',
          element: <Timeline />
        },
        {
          id: nanoid(),
          path: '/tags',
          element: <Tags />
        },
        {
          id: nanoid(),
          path: '/essay',
          element: <Essay />
        },
        {
          id: nanoid(),
          path: '/life',
          element: <Life />
        },
        {
          id: nanoid(),
          path: '/photoalbum',
          element: <PhotoAlbumPage />
        },
        {
          id: nanoid(),
          path: '/about',
          element: <About />
        },
        {
          id: nanoid(),
          path: '/profile',
          element: <Profile />
        },
        {
          id: nanoid(),
          path: '/topic',
          element: <Topic />
        },
        {
          id: nanoid(),
          path: '/topic/:id',
          element: <TopicDetail />
        },
        {
          id: nanoid(),
          path: '*',
          element: <NotFound />
        }
      ]
    },
    {
      id: nanoid(),
      path: '/login',
      element: <Login />
    }
  ]

  return routes
}

export default Routes
