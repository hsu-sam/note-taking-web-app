import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: "home",
    component: () => import("@/views/private/notes/AllNotesIndex.vue"),
    name: "home",
    meta: { layout: "user" },
    children: [
      {
        path: "create",
        component: () => import("@/views/private/notes/CreateNote.vue"),
        name: "home.create",
      },
    ],
  },
  {
    path: "archived",
    component: () => import("@/views/private/ArchivedIndex.vue"),
    name: "user.archived",
  },
];
