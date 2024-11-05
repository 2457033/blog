import request from '@/request'

/** 个人信息 */
export const postUserInfo = () => {
  return request.post('/api/backend/users/info')
}
