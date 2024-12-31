import axios, { AxiosResponse } from 'axios'

const apiList = {
  getLocationIp: {
    url: 'https://api.map.baidu.com/location/ip',
    ak: process.env.BaiduApiAk,
    getQueryUrl: function (ip: string) {
      return `${this.url}?ip=${ip}&coor=bd09ll&ak=${this.ak}`
    }
  },
  getWeather: {
    url: 'https://api.map.baidu.com/weather/v1/',
    ak: process.env.BaiduApiAk,
    getQueryUrl: function (district_id: string) {
      return `${this.url}?data_type=all&ak=${this.ak}&district_id=${district_id}`
    }
  }
}

/** 获取ip */
export const getLocationIp = (ip: string) => {
  const queryUrl = apiList.getLocationIp.getQueryUrl(ip)
  return new Promise((resolve, reject) => {
    axios
      .get(queryUrl)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject('请求异常: ' + err.message)
      })
  })
}

/** 获取天气 */
export const getWeather = (district_id: string) => {
  const queryUrl = apiList.getWeather.getQueryUrl(district_id)
  return new Promise((resolve, reject) => {
    axios
      .get(queryUrl)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject('请求异常: ' + err.message)
      })
  })
}
