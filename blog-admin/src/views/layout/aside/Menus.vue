<script lang="ts" setup>
import { menusF } from '@/api/setting/menus'
import { PropType } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  item: {
    type: Object as PropType<menusF>,
    required: true
  }
})

const routerClick = (item: menusF) => {
  try {
    router.push({ name: item.name })
  } catch (err) {
    // console.log(err)
    router.replace({ path: '/404' })
  }
}
</script>

<template>
  <ElMenuItem
    :index="item.name"
    @click="routerClick(item)"
    v-if="(item.children && item.children?.length <= 0) || !item.children"
  >
    <ElIcon>
      <component
        v-if="item.icon"
        :is="'icon-' + item.icon"
      />
    </ElIcon>
    <template #title>
      {{ props.item.title }}
    </template>
  </ElMenuItem>
  <ElSubMenu
    :index="item.name"
    popper-class="dark-mode"
    v-else
  >
    <template #title>
      <ElIcon>
        <component
          v-if="item.icon"
          :is="'icon-' + item.icon"
        />
      </ElIcon>
      <span>{{ item.title }}</span>
    </template>
    <Menus
      v-for="child in item.children"
      :key="child.id"
      :item="child"
    />
  </ElSubMenu>
</template>
