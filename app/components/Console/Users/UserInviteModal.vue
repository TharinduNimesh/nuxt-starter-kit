<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold">Invite New User</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>
      <UForm :schema="inviteUserSchema" :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormGroup label="Email Address" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter email address"
            />
          </UFormGroup>

          <UFormGroup label="Role" name="role">
            <USelect v-model="form.role" :options="['USER', 'ADMIN']" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3 mt-5">
          <UButton type="button" color="gray" @click="closeModal">
            Cancel
          </UButton>
          <UButton type="submit" color="primary" :loading="loading">
            Send Invitation
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import {
  inviteUserSchema,
  type InviteUserSchema,
} from "~~/shared/schemas/invitation";
import type { FormSubmitEvent } from "#ui/types";
import { $apiFetch } from '~~/app/composables/useApiFetch'
import { useApiError } from '~~/app/composables/useApiError'

const isOpen = defineModel<boolean>("modelValue");
const toast = useToast();
const loading = ref(false);

const form = ref({
  email: "",
  role: "USER" as const,
});

const closeModal = () => {
  form.value = {
    email: "",
    role: "USER",
  };
  isOpen.value = false;
};

const { handle } = useApiError()

const onSubmit = async (event: FormSubmitEvent<InviteUserSchema>) => {
  try {
    loading.value = true
    await $apiFetch('/api/invitation', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      id: "invite-success",
      title: "Success",
      description: "Invitation sent successfully",
      color: "green",
    });
    closeModal();
  } catch (error: any) {
    handle(error, { title: 'Error' })
  } finally {
    loading.value = false
  }
};
</script>
