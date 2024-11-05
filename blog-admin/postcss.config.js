export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': {
    //   rootValue: 12, // 基准值，对应根元素的字体大小
    //   propList: ['*'], // 需要转换的属性，* 代表所有属性都要转换
    //   unitPrecision: 5, // 转换后的rem值保留的小数位数
    //   selectorBlackList: ['html'], // 不转换的选择器，匹配的选择器将被忽略
    //   replace: true, // 替换包含px的属性，而不是添加fallback
    //   mediaQuery: false, // 允许在媒体查询中转换px
    //   minPixelValue: 0 // 小于或等于这个值的px不会被转换
    // }
  },
}
