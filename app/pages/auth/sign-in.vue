<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard class="w-full max-w-md mx-auto" :ui="{ background: 'dark:bg-zinc-900' }">
          <template #header>
            <div class="text-center">
              <h1 class="text-xl font-semibold">Sign In</h1>
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                Welcome back! Please sign in to continue.
              </p>
            </div>
          </template>

          <UForm :schema="signInSchema" :state="form" @submit="onSubmit">
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
                placeholder="Enter your password"
              />
            </UFormGroup>

            <div class="flex justify-between items-center">
              <UCheckbox v-model="rememberMe" label="Remember me" />
              <UButton
                variant="link"
                to="/auth/forgot-password"
                color="primary"
              >
                Forgot Password?
              </UButton>
            </div>

            <div class="mt-6">
              <UButton type="submit" block color="primary" :loading="loading">
                Sign In
              </UButton>
            </div>
          </UForm>

          <template #footer>
            <p class="text-sm text-center text-gray-500 dark:text-zinc-400">
              <template v-if="isSignUpEnabled">
                Don't have an account?
                <NuxtLink to="/auth/sign-up" class="text-primary font-semibold">
                  Sign Up
                </NuxtLink>
              </template>
            </p>
          </template>
        </UCard>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { signInSchema, type SignInSchema } from "~~/shared/schemas/auth";
import { type FormSubmitEvent } from "#ui/types";

const form = ref({
  email: "",
  password: "",
});

const rememberMe = ref(false);
const loading = ref(false);

const { signIn } = useAuth();
const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<SignInSchema>) => {
  try {
    loading.value = true
    await signIn(event.data)
  } catch (error: any) {
    toast.add({
      id: 'auth-error',
      title: 'Authentication Failed',
      description: error?.response?._data?.message || error.message,
      color: 'red',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

const config = useRuntimeConfig()
const isSignUpEnabled = config.public.isSignUpEnabled
</script>
