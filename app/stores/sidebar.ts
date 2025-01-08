import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isCollapsed: false,
    isMobileOpen: false,
    sidebarWidth: 'w-56',
  }),

  actions: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.sidebarWidth = this.isCollapsed ? 'w-24' : 'w-56';
    },
    toggleMobileMenu() {
      this.isMobileOpen = !this.isMobileOpen;
    },
    closeMobileMenu() {
      this.isMobileOpen = false;
    },
    openMobileMenu() {
      this.isMobileOpen = true;
    },
  },
})
