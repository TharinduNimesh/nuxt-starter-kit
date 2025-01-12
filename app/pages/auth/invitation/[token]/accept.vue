<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard
          class="w-full max-w-md mx-auto"
          :ui="{ background: 'dark:bg-zinc-900' }"
        >
          <div v-if="status === 'active'">
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Accept Invitation</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  You are invited as a {{ invitation.role }}
                </p>
              </div>
            </div>

            <UForm :schema="acceptSchema" :state="form" @submit="onSubmit">
              <UFormGroup label="Email Address" name="email">
                <UInput v-model="form.email" type="email" disabled />
              </UFormGroup>

              <UFormGroup label="Role" name="role" class="mt-4">
                <UInput v-model="form.role" disabled />
              </UFormGroup>

              <UFormGroup label="Password" name="password" class="mt-4">
                <UInput
                  v-model="form.password"
                  type="password"
                  placeholder="Set a password"
                />
              </UFormGroup>

              <UFormGroup
                label="Confirm Password"
                name="confirmPassword"
                class="mt-4"
              >
                <UInput
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
              </UFormGroup>

              <div class="mt-6">
                <UButton type="submit" block color="primary" :loading="loading">
                  Accept Invitation
                </UButton>
              </div>
            </UForm>
          </div>

          <!-- Expired Invitation -->
          <div v-else-if="status === 'expired'">
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Invitation Expired</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  This link is no longer valid.
                </p>
              </div>
            </div>
            <div class="text-center mt-6">
              <UButton color="primary" @click="goHome">Go to Home</UButton>
            </div>
          </div>

          <!-- Used Invitation -->
          <div v-else-if="status === 'used'">
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Invitation Already Used</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  Cannot accept again.
                </p>
              </div>
            </div>
            <div class="text-center mt-6">
              <UButton color="primary" @click="goHome">Go to Home</UButton>
            </div>
          </div>

          <!-- Fallback Invalid -->
          <div v-else>
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Invalid Invitation</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  Please check your link.
                </p>
              </div>
            </div>
            <div class="text-center mt-6">
              <UButton color="primary" @click="goHome">Go to Home</UButton>
            </div>
          </div>
        </UCard>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {
  acceptInvitationSchema,
  type AcceptInvitationSchema,
} from "~~/shared/schemas/invitation";
import type { FormSubmitEvent } from "#ui/types";

const invitation = ref({ email: "", role: "USER" });
const status = ref<"active" | "expired" | "used" | "invalid">("invalid");
const loading = ref(false);

const form = ref({
  email: "",
  role: "USER",
  password: "",
  confirmPassword: "",
});

const acceptSchema = acceptInvitationSchema;
const { handle } = useApiError();
const route = useRoute();
const toast = useToast();

const onSubmit = async (event: FormSubmitEvent<AcceptInvitationSchema>) => {
  try {
    loading.value = true;
    await $apiFetch("/api/invitation/accept", {
      method: "POST",
      body: event.data,
    });
    // Show success message
    toast.add({
      id: "invite-accept-success",
      title: "Success",
      description: "Invitation accepted. You can now sign in.",
      color: "green",
    });
    navigateTo("/auth/sign-in");
  } catch (error: any) {
    handle(error, { title: "Error Accepting Invitation" });
  } finally {
    loading.value = false;
  }
};

async function fetchInvitation() {
  try {
    loading.value = true;
    const token = route.params.token as string;
    const result = await $apiFetch(`/api/invitation/verify?token=${token}`);
    invitation.value = { email: result.email, role: result.role };
    status.value = result.status; // 'active' | 'expired' | 'used'
    form.value.email = result.email;
    form.value.role = result.role;
  } catch (error: any) {
    status.value = "invalid";
    handle(error, { title: "Invitation Invalid" });
  } finally {
    loading.value = false;
  }
}

function goHome() {
  navigateTo("/");
}

onMounted(() => {
  fetchInvitation();
});
</script>
