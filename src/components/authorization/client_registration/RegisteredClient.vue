<template>
  <v-container>
    <v-breadcrumbs :items="['授权管理', '客户端']"></v-breadcrumbs>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      @update:options="loadItems"
    ></v-data-table-server>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {getClientRegistrationApi, getOauthUsersApi, getRegisteredClientsApi} from '@/api/Api'

const RealAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    const response = await getRegisteredClientsApi();
    console.log('response: ' + response)
    return { items: response.data.content, total: response.data.size };
  }
}

// 定义模拟数据
const desserts = [
  { registeredClientId: 'reg-001', clientId: 'client-001', clientName: 'Test Client 1', authorizationGrantTypes: ['authorization_code'], scopes: ['read', 'write'], createdDate: '2023-10-01T12:00:00Z', lastModifiedDate: '2023-10-01T12:00:00Z' },
  { registeredClientId: 'reg-002', clientId: 'client-002', clientName: 'Test Client 2', authorizationGrantTypes: ['implicit'], scopes: ['openid', 'profile'], createdDate: '2023-10-02T13:30:00Z', lastModifiedDate: '2023-10-02T13:30:00Z' },
  { registeredClientId: 'reg-003', clientId: 'client-003', clientName: 'Test Client 3', authorizationGrantTypes: ['client_credentials'], scopes: ['read'], createdDate: '2023-10-03T14:45:00Z', lastModifiedDate: '2023-10-03T14:45:00Z' },
  { registeredClientId: 'reg-004', clientId: 'client-004', clientName: 'Test Client 4', authorizationGrantTypes: ['password'], scopes: ['read', 'write'], createdDate: '2023-10-04T15:15:00Z', lastModifiedDate: '2023-10-04T15:15:00Z' },
  { registeredClientId: 'reg-005', clientId: 'client-005', clientName: 'Test Client 5', authorizationGrantTypes: ['authorization_code'], scopes: ['openid', 'email'], createdDate: '2023-10-05T16:30:00Z', lastModifiedDate: '2023-10-05T16:30:00Z' }
];

// 模拟 API
const FakeAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const items = [...desserts];

        if (sortBy.length) {
          const sortKey = sortBy[0].key;
          const sortOrder = sortBy[0].order;
          items.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          });
        }

        const paginated = items.slice(start, end);
        resolve({ items: paginated, total: items.length });
      }, 500);
    });
  },
};

// 定义响应式变量
const itemsPerPage = ref(5);
const headers = [
  { title: '注册ID', key: 'registeredClientId', align: 'start' },
  { title: '客户端ID', key: 'clientId', align: 'start' },
  { title: '名称', key: 'clientName', align: 'start' },
  { title: '授权类型', key: 'authorizationGrantTypes', align: 'start' },
  { title: '权限', key: 'scopes', align: 'start' },
  { title: '创建时间', key: 'createdDate', align: 'start' },
  { title: '更新时间', key: 'lastModifiedDate', align: 'start' }
];
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

// 定义方法
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true;
  const { items, total } = await RealAPI.fetch({ page, itemsPerPage, sortBy });
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
};
</script>
