<template>
  <div>
    <NuxtLayout name="console">
      <div class="min-h-screen space-y-6 bg-gray-50/50 dark:bg-zinc-900 p-6 rounded-xl">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold">Users Management</h1>
            <p class="text-gray-600 dark:text-zinc-400">Manage system users and their roles</p>
          </div>
          <UButton 
            icon="i-heroicons-arrow-path" 
            color="gray" 
            :loading="refreshing"
            @click="refreshData"
          >
            Refresh
          </UButton>
        </div>

        <!-- Filters -->
        <ConsoleUsersUserFilters
          @update:search="search = $event"
          @update:role="role = $event"
          @update:status="status = $event"
          @invite="showInviteModal = true"
        />

        <!-- Users Table -->
        <UTable
          :rows="paginatedUsers"
          :columns="columns"
          :loading="refreshing"
          :ui="{
            wrapper: 'min-h-[450px]'
          }"
        >
          <template #name-data="{ row }">
            <div class="flex items-center gap-3">
              <img 
                :src="`https://ui-avatars.com/api/?name=${row.name || row.email}&background=146de0&color=fff`"
                :alt="row.name || row.email"
                class="w-8 h-8 rounded-full"
              />
              <div>
                <div class="font-medium">{{ row.name || '—' }}</div>
                <div class="text-sm text-gray-500 dark:text-zinc-400">{{ row.email }}</div>
              </div>
            </div>
          </template>

          <template #role-data="{ row }">
            <UBadge
              :color="row.role === 'ADMIN' ? 'primary' : 'gray'"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ row.role.toLowerCase() }}
            </UBadge>
          </template>

          <template #status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.status)"
              variant="soft"
              size="sm"
              class="capitalize"
            >
              {{ row.status.toLowerCase() }}
            </UBadge>
          </template>

          <template #lastActive-data="{ row }">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 dark:text-zinc-400">
                {{ row.lastActive || 'Never' }}
              </span>
              <UButton 
                v-if="row.status === 'Pending'"
                variant="link" 
                color="primary" 
                size="xs"
                @click="resendInvitation(row)"
              >
                Resend
              </UButton>
            </div>
          </template>

          <template #actions-data="{ row }">
            <UDropdown
              :items="getUserActions(row)"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
              />
            </UDropdown>
          </template>
        </UTable>

        <!-- Pagination -->
        <div class="flex justify-center">
          <UPagination
            v-model="currentPage"
            :total="filteredUsers.length"
            :per-page="perPage"
            :ui="{
              wrapper: 'gap-1',
              rounded: 'rounded-lg'
            }"
          />
        </div>
      </div>

      <!-- Invite Modal -->
      <ConsoleUsersUserInviteModal
        v-model="showInviteModal"
        @invite="inviteUser"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const refreshing = ref(false)
const showInviteModal = ref(false)

// Filters
const search = ref('')
const role = ref('All Roles')
const status = ref('All Status')

// Mock data
const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ADMIN',
    status: 'Active',
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    email: 'jane@example.com',
    role: 'USER',
    status: 'Pending',
    lastActive: null
  },
  {
    id: 3,
    name: 'Mike Smith',
    email: 'mike@example.com',
    role: 'USER',
    status: 'Suspended',
    lastActive: '5 days ago'
  }
])

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = search.value === '' || 
      user.email.toLowerCase().includes(search.value.toLowerCase()) ||
      (user.name?.toLowerCase().includes(search.value.toLowerCase()))
    const matchesRole = role.value === 'All Roles' || user.role === role.value
    const matchesStatus = status.value === 'All Status' || user.status === status.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredUsers.value.slice(start, end)
})

const columns = [
  {
    key: 'name',
    label: 'User',
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'lastActive',
    label: 'Last Activity',
  },
  {
    key: 'actions',
    label: '',
    sortable: false
  }
]

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'green'
    case 'Pending': return 'orange'
    case 'Suspended': return 'red'
    default: return 'gray'
  }
}

const getUserActions = (user: any) => {
  const mainActions = []
  const dangerActions = []
  
  if (user.role === 'USER') {
    mainActions.push({
      label: 'Promote to Admin',
      icon: 'i-heroicons-shield-check',
      click: () => promoteUser(user)
    })
  }

  if (user.status === 'Active') {
    mainActions.push({
      label: 'Suspend User',
      icon: 'i-heroicons-lock-closed',
      click: () => suspendUser(user)
    })
  } else if (user.status === 'Suspended') {
    mainActions.push({
      label: 'Reactivate User',
      icon: 'i-heroicons-lock-open',
      click: () => reactivateUser(user)
    })
  }

  dangerActions.push({
    label: 'Delete User',
    icon: 'i-heroicons-trash',
    click: () => deleteUser(user)
  })

  return [mainActions, dangerActions]
}

// Actions
const refreshData = async () => {
  refreshing.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  refreshing.value = false
}

const promoteUser = async (user: any) => {
  // TODO: Implement promotion logic
  user.role = 'ADMIN'
}

const suspendUser = async (user: any) => {
  // TODO: Implement suspension logic
  user.status = 'Suspended'
}

const reactivateUser = async (user: any) => {
  // TODO: Implement reactivation logic
  user.status = 'Active'
}

const deleteUser = async (user: any) => {
  // TODO: Implement deletion logic
  users.value = users.value.filter(u => u.id !== user.id)
}

const inviteUser = async (data: any) => {
  // TODO: Implement invitation logic
  users.value.push({
    id: Date.now(),
    email: data.email,
    role: data.role,
    status: 'Pending',
    lastActive: null
  })
}

const resendInvitation = async (user: any) => {
  // TODO: Implement resend logic
  console.log('Resending invitation to:', user.email)
}
</script>
