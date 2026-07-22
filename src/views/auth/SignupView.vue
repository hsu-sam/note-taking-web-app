<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { useWebHaptics } from "web-haptics/vue";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
</script>

<template>
  <div
    class="flex flex-col gap-200 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-130.5 w-full border border-neutral-200"
  >
    <Logo class="self-center" />
    <div class="flex flex-col items-center gap-100">
      <h1>Create Your Account</h1>
      <p>
        Sign up to start organizing your notes and boost your productivity.e
      </p>
    </div>
    <form class="flex flex-col gap-200">
      <Input
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        @click="trigger('selection')"
      />
      <Input label="Password" type="password" @click="trigger('selection')" />
      <Button class="w-full" @click="trigger('selection')">Log In</Button>
    </form>

    <div class="border-t border-neutral-300"></div>

    <div class="flex flex-col gap-200">
      <p class="self-center">Or login with:</p>

      <Button
        class="w-full"
        variant="border"
        icon="local:google"
        @click="trigger('selection')"
      >
        Google
      </Button>
    </div>

    <div class="border-t border-neutral-300"></div>

    <p class="self-center">
      Already have an account?
      <router-link
        :to="{ name: 'auth.login' }"
        class="text-neutral-950 hover:text-neutral-600"
        @click="trigger('selection')"
        >Login</router-link
      >
    </p>
  </div>
</template>
