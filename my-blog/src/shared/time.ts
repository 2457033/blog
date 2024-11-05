export const getNowTime = () => {
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
  const hoursF = Number(hours) > 23 ? Number(hours) - 24 : hours
  return `${year}-${month}-${date} ${hoursF}:${minutes}:${seconds}`
}
