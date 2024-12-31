import { Application, Response } from 'express'

class ResponseHandler {
  success(res: Response, data: any, msg = '操作成功', code = 200) {
    return res.send({
      code,
      msg,
      data
    })
  }

  successList(
    res: Response,
    data: { row: any[]; total: number },
    code = 200,
    msg = '操作成功'
  ) {
    return res.send({
      code,
      msg,
      data
    })
  }

  error(res: Response, msg = '操作失败', code = 400) {
    return res.send({
      code,
      msg
    })
  }

  customError(res: Response, { code, msg }: { code: number; msg: string }) {
    return res.status(code).send({
      code,
      msg
    })
  }
}

export const responseHandler = new ResponseHandler()
