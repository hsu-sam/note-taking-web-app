<script setup lang="ts">
import Toast from "@/components/ui/Toast.vue";
import DesktopOnlyNotice from "@/components/DesktopOnlyNotice.vue";
</script>

<template>
  <div class="hidden lg:contents">
    <router-view />
  </div>
  <DesktopOnlyNotice />
  <Toast />
</template>
