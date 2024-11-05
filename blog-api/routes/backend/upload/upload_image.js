var express = require('express')
var router = express.Router()
const uuid = require('uuid')
const multer = require('multer')
const iconv = require('iconv-lite')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/image'); // 上传的文件将保存在uploads文件夹中
  },
  filename: function (req, file, cb) {
    const { id } = req.tokenPayload
    const decodedName = iconv.decode(Buffer.from(uuid.v4() + '-' + `[userId-${id}]` + '-' + file.originalname, 'binary'), 'utf8');
    cb(null, decodedName); // 保留原始文件名
  }
});

const upload = multer({ storage: storage });

/** 修改用户头像 */
router.post('/', upload.single('file'), async (req, res, next) => {
  const { file } = req
  if (!file) {
    res.status(400).send({
      msg: '未找到上传的文件'
    });
  }

  res.status(200).send({
    msg: '操作成功',
    data: file.path,
    code: 200
  })
})
////////////////////////////

module.exports = router