<template>
  <div>
    <aside
      :class="[
        'fixed left-0 top-0 h-screen bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col z-30 transition-transform duration-300 ease-in-out',
        'md:fixed',
        sidebarStore.sidebarWidth,
        { '-translate-x-full': !sidebarStore.isMobileOpen && isMobile },
        { 'translate-x-0': sidebarStore.isMobileOpen || !isMobile },
      ]"
    >
      <!-- Logo Section -->
      <div
        class="p-6 border-b border-slate-200 dark:border-zinc-800 overflow-hidden whitespace-nowrap"
      >
        <div
          class="flex items-center"
          :class="{ 'justify-center': sidebarStore.isCollapsed }"
        >
          <img src="/logo.png" alt="Logo" class="h-10 w-auto" />
          <div v-if="!sidebarStore.isCollapsed" class="flex flex-col ml-3">
            <span class="text-lg font-bold text-slate-900 dark:text-white"
              >Eversoft IT.</span
            >
            <span class="text-sm text-slate-500 dark:text-zinc-400">Admin</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden">
        <ul class="p-4 space-y-2">
          <!-- Main Navigation -->
          <li v-for="link in mainNavLinks" :key="link.path">
            <NuxtLink
              :class="{
                'justify-center': sidebarStore.isCollapsed,
                'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400':
                  isLinkActive(link.path),
              }"
              :to="link.path"
              class="flex items-center px-4 py-3 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 group transition-colors duration-200"
            >
              <div class="relative flex items-center">
                <Icon
                  :name="link.icon"
                  class="w-5 h-5"
                  :class="{
                    'text-primary-600 dark:text-primary-400': isLinkActive(
                      link.path
                    ),
                  }"
                />
                <span
                  v-if="!sidebarStore.isCollapsed"
                  class="ml-3 text-sm font-medium whitespace-nowrap"
                  :class="{
                    'text-primary-600 dark:text-primary-400': isLinkActive(
                      link.path
                    ),
                  }"
                >
                  {{ link.name }}
                </span>
                <span
                  v-if="link.badge && !sidebarStore.isCollapsed"
                  class="ml-auto bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {{ link.badge }}
                </span>
              </div>

              <!-- Tooltip for collapsed state -->
              <div
                v-if="sidebarStore.isCollapsed"
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
          </li>

          <!-- Other Links -->
          <div class="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800">
            <h3
              v-if="!sidebarStore.isCollapsed"
              class="px-4 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
            >
              Other
            </h3>
            <li v-for="link in otherLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="flex items-center px-4 py-3 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 group transition-colors duration-200"
                :class="{
                  'justify-center': sidebarStore.isCollapsed,
                  'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400':
                    isLinkActive(link.path),
                }"
              >
                <div class="relative flex items-center">
                  <Icon
                    :name="link.icon"
                    class="w-5 h-5"
                    :class="{
                      'text-primary-600 dark:text-primary-400': isLinkActive(
                        link.path
                      ),
                    }"
                  />
                  <span
                    v-if="!sidebarStore.isCollapsed"
                    class="ml-3 text-sm font-medium whitespace-nowrap"
                    :class="{
                      'text-primary-600 dark:text-primary-400': isLinkActive(
                        link.path
                      ),
                    }"
                  >
                    {{ link.name }}
                  </span>
                </div>

                <!-- Tooltip for collapsed state -->
                <div
                  v-if="sidebarStore.isCollapsed"
                  class="absolute left-full ml-6 px-2 py-1 bg-slate-800 dark:bg-zinc-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  {{ link.name }}
                </div>
              </NuxtLink>
            </li>
          </div>

          <!-- Account Links -->
          <div class="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800">
            <h3
              v-if="!sidebarStore.isCollapsed"
              class="px-4 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2"
            >
              Account
            </h3>
            <li v-for="link in accountLinks" :key="link.path">
              <NuxtLink
                :to="link.path"
                class="flex items-center px-4 py-3 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 group transition-colors duration-200"
                :class="{
                  'justify-center': sidebarStore.isCollapsed,
                  'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400':
                    isLinkActive(link.path),
                }"
              >
                <div class="relative flex items-center">
                  <Icon
                    :name="link.icon"
                    class="w-5 h-5"
                    :class="{
                      'text-primary-600 dark:text-primary-400': isLinkActive(
                        link.path
                      ),
                    }"
                  />
                  <span
                    v-if="!sidebarStore.isCollapsed"
                    class="ml-3 text-sm font-medium whitespace-nowrap"
                    :class="{
                      'text-primary-600 dark:text-primary-400': isLinkActive(
                        link.path
                      ),
                    }"
                  >
                    {{ link.name }}
                  </span>
                </div>

                <!-- Tooltip for collapsed state -->
                <div
                  v-if="sidebarStore.isCollapsed"
                  class="absolute left-full ml-6 px-2 py-1 bg-slate-800 dark:bg-zinc-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                >
                  {{ link.name }}
                </div>
              </NuxtLink>
            </li>
          </div>
        </ul>
      </nav>

      <!-- User Profile -->
      <div
        class="p-4 border-t border-slate-200 dark:border-zinc-800 overflow-hidden whitespace-nowrap"
      >
        <div
          class="flex items-center px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50"
          :class="{ 'justify-center': sidebarStore.isCollapsed }"
        >
          <img
            src="https://ui-avatars.com/api/?name=Jeivine+Kief&background=146de0&color=fff"
            alt="Jeivine Kief"
            class="w-8 h-8 rounded-full"
          />
          <div v-if="!sidebarStore.isCollapsed" class="flex-1 min-w-0 ml-3">
            <p
              class="text-sm font-medium text-slate-900 dark:text-white truncate"
            >
              Jeivine Kief
            </p>
            <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">
              Administrator
            </p>
          </div>
          <button
            v-if="!sidebarStore.isCollapsed"
            @click="signOut"
            class="flex items-center gap-2 ml-4 text-slate-600 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors duration-200"
          >
            <Icon name="i-uil-signout" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Collapse Button -->
      <button
        @click="sidebarStore.toggleCollapse"
        class="hidden md:flex absolute -right-3 top-16 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400"
      >
        <Icon
          :name="
            sidebarStore.isCollapsed ? 'i-uil-angle-right' : 'i-uil-angle-left'
          "
          class="w-4 h-4"
        />
      </button>
    </aside>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarStore.isMobileOpen && isMobile"
      class="fixed inset-0 bg-gray-400/20 dark:bg-black/50 backdrop-blur-sm z-20"
      @click="sidebarStore.closeMobileMenu"
    ></div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but allow scrolling */
