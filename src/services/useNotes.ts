import { supabase } from "@/utils/supabase";
import { ref } from "vue";
import type { Note } from "@/types/notes";
import { useAuth } from "@/services/useAuth";

const notes = ref<Note[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export interface CreateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface CreateNoteResult {
  data: { id: string } | null;
  error: Error | null;
}

export function useNotes() {
  const { user } = useAuth();

  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      error.value = err.message;
      notes.value = [];
    } else {
      notes.value = (data ?? []) as Note[];
    }

    loading.value = false;
  };

  const createNote = async (
    input: CreateNoteInput,
  ): Promise<CreateNoteResult> => {
    const userId = user.value?.id;

    if (!userId) {
      return {
        data: null,
        error: new Error("You must be logged in."),
      };
    }

    const title = input.title?.trim() ?? "";
    const content = input.content?.trim() ?? "";
    const tagNames = Array.from(
      new Set(
        (input.tags ?? [])
          .map((tag) => tag.trim())
          .filter((tag) => Boolean(tag)),
      ),
    );

    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        title: title || "Untitled Note",
        content,
        tags: tagNames,
        user_id: userId,
        is_archived: input.isArchived ?? false,
      })
      .select("id")
      .single();

    if (noteError || !note) {
      return {
        data: null,
        error: noteError ?? new Error("Could not create note."),
      };
    }

    return { data: note, error: null };
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
  };
}

// Backward-compatible alias while files are being migrated.
export const useBookmarks = useNotes;
