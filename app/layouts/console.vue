<template>
  <div class="min-h-screen bg-slate-50 dark:bg-zinc-950">
    <!-- Sidebar -->
    <ConsoleSidebar />

    <!-- Main Content -->
    <div 
      :class="[
        { 'md:ml-[219px]': !sidebarStore.isCollapsed },
        { 'md:ml-24': sidebarStore.isCollapsed },
        { 'ml-0': isMobile }
      ]"
    >
      <ConsoleHeader />
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';

const sidebarStore = useSidebarStore();
const isMobile = ref(false);

// Check if we're on client-side
const isClient = computed(() => import.meta.client);

onMounted(() => {
  if (isClient.value) {
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
  }
});

// Check mobile view
const checkMobileView = () => {
  if (isClient.value) {
    isMobile.value = window.innerWidth < 768;
  }
};

// Handle window resize
const handleResize = debounce(() => {
  if (isClient.value) {
    checkMobileView();
    if (isMobile.value) {
      sidebarStore.closeMobileMenu();
    }
  }
}, 200);

// Clean up
onUnmounted(() => {
  if (isClient.value) {
    window.removeEventListener('resize', handleResize);
  }
});
</script>