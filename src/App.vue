<script setup lang="ts">
import { supabase } from "@/utils/supabase";
import Toast from "@/components/ui/Toast.vue";

const testConnection = async () => {
  const { data, error } = await supabase.from("notes").select("*");

  if (error) {
    console.error("Supabase error:", error.message);
    return;
  }

  console.log("Connected successfully:", data);
};

testConnection();
</script>

<template>
  <router-view />
  <Toast />
</template>
