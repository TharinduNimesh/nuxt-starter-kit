
<template>
  <div v-if="links.length" :class="{ 'pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800': hasBorder }">
    <h3
      v-if="!isCollapsed && title"
      class="px-4 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
    >
      {{ title }}
    </h3>
    <li v-for="link in links" :key="link.path">
      <ConsoleNavigationLink
        :link="link"
        :is-collapsed="isCollapsed"
        :is-active="isLinkActive(link.path)"
      />
    </li>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

defineProps<{
  links: NavLink[]
  isCollapsed: boolean
  title?: string
  hasBorder?: boolean
}>()

const isLinkActive = (path: string) => {
  if (path === "/console") {
    return route.path === path
  }
  return route.path.startsWith(path)
}
</script>