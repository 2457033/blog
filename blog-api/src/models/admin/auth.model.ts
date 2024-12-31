import { Query } from '@/config/mysql'

interface loginData {
  userName: string
  password: string
  phone: string
  code: string
}

class AuthModel {
  async login(data: loginData) {
    const { userName, password, phone, code } = data
    const sql = `SELECT u.*, r.permission, r.selectIds, r.role, r.status as roleStatus FROM users u 
                left join user_of_role ur on ur.userId = u.id
                left join role r on r.id = ur.roleId
                WHERE (u.userName=? AND u.password=MD5(?)) or (u.phone=? AND u.password=MD5(?))`
    const result = await Query(sql, [userName, password, phone, password])
    return result
  }
  async getUserInfo(id: string | number) {
    const sql = `select u.id, u.icon, u.createTime, u.nickName, u.phone, u.userName, u.sex, r.role, r.roleName, r.permission, r.selectIds, r.remark from users u
                left join user_of_role ur on ur.userId = u.id
                left join role r on r.id = ur.roleId
                where u.id = ?`
    const result = (await Query(sql, [id])).at(0)
    return result
  }
}

export const authModel = new AuthModel()
