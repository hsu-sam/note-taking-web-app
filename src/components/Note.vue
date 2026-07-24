<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import type { Note as NoteType } from "@/types/notes";

const props = defineProps<{
  note: NoteType;
}>();
const route = useRoute();

const editRouteName = computed(() =>
  props.note.is_archived ? "archived.edit" : "home.edit",
);

const isActive = computed(
  () =>
    route.name === editRouteName.value &&
    String(route.params.id ?? "") === props.note.id,
);

const formattedDate = computed(() => {
  const date = new Date(props.note.updated_at || props.note.created_at);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
});

const excerpt = computed(() => {
  const text = props.note.content?.trim() ?? "";
  if (!text) return "No content";
  return text.length > 80 ? `${text.slice(0, 80)}...` : text;
});

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <RouterLink
    :to="{ name: editRouteName, params: { id: note.id } }"
    :class="[
      'flex flex-col gap-150 rounded-8 transition-colors p-100 -m-100',
      isActive ? 'bg-neutral-100' : 'hover:bg-neutral-100',
    ]"
    @click="trigger('selection')"
  >
    <h2>{{ note.title || "Untitled Note" }}</h2>

    <div class="flex gap-100 flex-wrap" v-if="note.tags.length > 0">
      <p
        v-for="tag in note.tags"
        :key="tag"
        class="bg-neutral-100 rounded-4 py-0.5 px-1.5 text-xs"
      >
        {{ tag }}
      </p>
    </div>
    <p class="text-sm text-neutral-400">{{ formattedDate }}</p>
  </RouterLink>

  <div class="border-t border-neutral-200"></div>
</template>
