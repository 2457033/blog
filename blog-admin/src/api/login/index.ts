import { UserInfo } from '@/pinia'
import request from '@/request'

export interface loginF {
  userName?: string
  password?: string
  phone?: string
  code?: string
}

export const postLogin = (data: loginF) => {
  return request.post('/api/auth/login', data)
}

export const getUserInfo = () => {
  return request.get<UserInfo>('/api/auth/info')
}
