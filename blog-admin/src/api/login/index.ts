import { UserInfo } from '@/pinia'
import request from '@/request'

export interface loginF {
  userName?: string
  password?: string
  phone?: string
  code?: string
}

export const postLogin = (data: loginF) => {
  return request.post('/api/users/login', data)
}

export const postUserInfo = (id: string) => {
  return request.post<UserInfo>('/api/users/info', { id })
}