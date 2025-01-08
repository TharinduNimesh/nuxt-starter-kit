<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard
          class="w-full max-w-md mx-auto"
          :ui="{ background: 'dark:bg-zinc-900' }"
        >
          <template #header>
            <div class="text-center">
              <h1 class="text-xl font-semibold">Create Account</h1>
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                Sign up to get started
              </p>
            </div>
          </template>

          <UForm :schema="signUpSchema" :state="form" @submit="onSubmit">
            <UFormGroup label="Email Address" name="email">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
              />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="mt-4">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Create a password"
              />
            </UFormGroup>

            <p class="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Password must be at least 8 characters long with numbers and
              letters
            </p>

            <div class="mt-6">
              <UButton type="submit" block color="primary" :loading="loading">
                Create Account
              </UButton>
            </div>
          </UForm>

          <template #footer>
            <p class="text-sm text-center text-gray-500 dark:text-zinc-400">
              Already have an account?
              <NuxtLink to="/auth/sign-in" class="text-primary font-semibold">
                Sign In
              </NuxtLink>
            </p>
          </template>
        </UCard>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  signInSchema as signUpSchema,
  type SignInSchema as SignUpSchema,
} from "~~/shared/schemas/auth";
import { type FormSubmitEvent } from "#ui/types";

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);

const { signUp } = useAuth();
const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<SignUpSchema>) => {
  try {
    loading.value = true;
    await signUp(event.data);
  } catch (error: any) {
    toast.add({
      id: 'signup-error',
      title: 'Registration Failed',
      description: error?.response?._data?.message || error.message,
      color: 'red',
      timeout: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>
