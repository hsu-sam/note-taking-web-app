import type { RouteRecordRaw } from "vue-router";

export const settingRoutes: RouteRecordRaw[] = [
  {
    path: "settings",
    component: () => import("@/views/private/settings/SettingsIndex.vue"),
    name: "settings",
    meta: { layout: "user" },
    redirect: { name: "settings.color-theme" },
    children: [
      {
        path: "color-theme",
        name: "settings.color-theme",
        component: () => import("@/views/private/settings/ColorTheme.vue"),
      },
      {
        path: "font-theme",
        name: "settings.font-theme",
        component: () => import("@/views/private/settings/FontTheme.vue"),
      },
      {
        path: "change-password",
        name: "settings.change-password",
        component: () => import("@/views/private/settings/ChangePassword.vue"),
      },
    ],
  },
];
