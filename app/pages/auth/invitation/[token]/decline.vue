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
                <h1 class="text-xl font-semibold">Decline Invitation</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  You are invited as {{ invitation.role }} ({{
                    invitation.email
                  }})
                </p>
              </div>
            </div>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                Are you sure you want to decline this invitation?
              </p>
              <div class="flex justify-center gap-4 mt-4">
                <UButton
                  color="gray"
                  :loading="loading"
                  @click="declineInvitation"
                >
                  Decline
                </UButton>
                <UButton color="primary" @click="goHome">Cancel</UButton>
              </div>
            </div>
          </div>

          <!-- Expired -->
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

          <!-- Used -->
          <div v-else-if="status === 'used'">
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Invitation Already Used</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  This invitation has already been used.
                </p>
              </div>
            </div>
            <div class="text-center mt-6">
              <UButton color="primary" @click="goHome">Go to Home</UButton>
            </div>
          </div>

          <!-- Declined -->
          <div v-else-if="status === 'declined'">
            <div>
              <div class="text-center">
                <h1 class="text-xl font-semibold">Invitation Declined</h1>
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  You have declined this invitation.
                </p>
              </div>
            </div>
            <div class="text-center mt-6">
              <UButton color="primary" @click="goHome">Go to Home</UButton>
            </div>
          </div>

          <!-- Invalid -->
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
const invitation = ref({ email: "", role: "USER" });
const status = ref<"active" | "expired" | "used" | "declined" | "invalid">(
  "invalid"
);
const loading = ref(false);

const toast = useToast();
const route = useRoute();
const { handle } = useApiError();

async function fetchInvitation() {
  try {
    loading.value = true;
    const token = route.params.token as string;
    const result = await $apiFetch<any>(
      `/api/invitation/verify?token=${token}&email=${route.query.email}`
    );
    invitation.value = { email: result.email, role: result.role };
    status.value = result.status; // 'active', 'expired', or 'used'
  } catch (error: any) {
    status.value = "invalid";
    handle(error, { title: "Invitation Invalid" });
  } finally {
    loading.value = false;
  }
}

async function declineInvitation() {
  try {
    loading.value = true;
    const token = route.params.token as string;
    await $apiFetch("/api/invitation/decline", {
      method: "POST",
      body: { token },
    });
    status.value = "declined";
    toast.add({
      id: "decline-success",
      title: "Invitation Declined",
      description: "You have successfully declined this invitation.",
      color: "green",
    });
  } catch (error: any) {
    handle(error, { title: "Error Declining Invitation" });
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
