<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";

const oldPassword = ref("");
const newPassword = ref("");
const confirmedPassword = ref("");

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });

function savePassword() {
  trigger("selection");
}
</script>

<template>
  <section class="max-w-132 flex flex-col gap-400">
    <h1 class="text-base! font-bold! text-neutral-950">Change Password</h1>

    <form class="flex flex-col gap-250" @submit.prevent="savePassword">
      <Input
        v-model="oldPassword"
        name="old-password"
        label="Old Password"
        type="password"
        autocomplete="current-password"
        :required="false"
        class="text-sm text-neutral-950"
      />

      <Input
        v-model="newPassword"
        name="new-password"
        label="New Password"
        type="password"
        autocomplete="new-password"
        :required="false"
        class="text-sm text-neutral-950"
      >
        <template #helper>
          <span class="flex items-center gap-100 text-xs text-neutral-600">
            <Icon icon="local:info-circle" class="size-4 shrink-0" />
            At least 8 characters
          </span>
        </template>
      </Input>

      <Input
        v-model="confirmedPassword"
        name="confirm-new-password"
        label="Confirm New Password"
        type="password"
        autocomplete="new-password"
        :required="false"
        class="text-sm text-neutral-950"
      />

      <div class="flex justify-end">
        <Button type="submit">Save Password</Button>
      </div>
    </form>
  </section>
</template>
