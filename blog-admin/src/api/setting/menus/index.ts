import request from '@/request'

export interface menusBody {
  title: string
  status: string
  pageNum?: number
  pageSize?: number
}

export interface menusF {
  meta: any
  fId: string
  icon: string
  id: string
  name: string
  path: string
  title: string
  createTime: string
  showMenu: number
  sort: number
  permission: string
  outChain: number
  cache: number
  query: string
  menuType: string
  children?: menusF[]
  statusValue: string
  status: string
}

export interface MenusUpdateF {
  icon: string
  title: string
  name: string
  path: string
  status: string
  id: string
  sort: number
  menuType: string
  showMenu: number
  outChain: number
  permission: string
  cache: number
  query: string
}

export interface MenusAddF {
  icon: string
  title: string
  name: string
  path: string
  status: string
  sort: number
  fId: string
  menuType: string
  showMenu: number
  outChain: number
  permission: string
  cache: number
  query: string
}

export const getMenus = () => {
  return request.get<menusF[]>('/api/menus')
}

export const getMenusList = () => {
  return request.get<menusF[]>('/api/menus/list')
}

export const postMenusAll = (data: menusBody) => {
  return request.post<menusF[]>('/api/menus/all', data)
}

export const postMenusUpdate = (data: MenusUpdateF) => {
  return request.post('/api/menus/update', data)
}

export const postMenusAdd = (data: MenusAddF) => {
  return request.post('/api/menus/add', data)
}

export const postMenusDelete = (id: string) => {
  return request.post('/api/menus/delete', { id })
}
