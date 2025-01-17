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
              <h1 class="text-xl font-semibold">Accept Invitation</h1>
              <p
                v-if="invitation?.status === InvitationStatus.PENDING"
                class="text-sm text-gray-500 dark:text-zinc-400"
              >
                You've been invited by {{ invitation?.inviter }}
              </p>
            </div>
          </template>

          <!-- Loading State -->
          <div v-if="loading" class="py-8 text-center">
            <UIcon
              name="i-uil-spinner"
              class="animate-spin h-8 w-8 mx-auto text-gray-500 dark:text-zinc-400"
            />
            <p class="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              Verifying invitation...
            </p>
          </div>

          <!-- Error States -->
          <div
            v-else-if="error || invitation?.status !== InvitationStatus.PENDING"
            class="py-8 text-center"
          >
            <UIcon
              :name="errorIcon"
              class="h-12 w-12 mx-auto mb-4"
              :class="iconColorClass"
            />
            <h2 class="text-lg font-medium mb-2">{{ errorTitle }}</h2>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              {{ errorMessage }}
            </p>
            <UButton
              to="/auth/sign-in"
              color="primary"
              variant="ghost"
              class="mt-4"
            >
              Back to Sign In
            </UButton>
          </div>

          <!-- Success State - Show Sign Up Form -->
          <template v-else-if="invitation?.status === InvitationStatus.PENDING">
            <UForm :schema="signUpSchema" :state="form" @submit="onSubmit">
              <UFormGroup label="Email Address" name="email">
                <UInput
                  v-model="form.email"
                  type="email"
                  :disabled="true"
                  :modelValue="($route.query?.email as string)"
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

              <div class="mt-6 space-y-4">
                <UButton
                  type="submit"
                  block
                  color="primary"
                  :loading="submitting"
                >
                  Accept & Create Account
                </UButton>
                <UButton
                  :to="`/auth/invitation/${token}/decline?email=${$route.query.email}`"
                  block
                  variant="ghost"
                  color="red"
                >
                  Decline Invitation
                </UButton>
              </div>
            </UForm>
          </template>

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
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  DECLINED = "DECLINED",
}

interface Invitation {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  status: InvitationStatus;
  expiresAt: string;
  inviter: string;
}

interface APIResponse {
  status: string;
  data: Invitation;
}

const token = useRoute().params.token as string;
const loading = ref(true);
const error = ref<string | null>(null);
const invitation = ref<Invitation | null>(null);
const submitting = ref(false);

const form = ref({
  email: "",
  password: "",
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpSchema = z.output<typeof signUpSchema>;

// Computed properties for error states
const errorIcon = computed(() => {
  if (!invitation.value) return "i-uil-exclamation-circle";
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return "i-uil-clock";
    case InvitationStatus.ACCEPTED:
      return "i-uil-check-circle";
    case InvitationStatus.DECLINED:
      return "i-uil-times-circle";
    default:
      return "i-uil-exclamation-circle";
  }
});

const iconColorClass = computed(() => {
  if (!invitation.value) return "text-red-500";
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return "text-yellow-500";
    case InvitationStatus.ACCEPTED:
      return "text-green-500";
    case InvitationStatus.DECLINED:
      return "text-red-500";
    default:
      return "text-red-500";
  }
});

const errorTitle = computed(() => {
  if (!invitation.value) return "Invalid Invitation";
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return "Invitation Expired";
    case InvitationStatus.ACCEPTED:
      return "Invitation Already Used";
    case InvitationStatus.DECLINED:
      return "Invitation Declined";
    default:
      return "Invalid Invitation";
  }
});

const errorMessage = computed(() => {
  if (!invitation.value)
    return "The invitation link is invalid or has been removed.";
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return "This invitation has expired. Please request a new invitation.";
    case InvitationStatus.ACCEPTED:
      return "This invitation has already been used. Please sign in to your account.";
    case InvitationStatus.DECLINED:
      return "This invitation has been declined and cannot be used.";
    default:
      return "The invitation link is invalid or has been removed.";
  }
});

// Load invitation data
onMounted(async () => {
  try {
    const email = new URL(window.location.href).searchParams.get("email");
    if (!email) throw new Error("Invalid invitation link");

    const response = await $fetch<APIResponse>(
      "/api/public/invitation/verify",
      {
        params: { token, email },
      }
    );

    invitation.value = response.data;
    form.value.email = response.data.email;
  } catch (err: any) {
    error.value = err?.response?._data?.message || "Invalid invitation";
  } finally {
    loading.value = false;
  }
});

async function onSubmit(event: FormSubmitEvent<SignUpSchema>) {
  if (submitting.value || !invitation.value) return;
  submitting.value = true;

  try {
    const email = useRoute().query.email as string;

    // First update invitation status
    await $fetch(`/api/public/invitation/${invitation.value.id}`, {
      method: "PATCH",
      body: {
        status: "ACCEPTED",
      },
      params: {
        token,
        email,
      },
    });

    // Then create the user account
    await $fetch("/api/auth/sign-up", {
      method: "POST",
      body: {
        email: form.value.email,
        password: form.value.password,
        invitationToken: token,
      },
    });

    // Redirect to sign in after successful registration
    await navigateTo("/auth/sign-in");
  } catch (err: any) {
    error.value = err?.response?._data?.message || "Failed to create account";
  } finally {
    submitting.value = false;
  }
}
</script>
