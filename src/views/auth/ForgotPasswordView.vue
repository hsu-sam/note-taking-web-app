<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useWebHaptics } from "web-haptics/vue";

import { useToast } from "@/composables/useToast";
import { useAuth } from "@/services/useAuth";
import { emailRule } from "@/utils/validators";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { sendPasswordReset } = useAuth();
const toast = useToast();

const schema = {
  email: emailRule,
};

const isSubmitting = ref(false);

const onSubmit: SubmissionHandler = async (values, actions) => {
  isSubmitting.value = true;

  const { error } = await sendPasswordReset(values.email as string);

  isSubmitting.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  trigger("success");
  toast.success(
    "If an account exists for that email, we've sent a link to reset your password.",
  );
  actions.resetForm();
};
</script>

<template>
  <div
    class="flex flex-col gap-400 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-130.5 w-full border border-neutral-200"
  >
    <Logo class="self-center" />
    <div class="flex flex-col items-center gap-100">
      <h1>Forgotten your password?</h1>
      <p>Enter your email below, and we’ll send you a link to reset it.</p>
    </div>
    <Form
      class="flex flex-col gap-200"
      :validation-schema="schema"
      @submit="onSubmit"
    >
      <Input
        name="email"
        label="Email Address"
        type="email"
        autocomplete="email"
        placeholder="email@example.com"
        @click="trigger('selection')"
      />

      <Button
        class="w-full"
        type="submit"
        :loading="isSubmitting"
        @click="trigger('selection')"
        >Send Reset Link</Button
      >
    </Form>
  </div>
</template>
