<template>
  <v-container>
    <v-breadcrumbs :items="['工作流', '任务列表']"></v-breadcrumbs>

    <v-data-table-server
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
  </v-container>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {pageProcessTasksApi} from '@/api/ApiFlowable'

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '任务ID', key: 'id', align: 'start'},
    {title: '任务名称', key: 'name', align: 'start'},
    {title: '办理人', key: 'assignee', align: 'start'},
    {title: '流程实例ID', key: 'processInstanceId', align: 'start'},
    {title: '创建时间', key: 'createTime', align: 'start'},
    {title: '到期时间', key: 'dueDate', align: 'start'},
    {title: '状态', key: 'isOverdue', align: 'center',
      formatter: (value: boolean) => value ? '已过期' : '进行中'}
  ] as const),

  search: '',
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
    const response = await pageProcessTasksApi({})
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

</script>
