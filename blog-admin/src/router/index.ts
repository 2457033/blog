import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import { useMenuStore, userInfo } from '@/pinia'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '@/views/layout/index.vue'
import { postVisitRecord } from '@/api/home'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Layout,
    meta: { requiresAuth: true, title: '首页' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { requiresAuth: true, title: '首页' },
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/my-info',
        name: 'my-info',
        meta: { requiresAuth: true, title: '个人资料', cache: 1 },
        component: () => import('@/views/myInfo/index.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        alias: '/404',
        // name: '404',
        component: () => import('@/views/error/404.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    meta: { requiresAuth: true },
    children: []
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 })
})

NProgress.configure({ showSpinner: false })

function checkToken() {
  const token = localStorage.getItem('user_token')
  return !!token // 如果 token 存在，返回 true；否则返回 false
}

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const menuStore = useMenuStore()
  const userStore = userInfo()
  const { getUserInfo } = userStore
  const { getMenuList, setRoute, generateRoutes } = menuStore

  if (userStore.getToken()) {
    if (menuStore.routeList.length === 0) {
      await getUserInfo()
      await getMenuList(userStore.userinfo.permission!)
      const routes = generateRoutes()
      console.log(routes)
      routes.forEach((r) => {
        if (!router.hasRoute(r.name!)) {
          router.addRoute('system', r)
        }
      })
      // console.log(router.getRoutes())
      await setRoute(routes)
      next({ ...to, replace: true })
    } else {
      // 已经加载了动态路由
      const title = to.meta.title?.toString() || ''
      postVisitRecord(to.fullPath, title)
      if (to.path === '/login') {
        next({ path: '/' })
      } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!checkToken()) {
          next({ name: 'login', query: { redirect: to.fullPath } })
        } else if (to.meta.status === 'disable') {
          next({ name: '404' })
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
