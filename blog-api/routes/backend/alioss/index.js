var express = require('express')
var router = express.Router()
const { STS } = require('ali-oss')

/** 获取alioss信息 */
router.get('/sts', async (req, res, next) => {
  const { AccessKeyId, AccessKeySecret, ARN } = process.env
  let sts = new STS({
    accessKeyId: AccessKeyId,
    accessKeySecret: AccessKeySecret
  })
  sts.assumeRole(ARN, ``, '3000', 'sessiontest')
    .then((result) => {
      // console.log(result);
      res.json({
        msg: '获取成功',
        data: result.credentials,
        code: 200
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
})

module.exports = router
