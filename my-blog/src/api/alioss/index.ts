import request from '@/request'

interface aliOssD {
  AccessKeyId: string
  AccessKeySecret: string
  Expiration: string
  SecurityToken: string
}

/** 获取token */
export const getAliOssToken = () => {
  return request.get<aliOssD>('/api/alioss/sts')
}
