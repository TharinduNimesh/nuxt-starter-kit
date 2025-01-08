<template>
  <section class="relative py-24 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950"></div>
    
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
    
    <!-- Gradient Blob -->
    <div class="absolute inset-x-0 -top-48 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
    </div>

    <div class="relative container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Development Process?</h2>
        <p class="text-lg text-gray-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Start building modern web applications with our comprehensive starter kit. Everything you need, right out of the box.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton 
            size="xl"
            color="primary"
            class="min-w-[200px] group"
          >
            Start Building
            <Icon name="i-heroicons-rocket-launch" 
              class="ml-2 transform group-hover:translate-x-1 transition-transform"
            />
          </UButton>
          <UButton
            size="xl"
            variant="ghost"
            class="min-w-[200px]"
          >
            View Documentation
            <Icon name="i-heroicons-arrow-right" class="ml-2" />
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
