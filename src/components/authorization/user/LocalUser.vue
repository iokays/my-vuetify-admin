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

      <template #[`item.enabled`]="{item}: {item: {enabled: boolean }}">
        <v-chip :color="item.enabled ? 'success' : 'error'">
          {{ item.enabled ? '启用' : '禁用' }}
        </v-chip>
      </template>

    </v-data-table-server>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {getUsersApi} from '@/api/ApiAuthorization'

const RealAPI = {
  async fetch({page, itemsPerPage, sortBy}:  { page: number, itemsPerPage: number, sortBy: never[] }) {
    const response = await getUsersApi()
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
}


// 定义响应式变量
const itemsPerPage = ref(5);

const headers = ref<{
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}[]>([
  {title: '用户名', key: 'username', align: 'start'},
  {title: '状态', key: 'enabled', sortable: false, align: 'start'},
  {title: '创建时间', key: 'createdDate', align: 'end'}
]);
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

// 定义方法
const loadItems = async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
  loading.value = true;
  const {items = [], total = 0} = await RealAPI.fetch({page, itemsPerPage, sortBy}) || {};
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
};


</script>
