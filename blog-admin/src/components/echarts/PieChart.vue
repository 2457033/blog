<script setup lang="ts">
import echarts, { ECOption } from '@/shared/echarts'
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
const props = defineProps({
  width: {
    type: [Number, String],
    default: 300
  },
  height: {
    type: [Number, String],
    default: 300
  },
  seriesData: {
    type: Array as PropType<any[]>,
    default: []
  },
  text: {
    type: String
  },
  total: {
    type: Number,
    default: 0
  }
})

const chartRef = ref(null)

function init() {
  if (echarts.getInstanceByDom(chartRef.value!)) {
    echarts.getInstanceByDom(chartRef.value!)?.dispose()
  }
  const myChart = echarts.init(chartRef.value)
  const option: ECOption = {
    // color: ['#409eff', '#FA5247', '#F625AF', '#FFB435', '#1CCBB6'],
    tooltip: {
      trigger: 'item'
    },
    title: {
      text: props.text,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 14
      },
      subtext: props.total?.toString(),
      textVerticalAlign: 'top',
      subtextStyle: {
        valueAnimation: true,
        fontSize: 28,
        fontWeight: 800,
        color: 'black',
        align: 'center'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: props.seriesData
      }
    ]
  }
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    if (!myChart.isDisposed()) {
      myChart.resize()
    }
  })
}

watch(
  () => [props.seriesData, props.total],
  () => {
    init()
  }
)
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  const myChart = echarts.getInstanceByDom(chartRef.value!)
  if (myChart) {
    window.removeEventListener('resize', function () {
      myChart.resize()
    })
    myChart.dispose()
  }
})
</script>
<template>
  <div
    ref="chartRef"
    :style="{
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
      height:
        typeof props.height === 'number' ? props.height + 'px' : props.height
    }"
  ></div>
</template>
<style lang="less" scoped></style>
