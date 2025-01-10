<template>
  <div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
    <div class="flex gap-4">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search users..."
        @input="$emit('update:search', search)"
      />
      <USelect
        v-model="role"
        :options="['All Roles', 'ADMIN', 'USER']"
        @update:model-value="$emit('update:role', role)"
      />
      <USelect
        v-model="status"
        :options="['All Status', 'Active', 'Pending', 'Suspended']"
        @update:model-value="$emit('update:status', status)"
      />
    </div>
    <UButton
      icon="i-heroicons-envelope"
      @click="$emit('invite')"
    >
      Invite User
    </UButton>
  </div>
</template>

<script setup lang="ts">
const search = ref('')
const role = ref('All Roles')
const status = ref('All Status')

defineEmits<{
  'update:search': [value: string]
  'update:role': [value: string]
  'update:status': [value: string]
  'invite': []
}>()
</script>
