import { responseHandler } from '@/utils/response'
import { Request, Response } from 'express'
import { STS } from 'ali-oss'

class AliossController {
  async sts(req: Request, res: Response) {
    const { AccessKeyId, AccessKeySecret, ARN } = process.env
    let sts = new STS({
      accessKeyId: AccessKeyId!,
      accessKeySecret: AccessKeySecret!
    })
    sts
      .assumeRole(ARN!, ``, 3000, 'sessiontest')
      .then((result) => {
        responseHandler.success(res, result.credentials)
      })
      .catch((err) => {
        responseHandler.error(res, err.message)
      })
  }
}

export const aliossController = new AliossController()
