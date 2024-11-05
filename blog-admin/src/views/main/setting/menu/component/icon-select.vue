<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  icons: {
    type: Array
  }
})

const icons = ref(props.icons! as any)

watch(
  () => props.icons,
  (val) => {
    icons.value = val
  }
)
</script>

<template>
  <ElOptionGroup
    v-for="group in icons"
    :key="group.category"
    :label="group.categoryCN"
  >
    <ElOption
      v-for="item in group.options"
      :key="item.id"
      :value="item.name!"
    >
      <div class="flex items-center">
        <ElIcon :size="16">
          <component
            v-if="item.name"
            :is="'icon-' + item.name"
          />
        </ElIcon>
        <span class="ml-2">{{ item.name }}</span>
      </div>
    </ElOption>
  </ElOptionGroup>
</template>
