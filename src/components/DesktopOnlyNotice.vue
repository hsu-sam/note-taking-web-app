<script setup lang="ts">
import Logo from "@/components/ui/Logo.vue";
import { Icon } from "@iconify/vue";
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-300 bg-neutral-0 p-300 text-center lg:hidden"
  >
    <Logo />
    <div
      class="flex size-1000 items-center justify-center rounded-999 bg-blue-50"
    >
      <Icon icon="mdi:monitor" class="size-500 text-blue-500" />
    </div>
    <div class="flex flex-col gap-100">
      <h1 class="text-2xl font-bold text-neutral-950">
        Mobile & tablet coming soon
      </h1>
      <p class="max-w-88 text-sm text-neutral-600">
        We're still building the mobile and tablet experience. Please use a
        desktop computer to access your notes for now.
      </p>
    </div>
  </div>
</template>
