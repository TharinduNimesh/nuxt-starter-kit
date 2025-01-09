<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <UCard class="bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold">Monthly Revenue</h3>
            <Icon name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-green-500" />
          </div>
          <p class="text-2xl font-semibold mt-1">$24,563</p>
          <div class="flex items-center gap-1 mt-1 text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+12.5%</span>
            <span class="text-gray-600 dark:text-zinc-400">vs last month</span>
          </div>
        </div>
        <div class="hidden md:block">
          <ClientOnly>
            <VueApexCharts
              type="line"
              height="60"
              width="120"
              :options="chartOptions.primary"
              :series="[{ data: [31, 40, 28, 51, 42, 109, 100] }]"
            />
          </ClientOnly>
        </div>
      </div>
    </UCard>

    <UCard class="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold">Active Users</h3>
            <Icon name="i-heroicons-user-group" class="w-5 h-5 text-green-500" />
          </div>
          <p class="text-2xl font-semibold mt-1">1,234</p>
          <div class="flex items-center gap-1 mt-1 text-sm">
            <span class="text-green-600 dark:text-green-400 font-medium">+5.2%</span>
            <span class="text-gray-600 dark:text-zinc-400">growth rate</span>
          </div>
        </div>
        <div class="hidden md:block">
          <ClientOnly>
            <VueApexCharts
              type="line"
              height="60"
              width="120"
              :options="chartOptions.secondary"
              :series="[{ data: [25, 66, 41, 89, 63, 125, 144] }]"
            />
          </ClientOnly>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

const chartOptions = {
  primary: {
    chart: { sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#6366f1'],
    tooltip: { enabled: false }
  },
  secondary: {
    chart: { sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#22c55e'],
    tooltip: { enabled: false }
  }
}
</script>
