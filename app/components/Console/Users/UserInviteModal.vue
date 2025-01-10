
<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-200 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Invite New User</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <UForm :schema="inviteSchema" :state="form" @submit="onSubmit">
        <UFormGroup label="Email Address" name="email">
          <UInput v-model="form.email" type="email" placeholder="Enter email address" />
        </UFormGroup>

        <UFormGroup label="Role" name="role" class="mt-4">
          <USelect v-model="form.role" :options="['USER', 'ADMIN']" />
        </UFormGroup>

        <UFormGroup label="Custom Message" name="message" class="mt-4">
          <UTextarea v-model="form.message" :rows="3" placeholder="Optional message..." />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" @click="isOpen = false">
            Cancel
          </UButton>
          <UButton color="primary" :loading="loading" @click="onSubmit">
            Send Invitation
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'

const isOpen = defineModel<boolean>('modelValue')
const emit = defineEmits<{
  invite: [data: { email: string; role: string; message?: string }]
}>()

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  message: z.string().optional()
})

const form = ref({
  email: '',
  role: 'USER',
  message: ''
})

const loading = ref(false)

const onSubmit = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
  emit('invite', form.value)
  loading.value = false
  isOpen.value = false
}
</script>