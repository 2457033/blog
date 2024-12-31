import request from '@/request'

export interface homeInfo {
  usersCount: Number
  blogsCount: Number
  fileSize: Number
  rolesCount: Number
}

interface data {
  name: string
  value: number
}
export interface DeviceOrvisitAndCount {
  deviceInfo: {
    group: data[]
    total: number
  }
  visitInfo: {
    group: data[]
    total: number
  }
}

export const getHomeInfo = () => {
  return request.get<homeInfo>('/api/home')
}

export const postVisitCount = (visitType: string) => {
  return request.post('/api/home/visitCount', { visitType })
}

export const getHomeIpInfo = () => {
  return request.get('/api/home/ipInfo')
}

export const postVisitRecord = (url: string, title: string) => {
  return request.post('/api/home/record', { url, title })
}

export const postDeviceOrvisitAndCount = (type: string) => {
  return request.post<DeviceOrvisitAndCount>(
    '/api/home/deviceOrvisitAndCount',
    { type }
  )
}
