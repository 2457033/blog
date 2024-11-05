import { LoadingParentElement } from 'element-plus'
import { ComponentPublicInstance, ComponentOptionsBase, Ref } from 'vue'

let loadingInstance: {
  close: any
  setText?: (text: string) => void
  removeElLoadingChild?: () => void
  handleAfterLeave?: () => void
  vm?: ComponentPublicInstance<
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    false,
    ComponentOptionsBase<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      {},
      {},
      string,
      {}
    >,
    {},
    {}
  >
  $el?: HTMLElement
  originalPosition?: Ref<string>
  originalOverflow?: Ref<string>
  visible?: Ref<boolean>
  parent?: Ref<LoadingParentElement>
  background?: Ref<string>
  svg?: Ref<string>
  svgViewBox?: Ref<string>
  spinner?: Ref<string | boolean>
  text?: Ref<string>
  fullscreen?: Ref<boolean>
  lock?: Ref<boolean>
  customClass?: Ref<string>
  target?: Ref<HTMLElement>
  beforeClose?: Ref<(() => boolean) | undefined> | undefined
  closed?: Ref<(() => void) | undefined> | undefined
} | null = null

export function showLoading(isLoading: boolean, target = '.el-main') {
  if (isLoading) {
    loadingInstance = ElLoading.service({ target: target })
  } else if (!isLoading && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}
