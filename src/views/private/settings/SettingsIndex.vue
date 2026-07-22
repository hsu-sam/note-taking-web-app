<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useWebHaptics } from "web-haptics/vue";

interface SettingsNav {
  label: string;
  name: string;
  icon: string;
}

const settingsNav: SettingsNav[] = [
  { label: "Color Theme", name: "settings.color-theme", icon: "local:sun" },
  { label: "Font Theme", name: "settings.font-theme", icon: "local:type" },
  {
    label: "Change Password",
    name: "settings.change-password",
    icon: "local:iconly-icon",
  },
];

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div class="flex min-h-full">
    <nav class="w-62.5 shrink-0 border-r border-neutral-200 p-200">
      <ul class="flex flex-col gap-100">
        <li v-for="item in settingsNav" :key="item.name">
          <router-link
            :to="{ name: item.name }"
            class="flex items-center justify-between rounded-6 px-150 py-100 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
            active-class="bg-neutral-100 text-neutral-950 font-semibold"
            @click="trigger('selection')"
          >
            <div class="flex items-center gap-100">
              <Icon :icon="item.icon" class="w-6 h-6" />
              <span>{{ item.label }}</span>
            </div>
            <Icon
              icon="local:chevron-right"
              class="w-6 h-6"
              v-if="$route.name === item.name"
            />
          </router-link>
        </li>

        <div class="border-t border-neutral-200"></div>

        <li>
          <button
            class="w-full flex items-center gap-100 rounded-6 px-150 py-100 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
            @click="trigger('selection')"
          >
            <Icon icon="local:logout" class="w-6 h-6" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
    <div class="flex-1 p-400">
      <router-view />
    </div>
  </div>
</template>
