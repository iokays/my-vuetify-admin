<template>
  <v-container>
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
    ></v-data-table-server>
  </v-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {getUsersApi} from '@/api/Api'

const RealAPI = {
  async fetch({page, itemsPerPage, sortBy}) {
    const response = await getUsersApi()
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
    return
  }
}

// 定义模拟数据
const desserts = [
  {username: 'Frozen Yogurt', userId: 159, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Jelly bean', userId: 375, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'KitKat', userId: 518, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Eclair', userId: 262, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Gingerbread', userId: 356, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Ice cream sandwich', userId: 237, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Lollipop', userId: 392, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Cupcake', userId: 305, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Honeycomb', userId: 408, enabled: '有效', createdDate: '2025年03月14日'},
  {username: 'Donut', userId: 452, enabled: '有效', createdDate: '2025年03月14日'},
];

// 模拟 API
const FakeAPI = {
  async fetch({page, itemsPerPage, sortBy}) {
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
        resolve({items: paginated, total: items.length});
      }, 500);
    });
  },
};

// 定义响应式变量
const itemsPerPage = ref(5);
const headers = ref([
  {title: '用户ID', align: 'start', key: 'userId'},
  {title: '用户名', key: 'username', align: 'end'},
  {title: '状态', key: 'enabled', sortable: false, align: 'end'},
  {title: '创建时间', key: 'createdDate', align: 'end'}
]);
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

// 定义方法
const loadItems = async ({page, itemsPerPage, sortBy}) => {
  loading.value = true;
  const {items, total} = await RealAPI.fetch({page, itemsPerPage, sortBy});
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
};
</script>
