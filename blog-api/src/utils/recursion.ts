import crypto from 'crypto'
import { filterTime } from './common'
export const verifyPassword = (password: string) => {
  return crypto.createHash('md5').update(password).digest('hex')
}

export const toTree = (arr: any[], fId: string) => {
  let children: any[] = []
  if (arr.length > 0) {
    arr?.forEach((s) => {
      s.createTime = filterTime(s.createTime)
      if (s.fId === fId) {
        children.push({
          ...s,
          statusValue: s.status === 'open' ? '正常' : '停用',
          children: toTree(arr, s.id)
        })
      }
    })
  }
  if (children.length <= 0) {
    return
  }
  return children
}

export const toSort = (arr: any[], sortBy = 'sort') => {
  // 如果数组为空，则直接返回空数组
  if (arr?.length === 0) return []

  if (arr && arr.length > 0) {
    // 对数组进行排序
    arr.sort(function (a, b) {
      // 假设 a 和 b 都有 sortBy 属性，这里我们返回它们的差值
      // 如果 sortBy 不是数字，你可能需要将它转换为数字或使用其他比较逻辑
      return a[sortBy] - b[sortBy] // 或者使用 String.prototype.localeCompare 如果 sortBy 是字符串
    })

    // 遍历数组中的每个元素，如果元素有子数组，则递归调用 toSort
    arr.forEach((item) => {
      // 假设 item.children 是子数组
      if (Array.isArray(item.children)) {
        item.children = toSort(item.children, sortBy) // 递归调用
      }
    })
  }
  // 返回排序后的数组
  return arr
}

export const generateRandomName = (length: number) => {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const generateRandomPhone = (length: number) => {
  let result = ''
  const chars = '1234567890'
  const charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
