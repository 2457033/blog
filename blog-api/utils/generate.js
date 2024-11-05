const generateRandomName = (length) => {
  let result = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const generateRandomPhone = (length) => {
  let result = ''
  const chars = '1234567890'
  const charactersLength = chars.length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = {
  generateRandomName,
  generateRandomPhone
}