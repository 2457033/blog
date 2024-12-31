import { menusF, getMenus as getMenusApi } from '@/api/setting/menus'
import router from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('useMenuStore', () => {
  const routeList = ref<RouteRecordRaw[]>([])
  const menus = ref<menusF[]>([])

  async function getMenuList(permission: string) {
    try {
      const res = await getMenusApi()
      const list = res.data.row
      if (permission !== '*:*:*') {
        const permissionF = permission?.split(',')
        const arr = filterMenus(permissionF, list)
        const menuList = getMenus(list, arr)
        const menuListF = filterStatus(menuList)
        updateMenus(menuListF)
      } else {
        const menuListF = filterStatus(list)
        updateMenus(menuListF)
      }
    } catch (err) {
      console.error(err)
    }
  }

  function updateMenus(list: menusF[]) {
    menus.value = list || []
  }

  function generateRoutes() {
    return extractDynamicRoutes(filterRoute(menus.value))
  }

  async function setRoute(routes: RouteRecordRaw[]) {
    routeList.value = routes
  }

  function clearRoutes() {
    menus.value = []
    routeList.value = []
    const routes = router.getRoutes()
    routes.forEach((s) => {
      if (s.meta.trends) {
        router.removeRoute(s.name!?.toString())
      }
    })
  }

  return {
    routeList,
    menus,
    setRoute,
    getMenuList,
    updateMenus,
    generateRoutes,
    clearRoutes
  }
})

function filterMenus(
  permission: string[],
  list: menusF[],
  arr = [] as menusF[]
) {
  list.forEach((m) => {
    if (permission?.includes(m.permission)) {
      arr.push(m)
    }
    if (m.children && m.children.length > 0) {
      filterMenus(permission, m.children, arr)
    }
  })
  return arr
}

function getMenus(menus: menusF[], selectMenu: menusF[], arr = [] as menusF[]) {
  selectMenu.forEach((s) => {
    const item = menus.find((m) => m.id === s.fId)
    if (item) {
      const index = arr.findIndex((item) => item.id === s.fId)
      if (index < 0) {
        arr.push({
          ...item,
          children: [
            {
              ...s,
              children: []
            }
          ]
        })
      } else {
        arr[index].children?.push({
          ...s,
          children: []
        })
      }
    } else {
      menus.forEach((m) => {
        if (m.children && m.children.length > 0) {
          getMenus(m.children, selectMenu, arr)
        }
      })
    }
  })
  return arr
}

/** 过滤菜单状态为禁用的菜单 */
function filterStatus(list: menusF[]): menusF[] {
  return list
    .filter((s) => s.status === 'open')
    .map((s) => ({
      ...s,
      children: s.children ? filterStatus(s.children) : []
    }))
}

function filterRoute(menus: menusF[]) {
  const pageComps = Object.fromEntries(
    Object.entries(import.meta.glob('../../views/**/*.vue'))
      .filter((s) => !s[0]?.includes('/component') && s[0]?.includes('main'))
      .map(([key, value]) => [
        key.replace('../../views/main', '').replace(/\/[^/]*\.vue$/, ''), // 处理成对象的键
        value
      ])
  )
  const routes: RouteRecordRaw[] = menus
    .filter((m) => m.status === 'open')
    .map((r) => {
      let pageKey = r.path
      if (/:[^/]+/.test(r.path)) {
        pageKey = r.path.replace(/\/:[^/]+/g, '')
      } else {
        pageKey = r.path
      }
      const newRoute = {
        name: r.name,
        id: r.id,
        component: pageComps[pageKey],
        path: r?.path,
        meta: {
          icon: r.icon,
          cache: r.cache,
          outChain: r.outChain,
          permission: r.permission,
          showMenu: r.showMenu,
          sort: r.sort,
          status: r.status,
          title: r.title,
          menuType: r.menuType
        },
        children: r.children ? filterRoute(r.children) : []
      }
      return newRoute
    })
  return routes
}

function extractDynamicRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  routes.forEach((route) => {
    if (
      route.meta?.menuType === 'menu' &&
      route.children &&
      route.children.length > 0
    ) {
      const newRoute = { ...route, children: [] }
      result.push(newRoute)

      route.children.forEach((child) => {
        if (child.meta?.menuType === 'menu') {
          result.push(child)
        }
      })
    } else {
      if (route.children) {
        route.children = extractDynamicRoutes(route.children)
      }
      result.push(route)
    }
  })

  return result
}
