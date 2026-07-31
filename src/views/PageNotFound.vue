<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-200">
    <img
      src="/src/assets/icons/pagenotfound.svg"
      alt="404"
      class="w-1000 h-1000"
    />
    <h1 class="text-3xl font-bold text-neutral-950">Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <Button @click="router.push('/')">Go to Home</Button>
  </div>
</template>
