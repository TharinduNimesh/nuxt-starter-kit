type NavLink = {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  roles?: string[];
}

export const mainNavLinks: NavLink[] = [
  {
    name: "Dashboard",
    path: "/console",
    icon: "i-uil-apps",
    roles: ['ADMIN', 'USER']
  },
  {
    name: "Users",
    path: "/console/users",
    icon: "i-uil-users-alt",
    roles: ['ADMIN']
  },
  {
    name: "Payments",
    path: "/console/payments",
    icon: "i-uil-money-bill",
    roles: ['ADMIN']
  },
  {
    name: "Email",
    path: "/console/email",
    icon: "i-uil-envelope",
    roles: ['ADMIN']
  }
];

export const otherLinks: NavLink[] = [
  {
    name: "Analytics",
    path: "/console/analytics",
    icon: "i-uil-chart-line",
    roles: ['ADMIN']
  },
  {
    name: "Tasks",
    path: "/console/tasks",
    icon: "i-uil-clipboard-notes",
    badge: "5",
    roles: ['ADMIN', 'USER']
  }
];

export const accountLinks: NavLink[] = [
  {
    name: "Settings",
    path: "/console/settings",
    icon: "i-uil-setting",
    roles: ['ADMIN', 'USER']
  },
  {
    name: "Profile",
    path: "/console/profile",
    icon: "i-uil-user-circle",
    roles: ['ADMIN', 'USER']
  },
  {
    name: "Help",
    path: "/console/help",
    icon: "i-uil-question-circle",
    roles: ['ADMIN', 'USER']
  }
];
