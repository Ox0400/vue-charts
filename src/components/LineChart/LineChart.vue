<template>
  <div ref="chart" class="line-chart">
    <svg class="line-chart__svg" :width="chartWidth" :height="chartHeight" :viewbox="`0 0 ${chartWidth} ${chartHeight}`">
      <defs>
        <linearGradient
          :id="pathGradientId"
          x1="0"
          :y1="chartHeight"
          x2="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" class="line-chart__path--0" />
          <stop offset="85%" class="line-chart__path--85" />
          <stop offset="100%" class="line-chart__path--100" />
        </linearGradient>
        <linearGradient :id="fillGradientId" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" class="line-chart__gradient-start" />
          <stop offset="100%" class="line-chart__gradient-stop" />
        </linearGradient>
      </defs>
      <path v-if="strokePath" class="line-chart__path" :d="strokePath" />
      <path v-if="fillPath" class="line-chart__fill" :d="fillPath" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { useElementRect } from '@prefecthq/vue-compositions'
  import { scaleLinear, scaleTime, line as d3Line } from 'd3'
  import { endOfToday, startOfToday } from 'date-fns'
  import { computed, ref } from 'vue'
  import { LineChartData, LineChartOptions, PointPosition } from '@/components/LineChart/types'
  import { getCurve } from '@/utilities/getCurveFunction'
  import { roundUpToIncrement } from '@/utilities/roundUpToIncrement'  
  import { randomId } from '@/components/Base'

  const props = defineProps<{
    data: LineChartData,
    options?: LineChartOptions,
  }>()

  const chart = ref<Element>()
  const { width: chartWidth, height: chartHeight } = useElementRect(chart)
  const data = computed(() => props.data.slice().sort(([x1], [x2]) => x1.getTime() - x2.getTime()))
  const pathGradientId = computed(() => `histogram-path-gradient-${randomId()}`)
  const fillGradientId = computed(() => `line-chart-fill-gradient-${randomId()}`)
  const pathGradientIdUrl = computed(() => `url(#${pathGradientId.value})`)
  const fillGradientIdUrl = computed(() => `url(#${fillGradientId.value})`)

  const minDate = computed<Date>(() => {
    if (props.options?.startDate) {
      return props.options.startDate
    }

    const [x] = data.value.at(0) ?? []

    return x ?? startOfToday()
  })

  const endDate = computed<Date>(() => {
    if (props.options?.endDate) {
      return props.options.endDate
    }

    const [x] = data.value.at(-1) ?? []

    return x ?? endOfToday()
  })

  const xScale = computed(() => {
    const scale = scaleTime()

    scale.domain([minDate.value, endDate.value])
    scale.range([0, chartWidth.value])

    return scale
  })

  const values = computed(() => data.value.map(([, y]) => y))

  const minValue = computed(() => {
    if (props.options?.minValue !== undefined) {
      return props.options.minValue
    }

    return Math.min(...values.value, 0)
  })

  const maxValue = computed(() => {
    if (props.options?.maxValue !== undefined) {
      return props.options.maxValue
    }

    const max = Math.max(...values.value, 0)

    if (props.options?.roundUpMaxValue) {
      return roundUpToIncrement(max)
    }

    return max
  })

  const yScale = computed(() => {
    const scale = scaleLinear()

    scale.domain([minValue.value, maxValue.value])
    scale.range([chartHeight.value, 0])

    return scale
  })

  const positions = computed<PointPosition[]>(() => data.value.map(([x, y]) => [xScale.value(x), yScale.value(y)]))

  const strokePath = computed<string | null>(() => {
    const line = d3Line()

    if (props.options?.curve) {
      const curve = getCurve(props.options.curve)

      line.curve(curve)
    }

    return line(positions.value)
  })

  const fillPath = computed<string | null>(() => {
    if (!strokePath.value) {
      return null
    }

    const [min, max] = xScale.value.range()
    const [first] = positions.value.at(0) ?? [min]
    const [last] = positions.value.at(-1) ?? [max]
    const bottomRight = `L ${last},${chartHeight.value}`
    const bottomLeft = `L ${first},${chartHeight.value}`

    return `${strokePath.value}${bottomRight}${bottomLeft}Z`
  })
</script>

<style>
.line-chart {
  min-height: 100px;
  --vc-line-chart-gradient-start: #7210EF;
  --vc-line-chart-gradient-middle: #7210EF;
  --vc-line-chart-gradient-end: #A564F9;
}

.line-chart__path { @apply
  fill-transparent;
  stroke-width: 2px;
  stroke: v-bind(pathGradientIdUrl);
}

.line-chart__path--0 {
  stop-color: var(--vc-line-chart-gradient-start)
}

.line-chart__path--85 {
  stop-color: var(--vc-line-chart-gradient-middle)
}

.line-chart__path--100 {
  stop-color: var(--vc-line-chart-gradient-end)
}

.line-chart__fill {
  fill: v-bind(fillGradientIdUrl);
}

.line-chart__gradient-start {
  stop-color: var(--p-color-bg-2);
  stop-opacity: 0;
}

.dark .line-chart__gradient-start {
  stop-color: transparent;
  stop-opacity: 0;
}

.line-chart__gradient-stop {
  stop-opacity: 0.3;
  stop-color: var(--vc-line-chart-gradient-start);
}
</style>
