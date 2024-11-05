var express = require('express')
var router = express.Router()
const db = require('../../../db')
const uuid = require('uuid')
const tokenServer = require('../../../utils/token')
const { utcNow, filterTime } = require('../../../utils/common')
const { checkPermission } = require('../../../utils/permission')
const { generateRandomName, generateRandomPhone } = require('../../../utils/generate')
const XLSX = require('xlsx')
const multer = require('multer')
const fs = require('fs')
const iconv = require('iconv-lite')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/user_avatar'); // 上传的文件将保存在uploads文件夹中
  },
  filename: function (req, file, cb) {
    const { id } = req.tokenPayload
    const decodedName = iconv.decode(Buffer.from(uuid.v4() + '-' + `[userId-${id}]` + '-' + file.originalname, 'binary'), 'utf8');
    cb(null, decodedName); // 保留原始文件名
  }
});

const upload = multer({ storage: storage });

async function getName() {
  let userName = generateRandomName(7)
  const responese = await db(`select userName from users where userName = ?`, [userName])
  if (responese.length > 0) {
    getName()
  }
  return userName
}
async function getPhone() {
  let phone = generateRandomPhone(11)
  const responese = await db(`select phone from users where phone = ?`, [phone])
  if (responese.length > 0) {
    getPhone()
  }
  return phone
}

/** 用户管理 *//////////////
/** 下载模板 */
router.post('/downloadTem', async (req, res, next) => {
  const length = (await db(`select count(id) as count from users`))?.at().count
  let userName = await getName()
  let phone = await getPhone()
  const excelData = [
    ['用户名称', '用户密码', '用户昵称', '手机号码', '用户性别', '状态'],
    [userName, '123456', userName, phone, 'unknown', '正常']
  ]
  const wb = XLSX.utils.book_new()

  // 将二维数组转换为工作表
  const ws = XLSX.utils.aoa_to_sheet(excelData)

  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, "下载模板表")

  // 写入文件
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('导出数据.xlsx'));

  res.send(buffer)
})

/** 导出 */
router.post('/export', checkPermission('system:user:export'), async (req, res, next) => {
  const { pageNum, pageSize, userName, phone, status } = req.body
  let sql = `select u.id, userName, phone, icon, nickName, u.createTime, u.status, sex, u.remark, ur.roleId from users u left join user_of_role ur on ur.userId = u.id`
  let whereClause = '';
  let params = []

  if (userName) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` userName LIKE ?`;
    params.push(`%${userName}%`)
  }

  if (phone) {
    if (whereClause) whereClause += ' AND';
    whereClause += ` phone LIKE ?`;
    params.push(`%${phone}%`)
  }

  if (status !== undefined) { // 假设 status 可以是 null 或其他非数字值，这里使用 !== undefined 来判断
    if (whereClause) whereClause += ' AND';
    whereClause += ` status = ?`;
    params.push(status)
  }

  if (whereClause) {
    sql += ` WHERE ${whereClause}`;
  }

  const num = (pageNum - 1) * pageSize

  sql += ` ORDER BY id LIMIT ? OFFSET ?`;
  params.push(pageSize, num)
  const responese = await db(sql, params);
  const excelData = [
    ['用户编号', '用户名称', '用户昵称', '手机号码', '状态', '创建时间'],
    ...responese?.map(item => [item.id, item.userName, item.nickName, item.phone, item.status === 1 ? '正常' : '停用', filterTime(item.createTime)])
  ]
  const wb = XLSX.utils.book_new()

  // 将二维数组转换为工作表
  const ws = XLSX.utils.aoa_to_sheet(excelData)

  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, "导出表")

  // 写入文件
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('导出数据.xlsx'));

  res.send(buffer)
})

/** 导入 */
router.post('/import', checkPermission('system:user:import'), upload.single('file'), async (req, res, next) => {
  const { file } = req
  if (!file) {
    res.status(400).send({
      msg: '未找到上传的文件'
    });
  }
  let data = []
  let msg = ''
  const workbook = XLSX.readFile(file.path)
  for (let sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // 这里可以处理 sheet 数据，例如将其转换为 JSON
    data = XLSX.utils.sheet_to_json(sheet)
    if (data.length > 0) {
      for (let s of data) {
        const responese = await db(`select userName from users where userName = ?`, s['用户名称'])
        if (responese.length > 0) {
          if (msg) msg += '<br>'
          msg += `已有用户名为${s['用户名称']}的用户`
        } else {
          const responese = (await db(`select id from users order by CAST(id AS UNSIGNED) DESC limit 1`))?.at()
          let params = [`${parseInt(responese?.id) + 1}`, s['用户名称'], s['用户密码'], s['手机号码'], 'https://img0.baidu.com/it/u=365878481,4199784825&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1718470800&t=7a0922588019d3d8db1084a3e3859c1a', s['用户昵称'], s['用户性别'], 1, `${utcNow()}`]
          await db(
            `INSERT INTO users(id, userName, password, phone, code, icon, nickName, sex, status, remark, createTime) 
                    VALUES (
                    ?, ?, MD5(?), ?, null, ?,
                    ?, ?, ?, null,?);`,
            params
          )
        }
      }
    }
  }
  res.send({
    msg: '操作成功',
    data: msg
  })
  fs.unlink(file.path, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log(file.filename + '已被删除');
  })
})

/** 修改用户头像 */
router.post('/update/avtar', async (req, res, next) => {
  const { url } = req.body
  const { id } = req.tokenPayload
  if (!url) {
    return res.status(400).send({
      msg: '未找到上传的路径'
    });
  }
  if (!id) {
    return res.status(401).send({
      msg: '未找到token携带的id'
    });
  }
  await db('update users set icon = ? where id = ?', [url, id])
  res.status(200).send({
    msg: '操作成功',
    code: 200
  })
})
////////////////////////////

module.exports = router