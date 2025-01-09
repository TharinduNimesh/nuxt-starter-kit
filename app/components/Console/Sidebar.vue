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
              >Nuxt Kit</span
            >
            <span
              class="text-sm text-slate-500 dark:text-zinc-400 capitalize"
              >{{ user?.role?.toLowerCase() }}</span
            >
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden">
        <ul class="p-4 space-y-2">
          <!-- Main Navigation -->
          <ConsoleNavigationSection
            :links="filteredMainNavLinks"
            :is-collapsed="sidebarStore.isCollapsed"
          />

          <!-- Other Links -->
          <ConsoleNavigationSection
            :links="filteredOtherLinks"
            :is-collapsed="sidebarStore.isCollapsed"
            title="Other"
            has-border
          />

          <!-- Account Links -->
          <ConsoleNavigationSection
            :links="filteredAccountLinks"
            :is-collapsed="sidebarStore.isCollapsed"
            title="Account"
            has-border
          />
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
            :src="`https://ui-avatars.com/api/?name=${formatName(
              user?.name || user?.email
            )}&background=146de0&color=fff`"
            :alt="user?.name || user?.email"
            class="w-8 h-8 rounded-full"
          />
          <div v-if="!sidebarStore.isCollapsed" class="flex-1 min-w-0 ml-3">
            <p
              class="text-sm font-medium text-slate-900 dark:text-white truncate"
            >
              {{ formatDisplayText(user?.name || user?.email) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">
              {{ user?.email ? formatEmail(user.email) : "" }}
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

.w-56 {
  width: 14rem;
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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { debounce } from "lodash-es";
import { mainNavLinks, otherLinks, accountLinks } from "~/config/navigation";

const sidebarStore = useSidebarStore();
const route = useRoute();

const isMobile = ref(false);
const isClient = computed(() => import.meta.client);
const { signOut, user } = useAuth();

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
const filteredMainNavLinks = computed(() => {
  return mainNavLinks.filter(
    (link) => !link.roles || link.roles.includes(user.value?.role || "")
  );
});

const filteredOtherLinks = computed(() => {
  return otherLinks.filter(
    (link) => !link.roles || link.roles.includes(user.value?.role || "")
  );
});

const filteredAccountLinks = computed(() => {
  return accountLinks.filter(
    (link) => !link.roles || link.roles.includes(user.value?.role || "")
  );
});

const isLinkActive = (path: string) => {
  if (path === "/console") {
    return route.path === path;
  }
  return route.path.startsWith(path);
};

// Utility functions for formatting text
const formatDisplayText = (text: string | null | undefined, maxLength = 8) => {
  if (!text) return "";
  const name = text.split("@")[0]; // Get name part if it's an email
  if (!name) return text;
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

const formatEmail = (email: string, maxLength = 10) => {
  if (!email) return "";
  const [local] = email.split("@");
  if (!local) return email;
  const domain = "me"; // Simplified domain display
  return local.length > maxLength
    ? `${local.substring(0, 5)}...@${domain}`
    : `${local}@${domain}`;
};

const formatName = (text: string | null | undefined) => {
  if (!text) return "U";
  return text.split(/[@\s]/, 1)[0]?.substring(0, 2).toUpperCase();
};
</script>
