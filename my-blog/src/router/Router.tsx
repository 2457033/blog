import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import routes from './routes'
import { Suspense, useEffect } from 'react'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import Loading from '@/components/Load/Loading'

export default function AppRouter() {
  const location = useLocation()
  const Navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.userInfo)
  useEffect(() => {
    // 路由开始跳转时启动 nProgress
    nProgress.start()
    nProgress.done()
    // 路由变化结束时，关闭 nProgress
    return () => {
      nProgress.done()
    }
  }, [location])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    if (location.pathname === '/login' && token) {
      Navigate('/', { replace: true })
    }
  }, [location.pathname])
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map((item) => (
          <Route
            key={item.id}
            path={item.path}
            element={item.element}
          >
            {item.children && item.children?.length > 0
              ? item.children.map((r) => (
                  <Route
                    key={r.id}
                    path={r.path}
                    element={r.element}
                  />
                ))
              : null}
          </Route>
        ))}
      </Routes>
    </Suspense>
  )
}
