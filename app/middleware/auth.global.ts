export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()
  
  // Check if route starts with /console and user is not authenticated
  if (to.path.startsWith('/console')) {
    // If no user is set, redirect to login
    if (!user.value) {
      // Save the attempted URL for redirecting after login
      useState('redirect', () => to.fullPath)
      return navigateTo('/auth/sign-in')
    }
  }
  
  // If user is authenticated and trying to access auth pages, redirect to console
  if (user.value && to.path.startsWith('/auth/sign-in')) {
    return navigateTo('/console')
  }
})
