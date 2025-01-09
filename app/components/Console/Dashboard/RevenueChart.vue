
<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Revenue Overview</h3>
        <USelect
          v-model="selectedPeriod"
          :options="periods"
          size="sm"
          class="w-32"
        />
      </div>
    </template>
    <ClientOnly>
      <VueApexCharts
        type="area"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>
  </UCard>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const selectedPeriod = ref('This Year')
const periods = ['This Week', 'This Month', 'This Year']

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent'
  },
  colors: ['#6366f1'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [50, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { width: 2, curve: 'smooth' },
  grid: {
    borderColor: colorMode.value === 'dark' ? '#3f3f46' : '#e2e8f0',
    strokeDashArray: 4
  },
  theme: {
    mode: colorMode.value
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: colorMode.value === 'dark' ? '#71717a' : '#64748b'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: colorMode.value === 'dark' ? '#71717a' : '#64748b'
      },
      formatter: (value: number) => `$${value}k`
    }
  },
  tooltip: {
    theme: colorMode.value
  }
}))

const series = [{
  name: 'Revenue',
  data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 132, 140, 150]
}]

watch(colorMode, () => {
  // Update chart theme when color mode changes
  chartOptions.value.theme.mode = colorMode.value
  chartOptions.value.grid.borderColor = colorMode.value === 'dark' ? '#3f3f46' : '#e2e8f0'
  chartOptions.value.xaxis.labels.style.colors = colorMode.value === 'dark' ? '#71717a' : '#64748b'
  chartOptions.value.yaxis.labels.style.colors = colorMode.value === 'dark' ? '#71717a' : '#64748b'
  chartOptions.value.tooltip.theme = colorMode.value
})
</script>