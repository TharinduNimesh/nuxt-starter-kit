export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.client) {
    const { default: VueApexCharts } = await import('vue3-apexcharts')
    nuxtApp.vueApp.use(VueApexCharts)
  }
})