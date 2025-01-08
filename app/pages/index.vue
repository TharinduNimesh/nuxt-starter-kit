<template>
  <div>
    <NuxtLayout name="web">
      <UHeader :links="headerLinks">
        <template #logo>
          <h1 class="text-xl font-bold">Nuxt Starter Kit</h1>
        </template>
        <template #right>
          <div class="flex items-center gap-4">
            <UColorModeButton />
            <UButton to="/auth/sign-in" variant="ghost">Sign In</UButton>
            <UButton to="/auth/sign-up" color="primary">Get Started</UButton>
          </div>
        </template>
      </UHeader>

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingPricing />
        <LandingCTASection />
      </main>

    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { label: "Features", to: "#features" },
  { label: "Pricing", to: "#pricing" },
  { label: "Documentation", to: "#docs" },
];
</script>
