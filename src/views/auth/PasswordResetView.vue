<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { Form, type SubmissionHandler } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import { useToast } from "@/composables/useToast";
import { useAuth } from "@/services/useAuth";
import { matchFieldRule, passwordRule } from "@/utils/validators";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { isAuthenticated, initAuth, updatePassword, signOut } = useAuth();
const toast = useToast();
const router = useRouter();

const schema = {
  password: passwordRule,
  "confirm-password": matchFieldRule("password", "Confirm password"),
};

const isSubmitting = ref(false);

onMounted(async () => {
  await initAuth();

  // The recovery link grants a temporary session. If there isn't one, the
  // link is invalid or has expired, so send the user back to request a new
  // one.
  if (!isAuthenticated.value) {
    router.replace({ name: "auth.forgot-password" });
  }
});

const onSubmit: SubmissionHandler = async (values) => {
  isSubmitting.value = true;

  const { error } = await updatePassword(values.password as string);

  if (error) {
    isSubmitting.value = false;
    trigger("error");
    toast.error(error.message);
    return;
  }

  // Force a fresh login with the new password.
  await signOut();
  isSubmitting.value = false;
  trigger("success");
  toast.success("Your password has been updated. Please log in.");
  await router.push({ name: "auth.login" });
};
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
    <Form
      class="flex flex-col gap-200"
      :validation-schema="schema"
      @submit="onSubmit"
    >
      <Input
        name="password"
        label="New Password"
        type="password"
        autocomplete="new-password"
        @click="trigger('selection')"
      >
        <template #helper>
          <span class="flex items-center gap-100 text-xs text-neutral-600">
            <Icon icon="local:info-circle" class="size-4 shrink-0" />
            At least 8 characters
          </span>
        </template>
      </Input>

      <Input
        name="confirm-password"
        label="Confirm New Password"
        type="password"
        autocomplete="new-password"
        @click="trigger('selection')"
      />

      <Button
        class="w-full"
        type="submit"
        :loading="isSubmitting"
        @click="trigger('selection')"
        >Reset Password</Button
      >
    </Form>
  </div>
</template>
