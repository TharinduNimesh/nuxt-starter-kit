<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
    <Header :links="headerLinks" />

    <main class="flex-1">
      <slot />
    </main>

    <Footer :links="footerLinks" />
  </div>
</template>

<script setup lang="ts">
const headerLinks = [
  { label: "Features", to: "#features" },
  { label: "Pricing", to: "#pricing" },
  { label: "Documentation", to: "#docs" },
];

const footerLinks = [
  { label: "About", to: "/about" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];
</script>
