const jwt = require('jsonwebtoken')

const config = {
  secret: 'testSecrect',
  signOptions: {
    expiresIn: '30000s'
  },
  // unlessPaths: ["/api/users/login"], // 忽略token校验的路由
  requireCheckPaths: [
    /^\/api\/users\/(?!(?:.*?\/)?login($|\/)).*$/,
    // /^\/api\/menus/,
    /^\/api\/role/,
    /^\/api\/upload\/user/,
    /^\/api\/menus\/(?!$).+$/,
    /^\/api\/home/,
    /^\/api\/blog/,
    /^\/api\/blog_category/,
    /^\/api\/upload_image/
  ] //必须token校验的路由
}

const signByPayload = (payload) => {
  return jwt.sign(
    payload, // 想携带的数据(不要放敏感信息)
    config.secret, //密钥
    config.signOptions //签发token的配置信息
  )
}

const verify = (req, res, next) => {
  // if (config.unlessPaths.includes(req.path)) {
  //   next();
  //   return;
  // }
  const isForceCheck = config.requireCheckPaths.some((s) => {
    if (typeof s == 'object') return s.test(req.path)
    if (typeof s == 'string') return s == req.path
  })
  // 原始写法
  // let testRes = false;
  // config.requireCheckPaths.forEach((s) => {
  //   if (typeof s == "object" && s.test(req.path)) testRes = true;
  //   if (typeof s == "string" && s == req.path) testRes = true;
  // });

  // if (!config.requireCheckPaths.includes(req.path)) {
  //   next();
  //   return;
  // }

  const authorization = req.headers.authorization
  if (!authorization && isForceCheck) {
    res.send({
      isSuccess: false,
      message: '缺少认证资源',
      code: 401
    })
    return
  }
  if (authorization?.split(' ').length != 2 && isForceCheck) {
    res.send({
      isSuccess: false,
      message: '非法token',
      code: 401
    })
    return
  }
  const token = authorization?.split(' ')[1]
  // 如果没有强制解析token,并且没有token,那么可以放行
  if (!token && !isForceCheck) {
    next()
    return
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err && isForceCheck) {
      res.status(401).send({
        err
      })
      return
    }
    req.tokenPayload = decoded || {}
    next()
  })
}

module.exports = {
  signByPayload,
  verify
}
