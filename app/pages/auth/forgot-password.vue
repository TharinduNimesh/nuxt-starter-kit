<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard class="w-full max-w-md mx-auto" :ui="{ background: 'dark:bg-zinc-900' }">
          <template #header>
            <div class="text-center">
              <h1 class="text-xl font-semibold">Reset Password</h1>
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                {{ !emailSent ? 'Enter your email to reset your password' : 'Check your email' }}
              </p>
            </div>
          </template>

          <div v-if="!emailSent">
            <UForm :schema="forgotPasswordSchema" @submit="onSubmit">
              <UFormGroup label="Email Address" name="email">
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                />
              </UFormGroup>

              <div class="mt-6">
                <UButton type="submit" block color="primary" :loading="loading">
                  Send Reset Link
                </UButton>
              </div>
            </UForm>
          </div>

          <div v-else class="text-center space-y-4">
            <UIcon name="i-heroicons-envelope-open" class="text-4xl text-primary mx-auto"/>
            <p class="text-sm text-gray-600 dark:text-zinc-400">
              We've sent a password reset link to<br>
              <span class="font-medium text-gray-900 dark:text-white">{{ form.email }}</span>
            </p>
            <UButton 
              variant="link" 
              :disabled="resendTimer > 0"
              @click="handleResend"
            >
              Resend email {{ resendTimer > 0 ? `(${resendTimer}s)` : '' }}
            </UButton>
          </div>

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

const forgotPasswordSchema = {
  email: {
    required: true,
    email: true,
  }
};

const form = ref({
  email: '',
});

const loading = ref(false);
const emailSent = ref(false);
const resendTimer = ref(0);

const onSubmit = async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  emailSent.value = true;
  loading.value = false;
  startResendTimer();
};

const startResendTimer = () => {
  resendTimer.value = 120; // 2 minutes
  const timer = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleResend = async () => {
  if (resendTimer.value > 0) return;
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  loading.value = false;
  startResendTimer();
};
</script>