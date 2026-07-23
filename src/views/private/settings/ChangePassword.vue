<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Form, type SubmissionHandler } from "vee-validate";
import { ref } from "vue";
import { useWebHaptics } from "web-haptics/vue";

import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import { useToast } from "@/composables/useToast";
import { useAuth } from "@/services/useAuth";
import { matchFieldRule, passwordRule, requiredRule } from "@/utils/validators";

const { trigger } = useWebHaptics({ debug: import.meta.env.DEV });
const { user, signIn, updatePassword } = useAuth();
const toast = useToast();

const schema = {
  "old-password": requiredRule("Old password"),
  "new-password": passwordRule,
  "confirm-new-password": matchFieldRule(
    "new-password",
    "Confirm new password",
  ),
};

const isSubmitting = ref(false);

const savePassword: SubmissionHandler = async (values, actions) => {
  if (!user.value?.email) {
    toast.error("You need to be logged in to change your password.");
    return;
  }

  isSubmitting.value = true;

  // Re-authenticate with the old password before allowing the change.
  const { error: signInError } = await signIn(
    user.value.email,
    values["old-password"] as string,
  );

  if (signInError) {
    isSubmitting.value = false;
    trigger("error");
    actions.setFieldError("old-password", "Your current password is incorrect");
    return;
  }

  const { error } = await updatePassword(values["new-password"] as string);

  isSubmitting.value = false;

  if (error) {
    trigger("error");
    toast.error(error.message);
    return;
  }

  trigger("success");
  toast.success("Your password has been updated.");
  actions.resetForm();
};
</script>

<template>
  <section class="max-w-132 flex flex-col gap-400">
    <h1 class="text-base! font-bold! text-neutral-950">Change Password</h1>

    <Form
      class="flex flex-col gap-250"
      :validation-schema="schema"
      @submit="savePassword"
    >
      <Input
        name="old-password"
        label="Old Password"
        type="password"
        autocomplete="current-password"
        class="text-sm text-neutral-950"
      />

      <Input
        name="new-password"
        label="New Password"
        type="password"
        autocomplete="new-password"
        class="text-sm text-neutral-950"
      >
        <template #helper>
          <span class="flex items-center gap-100 text-xs text-neutral-600">
            <Icon icon="local:info-circle" class="size-4 shrink-0" />
            At least 8 characters
          </span>
        </template>
      </Input>

      <Input
        name="confirm-new-password"
        label="Confirm New Password"
        type="password"
        autocomplete="new-password"
        class="text-sm text-neutral-950"
      />

      <div class="flex justify-end">
        <Button type="submit" :loading="isSubmitting">Save Password</Button>
      </div>
    </Form>
  </section>
</template>
