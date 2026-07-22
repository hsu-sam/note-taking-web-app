import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { userRoutes } from "./private.ts";
import { publicRoutes } from "./public.ts";
import { settingRoutes } from "./settings.ts";

declare module "vue-router" {
  interface RouteMeta {
    authless?: boolean;
    layout?: string;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    meta: { authless: true },
    children: publicRoutes,
  },
  {
    path: "/logout",
    name: "auth.logout",
    component: () => import("@/views/private/settings/Logout.vue"),
    meta: { authless: true },
  },
  {
    path: "/",
    name: "app",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "u",
        alias: "users",
        meta: { layout: "user" },
        redirect: { name: "user.index" },
        children: userRoutes,
      },
      ...settingRoutes,
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/PageNotFound.vue"),
    name: "NotFound",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});
