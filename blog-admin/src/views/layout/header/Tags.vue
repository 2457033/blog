<script lang="ts" setup>
import { useMenuStore, useTagsStore } from '@/pinia'
import { TabsPaneContext } from 'element-plus'
import { storeToRefs } from 'pinia'
import {
  ComponentPublicInstance,
  computed,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  watch
} from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const name = computed(() => {
  return route.name?.toString()
})
const router = useRouter()

const menuStore = useMenuStore()
const { routeList } = storeToRefs(menuStore)

watch(route, (newVal) => {
  if (newVal) {
    addTags(newVal)
    nextTick(() => {
      if (elTabsRef.value) {
        const item =
          elTabsRef.value?.$el.children[0].children[0].children[0].children[0]
            .children['tab-' + route.name?.toString()]
        scrollbarRef.value?.setScrollLeft(item.offsetLeft)
      }
    })
  }
})

const tagsStore = useTagsStore()
const { addTags, deleteTagOfName } = tagsStore
const { tags } = storeToRefs(tagsStore)

function toRoute(routeList: RouteRecordRaw[]) {
  routeList.forEach((s) => {
    if (s.name === route.name) {
      route.meta.title = s.meta?.title
      route.meta.cache = s.meta?.cache
      route.meta.status = s.meta?.status
    } else {
      if (s.children) {
        toRoute(s.children)
      }
    }
  })
}

// 获取初始路由状况
const initialRoute = () => {
  toRoute(routeList.value)
  addTags(route)
}

// // 关闭标签
// const onClose = (tag: RouteLocationNormalizedLoadedGeneric) => {
//   if (route.name === tag.name) {
//     const lastRoute = tags.value[tags.value.indexOf(tag) - 1]
//     router.replace({
//       name: lastRoute.name
//     })
//   }
//   deleteTag(tag)
// }

const tabClick = (pane: TabsPaneContext, _ev: Event) => {
  const index = Number(pane.index)
  const { id } = tags.value[index].params
  const { name } = pane.props
  if (id) {
    router.push({ name: name?.toString(), params: { id } })
  } else {
    router.push({ name: name?.toString() })
  }
}

const tabRemove = (name: any) => {
  if (name === route.name) {
    const lastIndex = tags.value.findIndex((s) => s.name === name)
    const routerName = tags.value[lastIndex - 1].name?.toString()
    router.push({ name: routerName })
  }
  deleteTagOfName(name)
}
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const elTabsRef = ref<InstanceType<typeof ElTabs>>()
const tagRefs = ref<Record<string, ComponentPublicInstance | null>>({})

onMounted(() => {
  initialRoute()
})

onBeforeMount(() => {})
</script>

<template>
  <div class="mt-[5px]">
    <ElScrollbar
      ref="scrollbarRef"
      class="transition-all tag-shadow"
    >
      <ElTabs
        ref="elTabsRef"
        :model-value="name"
        type="card"
        class="demo-tabs flex"
        @tab-click="tabClick"
        @tab-remove="tabRemove"
      >
        <ElTabPane
          v-for="tag in tags"
          :key="tag.name"
          :label="tag.meta.title?.toString()"
          :name="tag.name?.toString()"
          :closable="tag.name === 'home' ? false : true"
          :ref="(el) => (tagRefs[tag.name!?.toString()] as ComponentPublicInstance | Element | null) = el"
        />
      </ElTabs>
    </ElScrollbar>
    <!-- <ElTag
      v-for="tag in tags"
      :key="tag.name"
      class="mx-1 cursor-pointer"
      :closable="tag.name === 'home' ? false : true"
      :type="route.name === tag.name ? 'primary' : 'info'"
      @close="onClose(tag)"
      @click="
        router.push({
          name: tag.name
        })
      "
    >
      {{ tag.meta.title }}
    </ElTag> -->
  </div>
</template>
<style lang="less" scoped>
:deep(.el-tabs--card) {
  .el-tabs__header {
    height: auto;
    margin: 0;
    width: 100%;
    .el-tabs__nav {
      margin: 0 10px;
      border: none;
    }
    .el-tabs__item {
      border-bottom: none;
      border-left: 1px solid var(--el-border-color-light);
      border-right: 1px solid var(--el-border-color-light);
      border-top: 1px solid var(--el-border-color-light);
      margin-right: 8px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      transition: color var(--el-transition-duration)
          var(--el-transition-function-ease-in-out-bezier),
        padding var(--el-transition-duration)
          var(--el-transition-function-ease-in-out-bezier);
      padding: 0 12px;
      font-size: 14px !important;
      height: 35px;
      &.is-active {
        background-color: #409eff;
        color: #fff;
        &.is-closable {
          padding: 0 12px;
        }
      }
    }
  }
}

.tag-shadow {
  box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.15);
  z-index: 999;
}
</style>
