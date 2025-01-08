<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard class="w-full max-w-md mx-auto" :ui="{ background: 'dark:bg-zinc-900' }">
          <template #header>
            <div class="text-center">
              <h1 class="text-xl font-semibold">Change Password</h1>
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                Create a new password for<br>
                <span class="font-medium text-gray-900 dark:text-white">user@example.com</span>
              </p>
            </div>
          </template>

          <UForm :schema="changePasswordSchema" @submit="onSubmit">
            <UFormGroup label="New Password" name="password">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="Enter new password"
              />
            </UFormGroup>

            <UFormGroup label="Confirm Password" name="confirmPassword" class="mt-4">
              <UInput
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </UFormGroup>

            <p class="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Password must be at least 8 characters long with numbers and letters
            </p>

            <div class="mt-6">
              <UButton type="submit" block color="primary" :loading="loading">
                Change Password
              </UButton>
            </div>
          </UForm>

          <template #footer>
            <p class="text-sm text-center text-gray-500 dark:text-zinc-400">
              Remember your password?
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
import { ref } from 'vue';

const changePasswordSchema = {
  password: {
    required: true,
    min: 8,
  },
  confirmPassword: {
    required: true,
    same: '@password',
  }
};

const form = ref({
  password: '',
  confirmPassword: '',
});

const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  loading.value = false;
  // Simulate successful password change
  navigateTo('/auth/sign-in');
};
</script>