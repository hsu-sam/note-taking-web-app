<script setup lang="ts">
import { Icon } from "@iconify/vue";

import { useToast, type ToastType } from "@/composables/useToast";

const { toasts, dismiss } = useToast();

const icons: Record<ToastType, string> = {
  success: "local:check-circle",
  error: "lucide:alert-circle",
};

const iconStyles: Record<ToastType, string> = {
  success: "text-green-500",
  error: "text-red-500",
};

const borderStyles: Record<ToastType, string> = {
  success: "border-green-500",
  error: "border-red-500",
};
</script>

<template>
  <div
    class="fixed bottom-200 right-200 z-50 flex flex-col items-end gap-100"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="alert"
        class="flex items-center gap-100 w-80 max-w-full px-200 py-150 rounded-8 border bg-neutral-0 shadow-lg text-small font-medium text-neutral-950"
        :class="borderStyles[toast.type]"
      >
        <Icon
          :icon="icons[toast.type]"
          class="size-5 shrink-0"
          :class="iconStyles[toast.type]"
        />
        <p class="flex-1">{{ toast.message }}</p>
        <button
          type="button"
          class="cursor-pointer shrink-0 text-neutral-500 hover:text-neutral-950"
          aria-label="Dismiss notification"
          @click="dismiss(toast.id)"
        >
          <Icon icon="local:close-remove" class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.toast-move {
  transition: transform 0.2s ease;
}
</style>
