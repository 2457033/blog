export interface ResultData<T = any> {
  code: number
  msg: string
  data: T | any
}
