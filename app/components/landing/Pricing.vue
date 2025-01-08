<template>
  <section class="py-24" id="pricing">
    <div class="container px-4 mx-auto">
      <div class="max-w-2xl mx-auto mb-16 text-center">
        <h2 class="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Choose the plan that best fits your needs
        </p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div v-for="plan in plans" :key="plan.name" class="relative group">
          <div
            class="absolute -inset-px rounded-xl bg-gradient-to-b from-primary/20 to-primary/0 dark:from-primary/10 opacity-0 group-hover:opacity-100"
          ></div>
          <UCard
            class="relative border-gray-200 dark:border-zinc-800 hover:border-primary/50 dark:hover:border-primary/50"
          >
            <div class="flex flex-col space-y-8" style="min-height: 550px">
              <div>
                <div :class="[plan.popular ? 'pt-4' : '']">
                  <UBadge
                    v-if="plan.popular"
                    color="primary"
                    class="absolute -top-3 right-4"
                  >
                    Most Popular
                  </UBadge>
                  <h3 class="text-2xl font-bold">{{ plan.name }}</h3>
                  <div class="mt-4 flex items-baseline">
                    <span class="text-5xl font-bold">${{ plan.price }}</span>
                    <span class="ml-2 text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ plan.description }}
                  </p>
                </div>

                <ul class="space-y-4 mt-8">
                  <li
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-start gap-2"
                  >
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="flex-shrink-0 w-5 h-5 mt-0.5 text-primary"
                    />
                    <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <div class="flex-1 flex flex-col justify-end">
                <UButton
                  :color="plan.popular ? 'primary' : 'gray'"
                  block
                  size="lg"
                >
                  {{ plan.popular ? "Get started now" : "Start free trial" }}
                  <UIcon
                    v-if="plan.popular"
                    name="i-heroicons-arrow-right-20-solid"
                  />
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for side projects and small applications",
    features: [
      "Authentication system",
      "Basic database integration",
      "Email templates",
      "Dark mode support",
      "Basic documentation",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: 49,
    popular: true,
    description: "Everything you need for a growing business",
    features: [
      "Everything in Starter",
      "Advanced database features",
      "Payment gateway integration",
      "Priority API access",
      "Advanced analytics",
      "Priority email support",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    description: "Advanced features for large scale applications",
    features: [
      "Everything in Pro",
      "Custom deployment setup",
      "Dedicated support team",
      "Custom feature development",
      "SLA guarantee",
      "Security audits",
      "24/7 phone support",
      "On-premise options",
    ],
  },
];
</script>

<style scoped>
.group:hover .absolute {
  backdrop-filter: blur(8px);
}
</style>
