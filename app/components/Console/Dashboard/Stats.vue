<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <UCard v-for="stat in stats" :key="stat.name" class="hover:shadow-lg transition-shadow">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-zinc-400">{{ stat.name }}</p>
          <p class="mt-2 text-3xl font-semibold">{{ stat.value }}</p>
          <p :class="[
            'mt-2 text-sm',
            stat.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          ]">
            <span>{{ stat.change > 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%</span>
            <span class="text-gray-600 dark:text-zinc-400 ml-1">vs last month</span>
          </p>
        </div>
        <div :class="`w-12 h-12 flex items-center justify-center rounded-lg border ${stat.bgColor} ${stat.borderColor}`">
          <Icon :name="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231',
    change: 12.5,
    icon: 'i-heroicons-banknotes-20-solid',
    bgColor: 'bg-primary-100/80 dark:bg-primary-900/30',
    borderColor: 'border-primary-200 dark:border-primary-800',
    iconColor: 'text-primary-600 dark:text-primary-400'
  },
  {
    name: 'Active Users',
    value: '1,234',
    change: 18.2,
    icon: 'i-heroicons-users-20-solid',
    bgColor: 'bg-green-100/80 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Pending Tasks',
    value: '23',
    change: -4.3,
    icon: 'i-heroicons-clipboard-document-list-20-solid',
    bgColor: 'bg-orange-100/80 dark:bg-orange-900/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    name: 'Open Issues',
    value: '12',
    change: -8.4,
    icon: 'i-heroicons-exclamation-circle-20-solid',
    bgColor: 'bg-red-100/80 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400'
  }
]
</script>
