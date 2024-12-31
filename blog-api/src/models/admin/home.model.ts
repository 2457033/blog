import { Query } from '@/config/mysql'
import { getPastMonth, getPastWeek } from '@/utils/common'

interface recordData {
  url: string
  title: string
  userIp: string
  device: string
  referrer: string
  userId: string
  browser: string
  visitTime: string
}

class HomeModel {
  async getHomeData() {
    const result = (
      await Query(`
    select
    (select count(id) from users) as usersCount,
    (select count(userId) from blog) as blogsCount,
    (select count(DISTINCT userIp) from visit_logs) as visitCount,
    (select count(id) from role) as rolesCount
    `)
    )?.at(0)
    return result
  }

  async getVisitCount(visitType: string) {
    const times = visitType === 'past_week' ? getPastWeek() : getPastMonth()
    let dates = []
    for (let time of times) {
      const responese = (
        await Query(
          `select count(id) as visitCount from visit_logs where visitTime between ? and ?`,
          [time + ' 00:00:00', time + ' 23:59:59']
        )
      )?.at(0)
      dates.push(responese?.visitCount)
    }
    return {
      times,
      dates
    }
  }

  async getIpInfo() {
    const result = await Query(`select DISTINCT userIp from visit_logs`)
    return result
  }

  async getDeviceOrVisitCount(type: string) {
    const times = type === 'past_week' ? getPastWeek() : getPastMonth()
    const [deviceGroup, deviceCount, visitGroup, visitCount] =
      await Promise.all([
        Query(
          `select device as name, count(DISTINCT userIp) as value from visit_logs where visitTime between ? and ? group by device`,
          [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']
        ),
        Query(
          `select count(DISTINCT userIp) as count from visit_logs where visitTime between ? and ?`,
          [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']
        ),
        Query(
          `select title as name, count(id) as value from visit_logs where visitTime between ? and ? group by title`,
          [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']
        ),
        Query(
          `select count(id) as count from visit_logs where visitTime between ? and ?`,
          [times[0] + ' 00:00:00', times[times.length - 1] + ' 23:59:59']
        )
      ])
    const responese = {
      deviceInfo: {
        group: deviceGroup,
        total: deviceCount[0]?.count
      },
      visitInfo: {
        group: visitGroup,
        total: visitCount[0]?.count
      }
    }
    return responese
  }

  async recordVisit(data: recordData) {
    const { url, title, userIp, device, referrer, userId, browser, visitTime } =
      data
    const userIpFormat = userIp.replace('::ffff:', '')
    const result = await Query(
      `insert into visit_logs (url, userIp, device, title, referrer, userId, browser, visitTime) values(?, ?, ?, ?, ?, ?, ?, ?)`,
      [url, userIpFormat, device, title, referrer, userId, browser, visitTime]
    )
    return result
  }
}

export const homeModel = new HomeModel()
