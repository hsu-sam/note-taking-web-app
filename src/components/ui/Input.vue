<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ErrorMessage, Field } from "vee-validate";
import { ref } from "vue";

export interface InputProps {
  type?: HTMLInputElement["type"];
  autocomplete?: string;
  label?: string;
  name: string;
  variant?: "default" | "ghost";
  disabled?: boolean;
  isValid?: boolean;
  required?: boolean;
}
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  variant: "default",
  required: true,
});

const model = defineModel();

const reactiveType = ref(props.type);
</script>
<template>
  <Field
    validateOnChange
    :name
    v-model="model"
    v-slot="{ field, meta, errorMessage }"
  >
    <label
      :class="[
        'flex flex-col gap-1.5 has-disabled:opacity-40 text-small',
        $attrs.class,
      ]"
    >
      <span v-if="label" class="font-semibold">
        {{ label }} <em class="text-red-500 not-italic" v-if="required">*</em>
      </span>

      <div
        class="input-container relative flex items-center font-medium"
        :class="[
          variant === 'default'
            ? 'rounded-8 border border-neutral-300 px-200 py-150'
            : 'rounded-4',
          {
            'text-green-600': isValid,
            'text-error': meta.touched && !meta.valid,
          },
        ]"
      >
        <input
          :autocomplete
          v-bind="{ ...field, ...$attrs }"
          :name
          :disabled
          :type="reactiveType"
          :class="{
            'bg-green-600': isValid,
            'border-error': meta.touched && !meta.valid,
          }"
          class="min-w-0 flex-1 focus-visible:outline-none"
        />
        <div
          :class="{
            error: meta.touched && !meta.valid,
          }"
          class="flex justify-center items-center h-full"
        >
          <slot name="suffix">
            <button
              type="button"
              v-if="type === 'password'"
              class="cursor-pointer"
            >
              <Icon
                v-if="reactiveType === 'password'"
                @click="reactiveType = 'text'"
                icon="lucide:eye"
                class="text-secondary-gray"
              />
              <Icon
                v-else
                @click="reactiveType = 'password'"
                icon="lucide:eye-off"
                class="text-secondary-gray"
              />
            </button>
          </slot>
        </div>
      </div>
      <slot v-if="!errorMessage" name="helper" class="font-medium"></slot>
      <ErrorMessage :name class="font-medium text-error" />
    </label>
  </Field>
</template>
<style scoped>
@reference "../../assets/css/main.css";

.valid {
}

.error {
}

.input-container:has(:focus-visible) {
  @apply outline-1 outline-offset-1 outline-neutral-400;
}
</style>
