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
import { ref } from 'vue';
import { getOauthUsersApi } from '@/api/Api'

const RealAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    const response = await getOauthUsersApi()
    console.log('response: ' + response)
    return { items: response.data.content, total: response.data.size };
    return
  }
}

// 定义模拟数据
const desserts = [
  {
    "oauthUserId": "oauth-1234",
    "clientRegistrationId": "client-567",
    "subject": "sub-98765",
    "name": "张三",
    "givenName": "张三",
    "familyName": "李四",
    "middleName": "王五",
    "nickname": "张三45",
    "preferredUsername": "张三45",
    "profile": "https://profile.example.com/张三45",
    "picture": "https://avatar.example.com/张三45.jpg",
    "website": "https://张三45.example.com",
    "email": "zhangsan45@gmail.com",
    "emailVerified": true,
    "gender": "男",
    "birthdate": "1995-07-15",
    "zoneinfo": "Asia/Shanghai",
    "locale": "zh-CN",
    "phoneNumber": "18812345678",
    "phoneNumberVerified": true,
    "address": "中国北京市朝阳区78号",
    "updatedAt": "2023年07月20日",
    "claim": "{\"customField\":\"value-42\"}"
  },{
    "oauthUserId": "oauth-5678",
    "clientRegistrationId": "client-123",
    "subject": "sub-54321",
    "name": "李四",
    "givenName": "李四",
    "familyName": "王五",
    "middleName": null,
    "nickname": "李四12",
    "preferredUsername": "李四12",
    "profile": "https://profile.example.com/李四12",
    "picture": "https://avatar.example.com/李四12.jpg",
    "website": "https://李四12.example.com",
    "email": "lisi12@yahoo.com",
    "emailVerified": false,
    "gender": "女",
    "birthdate": "1990-11-23",
    "zoneinfo": "America/New_York",
    "locale": "en-US",
    "phoneNumber": "13987654321",
    "phoneNumberVerified": false,
    "address": "中国北京市朝阳区34号",
    "updatedAt": "2022年11月25日",
    "claim": "{\"customField\":\"value-87\"}"
  },
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
  { title: 'ID', key: 'oauthUserId', align: 'start' },
  { title: '客户端', key: 'clientRegistrationId', align: 'start' },
  { title: '用户标识', key: 'subject', align: 'start' },
  { title: '全名', key: 'name', align: 'start' },
  // { title: '名字', key: 'givenName', align: 'start' },
  // { title: '姓氏', key: 'familyName', align: 'start' },
  // { title: '中间名', key: 'middleName', align: 'start' },
  { title: '昵称', key: 'nickname', align: 'start' },
  // { title: '首选用户名', key: 'preferredUsername', align: 'start' },
  { title: '个人主页 URL', key: 'profile', align: 'start' },
  // { title: '头像 URL', key: 'picture', align: 'start' },
  // { title: '个人网站 URL', key: 'website', align: 'start' },
  // { title: '电子邮件地址', key: 'email', align: 'start' },
  // { title: '电子邮件验证状态', key: 'emailVerified', align: 'start' },
  // { title: '性别', key: 'gender', align: 'start' },
  // { title: '出生日期', key: 'birthdate', align: 'start' },
  // { title: '时区信息', key: 'zoneinfo', align: 'start' },
  // { title: '区域设置', key: 'locale', align: 'start' },
  { title: '电话号码', key: 'phoneNumber', align: 'start' },
  { title: '电话号码验证状态', key: 'phoneNumberVerified', align: 'start' },
  { title: '地址', key: 'address', align: 'start' },
  { title: '最后更新时间', key: 'updatedAt', align: 'start' },
  // { title: '自定义声明字段', key: 'claim', align: 'start' }
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
