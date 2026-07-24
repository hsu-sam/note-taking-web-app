<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import { useNotes } from "@/services/useNotes";

const route = useRoute();
const router = useRouter();
const { notes } = useNotes();
const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });

const tags = computed(() => {
  const unique = new Set<string>();
  notes.value.forEach((note) => {
    note.tags?.forEach((tag) => unique.add(tag));
  });
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
});

const activeTag = computed(() => String(route.query.tag ?? ""));

function isTagActive(tag: string) {
  return route.name === "home" && activeTag.value === tag;
}

function selectTag(tag: string) {
  trigger("selection");

  if (isTagActive(tag)) {
    router.push({ name: "home" });
    return;
  }

  router.push({ name: "home", query: { tag } });
}
</script>

<template>
  <div v-if="tags.length > 0" class="flex flex-col gap-050">
    <p class="px-150 py-050 text-sm text-neutral-500">Tags</p>

    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="flex items-center justify-between py-150 px-150 rounded-6 mb-0.5 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
      :class="{
        'bg-neutral-100 text-neutral-950': isTagActive(tag),
      }"
      @click="selectTag(tag)"
    >
      <div class="flex items-center gap-100">
        <Icon
          icon="local:tag"
          class="w-6 h-6"
          :class="isTagActive(tag) ? 'text-blue-500' : 'text-neutral-950'"
        />
        <span class="text-preset-3 font-semibold">{{ tag }}</span>
      </div>
      <Icon
        icon="local:chevron-right"
        class="w-6 h-6"
        v-if="isTagActive(tag)"
      />
    </button>
  </div>
</template>
