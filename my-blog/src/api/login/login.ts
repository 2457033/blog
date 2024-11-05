import request from '@/request'

export interface LoginQ {
  userName?: string
  password?: string
  code?: string
}

/** 登录 */
export const postLogin = (data: LoginQ) => {
  return request.post('/api/backend/users/login', data)
}
