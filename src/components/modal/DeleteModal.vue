<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";
import Modal from "@/components/modal.vue";

interface DeleteModalProps {
  loading?: boolean;
}

withDefaults(defineProps<DeleteModalProps>(), {
  loading: false,
});

const isOpen = defineModel<boolean>();

const emit = defineEmits<{
  confirm: [];
}>();

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });

function cancel() {
  trigger("selection");
  isOpen.value = false;
}

function confirmDelete() {
  trigger("selection");
  emit("confirm");
}
</script>

<template>
  <Modal
    v-model="isOpen"
    hide-default-close
    dialog-class="bg-neutral-0 border-neutral-200 rounded-16 p-0 overflow-hidden"
  >
    <template #main>
      <div class="flex flex-col">
        <div class="flex items-start gap-200 p-200">
          <div
            class="flex shrink-0 items-center justify-center rounded-8 bg-neutral-100 p-200"
          >
            <Icon icon="local:delete" class="size-6 text-neutral-950" />
          </div>

          <div class="flex flex-col gap-075">
            <h2>Delete Note</h2>
            <p class="text-sm text-neutral-600">
              Are you sure you want to permanently delete this note? This action
              cannot be undone.
            </p>
          </div>
        </div>

        <div class="border-t border-neutral-200"></div>

        <div class="flex justify-end gap-200 py-200 px-250">
          <Button
            type="button"
            variant="secondary"
            :disabled="loading"
            @click="cancel"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            :loading="loading"
            @click="confirmDelete"
          >
            Delete Note
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
