<template>
  <section class="py-24 bg-gray-50 dark:bg-zinc-900" id="features">
    <div class="container px-4 mx-auto">
      <div class="max-w-2xl mx-auto mb-16 text-center">
        <h2 class="text-4xl font-bold mb-4">Everything You Need</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Built with modern tools and best practices
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="relative group"
        >
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/20 to-primary/0 dark:from-primary/10 opacity-0 group-hover:opacity-100"></div>
          <UCard class="relative h-full border border-gray-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50">
            <div class="flex flex-col h-full">
              <div class="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl mb-4 w-14 h-14 flex items-center justify-center">
                <UIcon :name="feature.icon" class="text-primary w-7 h-7" />
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Authentication',
    description: 'Secure user authentication with multiple providers and role-based access control.',
    icon: 'i-heroicons-finger-print'
  },
  {
    title: 'Database Integration',
    description: 'Pre-configured database setup with migrations and type safety.',
    icon: 'i-heroicons-circle-stack'
  },
  {
    title: 'Payment Processing',
    description: 'Integrated payment gateway for handling subscriptions and one-time payments.',
    icon: 'i-heroicons-credit-card'
  },
  {
    title: 'Email Integration',
    description: 'Ready-to-use email service for notifications and communications.',
    icon: 'i-heroicons-envelope'
  },
  {
    title: 'Dark Mode',
    description: 'Built-in dark mode support with system preference detection.',
    icon: 'i-heroicons-moon'
  },
  {
    title: 'TypeScript Support',
    description: 'Full TypeScript support with enhanced type safety and auto-completion.',
    icon: 'i-simple-icons-typescript'
  }
]
</script>

<style scoped>
.group:hover .absolute {
  backdrop-filter: blur(8px);
}
</style>
