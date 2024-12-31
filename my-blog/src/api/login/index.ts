import request from '@/request'

export interface LoginQ {
  userName?: string
  password?: string
  code?: string
}

/** 登录 */
export const postLogin = (data: LoginQ) => {
  return request.post('/api/reception/auth/login', data)
}

/** 个人信息 */
export const getUserInfo = () => {
  return request.get('/api/reception/auth/info')
}
