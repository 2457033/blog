import { getLocationIp } from '@/config/baiduApi'
import { homeModel } from '@/models/admin/home.model'
import { utcNow } from '@/utils/common'
import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'
import useragent from 'useragent'

class HomeController {
  // 获取首页数据
  async getHomeData(_req: Request, res: Response) {
    try {
      const result = await homeModel.getHomeData()
      const data = {
        usersCount: result?.usersCount || 0,
        blogsCount: result?.blogsCount || 0,
        visitCount: result?.visitCount || 0,
        rolesCount: result?.rolesCount || 0
      }
      responseHandler.success(res, data)
    } catch (error) {
      responseHandler.error(res, '获取失败')
    }
  }

  // 获取访问量
  async getVisitCount(req: Request, res: Response) {
    const { visitType } = req.body
    if (!visitType) {
      responseHandler.error(res, '缺少查询时间类型')
      return
    }
    const result = await homeModel.getVisitCount(visitType)
    responseHandler.success(res, result)
  }

  // 获取ip信息
  async getIpInfo(_req: Request, res: Response) {
    const ips = await homeModel.getIpInfo()
    let dates = []
    try {
      for (const ip of ips) {
        const responese: any = await getLocationIp(ip)
        if (responese.status === 2) {
          continue
        }
        console.log(responese)
        if (responese.status !== 2) {
          dates.push({
            name: responese?.content?.address_detail.city,
            value: [
              Number(responese?.content.point.x),
              Number(responese?.content.point.y)
            ]
          })
        }
      }
      responseHandler.success(res, dates)
    } catch (error) {
      responseHandler.error(res, '获取失败')
    }
  }

  // 获取设备或访问量
  async getDeviceOrVisitCount(req: Request, res: Response) {
    const { type } = req.body
    if (!type) {
      responseHandler.error(res, '缺少查询时间类型')
      return
    }
    const result = await homeModel.getDeviceOrVisitCount(type)
    responseHandler.success(res, result)
  }

  // 记录访问日志
  async recordVisit(req: Request, res: Response) {
    const { url, title } = req.body
    const userIp = req.ip || req.connection.remoteAddress
    const userAgent = req.headers['user-agent']
    const referrer = req.headers['referer']
    const userId = req.tokenPayload ? req.tokenPayload.id : null
    const agent = useragent.parse(userAgent)
    const device = filterDevice(agent.os.toString())
    const browser = agent.family
    const visitTime = utcNow()
    const data = {
      url,
      title,
      userIp: userIp!,
      device,
      referrer: referrer!,
      userId: String(userId),
      browser,
      visitTime
    }
    await homeModel.recordVisit(data)
    responseHandler.success(res, null)
  }
}

// 过滤设备
function filterDevice(value: string) {
  if (
    value?.includes('macOS') ||
    value?.includes('Macintosh') ||
    value?.includes('Windows')
  ) {
    return 'PC'
  } else {
    return '手机'
  }
}

export const homeController = new HomeController()
