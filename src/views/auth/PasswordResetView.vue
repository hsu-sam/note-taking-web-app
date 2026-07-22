<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { useWebHaptics } from "web-haptics/vue";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div
    class="flex flex-col gap-400 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-130.5 w-full border border-neutral-200"
  >
    <Logo class="self-center" />
    <div class="flex flex-col items-center gap-100">
      <h1>Reset your password</h1>
      <p>Choose a new password to secure your account.</p>
    </div>
    <form class="flex flex-col gap-200">
      <Input
        label="New Password"
        type="password"
        @click="trigger('selection')"
      />

      <Input
        label="Confirm New Password"
        type="password"
        @click="trigger('selection')"
      />

      <Button class="w-full" @click="trigger('selection')"
        >Reset Password</Button
      >
    </form>
  </div>
</template>
