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

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface UpdateNoteResult {
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

  const getNoteById = async (id: string) => {
    const userId = user.value?.id;

    if (!userId) {
      return {
        data: null,
        error: new Error("You must be logged in."),
      };
    }

    const { data, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (noteError) {
      return {
        data: null,
        error: noteError,
      };
    }

    return {
      data: (data as Note | null) ?? null,
      error: null,
    };
  };

  const updateNote = async (
    input: UpdateNoteInput,
  ): Promise<UpdateNoteResult> => {
    const userId = user.value?.id;

    if (!userId) {
      return {
        data: null,
        error: new Error("You must be logged in."),
      };
    }

    const payload: Partial<
      Pick<Note, "title" | "content" | "tags" | "is_archived">
    > = {};

    if (input.title !== undefined) {
      payload.title = input.title.trim() || "Untitled Note";
    }
    if (input.content !== undefined) {
      payload.content = input.content.trim();
    }
    if (input.tags !== undefined) {
      payload.tags = Array.from(
        new Set(
          input.tags.map((tag) => tag.trim()).filter((tag) => Boolean(tag)),
        ),
      );
    }
    if (input.isArchived !== undefined) {
      payload.is_archived = input.isArchived;
    }

    const { data, error: updateError } = await supabase
      .from("notes")
      .update(payload)
      .eq("id", input.id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (updateError || !data) {
      return {
        data: null,
        error: updateError ?? new Error("Could not update note."),
      };
    }

    notes.value = notes.value.map((note) =>
      note.id === input.id ? { ...note, ...payload } : note,
    );

    return { data, error: null };
  };

  const deleteNote = async (id: string) => {
    const userId = user.value?.id;

    if (!userId) {
      return { error: new Error("You must be logged in.") };
    }

    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (deleteError) {
      return { error: deleteError };
    }

    notes.value = notes.value.filter((note) => note.id !== id);

    return { error: null };
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
  };
}

// Backward-compatible alias while files are being migrated.
export const useBookmarks = useNotes;
