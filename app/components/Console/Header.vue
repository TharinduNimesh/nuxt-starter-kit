<template>
  <header
    class="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 h-16"
  >
    <div class="h-full flex items-center justify-between px-4 md:px-6">
      <!-- Left Section: Mobile Menu + Search -->
      <div class="flex items-center flex-1">
        <!-- Mobile Menu Toggle -->
        <button
          class="md:hidden pr-4 h-10 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg"
          @click="sidebarStore.toggleMobileMenu"
        >
          <Icon
            :name="sidebarStore.isMobileOpen ? 'i-uil-times' : 'i-uil-bars'"
            class="text-xl"
          />
        </button>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl">
          <div class="relative">
            <input
              type="text"
              placeholder="Search anything..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-sm dark:text-zinc-100 dark:placeholder-zinc-400"
            />
            <Icon
              name="i-uil-search"
              class="absolute left-3 top-2.5 w-5 h-5 text-slate-400 dark:text-zinc-500"
            />
          </div>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center space-x-2 md:space-x-4 ml-4">
        <!-- Export & Add Widget Buttons (Hidden on mobile) -->
        <div
          class="hidden md:flex rounded-lg border border-slate-200 dark:border-zinc-700 divide-x dark:divide-zinc-700"
        >
          <button
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span class="hidden lg:inline">Export</span>
            <Icon name="i-uil-export" class="w-4 h-4 lg:hidden" />
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span class="hidden lg:inline">+ Add Widget</span>
            <Icon name="i-uil-plus" class="w-4 h-4 lg:hidden" />
          </button>
        </div>

        <!-- Theme Toggle -->
        <UButton
          icon="i-uil-sun"
          color="gray"
          variant="ghost"
          :ui="{ rounded: 'rounded-lg' }"
          @click="toggleColorMode"
          square
        />

        <UButton
          icon="i-uil-bell"
          color="gray"
          variant="ghost"
          :ui="{ rounded: 'rounded-lg' }"
          square
        />

        <!-- Profile Dropdown -->
        <UDropdown :items="profileItems" :popper="{ placement: 'bottom-end' }">
          <button class="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
            <img
              :src="`https://ui-avatars.com/api/?name=${formatName(user?.name || user?.email)}&background=146de0&color=fff`"
              :alt="user?.name || user?.email"
              class="w-8 h-8 rounded-full"
            />
            <span class="hidden md:block text-sm font-medium text-slate-700 dark:text-zinc-200 max-w-[120px] truncate">
              {{ formatDisplayText(user?.name || user?.email, 15) }}
            </span>
            <Icon
              name="i-uil-angle-down"
              class="w-5 h-5 text-slate-400 dark:text-zinc-500 hidden md:block flex-shrink-0"
            />
          </button>
        </UDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const sidebarStore = useSidebarStore();
const colorMode = useColorMode();
const { user, signOut } = useAuth();

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const formatDisplayText = (text: string | null | undefined, maxLength = 20) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatName = (text: string | null | undefined) => {
  if (!text) return 'U'
  return text.split(/[@\s]/, 1)[0]?.substring(0, 2).toUpperCase()
}

const profileItems = computed(() => [
  [
    {
      label: formatEmail(user.value?.email || ''),
      slot: "email",
      disabled: true,
    },
    {
      label: `Role: ${user.value?.role?.toLowerCase()}`,
      slot: "role",
      disabled: true,
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-uil-user",
      to: "/console/profile",
    },
    {
      label: "Settings",
      icon: "i-uil-setting",
      to: "/console/settings",
    },
  ],
  [
    {
      label: "Sign Out",
      icon: "i-uil-signout",
      click: () => signOut(),
    },
  ],
])

const formatEmail = (email: string, maxLength = 25) => {
  if (!email || email.length <= maxLength) return email
  const [local, domain] = email.split('@')
  if (!domain || !local) return email;
  const shortenedLocal = local.substring(0, maxLength - domain.length - 2) + '...'
  return `${shortenedLocal}@${domain}`
}
</script>
