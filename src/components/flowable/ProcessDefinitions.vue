<template>
  <v-container>
    <v-breadcrumbs :items="['工作流', '流程定义']"></v-breadcrumbs>

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
import {pageProcessDefinitionsApi} from '@/api/Api'

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '定义编号', key: 'key', align: 'start'},
    {title: '定义名称', key: 'name', align: 'start'},
    {title: '类型', key: 'category', align: 'start'},
    {title: '版本号', key: 'version', align: 'start'},
    {title: '描述', key: 'messageId', align: 'start'},
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
    const response = await pageProcessDefinitionsApi({})
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

</script>
