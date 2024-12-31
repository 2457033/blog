import { Query } from '@/config/mysql'
import { filterTime } from '@/utils/common'

interface loginData {
  userName: string
  password: string
  phone: string
  code: string
}

class AuthModel {
  async login(data: loginData) {
    const { userName, password, phone, code } = data
    let sql = `SELECT u.*, r.permission, r.selectIds, r.role, r.status as roleStatus FROM users u 
  left join user_of_role ur on ur.userId = u.id
  left join role r on r.id = ur.roleId
  WHERE (u.userName=? AND u.password=MD5(?)) or (u.phone=? AND u.password=MD5(?)) `
    const result = await Query(sql, [userName, password, phone, password])
    return result
  }
  async getUserInfo(id: string | number) {
    
    const result = (await Query(`
      select u.id, u.icon, u.createTime, u.nickName, u.phone, u.userName, u.sex, r.role, 
      r.roleName, r.permission, r.selectIds, r.remark, count(b.id) as articleCount,
      count(bv.id) as visitCount, count(bl.id) as likeCount
      from users u
      left join user_of_role ur on ur.userId = u.id
      left join role r on r.id = ur.roleId
      left join blog b on u.id = b.userId
      left join blog_visit bv on b.id = bv.blogId and u.id != bv.userId
      left join blog_like bl on b.id = bl.blogId and u.id != bl.userId
      where u.id = ? GROUP BY u.id;`, [id])).at(0)
    if (result?.createTime) {
      result.createTime = filterTime(result.createTime)
    }
    return result
  }
}

export const authModel = new AuthModel()
