const tencentcloud = require('tencentcloud-sdk-nodejs-tmt')

const TmtClient = tencentcloud.tmt.v20180321.Client

const client = new TmtClient({
  credential: {
    secretId: 'AKIDOjw76zrfK6ufFeqpeIpBZoyymEjAXj8X',
    secretKey: 'Us8zc2EE7upvuxFSVky3EJTdilmiaQRc'
  },
  region: 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'tmt.tencentcloudapi.com'
    }
  }
})

const translateText = (text) => {
  return client.TextTranslate({
    SourceText: text,
    Source: 'zh',
    Target: 'en',
    ProjectId: 0
  })
    .then(
      (data) => {
        return data.TargetText.replace(' ', '_')
      },
      (err) => {
        console.error("error", err);
        return null
      }
    );
}

module.exports = {
  translateText
}