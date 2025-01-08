<template>
  <footer class="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
    <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <UIcon name="i-heroicons-cube-transparent" class="text-primary w-8 h-8" />
            <span class="font-bold text-lg">Nuxt Starter Kit</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">
            Modern web development starter kit with everything you need to build amazing products.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-gray-400 hover:text-primary">
              <UIcon name="i-simple-icons-github" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary">
              <UIcon name="i-simple-icons-twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-primary">
              <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div v-for="(group, index) in footerLinks" :key="index">
          <h3 class="font-semibold mb-4">{{ group.title }}</h3>
          <ul class="space-y-3">
            <li v-for="link in group.links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-gray-500 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-500 dark:text-zinc-400">
          © {{ new Date().getFullYear() }} Nuxt Starter Kit. All rights reserved.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-sm text-gray-500 hover:text-primary dark:text-zinc-400">
            Privacy Policy
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-primary dark:text-zinc-400">
            Terms of Service
          </a>
          <a href="#" class="text-sm text-gray-500 hover:text-primary dark:text-zinc-400">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '#features' },
      { label: 'Pricing', to: '#pricing' },
      { label: 'Documentation', to: '#docs' },
      { label: 'Changelog', to: '/changelog' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Community', to: '/community' },
      { label: 'Help Center', to: '/help' },
      { label: 'Partners', to: '/partners' },
      { label: 'Status', to: '/status' },
    ]
  }
]
</script>
