<script setup lang="ts">
import SearchInput from "@/components/ui/SearchInput.vue";
import { Icon } from "@iconify/vue";
import { useWebHaptics } from "web-haptics/vue";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div
    class="flex items-center justify-between p-400 bg-white border-b border-neutral-200 h-20.25"
  >
    <h1>All Notes</h1>
    <div class="flex items-center gap-075">
      <SearchInput
        placeholder="Search by title, content, tags..."
        class="w-75"
        @click="trigger('selection')"
      />
      <router-link
        :to="{ name: 'settings' }"
        class="rounded-6 p-100 text-neutral-500"
        @click="trigger('selection')"
        :class="{
          'text-neutral-950': String($route.name).startsWith('settings'),
        }"
      >
        <Icon icon="local:setting" class="text-2xl" />
      </router-link>
    </div>
  </div>
</template>
