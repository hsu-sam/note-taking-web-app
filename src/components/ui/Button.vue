<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";

type ButtonVariant = "primary" | "secondary" | "border" | "danger";

type ButtonSize = "default" | "link";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  to?: RouteLocationRaw;
}

withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "default",
  type: "submit",
  disabled: false,
});

const variants: Record<ButtonVariant, string> = {
  primary:
    "flex items-center justify-center gap-100 text-neutral-0 bg-blue-500 hover:bg-blue-700 rounded-8 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-400 active:bg-blue-700",
  secondary:
    "flex items-center gap-100 text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-0 hover:border border-neutral-300 rounded-8 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-400 active:bg-neutral-0",
  border:
    "flex items-center justify-center gap-100 text-neutral-960 hover:text-neutral-600 bg-neutral-0 hover:bg-neutral-100 hover:border-none border border-neutral-300 rounded-8 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-400 active:bg-neutral-100",
  danger:
    "flex items-center gap-100 text-neutral-0 bg-red-500 hover:bg-red-700 hover:border border-red-700 rounded-8 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-400 active:bg-red-700",
};

const sizes: Record<ButtonSize, string> = {
  default: "py-150 px-200",
  link: "",
};
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    :class="[variants[variant], sizes[size]]"
    class="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[.98] inline-flex"
    :aria-disabled="disabled || loading"
    :tabindex="disabled || loading ? -1 : 0"
    @click="(event) => {
      if (disabled || loading) event.preventDefault();
    }"
  >
    <Icon icon="mdi-light:loading" class="animate-spin" v-if="loading" />
    <Icon v-else-if="icon" :icon class="w-6 h-6" />
    <span class="flex items-center gap-100" v-if="$slots.default">
      <slot />
    </span>
  </RouterLink>
  <button
    v-else
    :type
    :disabled="disabled || loading"
    :class="[variants[variant], sizes[size]]"
    class="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[.98]"
  >
    <Icon icon="mdi-light:loading" class="animate-spin" v-if="loading" />
    <Icon v-else-if="icon" :icon class="w-6 h-6" />
    <span class="flex items-center gap-100" v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>
