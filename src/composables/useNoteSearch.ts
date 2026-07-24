import { ref, watch } from "vue";

import type { Note } from "@/types/notes";

const searchQuery = ref("");
const debouncedQuery = ref("");

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchQuery, (value) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = value;
  }, 200);
});

export function matchesNoteSearch(note: Note, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const inTitle = note.title?.toLowerCase().includes(normalized) ?? false;
  const inContent = note.content?.toLowerCase().includes(normalized) ?? false;
  const inTags = (note.tags ?? []).some((tag) =>
    tag.toLowerCase().includes(normalized),
  );

  return inTitle || inContent || inTags;
}

export function useNoteSearch() {
  return { searchQuery, debouncedQuery };
}
