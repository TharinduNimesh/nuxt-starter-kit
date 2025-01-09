export default defineNuxtPlugin(async () => {
  const { user, accessToken } = useAuth()
  
  // Only run on client side and if no user is set
  if (import.meta.client && !user.value) {
    try {
      // Try to get current session
      const response = await $fetch('/api/auth/session')
      user.value = { ...response.user, name: response.user.name ?? null }
      accessToken.value = response.accessToken
    } catch (error) {
      // Clear any existing auth state if session is invalid
      user.value = null
      accessToken.value = null
    }
  }
})
