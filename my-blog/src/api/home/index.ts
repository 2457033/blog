import request from '@/request'

export interface HomeListD {
  swipers?: Swiper[]
  weather?: Weather
}

interface Swiper {
  id: number
  img: string
  sort: number
  createTime: string
}

export interface Weather {
  location?: {
    country: string
    province: string
    city: string
    name: string
    id: string
  }
  now?: {
    text: string
    temp: number
    feels_like: number
    rh: number
    wind_class: string
    wind_dir: string
    uptime: string
  }
  forecasts: [
    {
      high: number
      low: number
      week: string
    }
  ]
  msg?: string
  status: number
}

/** 登录 */
export const getHomeList = () => {
  return request.get<HomeListD>('/api/backend/home/list')
}
