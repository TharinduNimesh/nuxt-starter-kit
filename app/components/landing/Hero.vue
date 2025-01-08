<template>
  <section class="relative py-24 overflow-hidden">
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap items-center -m-8">
        <div class="w-full md:w-1/2 p-8">
          <h1 class="font-bold text-5xl md:text-6xl tracking-tight mb-8">
            Complete Starter Kit for
            <span class="text-primary">Modern Web Apps</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Accelerate your development with pre-built authentication, database integration,
            payment processing, and email capabilities.
          </p>
          <div class="flex flex-wrap gap-4">
            <UButton size="lg" color="primary">
              Get Started
              <Icon name="i-heroicons-arrow-right-20-solid" />
            </UButton>
            <UButton size="lg" variant="ghost">
              View Documentation
              <Icon name="i-heroicons-book-open-20-solid" />
            </UButton>
          </div>
        </div>
        <div class="w-full md:w-1/2 p-8">
          <img src="/hero-image.svg" alt="Hero" class="w-full" />
        </div>
      </div>
    </div>
  </section>
</template>
