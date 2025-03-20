<template>
  <v-container>
    <v-breadcrumbs :items="['任务调度', '任务']"></v-breadcrumbs>
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
import {getJobDetails, getUsersApi} from '@/api/Api'

const RealAPI = {
  async fetch({ page, itemsPerPage, sortBy }) {
    const response = await getJobDetails()
    console.log('response: ' + response)
    return { items: response.data.content, total: response.data.size };
    return
  }
}

// 定义模拟数据
const desserts = [
  { description: '备份数据库任务', isDurable: true, isNonconcurrent: true, jobClassName: 'com.example.BackupJob', jobGroup: 'Database', jobName: 'BackupDB', requestsRecovery: true },
  { description: '清理日志任务', isDurable: false, isNonconcurrent: false, jobClassName: 'com.example.CleanupJob', jobGroup: 'Logs', jobName: 'CleanupLogs', requestsRecovery: false },
  { description: '发送邮件任务', isDurable: true, isNonconcurrent: true, jobClassName: 'com.example.EmailJob', jobGroup: 'Notifications', jobName: 'SendEmail', requestsRecovery: true },
  { description: '生成报告任务', isDurable: true, isNonconcurrent: false, jobClassName: 'com.example.ReportJob', jobGroup: 'Reports', jobName: 'GenerateReport', requestsRecovery: false },
  { description: '同步数据任务', isDurable: true, isNonconcurrent: true, jobClassName: 'com.example.SyncJob', jobGroup: 'Data', jobName: 'SyncData', requestsRecovery: true }
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
const headers = ref([
  { title: '任务名称', key: 'jobName', align: 'end' },
  { title: '任务组名', key: 'jobGroup', align: 'end' },
  { title: '任务类名', key: 'jobClassName', align: 'end' },
  { title: '任务描述', align: 'start', key: 'description' },
  { title: '是否持久化', key: 'isDurable', align: 'end' },
  { title: '是否不允许并发', key: 'isNonconcurrent', align: 'end' },
  { title: '是否需要恢复', key: 'requestsRecovery', align: 'end' }
]);
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
