<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

import Button from "@/components/ui/Button.vue";
import { useWebHaptics } from "web-haptics/vue";

type ColorTheme = "light" | "dark" | "system";

interface ThemeOption {
  value: ColorTheme;
  label: string;
  description: string;
  icon: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light Mode",
    description: "Pick a clean and classic light theme",
    icon: "local:sun",
  },
  {
    value: "dark",
    label: "Dark Mode",
    description: "Select a sleek and modern dark theme",
    icon: "local:dark-mode",
  },
  {
    value: "system",
    label: "System",
    description: "Adapts to your device's theme",
    icon: "local:light-mode",
  },
];

const savedTheme = localStorage.getItem("color-theme");
const selectedTheme = ref<ColorTheme>(
  savedTheme === "dark" || savedTheme === "system" ? savedTheme : "light",
);

function applyTheme() {
  localStorage.setItem("color-theme", selectedTheme.value);
}
const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <section class="max-w-132 flex flex-col gap-300">
    <div>
      <h1 class="text-base! font-bold! text-neutral-950">Color Theme</h1>
      <p class="mt-050 text-sm text-neutral-700">Choose your color theme:</p>
    </div>

    <form class="flex flex-col gap-200" @submit.prevent="applyTheme">
      <fieldset>
        <legend class="sr-only">Choose a color theme</legend>

        <div class="flex flex-col gap-200">
          <label
            v-for="theme in themeOptions"
            :key="theme.value"
            class="flex min-h-18 cursor-pointer items-center gap-200 rounded-12 border p-200 transition-colors"
            :class="
              selectedTheme === theme.value
                ? 'border-neutral-100 bg-neutral-100'
                : 'border-neutral-200 bg-neutral-0 hover:bg-neutral-50'
            "
            @click="trigger('selection')"
          >
            <input
              v-model="selectedTheme"
              class="peer sr-only"
              type="radio"
              name="color-theme"
              :value="theme.value"
            />

            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-12 border border-neutral-200 bg-neutral-0 text-neutral-950"
            >
              <Icon :icon="theme.icon" class="size-6" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-neutral-950">
                {{ theme.label }}
              </span>
              <span class="mt-050 block text-xs text-neutral-700">
                {{ theme.description }}
              </span>
            </span>

            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500"
              aria-hidden="true"
            >
              <span
                v-if="selectedTheme === theme.value"
                class="size-2 rounded-full bg-blue-500"
              />
            </span>
          </label>
        </div>
      </fieldset>

      <div class="flex justify-end">
        <Button type="submit" @click="trigger('selection')"
          >Apply Changes</Button
        >
      </div>
    </form>
  </section>
</template>
