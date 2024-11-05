import type { Dayjs } from 'dayjs'
// import type { UploadFile } from '@/components/Upload'
// import type { ResultProps } from '@/components/Result'

export function makeStringProp(): string | undefined
export function makeStringProp<T = string>(defaultVal: string): T | string
export function makeStringProp(defaultVal?: string) {
  return defaultVal
}

export function makeStringMap<T = string[]>(...keys: Array<keyof T>) {
  return keys.reduce((maps, curr) => {
    maps[curr] = makeStringProp()
    return maps
  }, {} as Record<keyof T, string | undefined>)
}

export function makeNumberProp(): number | undefined
export function makeNumberProp(defaultVal: number): number
export function makeNumberProp(defaultVal?: number) {
  return defaultVal
}

export function makeNumberMap<T = number[]>(...keys: Array<keyof T>) {
  return keys.reduce((maps, curr) => {
    maps[curr] = makeNumberProp()
    return maps
  }, {} as Record<keyof T, number | undefined>)
}

export function makeArrayProp<T = any>(): T[] | undefined
export function makeArrayProp<T = any>(defaultArr: T[]): T[]
export function makeArrayProp<T = any>(defaultArr?: T[]) {
  return defaultArr
}

// export function makeUploadProp<T = any>() {
//   return [] as UploadFile<T>[]
// }

// export function makeResultProp() {
//   return undefined as ResultProps | undefined
// }

export function makeDayjsProp() {
  return null as Dayjs | null
}
