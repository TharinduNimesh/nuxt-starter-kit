<template>
  <div>
    <NuxtLayout>
      <div class="min-h-screen flex items-center justify-center">
        <UCard class="w-full max-w-md mx-auto" :ui="{ background: 'dark:bg-zinc-900' }">
          <template #header>
            <div class="text-center">
              <h1 class="text-xl font-semibold">Decline Invitation</h1>
              <p v-if="invitation?.status === InvitationStatus.PENDING" class="text-sm text-gray-500 dark:text-zinc-400">
                Are you sure you want to decline the invitation?
              </p>
            </div>
          </template>

          <!-- Loading State -->
          <div v-if="loading" class="py-8 text-center">
            <UIcon name="i-uil-spinner" class="animate-spin h-8 w-8 mx-auto text-gray-500 dark:text-zinc-400" />
            <p class="mt-2 text-sm text-gray-500 dark:text-zinc-400">Verifying invitation...</p>
          </div>

          <!-- Error States -->
          <div v-else-if="error || invitation?.status !== InvitationStatus.PENDING" class="py-8 text-center">
            <UIcon 
              :name="errorIcon" 
              class="h-12 w-12 mx-auto mb-4"
              :class="iconColorClass"
            />
            <h2 class="text-lg font-medium mb-2">{{ errorTitle }}</h2>
            <p class="text-sm text-gray-500 dark:text-zinc-400">{{ errorMessage }}</p>
            <UButton
              to="/auth/sign-in"
              color="primary"
              variant="ghost"
              class="mt-4"
            >
              Back to Sign In
            </UButton>
          </div>

          <!-- Success State - Show Decline Confirmation -->
          <template v-else-if="invitation?.status === InvitationStatus.PENDING">
            <div class="py-8">
              <div class="text-center mb-8">
                <p class="text-sm text-gray-500 dark:text-zinc-400">
                  You were invited by <span class="font-medium text-gray-700 dark:text-zinc-300">{{ invitation.inviter }}</span>
                </p>
                <p class="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div class="space-y-4">
                <UButton 
                  block 
                  color="red" 
                  :loading="submitting"
                  @click="onDecline"
                >
                  Decline Invitation
                </UButton>
                <UButton 
                  :to="`/auth/invitation/${token}/accept?email=${invitation.email}`" 
                  block 
                  variant="ghost"
                  color="primary"
                >
                  Back to Accept
                </UButton>
              </div>
            </div>
          </template>

          <!-- Declined Success State -->
          <div v-else-if="declined" class="py-8 text-center">
            <UIcon 
              name="i-uil-check-circle" 
              class="h-12 w-12 mx-auto text-green-500 mb-4"
            />
            <h2 class="text-lg font-medium mb-2">Invitation Declined</h2>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              You have successfully declined the invitation.
            </p>
            <UButton
              to="/"
              color="primary"
              variant="ghost"
              class="mt-4"
            >
              Go to Home
            </UButton>
          </div>
        </UCard>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  DECLINED = 'DECLINED'
}

interface Invitation {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  status: InvitationStatus
  expiresAt: string
  inviter: string
}

interface APIResponse {
  status: string
  data: Invitation
}

const token = useRoute().params.token as string
const loading = ref(true)
const error = ref<string | null>(null)
const invitation = ref<Invitation | null>(null)
const submitting = ref(false)
const declined = ref(false)

// Computed properties for error states
const errorIcon = computed(() => {
  if (!invitation.value) return 'i-uil-exclamation-circle'
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return 'i-uil-clock'
    case InvitationStatus.ACCEPTED:
      return 'i-uil-check-circle'
    case InvitationStatus.DECLINED:
      return 'i-uil-times-circle'
    default:
      return 'i-uil-exclamation-circle'
  }
})

const iconColorClass = computed(() => {
  if (!invitation.value) return 'text-red-500'
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return 'text-yellow-500'
    case InvitationStatus.ACCEPTED:
      return 'text-green-500'
    case InvitationStatus.DECLINED:
      return 'text-red-500'
    default:
      return 'text-red-500'
  }
})

const errorTitle = computed(() => {
  if (!invitation.value) return 'Invalid Invitation'
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return 'Invitation Expired'
    case InvitationStatus.ACCEPTED:
      return 'Invitation Already Used'
    case InvitationStatus.DECLINED:
      return 'Invitation Already Declined'
    default:
      return 'Invalid Invitation'
  }
})

const errorMessage = computed(() => {
  if (!invitation.value) return 'The invitation link is invalid or has been removed.'
  switch (invitation.value.status) {
    case InvitationStatus.EXPIRED:
      return 'This invitation has expired. No action needed.'
    case InvitationStatus.ACCEPTED:
      return 'This invitation has already been used.'
    case InvitationStatus.DECLINED:
      return 'This invitation has already been declined.'
    default:
      return 'The invitation link is invalid or has been removed.'
  }
})

// Load invitation data
onMounted(async () => {
  try {
    const email = new URL(window.location.href).searchParams.get('email')
    if (!email) throw new Error('Invalid invitation link')

    const response = await $fetch<APIResponse>('/api/public/invitation/verify', {
      params: { token, email }
    })
    
    invitation.value = response.data
  } catch (err: any) {
    error.value = err?.response?._data?.message || 'Invalid invitation'
  } finally {
    loading.value = false
  }
})

async function onDecline() {
  if (submitting.value || !invitation.value) return
  submitting.value = true

  try {
    const email = useRoute().query.email as string
    
    await $fetch(`/api/public/invitation/${invitation.value.id}`, {
      method: 'PATCH',
      body: {
        status: 'DECLINED'
      },
      params: {
        token,
        email
      }
    })
    
    declined.value = true
  } catch (err: any) {
    error.value = err?.response?._data?.message || 'Failed to decline invitation'
  } finally {
    submitting.value = false
  }
}
</script>
