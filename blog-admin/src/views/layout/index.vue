<script setup lang="ts">
import Aside from './aside/index.vue'
import Header from './header/index.vue'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemTool, useWindow } from '@/pinia'
import { zhCn } from 'element-plus/es/locales.mjs'

const systemToolStore = useSystemTool()
const windowStore = useWindow()
const { screenWidth } = storeToRefs(windowStore)
const { updateWidth } = windowStore

const { isCollapse } = storeToRefs(systemToolStore)

// function setRootFontSize(innerWidth: number) {
//   // const designWidth = innerWidth
//   const rootSize = innerWidth / 100
//   document.documentElement.style.fontSize = `${rootSize}px`
// }

const getWindowWidth = () => {
  if (windowStore.screenWidth > 1240) {
    isCollapse.value = false
  } else {
    isCollapse.value = true
  }
  window.addEventListener('resize', function () {
    // setRootFontSize(this.window.innerWidth)
    updateWidth(this.window.innerWidth)
    if (this.window.innerWidth < 992) {
      return
    }
    if (this.window.innerWidth > 1240) {
      isCollapse.value = false
    } else {
      isCollapse.value = true
    }
  })
}

// const mainScroll = (e: Event) => {
//   const target = e.target as HTMLElement
//   updateHeight(target.scrollTop)
// }

// const removeWindowListen = () => {
//   window.removeEventListener('resize')
// }
onMounted(() => {
  // setRootFontSize(windowStore.screenWidth)
  getWindowWidth()
})
</script>
<template>
  <div class="min-w-[375px] common-layout relative w-full h-full flex">
    <ElConfigProvider
      :locale="zhCn"
      :message="{ max: 3 }"
    >
      <ElContainer>
        <ElAside
          :width="
            screenWidth > 992 ? (isCollapse ? 'auto' : 200 + 'px') : 'auto'
          "
          class="min-h-screen"
        >
          <Aside
            :screen-width="screenWidth"
            :is-collapse="isCollapse"
          />
        </ElAside>
        <ElContainer>
          <ElHeader>
            <Header :screen-width="screenWidth" />
          </ElHeader>

          <ElMain class="main">
            <RouterView v-slot="{ Component, route }">
              <Transition
                name="page-slide"
                mode="out-in"
              >
                <!-- 加入div防止每次创建vue页面不加入div报错，并创建标识让Transition识别 -->
                <div
                  class="flex flex-col flex-1"
                  :key="route.name"
                >
                  <component :is="Component" />
                </div>
              </Transition>
            </RouterView>
          </ElMain>
        </ElContainer>
      </ElContainer>
    </ElConfigProvider>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-main) {
  background-color: rgb(246, 246, 248);
  padding: 10px 10px 25px 10px;
}

:deep(.el-header) {
  --el-header-padding: 0;
  --el-header-height: auto;
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s;
}

.page-slide-enter {
  transform: translateX(200px); /* 从右侧进入 */
  opacity: 1;
}

.page-slide-leave-to {
  transform: translateX(-200px); /* 向左侧移出 */
  opacity: 0;
}

.main {
  height: 0 !important;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 6px; /* 滚动条的宽度 */
  }
  // &::-webkit-scrollbar-track {
  //   background: #f1f1f1; /* 滚动条轨道的颜色 */
  // }
  &::-webkit-scrollbar-thumb {
    background: var(
      --el-scrollbar-bg-color,
      var(--el-text-color-secondary)
    ); /* 滚动条滑块的颜色 */
    border-radius: 10px; /* 滚动条滑块的圆角 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #409eff; /* 滚动条滑块在hover时的颜色 */
    cursor: pointer;
  }
}
</style>
