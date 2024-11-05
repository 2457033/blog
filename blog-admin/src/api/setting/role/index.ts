import request from '@/request'

export interface roleF {
  role: string
  roleName: string
  status: number
  createStartTime: string
  createEndTime: string
  pageNum?: number
  pageSize?: number
}

export interface Row {
  id: string
  role: string
  roleName: string
  permission: string
  sort: number
  status: number
  remark: string
  selectIds?: string[]
  createTime: string
}

export interface roleListF {
  row: Row[]
  total: number
}

interface roleAddF {
  roleName: string
  role: string
  sort: number
  status: number
  selectIds?: string[]
  halfSelecteIds?: string[]
  remark: string
}

interface roleUpdateF extends roleAddF {
  id: string
}

interface roleUpdateStatusF {
  status: number
  id: string
}

interface unBindUserF {
  pageNum: number
  pageSize: number
}

interface BindUserF extends unBindUserF {
  roleId: string
}

interface unBindUserListF {
  row: unBindUserRow[]
  total: number
}

export interface unBindUserRow {
  id: string
  userName: string
  phone: string
  icon: string
  nickName: string
  createTime: string
  status: number
  sex: string
  remark: string
  roleId: string
}

interface bindUserF {
  userIds: string[]
  roleId: string
}

/** 列表 */
export const postRoleList = (data: roleF) => {
  return request.post<roleListF[]>('/api/role/list', data)
}

/** 增加 */
export const postRoleAdd = (data: roleAddF) => {
  return request.post('/api/role/add', data)
}

/** 修改某个角色 */
export const postRoleUpdate = (data: roleUpdateF) => {
  return request.post('/api/role/update', data)
}

/** 修改某个角色的状态 */
export const postRoleUpdateStatus = (data: roleUpdateStatusF) => {
  return request.post('/api/role/update/status', data)
}

/** 删除 */
export const getRoleDel = (id: string) => {
  return request.get('/api/role/delete', { id })
}

/** 获取未分配用户 */
export const postUnBindUserList = (data: unBindUserF) => {
  return request.post<unBindUserListF[]>('/api/role/unBindUser/list', data)
}

/** 获取已分配用户 */
export const postBindUserList = (data: BindUserF) => {
  return request.post<unBindUserListF[]>('/api/role/bindUser/list', data)
}

/** 分配用户 */
export const postBindUser = (data: bindUserF) => {
  return request.post('/api/role/bind', data)
}

/** 取消分配用户 */
export const postUnBindUser = (data: bindUserF) => {
  return request.post('/api/role/unBind', data)
}

/** 导出 */
export const postRoleExport = (data: roleF) => {
  return request.post('/api/role/export', data, {
    responseType: 'arraybuffer'
  })
}
