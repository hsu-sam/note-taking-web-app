<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";

type FontTheme = "sans-serif" | "serif" | "monospace";

interface FontOption {
  value: FontTheme;
  label: string;
  description: string;
  icon: string;
}

const fontOptions: FontOption[] = [
  {
    value: "sans-serif",
    label: "Sans-serif",
    description: "Clean and modern, easy to read.",
    icon: "local:sans-serif",
  },
  {
    value: "serif",
    label: "Serif",
    description: "Classic and elegant for a timeless feel.",
    icon: "local:serif",
  },
  {
    value: "monospace",
    label: "Monospace",
    description: "Code-like, great for a technical vibe.",
    icon: "local:monospace",
  },
];

const savedFont = localStorage.getItem("font-theme");
const selectedFont = ref<FontTheme>(
  savedFont === "serif" || savedFont === "monospace"
    ? savedFont
    : "sans-serif",
);

function applyFont() {
  localStorage.setItem("font-theme", selectedFont.value);
  document.documentElement.dataset.fontTheme = selectedFont.value;
}

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <section class="max-w-132 flex flex-col gap-300">
    <div>
      <h1 class="text-base! font-bold! text-neutral-950">Font Theme</h1>
      <p class="mt-050 text-sm text-neutral-700">Choose your font theme:</p>
    </div>

    <form class="flex flex-col gap-200" @submit.prevent="applyFont">
      <fieldset>
        <legend class="sr-only">Choose a font theme</legend>

        <div class="flex flex-col gap-200">
          <label
            v-for="font in fontOptions"
            :key="font.value"
            class="flex min-h-18 cursor-pointer items-center gap-200 rounded-12 border p-200 transition-colors"
            :class="
              selectedFont === font.value
                ? 'border-neutral-100 bg-neutral-100'
                : 'border-neutral-200 bg-neutral-0 hover:bg-neutral-50'
            "
            @click="trigger('selection')"
          >
            <input
              v-model="selectedFont"
              class="peer sr-only"
              type="radio"
              name="font-theme"
              :value="font.value"
            />

            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-12 border border-neutral-200 bg-neutral-0 text-neutral-950"
            >
              <Icon :icon="font.icon" class="size-6" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-neutral-950">
                {{ font.label }}
              </span>
              <span class="mt-050 block text-xs text-neutral-700">
                {{ font.description }}
              </span>
            </span>

            <span
              class="flex size-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500"
              aria-hidden="true"
            >
              <span
                v-if="selectedFont === font.value"
                class="size-2 rounded-full bg-blue-500"
              />
            </span>
          </label>
        </div>
      </fieldset>

      <div class="flex justify-end">
        <Button type="submit" @click="trigger('selection')">
          Apply Changes
        </Button>
      </div>
    </form>
  </section>
</template>
