<script setup lang="ts">
import MainHeader from "@/components/MainHeader.vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Right Section -->
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <div class="shrink-0">
        <MainHeader />
      </div>

      <!-- Main Content -->
      <main class="flex min-h-0 flex-1">
        <div class="flex min-h-full flex-1 flex-col">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
