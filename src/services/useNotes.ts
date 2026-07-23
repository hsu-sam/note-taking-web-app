import { supabase } from "@/utils/supabase";
import { ref } from "vue";
import type { Note } from "@/types/notes";

const notes = ref<Note[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useBookmarks() {
  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("notes")
      .select(
        `
    *,
    note_tags (
      tags (
        id,
        name
      )
    )
  `,
      )
      .order("created_at", { ascending: false });

    if (err) {
      error.value = err.message;
      notes.value = [];
    } else {
      notes.value = (data ?? []) as Note[];
    }

    loading.value = false;
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
  };
}
