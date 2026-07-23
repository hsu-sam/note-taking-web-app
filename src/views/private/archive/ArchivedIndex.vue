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

      <p>
        All your archived notes are stored here. You can restore or delete them
        anytime.
      </p>

      <div class="border border-neutral-200 rounded-8 p-100 bg-neutral-100">
        <p>
          No notes have been archived yet. Move notes here for safekeeping, or
          <router-link :to="{ name: 'home.create' }" class="underline"
            >create a new note</router-link
          >.
        </p>
      </div>
    </div>

    <router-view />
  </div>
</template>
