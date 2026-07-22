<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { Icon } from "@iconify/vue";
import { useWebHaptics } from "web-haptics/vue";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div class="flex min-h-full">
    <div
      class="flex flex-col gap-200 w-73 shrink-0 border-r border-neutral-200 p-200"
    >
      <Button
        :to="{ name: 'home.create' }"
        class="text-neutral-0 w-full"
        variant="primary"
        @click="trigger('selection')"
      >
        <Icon icon="local:plus" class="w-5 h-5" />
        Create New Note
      </Button>

      <div class="border border-neutral-200 rounded-8 p-100 bg-neutral-100">
        <p>
          You don’t have any notes yet. Start a new note to capture your
          thoughts and ideas.
        </p>
      </div>
    </div>

    <router-view />
  </div>
</template>
