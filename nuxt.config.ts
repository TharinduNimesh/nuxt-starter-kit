// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxt/ui", "@pinia/nuxt"],

  icon: {
    serverBundle: {
      collections: ["uil"],
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "~/tailwind.config.ts",
  },

  runtimeConfig: {
    public: {
      isSignUpEnabled: process.env.IS_SIGN_UP_ENABLED === "true",
    },
  },

  routeRules: {
    "/console": {
      ssr: false,
    },
    "/console/**": {
      ssr: false,
    },
  },
});
