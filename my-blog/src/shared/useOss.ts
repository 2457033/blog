import { getAliOssToken } from '@/api/alioss'
import * as uuid from 'uuid'
import OSS from 'ali-oss'
import { message } from 'antd'

const { VITE_ALIOSS_BUCKET, VITE_ALIOSS_Region } = import.meta.env

export const ossUploadFile = async (file: File) => {
  let result
  await getAliOssToken().then(async (res) => {
    const { AccessKeyId, AccessKeySecret, SecurityToken } = res.data
    const client = new OSS({
      region: VITE_ALIOSS_Region,
      bucket: VITE_ALIOSS_BUCKET,
      accessKeyId: AccessKeyId,
      accessKeySecret: AccessKeySecret,
      stsToken: SecurityToken,
      refreshSTSToken: async () => {
        const refreshToken = await getAliOssToken()
        const { AccessKeyId, AccessKeySecret, SecurityToken } =
          refreshToken.data
        return {
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken
        }
      }
    })
    try {
      result = await client.put(uuid.v4() + '-' + file.name, file)
    } catch (e) {
      console.log(e)
      message.error('上传失败')
      return
    }
  })
  return result
}

export const getBucketStat = async () => {
  await getAliOssToken().then(async (res) => {
    const { AccessKeyId, AccessKeySecret, SecurityToken } = res.data
    const client = new OSS({
      region: VITE_ALIOSS_Region,
      bucket: VITE_ALIOSS_BUCKET,
      accessKeyId: AccessKeyId,
      accessKeySecret: AccessKeySecret,
      stsToken: SecurityToken,
      refreshSTSToken: async () => {
        const refreshToken = await getAliOssToken()
        const { AccessKeyId, AccessKeySecret, SecurityToken } =
          refreshToken.data
        return {
          accessKeyId: AccessKeyId,
          accessKeySecret: AccessKeySecret,
          stsToken: SecurityToken
        }
      }
    })
    try {
      const result = await client.list(null, {})
      console.log(result.objects)
    } catch (error) {
      console.error('获取Bucket统计信息时出错', error)
    }
  })
}