nav {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

nav::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.-translate-x-full {
  transform: translateX(-100%);
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash-es";

const sidebarStore = useSidebarStore();
const route = useRoute();

const isMobile = ref(false);
const isClient = computed(() => import.meta.client);
const { signOut } = useAuth();

onMounted(() => {
  if (isClient.value) {
    checkMobileView();
    window.addEventListener("resize", handleResize);
  }
});

const checkMobileView = () => {
  if (isClient.value) {
    isMobile.value = window.innerWidth < 768;
  }
};

const handleResize = debounce(() => {
  if (isClient.value) {
    checkMobileView();
  }
}, 200);

onUnmounted(() => {
  if (isClient.value) {
    window.removeEventListener("resize", handleResize);
  }
});

// Navigation Links
const mainNavLinks = [
  {
    name: "Dashboard",
    path: "/console",
    icon: "i-uil-apps",
  },
  {
    name: "Products",
    path: "/console/products",
    icon: "i-uil-box",
    badge: "24",
  },
  {
    name: "Categories",
    path: "/console/categories",
    icon: "i-uil-layer-group",
  },
];

const otherLinks = [
  {
    name: "Inquiries",
    path: "/console/inquiries",
    icon: "i-uil-comment-message",
    badge: "12",
  },
];

const accountLinks = [
  {
    name: "Members",
    path: "/console/members",
    icon: "i-uil-users-alt",
  },
  {
    name: "Settings",
    path: "/console/settings",
    icon: "i-uil-setting",
  },
  {
    name: "Feedback",
    path: "/console/feedback",
    icon: "i-uil-comment-alt-message",
  },
];

const isLinkActive = (path) => {
  if (path === "/console") {
    return route.path === path;
  }
  return route.path.startsWith(path);
};
</script>
