import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { RouteLocationNormalizedLoadedGeneric, useRouter } from 'vue-router'
export const useTagsStore = defineStore('useTagsStore', () => {
  const router = useRouter()
  const routes = computed(() => {
    return router.getRoutes()
  })
  const tags = ref<RouteLocationNormalizedLoadedGeneric[]>([
    {
      fullPath: '/home',
      hash: '',
      matched: [],
      meta: { requiresAuth: true, title: '首页', cache: 1, status: 'open' },
      name: 'home',
      params: {},
      path: '/home',
      query: {},
      redirectedFrom: undefined
    }
  ])

  /** 添加标签 */
  function addTags(route: RouteLocationNormalizedLoadedGeneric) {
    if (tags.value.some((s) => s.name === route.name)) return
    if (route.meta && route.meta.cache === 1) {
      tags.value.push(Object.assign({}, route))
    }
  }

  /** 清楚标签 */
  function clearTags() {
    tags.value = [
      {
        fullPath: '/home',
        hash: '',
        matched: [],
        meta: { requiresAuth: true, title: '首页', cache: 1, status: 'open' },
        name: 'home',
        params: {},
        path: '/home',
        query: {},
        redirectedFrom: undefined
      }
    ]
  }

  /** 删除标签 */
  function deleteTag(route: RouteLocationNormalizedLoadedGeneric) {
    tags.value.splice(tags.value.indexOf(route), 1)
  }

  /** 根据name删除标签 */
  function deleteTagOfName(name: string) {
    const item = tags.value.find((s) => s.name === name)
    tags.value.splice(tags.value.indexOf(item!), 1)
  }

  /** 更新标签 */
  function updateDelTags(modal: any) {
    if (tags.value.some((s) => s.name === modal.name)) {
      tags.value = tags.value.filter((s) => s.name !== modal.name)
    }
  }

  /** 更新标签 */
  function updateAddTags(modal: any) {
    const item = routes.value.find((s) => s.name === modal.name)
    let route: RouteLocationNormalizedLoadedGeneric = {
      fullPath: item?.path!,
      hash: '',
      matched: [],
      meta: {
        requiresAuth: true,
        title: item?.meta.title,
        cache: item?.meta.cache,
        status: item?.meta.status
      },
      name: item?.name!,
      params: {},
      path: item?.path!,
      query: modal.query,
      redirectedFrom: undefined
    }
    if (!tags.value.some((s) => s.name === modal.name)) {
      tags.value.push(Object.assign({}, route))
    }
  }

  return {
    tags,
    addTags,
    deleteTag,
    updateDelTags,
    updateAddTags,
    deleteTagOfName,
    clearTags
  }
})
