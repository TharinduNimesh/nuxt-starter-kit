<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
  >
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-2">
          <NuxtLink to="/" class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-cube-transparent"
              class="text-primary w-8 h-8"
            />
            <span class="font-bold text-lg">Nuxt Starter Kit</span>
          </NuxtLink>

          <div class="hidden md:flex md:gap-x-6 ml-10">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            @click="toggleColorMode"
            variant="ghost"
            class="rounded-full dark:hover:bg-zinc-800"
            :icon="
              colorMode.value === 'dark'
                ? 'i-heroicons-sun-20-solid'
                : 'i-heroicons-moon-20-solid'
            "
            :title="
              colorMode.value === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            "
          />
          <UButton
            to="/auth/sign-in"
            variant="ghost"
            class="dark:hover:bg-zinc-800"
          >
            Sign In
          </UButton>
          <UButton to="/auth/sign-up" color="primary"> Get Started </UButton>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  links?: Array<{
    label: string;
    to: string;
  }>;
}>();

const colorMode = useColorMode();

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};
</script>
