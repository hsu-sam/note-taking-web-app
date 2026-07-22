import type { RouteRecordRaw } from "vue-router";

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/auth/LoginView.vue"),
    name: "auth.login",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/signup",
    component: () => import("@/views/auth/SignupView.vue"),
    name: "auth.signup",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/forgot-password",
    component: () => import("@/views/auth/ForgotPasswordView.vue"),
    name: "auth.forgot-password",
    meta: { layout: "auth", authless: true },
  },
  {
    path: "/reset-password",
    component: () => import("@/views/auth/PasswordResetView.vue"),
    name: "auth.password-reset",
    meta: { layout: "auth", authless: true },
  },
];
