import axios, { AxiosError, AxiosResponse } from 'axios'
import { ResultData } from './types'
import { message, notification } from 'antd'
import store from '@/redux'

const { VITE_BASE_URL } = import.meta.env

const defaultResult = {
  code: 200,
  data: null,
  msg: '请求成功'
}

const errorToResult = (err: any) => {
  const { code, message } = err
  return {
    status: code.toString(),
    desc: message
  }
}

/** 异常捕获 */
const errorCapture = (err: AxiosError) => {
  return new Promise<ResultData>((resolve, reject) => {
    // Shallow copy
    const errResult = Object.assign({}, defaultResult, {
      code: 400,
      msg: err.message
    })

    const errMessage = err?.message

    if (errMessage) {
      const { status, statusText, data }: any = err.response ?? {}

      if (data) {
        errResult.msg = data.msg
      } else if (statusText) {
        if (statusText.startsWith('Internal Server Error')) {
          errResult.msg = '内部服务器错误，请稍后请求'
        } else {
          errResult.msg = statusText
        }
      } else {
        if (errMessage.startsWith('Network Error')) {
          errResult.msg = '网络异常，请检查网络'
        } else if (errMessage.startsWith('timeout of 10000ms exceeded')) {
          errResult.msg = '请求超时，请检查网络或重新请求'
        } else {
          errResult.msg = errMessage
        }
      }

      if (status !== null || status !== undefined) {
        errResult.code = status
      }

      return resolve(errResult)
    }
    errResult.msg = err.toString()
    reject(errResult)
  })
}

function handleCode(code: number): void {
  switch (code) {
    case 401:
      message.error('登录失败，请重新登录')
      localStorage.removeItem('user_token')
      // router.replace({
      //   path: '/login'
      // })
      break
    case 403:
      notification.error({
        description: '错误消息',
        message: '暂无权限,请联系管理员',
        duration: 3000
      })
      break
    case 423:
      notification.error({
        description: '错误消息',
        message: '该账户已被禁用，请联系管理员',
        duration: 3000
      })
      break
    case 453:
      notification.error({
        description: '错误消息',
        message: '该账户未绑定角色，请联系管理员',
        duration: 3000
      })
      break
    case 473:
      notification.error({
        description: '错误消息',
        message: '该账户绑定的角色已被禁用，请联系管理员',
        duration: 3000
      })
      break
    default:
      message.error('请求失败')
      break
  }
}

const instance = axios.create({
  baseURL: VITE_BASE_URL,
  /** 请求超时 默认：30s */
  timeout: 1000 * 30
  // withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    const token = store.getState().userInfo.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) =>
    errorCapture(error).then((err) => {
      message.warning(err.msg)
      return Promise.reject(errorToResult(err))
    })
)

/** 响应拦截 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response // 解构
    // if (data.code === 401) {
    //   // 登录信息失效，应跳转到登录页面，并清空本地的token
    //   localStorage.removeItem('user_token')
    //   router.replace({
    //     path: '/login'
    //   })
    //   handleCode(data.code)
    //   return Promise.reject(data)
    // }
    // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
    if (data.code === 400) {
      message.error(data.msg)
      return Promise.reject(data)
    }
    if (data.code && data.code !== 200) {
      handleCode(data.code) // 此处也可以使用组件提示报错信息
      return Promise.reject(data)
    }
    return data
  },
  (error: AxiosError) => {
    const { response } = error
    if (response) {
      handleCode(response.status)
      return Promise.reject(response.data)
    }
    if (!window.navigator.onLine) {
      message.error('网络连接失败')
      // 可以跳转到错误页面，也可以不做操作
      // return router.replace({
      //   path: '/error'
      // })
    }

    if (error.code === 'ERR_NETWORK') {
      notification.error({
        description: error.message,
        message: '服务器内部错误!!!',
        duration: 2000
      })
      return Promise.reject(error.message)
    }
  }
)

class CreateAxios {
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return instance.get(url, { params })
  }

  post<T>(url: string, data?: any, config?: any): Promise<ResultData<T>> {
    return instance.post(url, data, config)
  }

  put<T>(url: string, data?: any): Promise<ResultData<T>> {
    return instance.put(url, data)
  }

  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return instance.delete(url, { params })
  }

  upload<T>(
    url: string,
    file: File, // 上传的文件
    additionalData: Record<string, any> = {}, // 额外的数据
    config: any = {} // 额外的配置
  ): Promise<ResultData<T>> {
    // 创建一个 FormData 实例，用于存放文件和其他数据
    const formData = new FormData()

    // 添加文件到 FormData 中
    formData.append('file', file)

    // 如果有额外的数据，将其添加到 FormData 中
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key])
    })

    return instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers // 合并用户自定义的 headers
      },
      ...config
    })
  }
}

const request = new CreateAxios()

export default request
