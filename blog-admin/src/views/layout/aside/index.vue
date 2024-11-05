<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore, useSystemTool } from '@/pinia'
import { storeToRefs } from 'pinia'

import Menus from './Menus.vue'
import { menusF } from '@/api/setting/menus'

const props = defineProps({
  screenWidth: {
    type: Number
  }
})

const systemToolStore = useSystemTool()
const { isCollapse } = storeToRefs(systemToolStore)

const menuStore = useMenuStore()
const { menus } = storeToRefs(menuStore)
const menuList = ref([] as menusF[])

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const { name } = route
  return name?.toString() || ''
})

const routerClick = () => {
  try {
    router.push({ name: 'home' })
  } catch (err) {
    // console.log(err)
    router.replace({ name: 'error' })
  }
}

/** 过滤隐藏的菜单 */
function filterShow(list: menusF[]): menusF[] {
  return list
    .filter((s) => s.showMenu !== 0)
    .map((s) => ({
      ...s,
      children: s.children ? filterShow(s.children) : []
    }))
}

const onClose = () => {
  isCollapse.value = false
}

onMounted(() => {
  menuList.value = filterShow(menus.value)
})
</script>
<template>
  <div class="h-full">
    <ElMenu
      v-if="props.screenWidth! > 992"
      background-color="#D4E1EB"
      text-color="#000"
      :default-active="activeMenu"
      class="el-menu-vertical-demo dark-mode h-full"
      :collapse="isCollapse"
    >
      <div
        style="background: #d4e1eb"
        class="flex items-end px-[20px] pt-[10px] pb-[20px]"
      >
        <Logo
          width="40"
          height="40"
        />
        <span
          v-if="!isCollapse"
          class="gradient-text ml-[12px] text-[20px]"
        >
          XJ个人博客
        </span>
      </div>
      <ElMenuItem
        index="home"
        @click="routerClick"
      >
        <ElIcon>
          <HomeFilled />
        </ElIcon>
        <template #title>首页</template>
      </ElMenuItem>
      <Menus
        v-for="item in menuList"
        :key="item.id"
        :item="item"
      />
    </ElMenu>
    <ElDrawer
      :model-value="isCollapse"
      :show-close="false"
      :with-header="false"
      direction="ltr"
      size="45%"
      @close="onClose"
      v-else
    >
      <div
        style="background: #d4e1eb"
        class="flex items-end px-[10px] pt-[10px] pb-[20px]"
      >
        <Logo
          width="40"
          height="40"
        />
        <span class="gradient-text ml-[12px] text-[20px]"> XJ个人博客 </span>
      </div>
      <ElMenu
        background-color="#D4E1EB"
        text-color="#000"
        :default-active="activeMenu"
        class="el-menu-d el-menu-vertical-demo dark-mode h-full"
      >
        <ElMenuItem
          index="home"
          @click="routerClick"
        >
          <ElIcon>
            <HomeFilled />
          </ElIcon>
          <template #title>首页</template>
        </ElMenuItem>
        <Menus
          v-for="item in menuList"
          :key="item.id"
          :item="item"
        />
      </ElMenu>
    </ElDrawer>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-drawer__body) {
  padding: 0;
}
.el-menu-d {
  border-right: none !important;
}

:deep(.el-menu) {
  border: none;
  &-item {
    border-bottom-left-radius: 16px;
    border-top-left-radius: 16px;
    // margin: 0 0 0 8px;
    // border-radius: 16px;
  }
  .el-sub-menu__title {
    border-bottom-left-radius: 16px;
    border-top-left-radius: 16px;
  }
  &-item.is-active {
    background-color: #fff;
  }
}

.gradient-text {
  background: linear-gradient(to right, #00a1ff, #00ff8f, #00a1ff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
