<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import Logo from "@/components/ui/Logo.vue";

import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebHaptics } from "web-haptics/vue";

import { useToast } from "@/composables/useToast";
import { useAuth } from "@/services/useAuth";
import { emailRule, requiredRule } from "@/utils/validators";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { signIn } = useAuth();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const schema = {
  email: emailRule,
  password: requiredRule("Password"),
};

const isSubmitting = ref(false);

const onSubmit: SubmissionHandler = async (values) => {
  isSubmitting.value = true;

  const { error } = await signIn(
    values.email as string,
    values.password as string,
  );

  isSubmitting.value = false;

  if (error) {
    trigger("error");
    toast.error("Incorrect email or password. Please try again.");
    return;
  }

  trigger("success");
  const redirect = route.query.redirect;
  await router.push(typeof redirect === "string" ? redirect : { name: "home" });
};
</script>

<template>
  <div
    class="flex flex-col gap-200 px-200 py-500 md:px-400 md:py-600 bg-neutral-0 rounded-12 md:max-w-130.5 w-full border border-neutral-200"
  >
    <Logo class="self-center" />
    <div class="flex flex-col items-center gap-100">
      <h1>Welcome to Note</h1>
      <p>Please log in to continue</p>
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
        autocomplete="current-password"
        @click="trigger('selection')"
      />

      <Button
        class="w-full"
        type="submit"
        :loading="isSubmitting"
        @click="trigger('selection')"
        >Log In</Button
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
      No account yet?
      <router-link
        :to="{ name: 'auth.signup' }"
        class="text-neutral-950 hover:text-neutral-600"
        @click="trigger('selection')"
        >Sign up</router-link
      >
    </p>
  </div>
</template>
