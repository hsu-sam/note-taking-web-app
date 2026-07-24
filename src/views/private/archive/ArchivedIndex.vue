<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { Icon } from "@iconify/vue";
import { computed, onMounted } from "vue";
import { useWebHaptics } from "web-haptics/vue";

import Note from "@/components/Note.vue";
import { useNotes } from "@/services/useNotes";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { notes, loading, fetchNotes } = useNotes();

const archivedNotes = computed(() =>
  notes.value.filter((note) => note.is_archived),
);

onMounted(() => {
  void fetchNotes();
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

      <div
        v-if="!loading && archivedNotes.length === 0"
        class="border border-neutral-200 rounded-8 p-100 bg-neutral-100"
      >
        <p>
          No notes have been archived yet. Move notes here for safekeeping,
          or
          <router-link :to="{ name: 'home.create' }" class="underline"
            >create a new note</router-link
          >.
        </p>
      </div>

      <p v-if="loading" class="text-sm text-neutral-500">
        Loading archived notes...
      </p>

      <div v-else-if="archivedNotes.length > 0" class="flex flex-col gap-150">
        <Note v-for="note in archivedNotes" :key="note.id" :note="note" />
      </div>
    </div>

    <router-view />
  </div>
</template>
