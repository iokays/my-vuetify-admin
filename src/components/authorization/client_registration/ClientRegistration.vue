<template>
  <v-container>
    <v-breadcrumbs :items="['授权管理', '服务端']"></v-breadcrumbs>
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
import {getClientRegistrationsApi} from '@/api/Api'

const RealAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    const response = await getClientRegistrationsApi();
    console.log('response: ' + response)
    return { items: response.data.content, total: response.data.size };
  }
}

// 定义模拟数据
const desserts = [
  { clientRegistrationId: 'reg-001', clientRegistrationType: 'OAuth2', clientId: 'client-001', clientName: 'Test Client 1', authorizationGrantType: 'authorization_code', scopes: ['read', 'write'], lastModifiedDate: '2023-10-01T12:00:00Z' },
  { clientRegistrationId: 'reg-002', clientRegistrationType: 'OpenID Connect', clientId: 'client-002', clientName: 'Test Client 2', authorizationGrantType: 'implicit', scopes: ['openid', 'profile'], lastModifiedDate: '2023-10-02T13:30:00Z' },
  { clientRegistrationId: 'reg-003', clientRegistrationType: 'OAuth2', clientId: 'client-003', clientName: 'Test Client 3', authorizationGrantType: 'client_credentials', scopes: ['read'], lastModifiedDate: '2023-10-03T14:45:00Z' },
  { clientRegistrationId: 'reg-004', clientRegistrationType: 'OAuth2', clientId: 'client-004', clientName: 'Test Client 4', authorizationGrantType: 'password', scopes: ['read', 'write'], lastModifiedDate: '2023-10-04T15:15:00Z' },
  { clientRegistrationId: 'reg-005', clientRegistrationType: 'OpenID Connect', clientId: 'client-005', clientName: 'Test Client 5', authorizationGrantType: 'authorization_code', scopes: ['openid', 'email'], lastModifiedDate: '2023-10-05T16:30:00Z' },
  { clientRegistrationId: 'reg-006', clientRegistrationType: 'OAuth2', clientId: 'client-006', clientName: 'Test Client 6', authorizationGrantType: 'implicit', scopes: ['read'], lastModifiedDate: '2023-10-06T17:00:00Z' },
  { clientRegistrationId: 'reg-007', clientRegistrationType: 'OAuth2', clientId: 'client-007', clientName: 'Test Client 7', authorizationGrantType: 'client_credentials', scopes: ['write'], lastModifiedDate: '2023-10-07T18:20:00Z' },
  { clientRegistrationId: 'reg-008', clientRegistrationType: 'OpenID Connect', clientId: 'client-008', clientName: 'Test Client 8', authorizationGrantType: 'authorization_code', scopes: ['openid', 'profile', 'email'], lastModifiedDate: '2023-10-08T19:45:00Z' },
  { clientRegistrationId: 'reg-009', clientRegistrationType: 'OAuth2', clientId: 'client-009', clientName: 'Test Client 9', authorizationGrantType: 'password', scopes: ['read', 'write'], lastModifiedDate: '2023-10-09T20:10:00Z' },
  { clientRegistrationId: 'reg-010', clientRegistrationType: 'OpenID Connect', clientId: 'client-010', clientName: 'Test Client 10', authorizationGrantType: 'implicit', scopes: ['openid'], lastModifiedDate: '2023-10-10T21:00:00Z' }
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
  { title: '注册ID', key: 'clientRegistrationId', align: 'start' },
  { title: '类型', key: 'clientRegistrationType', align: 'start' },
  { title: '客户端ID', key: 'clientId', align: 'start' },
  { title: '名称', key: 'clientName', align: 'start' },
  { title: '授权类型', key: 'authorizationGrantType', align: 'start' },
  { title: '权限范围', key: 'scopes', align: 'start' },
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
