import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { userRoutes } from "./private.ts";
import { publicRoutes } from "./public.ts";
import { settingRoutes } from "./settings.ts";
import { useAuth } from "@/services/useAuth";

declare module "vue-router" {
  interface RouteMeta {
    authless?: boolean;
    layout?: string;
    title?: string;
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

router.beforeEach(async (to) => {
  const { initAuth, isAuthenticated, isPasswordRecovery } = useAuth();

  // Wait for the Supabase session to be restored before making any
  // authentication-based routing decision.
  await initAuth();

  // The reset-password page must always be reachable: Supabase signs the
  // user in via the recovery link, so `isAuthenticated` is true even though
  // they haven't "really" logged in yet.
  if (to.name === "auth.password-reset") {
    return true;
  }

  const isPublicRoute = to.meta.authless ?? false;

  if (!isPublicRoute && !isAuthenticated.value) {
    return { name: "auth.login", query: { redirect: to.fullPath } };
  }

  if (
    isPublicRoute &&
    to.name !== "auth.logout" &&
    isAuthenticated.value &&
    !isPasswordRecovery.value
  ) {
    return { name: "home" };
  }

  return true;
});
