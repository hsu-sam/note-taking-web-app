<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import ArchiveModal from "@/components/modal/ArchiveModal.vue";
import DeleteModal from "@/components/modal/DeleteModal.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import { useToast } from "@/composables/useToast";
import { useNotes } from "@/services/useNotes";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { getNoteById, updateNote, deleteNote } = useNotes();

const title = ref("");
const tags = ref("");
const content = ref("");
const updatedAt = ref<string | null>(null);
const isArchived = ref(false);

const isLoading = ref(true);
const isArchiving = ref(false);
const isSaving = ref(false);
const isRestoring = ref(false);
const isDeleting = ref(false);
const isArchiveModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const noteId = computed(() => String(route.params.id ?? ""));

const formattedUpdatedAt = computed(() => {
  if (!updatedAt.value) return "Not yet saved";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(updatedAt.value));
});

function parseTags(rawTags: string): string[] {
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => Boolean(tag));
}

async function loadNote() {
  if (!noteId.value) {
    toast.error("Invalid note id.");
    await router.push({ name: "home" });
    return;
  }

  isLoading.value = true;
  const { data, error } = await getNoteById(noteId.value);
  isLoading.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    await router.push({ name: "home" });
    return;
  }

  if (!data) {
    trigger("error");
    toast.error("Note not found.");
    await router.push({ name: "home" });
    return;
  }

  title.value = data.title ?? "";
  content.value = data.content ?? "";
  tags.value = (data.tags ?? []).join(", ");
  updatedAt.value = data.updated_at ?? data.created_at ?? null;
  isArchived.value = data.is_archived ?? false;
}

async function saveNote() {
  trigger("selection");
  if (isSaving.value || isLoading.value) return;

  const trimmedTitle = title.value.trim();
  const trimmedContent = content.value.trim();

  if (!trimmedTitle && !trimmedContent) {
    trigger("error");
    toast.error("Please add a title or some content before saving.");
    return;
  }

  isSaving.value = true;
  const { error } = await updateNote({
    id: noteId.value,
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
  toast.success("Note updated.");
  await router.push({ name: "home" });
}

async function archiveNote() {
  if (isArchiving.value) return;

  isArchiving.value = true;
  const { error } = await updateNote({ id: noteId.value, isArchived: true });
  isArchiving.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  isArchiveModalOpen.value = false;
  trigger("success");
  toast.success("Note archived.");
  await router.push({ name: "home" });
}

async function restoreNote() {
  if (isRestoring.value) return;

  trigger("selection");
  isRestoring.value = true;
  const { error } = await updateNote({ id: noteId.value, isArchived: false });
  isRestoring.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  trigger("success");
  toast.success("Note restored.");
  await router.push({ name: "user.archived" });
}

async function removeNote() {
  if (isDeleting.value) return;

  isDeleting.value = true;
  const { error } = await deleteNote(noteId.value);
  isDeleting.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  isDeleteModalOpen.value = false;
  trigger("success");
  toast.success("Note deleted.");
  await router.push({
    name: isArchived.value ? "user.archived" : "home",
  });
}

onMounted(() => {
  void loadNote();
});
</script>

<template>
  <form
    class="flex gap-200 h-full w-147 shrink-0 flex-col border-r border-neutral-200 p-300"
    @submit.prevent="saveNote"
  >
    <template v-if="isLoading">
      <p class="text-sm text-neutral-500">Loading note...</p>
    </template>

    <template v-else>
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
            v-if="isArchived"
            class="flex items-center gap-075 text-sm shrink-0 text-neutral-700"
          >
            <Icon icon="local:archive" class="size-4" />
            <span>Status</span>
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

          <span v-if="isArchived" class="text-sm text-neutral-700"
            >Archived</span
          >

          <span class="text-sm text-neutral-400">{{ formattedUpdatedAt }}</span>
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
          :to="isArchived ? { name: 'user.archived' } : { name: 'home' }"
          type="button"
          variant="secondary"
          :disabled="isSaving"
          @click="trigger('selection')"
        >
          Cancel
        </Button>
      </div>
    </template>
  </form>

  <div class="flex flex-col gap-200 w-70 px-200 py-250">
    <Button
      v-if="isArchived"
      type="button"
      variant="border"
      icon="local:refresh-left"
      class="w-full"
      :loading="isRestoring"
      @click="restoreNote"
      >Restore Note</Button
    >
    <Button
      v-else
      type="button"
      variant="border"
      icon="local:archive"
      class="w-full justify-start"
      @click="
        trigger('selection');
        isArchiveModalOpen = true;
      "
      >Archive Note</Button
    >
    <Button
      type="button"
      variant="border"
      icon="local:delete"
      class="w-full justify-start"
      @click="
        trigger('selection');
        isDeleteModalOpen = true;
      "
      >Delete Note</Button
    >
  </div>

  <ArchiveModal
    v-model="isArchiveModalOpen"
    :loading="isArchiving"
    @confirm="archiveNote"
  />
  <DeleteModal
    v-model="isDeleteModalOpen"
    :loading="isDeleting"
    @confirm="removeNote"
  />
</template>
