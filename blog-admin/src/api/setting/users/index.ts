import request from '@/request'

export interface usersF {
  userName: string
  phone: string
  status: number
  pageNum?: number
  pageSize?: number
}

export interface Row {
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

export interface usersListF {
  row: Row[]
  total: number
}

interface usersAddF {
  userName: string
  password: string
  phone: string
  nickName: string
  sex: string
  status: number
  remark: string
}

interface usersUpdateStatusF {
  status: number
  id: string
}

interface usersUpdateF {
  id: string
  phone: string
  nickName: string
  sex: string
  status?: number
  remark?: string
}

interface bindF {
  userId: string
  roleId: string
}

interface uptPwdF {
  oldPwd: string
  newPwd: string
}

export const postUsersList = (data: usersF) => {
  return request.post<usersListF[]>('/api/users/list', data)
}

export const postUsersAdd = (data: usersAddF) => {
  return request.post('/api/users/add', data)
}

export const postUsersUpdate = (data: usersUpdateF) => {
  return request.post('/api/users/update', data)
}

export const postUsersUpdateStatus = (data: usersUpdateStatusF) => {
  return request.post('/api/users/update/status', data)
}

// 删除角色
export const getUsersDel = (id: string) => {
  return request.get('/api/users/delete', { id })
}

// 绑定角色
export const postUsersBind = (data: bindF) => {
  return request.post('/api/users/bind', data)
}

// 取消绑定
export const postUsersUnBind = (data: bindF) => {
  return request.post('/api/users/unBind', data)
}

/** 导出 */
export const postUserExport = (data: usersF) => {
  return request.post('/api/users/export', data, {
    responseType: 'arraybuffer'
  })
}

/** 下载模板 */
export const postUserDownloadTem = () => {
  return request.post(
    '/api/users/downloadTem',
    {},
    {
      responseType: 'arraybuffer'
    }
  )
}

/** 上传头像 */
export const uploadUserUptAvtar = (url: string) => {
  return request.post('/api/users/update/avtar', { url })
}

/** 修改密码 */
export const postUptPwd = (data: uptPwdF) => {
  return request.post('/api/users/uptPwd', data)
}
