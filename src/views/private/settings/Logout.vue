<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuth } from "@/services/useAuth";

const router = useRouter();
const { signOut } = useAuth();

onMounted(async () => {
  await signOut();
  await router.replace({ name: "auth.login" });
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p>Logging out…</p>
  </div>
</template>
