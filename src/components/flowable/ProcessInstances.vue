<template>
  <v-breadcrumbs :items="['工作流', '流程实例']"></v-breadcrumbs>

  <v-data-table-server
    v-model:page="searchPage.currentPage"
    v-model:items-per-page="searchPage.itemsPerPage"
    :headers="searchPage.headers"
    :items="searchPage.serverItems"
    :items-length="searchPage.totalItems"
    :loading="searchPage.loading"
    :search="searchPage.search"
    item-value="name"
    @update:options="searchPage.loadItems"
  >

  </v-data-table-server>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {pageProcessInstancesApi} from '@/api/ApiFlowable'

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '流程定义ID', key: 'processDefinitionId', align: 'start'},
    {title: '流程定义名称', key: 'processDefinitionName', align: 'start'},
    {title: '业务Key', key: 'businessKey', align: 'start'},
    {title: '状态', key: 'suspended', align: 'center', formatter: (value: boolean) => value ? '已挂起' : '运行中'},
    {title: '发起人', key: 'startUserId', align: 'start'},
    {title: '开始时间', key: 'startTime', align: 'start'},
    {title: '租户', key: 'tenantId', align: 'start'}
  ] as const),

  search: '',
  currentPage: 1,
  itemsPerPage: 10,
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async () => {
    searchPage.loading = true;
    const {items, total} = await searchPage._RealAPI();
    searchPage.serverItems = items;
    searchPage.totalItems = total;
    searchPage.loading = false;
  },

  _RealAPI: async () => {
    const response = await pageProcessInstancesApi({
      page: searchPage.currentPage - 1,
      size: searchPage.itemsPerPage
    })
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

</script>
