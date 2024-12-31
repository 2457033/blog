import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err)
  res.status(500).send({
    code: 500,
    message: '服务器内部错误'
  })
}
