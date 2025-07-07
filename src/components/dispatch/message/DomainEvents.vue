<template>
  <v-breadcrumbs :items="['事件消息', '领域事件']"></v-breadcrumbs>


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
    <template v-slot:top>
      <v-row>
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="searchPage.category"
            :items="categories"
            label="类别"
            variant="solo-filled"
            @update:model-value="searchPage.loadItems"
          ></v-select>
        </v-col>
      </v-row>
    </template>

    <template #[`item.status`]="{ item }: { item: { status: number } }">
      <v-chip :color="item.status == 1 ? 'info': 'success'">
        {{ item.status == 1 ? '待发送': '已发送' }}
      </v-chip>
    </template>



  </v-data-table-server>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {getMessagesApi} from '@/api/ApiDispatch'

const categories = ["users", "other"]

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '消息ID', key: 'messageId', align: 'start'},
    {title: '分组', key: 'groupKey', align: 'start'},
    {title: '区域', key: 'region', align: 'start'},
    {title: '优先级', key: 'messagePriority', align: 'start'},
    {title: '顺序', key: 'messageSequence', align: 'start'},
    {title: '创建时间', key: 'createdDate', align: 'start'},
    {title: '状态', key: 'status', align: 'start'},
    {title: '消息内容', key: 'content', align: 'start'},
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
    console.log('searchPage.category: ' + searchPage.category)
    const response = await getMessagesApi({
      page: searchPage.currentPage - 1,
      size: searchPage.itemsPerPage,
      category: searchPage.category
    })
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.totalElements};
  }
});

</script>
