<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";
</script>

<template>
  <div
    class="flex flex-col gap-400 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-md w-full border border-neutral-200"
  >
    <Logo />
    <div>
      <h1>Welcome to Note</h1>
      <p>Please log in to continue</p>
    </div>
    <form>
      <Input label="Email" type="email" placeholder="Enter your email" />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
      />
      <Button class="w-full">Log In</Button>
    </form>

    <p>No account yet?<span>Sign up</span></p>
  </div>
</template>
