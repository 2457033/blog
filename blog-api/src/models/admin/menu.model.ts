import { Query } from '@/config/mysql'
import { filterTime, utcNow } from '@/utils/common'
import { toSort, toTree } from '@/utils/recursion'
import { v4 as uuidv4 } from 'uuid'
interface updateMenu {
  icon: string
  title: string
  name: string
  path: string
  status: string
  id: string
  sort: number
  menuType: string
  showMenu: number
  outChain: number
  permission: string
  cache: number
  query: string
}

interface addMenu extends Omit<updateMenu, 'id'> {
  fId: string
}

class MenuModel {
  async getMenu() {
    const menus = await Query(`SELECT * FROM menus 
      WHERE status = 'open' 
      AND (menuType != 'button' OR menuType IS NULL)
      ORDER BY sort;`)
    const arr: any[] = []
    if (menus) {
      menus.forEach((menu) => {
        if (!menu.fId) {
          arr.push({
            ...menu,
            statusValue: menu.status === 'open' ? '正常' : '停用',
            children: []
          })
        }
      })
    }

    arr.forEach((s) => {
      s.children = toTree(menus, s.id)
      s.children = toSort(s.children)
    })

    return arr
  }

  async getMenuList() {
    const [menus, allMenus] = await Promise.all([
      Query(
        `select * from menus where status = 'open' and fId is null and (menuType = 'menu' and permission is not null) or menuType != 'menu' ORDER BY sort`
      ),
      Query(`select * from menus where permission is not null`)
    ])

    const arr: any[] = []
    if (menus) {
      menus.forEach((menu) => {
        if (!menu.fId) {
          arr.push({
            ...menu,
            statusValue: menu.status === 'open' ? '正常' : '停用',
            children: []
          })
        }
      })
    }

    arr.forEach((s) => {
      s.children = toTree(allMenus, s.id)
      s.children = toSort(s.children)
    })

    return arr
  }

  async getMenuAll(data: {
    title: string
    status: string
    pageSize: number
    pageNum: number
  }) {
    const { title, status, pageSize, pageNum } = data
    let sql = 'select * from menus where fId is null'
    let params = []
    let paramsCount = []

    let whereClause = ''
    if (title) {
      whereClause += ` and title like ?`
      params.push(`%${title}%`)
      paramsCount.push(`%${title}%`)
    }

    if (status) {
      whereClause += ` and status = ?`
      params.push(status)
      paramsCount.push(status)
    }

    if (whereClause) {
      sql += `${whereClause}`
    }

    const num = (pageNum - 1) * pageSize
    const sqlCount = sql + ` ORDER BY sort`
    const sqlList = sql + ` ORDER BY sort limit ? offset ?`
    params.push(pageSize, num)
    const [count, result, allMenus] = await Promise.all([
      Query(sqlCount, paramsCount),
      Query(sqlList, params),
      Query(`select * from menus`)
    ])

    const arr: any[] = []
    if (result) {
      result.forEach((s) => {
        s.createTime = filterTime(s.createTime)
        if (!s.fId) {
          arr.push({
            ...s,
            statusValue: s.status === 'open' ? '正常' : '停用'
          })
        }
      })
    }

    arr.forEach((s) => {
      s.children = toTree(allMenus, s.id)
      s.children = toSort(s.children)
    })

    return {
      row: arr,
      total: count.length || 0
    }
  }

  async updateMenu(data: updateMenu) {
    const {
      icon,
      title,
      name,
      path,
      status,
      id,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = data
    const iconF = icon == undefined ? null : `${icon}`
    const pathF = path == undefined ? null : `${path}`
    const permissionF =
      permission == undefined || !permission ? null : `${permission}`
    const queryF = query == undefined ? null : `${query}`
    const nameF = name == undefined ? null : `${name}`

    let params = [
      iconF,
      title,
      nameF,
      pathF,
      status,
      `${sort || null}`,
      menuType,
      showMenu,
      outChain,
      permissionF,
      cache,
      queryF,
      id
    ]

    await Query(
      `UPDATE menus SET 
      icon = ?, 
      title = ?,
      name = ?, 
      path = ?, 
      status = ?, 
      sort = ?, 
      menuType = ?, 
      showMenu = ?, 
      outChain=?, 
      permission=?, 
      cache=?, 
      query=?  
      WHERE id = ?;`,
      params
    )
  }

  async addMenu(data: addMenu) {
    const {
      fId,
      title,
      status,
      icon,
      name,
      path,
      sort,
      menuType,
      showMenu,
      outChain,
      permission,
      cache,
      query
    } = data
    const fIdF = fId == undefined ? null : `${fId}`
    const iconF = icon == undefined ? null : `${icon}`
    const pathF = path == undefined ? null : `${path}`
    const permissionF = permission == undefined ? null : `${permission}`
    const queryF = query == undefined ? null : `${query}`
    const nameF = name == undefined ? null : `${name}`

    let params = [
      uuidv4(),
      fIdF,
      iconF,
      title,
      nameF,
      pathF,
      status,
      sort,
      menuType,
      showMenu,
      outChain,
      permissionF,
      cache,
      queryF,
      `${utcNow()}`
    ]

    await Query(
      `INSERT INTO menus(id, fId, icon, title, name, path, status, sort, menuType, showMenu, outChain, permission, cache, query, createTime) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      params
    )
  }

  async deleteMenu(id: string) {
    await Query(`delete from menus where id=?`, [id])
  }
}

export const menuModel = new MenuModel()
