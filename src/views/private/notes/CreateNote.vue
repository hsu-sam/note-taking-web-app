<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import { useToast } from "@/composables/useToast";
import { useNotes } from "@/services/useNotes";

const title = ref("");
const tags = ref("");
const content = ref("");
const isSaving = ref(false);

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const toast = useToast();
const router = useRouter();
const { createNote } = useNotes();

function parseTags(rawTags: string): string[] {
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => Boolean(tag));
}

async function saveNote() {
  trigger("selection");

  if (isSaving.value) {
    return;
  }

  const trimmedTitle = title.value.trim();
  const trimmedContent = content.value.trim();

  if (!trimmedTitle && !trimmedContent) {
    trigger("error");
    toast.error("Please add a title or some content before saving.");
    return;
  }

  isSaving.value = true;

  const { error } = await createNote({
    title: trimmedTitle,
    content: trimmedContent,
    tags: parseTags(tags.value),
  });

  isSaving.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  trigger("success");
  toast.success("Note saved.");
  await router.push({ name: "home" });
}
</script>

<template>
  <form
    class="flex gap-200 h-full w-147 shrink-0 flex-col border-r border-neutral-200 p-300"
    @submit.prevent="saveNote"
  >
    <Input
      v-model="title"
      name="note-title"
      variant="ghost"
      placeholder="Enter a title..."
      :required="false"
      class="w-full text-2xl! font-bold! text-neutral-950 placeholder:text-neutral-950"
    />

    <div class="flex gap-150">
      <div class="flex flex-col items-start gap-100 text-sm text-neutral-700">
        <div class="flex items-center gap-075 text-sm text-neutral-700 w-23">
          <Icon icon="local:tag" class="size-4" />
          <span>Tags</span>
        </div>

        <div
          class="flex items-center gap-075 text-sm shrink-0 text-neutral-700"
        >
          <Icon icon="local:circle-clock" class="size-4" />
          <span>Last edited</span>
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col items-start gap-100">
        <Input
          v-model="tags"
          type="text"
          name="note-tags"
          aria-label="Tags"
          placeholder="Add tags separated by commas (e.g. Work, Planning)"
          class="w-full text-sm text-neutral-950 placeholder:text-neutral-400 focus-visible:outline"
          variant="ghost"
        />

        <span class="text-sm text-neutral-400">Not yet saved</span>
      </div>
    </div>

    <div
      class="mt-250 flex min-h-0 flex-1 flex-col border-t border-neutral-200 pt-200"
    >
      <textarea
        v-model="content"
        name="note-content"
        aria-label="Note content"
        placeholder="Start typing your note here..."
        class="min-h-0 flex-1 resize-none text-sm text-neutral-950 placeholder:text-neutral-700 focus-visible:outline-none"
      />
    </div>

    <div class="flex gap-200 border-t border-neutral-200 pt-200">
      <Button type="submit" :loading="isSaving">Save Note</Button>
      <Button
        :to="{ name: 'home' }"
        type="button"
        variant="secondary"
        :disabled="isSaving"
        @click="trigger('selection')"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
