import type { RouteRecordRaw } from "vue-router";

export const userRoutes: RouteRecordRaw[] = [
  {
    path: "home",
    component: () => import("@/views/private/notes/AllNotesIndex.vue"),
    name: "home",
    meta: { layout: "user", title: "All Notes" },
    children: [
      {
        path: "create",
        component: () => import("@/views/private/notes/CreateNote.vue"),
        name: "home.create",
      },
      {
        path: ":id/edit",
        component: () => import("@/views/private/notes/EditNote.vue"),
        name: "home.edit",
      },
    ],
  },
  {
    path: "archived",
    component: () => import("@/views/private/archive/ArchivedIndex.vue"),
    name: "user.archived",
    meta: { title: "Archived Notes" },

    children: [
      {
        path: ":id/edit",
        component: () => import("@/views/private/notes/EditNote.vue"),
        name: "archived.edit",
      },
    ],
  },
];
