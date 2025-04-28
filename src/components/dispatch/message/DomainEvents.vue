<template>
  <v-container>
    <v-breadcrumbs :items="['事件消息', '领域事件']"></v-breadcrumbs>


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
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="2"
            >
              <v-select
                label="类别"
                :items="categories"
                v-model="searchPage.category"
                variant="solo-filled"
                @update:model-value="searchPage.loadItems"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </template>


    </v-data-table-server>
  </v-container>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {getMessagesApi} from '@/api/Api'

const categories = ["users", "other"]

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '消息ID', key: 'messageId', align: 'start'},
    {title: '消息类型', key: 'messageType', align: 'start'},
    {title: '消息内容', key: 'content', align: 'start'},
    {title: '创建时间', key: 'createdDate', align: 'start'},
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
    console.log('searchPage.category: ' + searchPage.category)
    const response = await getMessagesApi({
      category: searchPage.category
    })
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

</script>
