<template>
  <div>
    <NuxtLayout name="console">
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold">Dashboard</h1>
            <p class="mt-1 text-gray-600 dark:text-zinc-400">Monitor your business metrics</p>
          </div>
          <div class="flex items-center gap-4">
            <UButton 
              icon="i-heroicons-arrow-down-tray-20-solid" 
              color="gray" 
            >
              Download Report
            </UButton>
            <UButton 
              icon="i-heroicons-arrow-path-20-solid" 
              color="primary"
              :loading="refreshing"
              @click="refreshData"
            >
              Refresh Data
            </UButton>
          </div>
        </div>

        <!-- Stats Cards -->
        <ConsoleDashboardStats />

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <!-- Revenue Stats -->
            <ConsoleDashboardMiniStats />
            <ConsoleDashboardRevenueChart />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Recent Activity</h3>
              </template>
              <div class="space-y-4">
                <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start gap-4">
                  <div :class="`w-10 h-10 flex items-center justify-center rounded-lg border ${activity.bgColor} ${activity.borderColor}`">
                    <Icon :name="activity.icon" :class="`w-5 h-5 ${activity.iconColor}`" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ activity.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-zinc-400">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold">Top Products</h3>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                    class="-mr-2"
                  />
                </div>
              </template>
              <div class="space-y-4">
                <div v-for="product in topProducts" :key="product.id" class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Icon :name="product.icon" class="w-6 h-6 text-gray-500 dark:text-zinc-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ product.name }}</p>
                    <p class="text-xs text-gray-600 dark:text-zinc-400">${{ product.revenue.toLocaleString() }}</p>
                  </div>
                  <div :class="`px-2 py-1 text-xs rounded ${product.trending > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'}`">
                    {{ product.trending > 0 ? '+' : '' }}{{ product.trending }}%
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
const refreshing = ref(false)

const recentActivities = [
  {
    title: 'New user registered',
    time: '5 minutes ago',
    icon: 'i-heroicons-user-plus-20-solid',
    bgColor: 'bg-primary-100/80 dark:bg-primary-900/30',
    borderColor: 'border-primary-200 dark:border-primary-800',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  {
    title: 'Payment received',
    time: '2 hours ago',
    icon: 'i-heroicons-banknotes-20-solid',
    bgColor: 'bg-green-100/80 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'System alert',
    time: '1 day ago',
    icon: 'i-heroicons-bell-alert-20-solid',
    bgColor: 'bg-orange-100/80 dark:bg-orange-900/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
]

const topProducts = [
  {
    id: 1,
    name: 'Premium Template',
    revenue: 45990,
    trending: 12.8,
    icon: 'i-heroicons-document'
  },
  {
    id: 2,
    name: 'Custom Plugin',
    revenue: 32100,
    trending: -5.2,
    icon: 'i-heroicons-puzzle-piece'
  },
  {
    id: 3,
    name: 'UI Components',
    revenue: 28700,
    trending: 8.4,
    icon: 'i-heroicons-squares-2x2'
  },
  {
    id: 4,
    name: 'API Package',
    revenue: 22340,
    trending: 3.2,
    icon: 'i-heroicons-code-bracket'
  }
]

const refreshData = async () => {
  refreshing.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  refreshing.value = false
}

</script>
