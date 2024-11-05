<script lang="ts" setup>
import { menusF } from '@/api/setting/menus'
import { useMenuStore } from '@/pinia'
import { storeToRefs } from 'pinia'
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const menusStore = useMenuStore()
const { menus } = storeToRefs(menusStore)

const props = defineProps({
  screenWidth: {
    type: Number
  }
})

const route = useRoute()
const router = useRouter()
const breadcrumb = ref<any[]>([])

const getBreadcrumb = async () => {
  let matched: any[] = findMatchs(menus.value, route.name!?.toString())
  breadcrumb.value = [
    {
      name: 'home',
      title: '首页',
      type: 'menu'
    }
  ]
  if (matched) {
    matched.forEach((s) => {
      if (s.name === 'home') return
      breadcrumb.value.push({
        name: s.name,
        title: s.title,
        type: s.menuType
      })
    })
  } else {
    if (route.name !== 'home') {
      breadcrumb.value.push({
        name: route.name,
        title: route.meta.title,
        type: route.meta.menuType
      })
    }
  }
}

function findMatchs(menus: menusF[], name: string, parents = [] as any) {
  for (const item of menus) {
    if (item.name === name) {
      return [...parents, item]
    }
    if (item.children?.length) {
      const found: any = findMatchs(item.children, name, [...parents, item])
      if (found) {
        return found
      }
    }
  }
  return null
}

function handleLink(item: any) {
  const { name } = item
  router.push({ name })
}

watchEffect(() => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})
</script>
<template>
  <div
    v-if="props.screenWidth! >= 415"
    class="ml-[20px]"
  >
    <ElBreadcrumb separator="/">
      <TransitionGroup name="breadcrumb">
        <ElBreadcrumbItem
          v-for="(item, _index) in breadcrumb"
          :key="item.name"
        >
          <a
            :class="{
              hight: item.name === route.name?.toString()
            }"
            v-if="item.name === route.name?.toString()"
          >
            {{ item.title }}
          </a>
          <a
            :class="{ home: item.type === 'menu' }"
            v-else-if="item.type === 'menu'"
            @click.prevent="handleLink(item)"
          >
            {{ item.title }}
          </a>
          <span v-else>
            {{ item.title }}
          </span>
        </ElBreadcrumbItem>
      </TransitionGroup>
    </ElBreadcrumb>
  </div>
</template>

<style lang="less" scoped>
.hight {
  font-weight: bold !important;
  color: #000 !important;
}

.home {
  cursor: pointer !important;
  color: var(--el-text-color-regular);
  font-weight: 500 !important;
}

.home:hover {
  color: var(--el-menu-active-color);
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
