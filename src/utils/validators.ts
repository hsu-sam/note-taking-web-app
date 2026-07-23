import type { GenericValidateFunction } from "vee-validate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Ensures a field has a non-empty value.
 */
export function requiredRule(
  label = "This field",
): GenericValidateFunction<string> {
  return (value) => {
    if (!value || !value.trim()) {
      return `${label} is required`;
    }
    return true;
  };
}

/**
 * Validates that a field contains a well-formed email address.
 */
export const emailRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) {
    return "Email address is required";
  }
  if (!EMAIL_REGEX.test(value.trim())) {
    return "Please enter a valid email address";
  }
  return true;
};

/**
 * Validates that a password meets the minimum strength requirements.
 */
export const passwordRule: GenericValidateFunction<string> = (value) => {
  if (!value) {
    return "Password is required";
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return true;
};

/**
 * Validates that a field's value matches another field in the same form,
 * e.g. confirming a password. `ctx.form` is populated by vee-validate with
 * the current values of every field registered in the form.
 */
export function matchFieldRule(
  fieldToMatch: string,
  label = "This field",
): GenericValidateFunction<string> {
  return (value, ctx) => {
    if (!value) {
      return `${label} is required`;
    }
    if (value !== ctx.form[fieldToMatch]) {
      return "Passwords do not match";
    }
    return true;
  };
}
