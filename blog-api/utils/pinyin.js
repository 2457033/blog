const { pinyin } = require("pinyin-pro")

const textToPinyin = (text) => {
  return pinyin(text, { toneType: 'num' })?.replace(/\s+/g, '')
}

module.exports = {
  textToPinyin
}