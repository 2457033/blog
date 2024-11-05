import { postUserInfo } from '@/api/login'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface UserInfo {
  id?: string
  icon?: string
  createTime?: string
  nickName?: string
  phone?: string
  userName?: string
  sex?: string
  role?: string
  roleName?: string
  permission?: string
  selectIds?: string
  remark?: string
  status?: number
}

export const userInfo = defineStore('userInfo', () => {
  const userinfo = reactive({} as UserInfo)

  const token = ref(localStorage.getItem('user_token'))

  function getToken() {
    return localStorage.getItem('user_token')
  }

  function updateToken(val: string) {
    localStorage.setItem('user_token', val)
    token.value = val
  }

  function clearToken() {
    localStorage.removeItem('user_token')
  }

  function updateUserInfo(data: UserInfo) {
    Object.assign(userinfo, data)
  }

  async function getUserInfo() {
    const res = await postUserInfo(token.value!)
    updateUserInfo(res.data)
  }

  // 个人资料
  function uptPersonal(data: UserInfo) {
    userinfo.nickName = data.nickName
    userinfo.phone = data.phone
    userinfo.sex = data.sex
  }

  // 更新个人资料
  function uptInfo(data: UserInfo) {
    userinfo.nickName = data.nickName
    userinfo.phone = data.phone
    userinfo.sex = data.sex
    userinfo.status = data.status
    userinfo.remark = data.remark
  }

  /** 修改头像 */
  function uptAvatr(avtar: string) {
    userinfo.icon = avtar
  }

  return {
    userinfo,
    token,
    updateToken,
    updateUserInfo,
    clearToken,
    uptPersonal,
    getToken,
    getUserInfo,
    uptAvatr,
    uptInfo
  }
})
