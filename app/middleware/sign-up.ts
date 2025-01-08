
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  
  if (to.path === '/auth/sign-up' && !config.public.isSignUpEnabled) {
    return navigateTo('/auth/sign-in')
  }
})