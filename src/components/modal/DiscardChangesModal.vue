<script setup lang="ts">
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";
import Modal from "@/components/modal.vue";

const isOpen = defineModel<boolean>();

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });

function cancel() {
  trigger("selection");
  isOpen.value = false;
  emit("cancel");
}

function confirmDiscard() {
  trigger("selection");
  isOpen.value = false;
  emit("confirm");
}
</script>

<template>
  <Modal
    v-model="isOpen"
    hide-default-close
    dialog-class="bg-neutral-0 border-neutral-200 rounded-16 p-0 overflow-hidden"
    @close="cancel"
  >
    <template #main>
      <div class="flex flex-col">
        <div class="flex flex-col gap-075 p-200">
          <h2>Unsaved changes</h2>
          <p class="text-sm text-neutral-600">
            You have unsaved changes. Do you want to discard them and continue?
          </p>
        </div>

        <div class="border-t border-neutral-200"></div>

        <div class="flex justify-end gap-200 py-200 px-250">
          <Button type="button" variant="secondary" @click="cancel">
            Keep editing
          </Button>
          <Button type="button" variant="primary" @click="confirmDiscard">
            Discard changes
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
