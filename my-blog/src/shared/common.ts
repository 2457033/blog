function formatDate(targetTime: string | number | Date) {
  const targetDate = new Date(targetTime)
  const currentYear = new Date().getFullYear()
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')

  if (year === currentYear) {
    return `${month}-${day}` // 当年省略年份
  } else {
    return `${year}-${month}-${day}` // 跨年显示年份
  }
}

export const filterCommentTime = (targetTime: string | number | Date) => {
  const now: any = new Date()
  const targetDate: any = new Date(targetTime)
  const diffTime = now - targetDate // 时间差（毫秒）

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) // 转换为天

  if (diffDays > 7) {
    // 超过 7 天，返回具体日期
    return formatDate(targetTime)
  } else if (diffDays >= 1) {
    return `${diffDays}天前`
  } else {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours >= 1) {
      return `${diffHours}小时前`
    } else {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return diffMinutes >= 1 ? `${diffMinutes}分钟前` : `刚刚`
    }
  }
}
