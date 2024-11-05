/**
 * 返回类型值
 *
 * @example
 * ```ts
 * toString(new Array()) // Array
 * toString({}) // Object
 * toString(1) // Number
 * toString(undefined) // Undefined
 * toString(null) // Null
 * toString(Symbol('key')) // Symbol
 * ```
 */
export const toString = (value: any): string => {
  return Object.create(Object.prototype).toString.call(value).slice(8, -1)
}

/**
 * 检查 `value` 是否是 `string`
 *
 * @example
 * ```ts
 * isString('') // true
 * isString(1) // false
 * isString(false) // false
 * ```
 */
export const isString = (value: any): value is string => {
  return toString(value) === 'String'
}

/**
 * 检查 `value` 是否是 `number` 类型，且值不为 `NaN`
 *
 * @example
 * ```ts
 * isNumber(3) // true
 * isNumber(3.1415) // true
 * isNumber('3.1415926') // false
 * ```
 */
export const isNumber = (value: any): value is number => {
  return toString(value) === 'Number' && !isNaN(value)
}

/**
 * 检查 `value` 是否是 `number`，支持正则校验 `/^\d+(\.\d+)?$/`
 *
 * @example
 * ```ts
 * isNumberic(3) // true
 * isNumberic('3.1415926') // true
 * ```
 */
export const isNumberic = (value: any): value is number => {
  return isNumber(value) || /^\d+(\.\d+)?$/.test(value)
}

/**
 * 检查 `value` 是否是整数，正则校验 `/^\d+$/`
 *
 * @example
 * ```ts
 * isInteger(10) // true
 * isInteger(3.1415926) // false
 * isInteger(0.1) // false
 * ```
 */
export const isInteger = (value: any): value is number => {
  return /^\d+$/.test(value)
}

/**
 * 检查 `value` 是否是 `undefined`
 *
 * @example
 * ```ts
 * isUndefined(void 0) // true
 * isUndefined(null) // false
 * ```
 */
export const isUndefined = (value: any): value is undefined => {
  return toString(value) === 'Undefined'
}

/**
 * 检查 `value` 是否是 `null`
 *
 * @example
 * ```ts
 * isNull(void 0) // false
 * isNull(null) // true
 * ```
 */
export const isNull = (value: any): value is null => {
  return value === null
}

/**
 * 检查 `value` 是否是 `undefined` 或 `null`
 *
 * @example
 * ```ts
 * isNil(void 0) // true
 * isNil(null) // true
 * isNil('hello world') // false
 * isNil(123) // false
 * ```
 */
export const isNil = (value: any): value is null | undefined => {
  return value == null
}

/**
 * 检查 `value` 是否是 `boolean`
 *
 * @example
 * ```ts
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(123) // false
 * ```
 */
export const isBoolean = (value: any): value is boolean => {
  return toString(value) === 'Boolean'
}

/**
 * 检查 `value` 是否是 `function`
 *
 * @example
 * ```ts
 * const fn = () => {}
 *
 * isFunction(fn) // true
 * isFunction(null) // false
 * ```
 */
export const isFunction = (value: any): value is (...args: any[]) => any => {
  return toString(value) === 'Function'
}

/**
 * 检查 `value` 是否是 `array`
 *
 * @example
 * ```ts
 * isArray(new Array()) // true
 * isArray([1,2,3]) // true
 * isArray(null) // false
 * isArray()
 * ```
 */
export const isArray = (value: any): value is any[] => {
  return toString(value) === 'Array'
}

/**
 * 检查 `value` 是否是 `array`
 *
 * @example
 * ```ts
 * isObject({}) // true
 * isObject(null) // false
 * isObject(new Object()) // true
 * ```
 */
export const isObject = <T>(
  value: T
): value is T extends object ? T : never => {
  return !isNull(value) && toString(value) === 'Object'
}

/**
 * 检查 `value` 是否 `string`，不能是 `''`
 *
 * @example
 * ```ts
 * isRequired(null) // false
 * isRequired('') // false
 * isRequired('hello world') // true
 * ```
 */
export const isRequired = (value: any): value is string => {
  return isString(value) && !value.match(/^[ ]*$/)
}

/**
 * 检查 `value` 是否是 `promise`
 *
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // true
 * ```
 */
export const isPromise = <T = void>(value: any): value is Promise<T> => {
  return toString(value) === 'Promise' && isFunction(value.then)
}

/** 检查运行环境是浏览器 */
export const isBrowser = () => {
  return typeof window !== 'undefined'
}

/**
 * 检查 `value` 是否是手机号码，支持号码段 `1{345789}`
 *
 * @example
 * ```ts
 * isPN('1322553355') // true
 * isPN('4666565') // false
 * ```
 */
export const isPN = (value: any): value is string => {
  return /^1[345789]\d{9}$/.test(value.replace(/\s+/g, ''))
}

/**
 * 检查 `value` 是否是 `base64` 图片类型
 *
 * @example
 * ```ts
 * isBase64Image('data:image/png;base64,...') // true
 * isBase64Image('https://example.com/image.jpg') // false
 * ```
 */
export const isBase64Image = (value: any): value is string => {
  return /^data:image\/(.*);base64,/i.test(value)
}

/**
 * 检查 `value` 是否是链接
 *
 * @example
 * ```ts
 * isAbsoluteURL('https://example.com') // true
 * isAbsoluteURL('/index') // false
 * ```
 */
export const isAbsoluteURL = (value: any): value is string => {
  return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/i.test(
    value
  )
}

/**
 * 检查 `value` 是否是内部链接
 *
 * @example
 * ```ts
 * isInternalLink('/list/240') // true
 * isInternalLink('home') // false
 * isInteralLink('https://example.com') // false
 * ```
 */
export const isInternalLink = (value: any): value is string => {
  return /^\/(.*)/i.test(value)
}

export const isHttpOrHttps = (value: any): value is string => {
  if (value && value.includes('http')) {
    return true
  } else {
    return false
  }
}
