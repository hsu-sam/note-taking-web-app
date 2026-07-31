<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import Note from "@/components/Note.vue";
import { matchesNoteSearch, useNoteSearch } from "@/composables/useNoteSearch";
import { useNotes } from "@/services/useNotes";
const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { notes, loading } = useNotes();
const { debouncedQuery } = useNoteSearch();
const route = useRoute();

const activeTag = computed(() => String(route.query.tag ?? ""));

const activeNotes = computed(() => {
  const withoutArchived = notes.value.filter((note) => !note.is_archived);

  const byTag = activeTag.value
    ? withoutArchived.filter((note) => note.tags?.includes(activeTag.value))
    : withoutArchived;

  return byTag.filter((note) => matchesNoteSearch(note, debouncedQuery.value));
});
</script>

<template>
  <div class="flex min-h-full">
    <div
      class="flex flex-col gap-200 w-73 shrink-0 border-r border-neutral-200 p-200"
    >
      <Button
        :to="{ name: 'home.create' }"
        class="text-neutral-0 w-full"
        variant="primary"
        @click="trigger('selection')"
      >
        <Icon icon="local:plus" class="w-5 h-5" />
        Create New Note
      </Button>

      <div class="flex flex-col gap-200 scrollbar-none overflow-y-auto">
        <p v-if="activeTag">
          All notes with the ”{{ activeTag }}” tag are shown here.
        </p>

        <div
          v-if="!loading && activeNotes.length === 0"
          class="border border-neutral-200 rounded-8 p-100 bg-neutral-100"
        >
          <p v-if="debouncedQuery">No notes match “{{ debouncedQuery }}”.</p>
          <p v-else-if="activeTag">
            No notes found with the tag “{{ activeTag }}”.
          </p>
          <p v-else>
            You don’t have any notes yet. Start a new note to capture your
            thoughts and ideas.
          </p>
        </div>

        <p v-if="loading" class="text-sm text-neutral-500">Loading notes...</p>

        <div v-else-if="activeNotes.length > 0" class="flex flex-col gap-150">
          <Note v-for="note in activeNotes" :key="note.id" :note="note" />
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>
