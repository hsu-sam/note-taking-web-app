import { supabase } from "@/utils/supabase";
import { ref } from "vue";

import type { Tag } from "@/types/tags";

const tags = ref<Tag[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useBookmarks() {
  const fetchBookmarks = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("tags")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      error.value = err.message;
      tags.value = [];
    } else {
      tags.value = (data ?? []) as Tag[];
    }

    loading.value = false;
  };

  return {
    tags,
    loading,
    error,
    fetchBookmarks,
  };
}
