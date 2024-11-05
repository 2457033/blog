// 获取随机字符串（长度默认6，可以通过参数修改）
const getValidCode = (len) => {
  let res = ''
  const resLen = len - 1 || 6
  for (let i = 0; i < resLen; i++) {
    res += Math.floor(Math.random() * 10)
  }
  return res
}

const getRanddomCode = (len) => {
  let res = ''
  const resLen = len - 1 || 6
  for (let i = 0; i < resLen; i++) {
    res += Math.floor(Math.random() * 10)
  }
  return res
}

// 获取当前时间（数字类型） 202303171530
const getDateNumStr = () => {
  // 当前时间
  const current = new Date()
  // 获取年
  const year = current.getFullYear()
  // 获取月
  const month = `${current.getMonth() + 1}`.padStart(2, '0')
  // 获取日
  const date = `${current.getDate()}`.padStart(2, '0')
  // 获取时
  const hours = `${current.getHours()}`.padStart(2, '0')

  // 获取分
  const minutes = `${current.getMinutes()}`.padStart(2, '0')
  // 获取秒
  const seconds = `${current.getSeconds()}`.padStart(2, '0')

  return `${year}${month}${date}${hours}${minutes}${seconds}`
}

const getOrderNo = () => {
  return `${getDateNumStr()}${getRanddomCode(8)}`
}

function filterHours(hours) {
  if (hours > 23) {
    hours = hours % 24;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    return hours
  }
}
const utcNow = () => {
  // 当前时间
  const current = new Date()
  // 获取年
  const year = current.getFullYear()
  // 获取月
  const month = `${current.getMonth() + 1}`.padStart(2, '0')
  // 获取日
  const date = `${current.getDate()}`.padStart(2, '0')
  // 获取时
  const hours = `${current.getHours()}`.padStart(2, '0')
  // 获取分
  const minutes = `${current.getMinutes()}`.padStart(2, '0')
  // 获取秒
  const seconds = `${current.getSeconds()}`.padStart(2, '0')
  const hoursF = hours > 23 ? hours - 24 : hours
  return `${year}-${month}-${date} ${hoursF}:${minutes}:${seconds}`
}

const formatISO = (ISOString) => {
  // 当前时间
  const current = new Date(ISOString)
  // 获取年
  const year = current.getUTCFullYear()
  // 获取月
  const month = `${current.getUTCMonth() + 1}`.padStart(2, '0')
  // 获取日
  const date = `${current.getUTCDate()}`.padStart(2, '0')
  // 获取时
  const hours = `${current.getUTCHours()}`.padStart(2, '0')
  // 获取分
  const minutes = `${current.getUTCMinutes()}`.padStart(2, '0')
  // 获取秒
  const seconds = `${current.getUTCSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

const arrayToTree = (
  jsonArr, // 数据源(数组)
  idStr = 'id', // 声明唯一id的属性名
  pidStr = 'parent_id', // 根据哪个属性进行查找父级
  childrenStr = 'children'
) => {
  // 存放的最终结果树数组
  const result = []
  const id = idStr
  const pid = pidStr
  const children = childrenStr
  const len = jsonArr.length

  // 遍历得到以id为键名的对象(建立整棵树的索引)
  const hash = {}
  jsonArr.forEach((item) => {
    hash[item[id]] = item
  })

  // {
  //   '100001':{
  //     ....
  //   },
  //   '100002':{
  //     ....
  //   }
  // }

  for (let j = 0; j < len; j++) {
    const jsonArrItem = jsonArr[j]
    const hashItem = hash[jsonArrItem[pid]]
    if (hashItem) {
      // 如果当前项还没有children属性，则添加该属性并设置为空数组
      !hashItem[children] && (hashItem[children] = [])
      hashItem[children].push(jsonArrItem)
    } else {
      result.push(jsonArrItem)
    }
  }
  return result
}

const filterTime = (time) => {
  const utcTime = new Date(time) // 解析为Date对象
  const chinaTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000) // 增加8小时得到中国时间

  // 将中国时间格式化为字符串
  const chinaTimeString = chinaTime
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '')

  return chinaTimeString
}

const getPastWeek = () => {
  const dates = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }
  return dates
}

const getPastMonth = () => {
  const dates = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }
  return dates
}

module.exports = {
  getValidCode,
  getRanddomCode,
  utcNow,
  formatISO,
  filterTime,
  getPastWeek,
  getPastMonth
}
