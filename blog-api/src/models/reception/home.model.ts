import { getLocationIp, getWeather } from '@/config/baiduApi'
import { Query } from '@/config/mysql'
import { filterTime } from '@/utils/common'

class HomeModel {
  /** 获取首页数据 */
  async getHomeList(ip: string) {
    const swipers = await Query(
      `select id, img, sort, createTime from blog_swiper where imgStatus = 1`
    )
    const ipInfo: any = await getLocationIp(ip)
    let nowWeather: any = {}
    if (ipInfo.status === 0) {
      const { address_detail } = ipInfo?.content
      const weather: any = await getWeather(address_detail?.adcode)
      const { now } = weather?.result
      nowWeather = weather?.result
      nowWeather.status = 200
    } else {
      nowWeather.status = 400
      nowWeather.msg = '当前ip无法查看天气'
    }
    return {
      swipers,
      weather: nowWeather
    }
  }

  /** 获取最新文章和评论 */
  async getNewInfo() {
    const [article, comment] = await Promise.all([
      Query(
        'select b.id, b.title, b.createTime, count(DISTINCT bv.userId) as visitCount from blog b left join blog_visit bv on b.id = bv.blogId where b.blogType = 1 GROUP BY bv.blogId order by b.createTime limit 5'
      ),
      Query(`select bc.id, b.id as blogId, b.title, bc.message, bc.createTime, u.nickName, u.icon from blog b 
        join blog_common bc on b.id = bc.blogId
        left join users u on bc.userId = u.id
        where b.blogType = 1 
        order by b.createTime limit 10`)
    ])
    article.forEach((item) => {
      item.createTime = filterTime(item.createTime)
    })
    comment.forEach((item) => {
      item.createTime = filterTime(item.createTime)
    })
    return {
      article,
      comment
    }
  }
}

export const homeModel = new HomeModel()
