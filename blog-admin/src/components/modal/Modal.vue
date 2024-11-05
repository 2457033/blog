<script lang="ts" setup>
import { useWindow } from '@/pinia'
import { storeToRefs } from 'pinia'
import { useAttrs } from 'vue'

const windowStore = useWindow()
const { screenWidth } = storeToRefs(windowStore)

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: String || Number
  },
  operaShow: {
    type: Boolean,
    default: true
  },
  cancelShow: {
    type: Boolean,
    default: true
  },
  confirmShow: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['cancel', 'confirm'])

const attrs = useAttrs()

const cancel = () => {
  emit('cancel')
}
</script>
<template>
  <div>
    <ElDialog
      v-bind="attrs"
      append-to-body
      :width="screenWidth < 650 ? '100%' : props.width"
      style="border-radius: 12px"
    >
      <slot></slot>
      <template
        #footer
        v-if="props.operaShow"
      >
        <div class="dialog-footer">
          <ElButton
            v-if="props.cancelShow"
            @click="cancel"
          >
            {{ cancelText }}
          </ElButton>
          <ElButton
            v-if="props.confirmShow"
            :loading="props.loading"
            type="primary"
            @click="emit('confirm')"
            :disabled="confirmDisabled"
          >
            {{ confirmText }}
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
<style lang="less"></style>
