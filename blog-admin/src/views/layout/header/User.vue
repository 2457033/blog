<script lang="ts" setup>
import { useMenuStore, userInfo, useTagsStore } from '@/pinia'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { isHttpOrHttps } from '@/shared/verify'

const { VITE_BASE_URL } = import.meta.env

const router = useRouter()

const userInfoStore = userInfo()
const { userinfo } = storeToRefs(userInfoStore)
const { clearToken } = userInfoStore

const tagsStore = useTagsStore()

const menuStore = useMenuStore()

const loginOut = () => {
  ElMessageBox.confirm('确定要退出吗', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      clearToken()
      menuStore.clearRoutes()
      tagsStore.clearTags()
      ElMessage.success('退出成功')
      router.replace({
        name: 'login'
      })
    })
    .catch(() => {})
}
</script>
<template>
  <div class="absolute right-[20px] flex items-center">
    <div class="flex items-center">
      <ElImage
        :src="
          isHttpOrHttps(userinfo.icon)
            ? userinfo.icon
            : VITE_BASE_URL + userinfo.icon
        "
        fit="cover"
        class="rounded-[50%] w-12 h-12 border-[1px] border-inherit"
      />
      <span class="ml-[10px]">{{ userinfo.nickName }}</span>
    </div>
    <div class="ml-[10px] mt-[8px] h-full">
      <ElDropdown>
        <span class="el-dropdown-link flex items-center">
          <ElIcon class="el-icon--right">
            <arrow-down />
          </ElIcon>
        </span>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="router.push({ name: 'my-info' })">
              个人资料
            </ElDropdownItem>
            <ElDropdownItem @click="loginOut">退出登录</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <!-- <span>{{ userinfo.nikeName }}</span> -->
    </div>
  </div>
</template>
