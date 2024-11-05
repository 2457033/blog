var express = require('express')
var router = express.Router()
const db = require('../../../db')
const enumListMap = { blog_category: 'blog_category' }

/** 枚举 */
router.post('/', async (req, res, next) => {
  // const { enumList } = req.body
  // let arr
  // for (const item of enumList) {
  //   const tableName = enumListMap[item]
  //   if (tableName) {
  //     const response = await db(`select * from`)
  //   }
  // }
})

module.exports = router
