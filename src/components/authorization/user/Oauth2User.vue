<template>
  <v-container>
    <v-breadcrumbs :items="['用户', 'Oauth2用户']"></v-breadcrumbs>
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
import {getOauthUsersApi} from '@/api/Api'

const RealAPI = {
  async fetch({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) {
    const response = await getOauthUsersApi()
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
    return
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
  {title: 'ID', key: 'oauthUserId', align: 'start'},
  {title: '客户端', key: 'clientRegistrationId', align: 'start'},
  {title: '用户标识', key: 'subject', align: 'start'},
  {title: '全名', key: 'name', align: 'start'},
  // { title: '名字', key: 'givenName', align: 'start' },
  // { title: '姓氏', key: 'familyName', align: 'start' },
  // { title: '中间名', key: 'middleName', align: 'start' },
  {title: '昵称', key: 'nickname', align: 'start'},
  // { title: '首选用户名', key: 'preferredUsername', align: 'start' },
  {title: '个人主页 URL', key: 'profile', align: 'start'},
  // { title: '头像 URL', key: 'picture', align: 'start' },
  // { title: '个人网站 URL', key: 'website', align: 'start' },
  // { title: '电子邮件地址', key: 'email', align: 'start' },
  // { title: '电子邮件验证状态', key: 'emailVerified', align: 'start' },
  // { title: '性别', key: 'gender', align: 'start' },
  // { title: '出生日期', key: 'birthdate', align: 'start' },
  // { title: '时区信息', key: 'zoneinfo', align: 'start' },
  // { title: '区域设置', key: 'locale', align: 'start' },
  {title: '电话号码', key: 'phoneNumber', align: 'start'},
  {title: '电话号码验证状态', key: 'phoneNumberVerified', align: 'start'},
  {title: '地址', key: 'address', align: 'start'},
  {title: '最后更新时间', key: 'updatedAt', align: 'end'},
  // { title: '自定义声明字段', key: 'claim', align: 'start' }
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
