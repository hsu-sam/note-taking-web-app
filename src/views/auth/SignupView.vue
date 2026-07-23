<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import { useToast } from "@/composables/useToast";
import { useAuth } from "@/services/useAuth";
import { emailRule, passwordRule } from "@/utils/validators";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { signUp } = useAuth();
const toast = useToast();
const router = useRouter();

const schema = {
  email: emailRule,
  password: passwordRule,
};

const isSubmitting = ref(false);

const onSubmit: SubmissionHandler = async (values, actions) => {
  isSubmitting.value = true;

  const { data, error } = await signUp(
    values.email as string,
    values.password as string,
  );

  isSubmitting.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  trigger("success");

  if (data.session) {
    await router.push({ name: "home" });
    return;
  }

  toast.success(
    "Check your inbox to confirm your email address before logging in.",
  );
  actions.resetForm();
};
</script>

<template>
  <div
    class="flex flex-col gap-200 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-130.5 w-full border border-neutral-200"
  >
    <Logo class="self-center" />
    <div class="flex flex-col items-center gap-100">
      <h1>Create Your Account</h1>
      <p>
        Sign up to start organizing your notes and boost your productivity.
      </p>
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
      <Input
        name="password"
        label="Password"
        type="password"
        autocomplete="new-password"
        @click="trigger('selection')"
      >
        <template #helper>
          <span class="text-xs text-neutral-600">At least 8 characters</span>
        </template>
      </Input>

      <Button
        class="w-full"
        type="submit"
        :loading="isSubmitting"
        @click="trigger('selection')"
        >Sign Up</Button
      >
    </Form>

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
