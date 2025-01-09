<template>
  <NuxtLink
    :to="link.path"
    class="flex items-center px-4 py-3 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 group transition-colors duration-200"
    :class="{
      'justify-center': isCollapsed,
      'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400': isActive,
    }"
  >
    <div class="relative flex items-center">
      <Icon
        :name="link.icon"
        class="w-5 h-5"
        :class="{ 'text-primary-600 dark:text-primary-400': isActive }"
      />
      <span
        v-if="!isCollapsed"
        class="ml-3 text-sm font-medium whitespace-nowrap"
        :class="{ 'text-primary-600 dark:text-primary-400': isActive }"
      >
        {{ link.name }}
      </span>
      <span
        v-if="link.badge && !isCollapsed"
        class="ml-auto bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full"
      >
        {{ link.badge }}
      </span>
    </div>

    <!-- Tooltip for collapsed state -->
    <div
      v-if="isCollapsed"
      class="absolute left-full ml-6 px-2 py-1 bg-slate-800 dark:bg-zinc-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
    >
      {{ link.name }}
      <span
        v-if="link.badge"
        class="ml-2 bg-primary-500 dark:bg-primary-600 px-1.5 py-0.5 rounded-full text-xs"
      >
        {{ link.badge }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NavLink } from '~/config/navigation'

defineProps<{
  link: NavLink
  isCollapsed: boolean
  isActive: boolean
}>()
</script>
