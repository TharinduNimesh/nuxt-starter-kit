import { mainNavLinks, otherLinks, accountLinks } from "~/config/navigation";

export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  // Combine all navigation links
  const allLinks = [...mainNavLinks, ...otherLinks, ...accountLinks];

  // Find the matching route configuration
  const routeConfig = allLinks.find((link) => to.path.startsWith(link.path));

  // If route requires specific roles and user doesn't have them, redirect to dashboard
  if (
    routeConfig?.roles &&
    !routeConfig.roles.includes(user.value?.role || "")
  ) {
    return navigateTo("/console");
  }
});
