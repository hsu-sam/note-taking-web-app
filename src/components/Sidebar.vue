<script setup lang="ts">
import Logo from "@/components/ui/Logo.vue";
import { Icon } from "@iconify/vue";
import { useWebHaptics } from "web-haptics/vue";
import Tags from "./Tags.vue";

interface Section {
  label: string;
  name: string;
  icon: string;
}

const sections: Section[] = [
  {
    label: "All Notes",
    name: "user.index",
    icon: "local:home",
  },
  {
    label: "Archived",
    name: "user.archived",
    icon: "local:archive",
  },
];

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div
    class="flex flex-col gap-200 bg-neutral-0 border-r border-neutral-200 w-68 h-full py-150 px-200"
  >
    <div class="flex items-center justify-between p-150">
      <Logo />
    </div>

    <div class="flex flex-col gap-100">
      <div class="flex flex-col gap-050">
        <router-link
          v-for="section in sections"
          :key="section.name"
          :to="{ name: section.name }"
          :class="{
            'active group': $route.name === section.name,
          }"
          @click="trigger('selection')"
        >
          <div
            class="flex items-center justify-between py-150 px-150 rounded-6 mb-0.5 text-neutral-700 hover:bg-neutral-100 transition-colors group-[.active]:bg-neutral-100 group-[.active]:text-neutral-950"
          >
            <div class="flex items-center gap-100">
              <Icon
                :icon="section.icon"
                class="w-6 h-6"
                :class="
                  $route.name === section.name
                    ? 'text-blue-500 '
                    : 'text-neutral-950'
                "
              />
              <span class="text-preset-3 font-semibold">
                {{ section.label }}
              </span>
            </div>
            <Icon
              icon="local:chevron-right"
              class="w-6 h-6"
              v-if="$route.name === section.name"
            />
          </div>
        </router-link>
      </div>

      <div class="border-t border-neutral-200"></div>

      <Tags />
    </div>
  </div>
</template>
