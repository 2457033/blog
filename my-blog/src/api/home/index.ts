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

export interface NewInfo {
  article: Article[]
  comment: Comment[]
}

interface Article {
  id: number
  title: string
  createTime: string
  visitCount: number
}

interface Comment {
  blogId: number
  nickName: string | undefined
  icon: string | undefined
  id: number
  title: string
  message: string
  createTime: string
}

/** 首页信息 */
export const getHomeList = () => {
  return request.get<HomeListD>('/api/reception/home/list')
}

/** 最新文章和评论 */
export const getNewInfo = () => {
  return request.get<NewInfo>('/api/reception/home/newInfo')
}
