<template>
  <v-breadcrumbs :items="['用户', '本地用户']"></v-breadcrumbs>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
  >
    <template #[`item.enabled`]="{ item }: { item: { enabled: boolean } }">
      <v-chip :color="item.enabled ? 'success' : 'error'">
        {{ item.enabled ? '启用' : '禁用' }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }: {item: {username: string}}">
      <v-chip
        color="success"
        @click="openGroupDialog(item.username)"
        style="cursor: pointer;"
      >
        权限
      </v-chip>
    </template>
  </v-data-table-server>

  <v-dialog v-model="groupDialog" max-width="400px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>用户{{ selectedUsername }} 的权限组</span>
        <v-btn icon="mdi-close" variant="text" @click="groupDialog = false"></v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-chip
          v-for="group in userGroups"
          :key="group.groupId"
          class="ma-1"
          :color="group.authorized ? 'primary' : 'info'"
          :variant="group.authorized ? 'flat' : 'outlined'"
          @click="toggleGroup(group)"
          style="cursor: pointer;"
        >
          {{ group.groupName }}
        </v-chip>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveGroups">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getUsersApi, getUserGroupsApi, setUserGroupsApi } from '@/api/ApiAuthorization';

const RealAPI = {
  async fetch({ page, itemsPerPage, sortBy }: { page: number, itemsPerPage: number, sortBy: never[] }) {
    const response = await getUsersApi();
    return { items: response.data.content, total: response.data.size };
  }
}

// 表格相关
const itemsPerPage = ref(5);
const headers = ref([
  { title: '用户名', key: 'username', align: 'start' },
  { title: '状态', key: 'enabled', sortable: false, align: 'start' },
  { title: '创建时间', key: 'createdDate', align: 'end' },
  { title: '操作', key: 'actions', align: 'end' },
]);
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

// 权限组对话框相关
const groupDialog = ref(false);
const selectedUsername = ref('');
const userGroups = ref<Array<{
  groupId: string;
  groupName: string;
  authorized: boolean
}>>([]);

const loadItems = async ({ page, itemsPerPage, sortBy }: { page: number, itemsPerPage: number, sortBy: never[] }) => {
  loading.value = true;
  const { items = [], total = 0 } = await RealAPI.fetch({ page, itemsPerPage, sortBy }) || {};
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
};

const openGroupDialog = async (username: string) => {
  selectedUsername.value = username;
  try {
    const response = await getUserGroupsApi(username);
    userGroups.value = response.data;
    groupDialog.value = true;
  } catch (error) {
    console.error('获取权限组失败:', error);
    userGroups.value = [];
  }
};

const toggleGroup = (group: { groupId: string, authorized: boolean }) => {
  group.authorized = !group.authorized;
};

const saveGroups = async () => {
  try {
    const selectedGroupIds = userGroups.value
      .filter(group => group.authorized)
      .map(group => group.groupId);

    await setUserGroupsApi({
      username: selectedUsername.value,
      groupIds: selectedGroupIds
    });

    groupDialog.value = false;
    // Optional: Show success message or refresh data
  } catch (error) {
    console.error('保存权限组失败:', error);
    // Optional: Show error message
  }
};
</script>
