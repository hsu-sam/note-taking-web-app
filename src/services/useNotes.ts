import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

import { supabase } from "@/utils/supabase";
import type { Note } from "@/types/notes";
import { useAuth } from "@/services/useAuth";

export const NOTES_QUERY_KEY = ["notes"] as const;

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

async function fetchNotesRequest(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Note[];
}

export function useNotes() {
  const { user, isReady } = useAuth();
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: fetchNotesRequest,
    enabled: computed(() => isReady.value && !!user.value),
    staleTime: 30_000,
  });

  const notes = computed(() => notesQuery.data.value ?? []);
  const loading = computed(() => notesQuery.isPending.value);
  const error = computed(() => notesQuery.error.value?.message ?? null);

  const fetchNotes = async () => {
    await notesQuery.refetch();
  };

  const invalidateNotes = () =>
    queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });

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

    await invalidateNotes();

    return { data: note, error: null };
  };

  const getNoteById = async (id: string) => {
    const cached = queryClient.getQueryData<Note[]>(NOTES_QUERY_KEY);
    const cachedNote = cached?.find((note) => note.id === id);

    if (cachedNote) {
      return { data: cachedNote, error: null };
    }

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

    await invalidateNotes();

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

    await invalidateNotes();

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
