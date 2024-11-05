import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemTool = defineStore('systemTool', () => {
  const isCollapse = ref(false)
  const expandRowKeys = ref([] as string[])

  function getExpandRowKeys(id: string, expandedRows: boolean) {
    if (expandedRows) {
      if (expandRowKeys.value?.includes(id)) return
      expandRowKeys.value.push(id)
    } else {
      if (!expandRowKeys.value?.includes(id)) return
      expandRowKeys.value.splice(expandRowKeys.value.indexOf(id), 1)
    }
  }
  return { isCollapse, expandRowKeys, getExpandRowKeys }
})
