<template>
  <v-breadcrumbs :items="['任务调度', '任务']"></v-breadcrumbs>
  <v-data-table-server
    v-model:page="searchJobDetails.currentPage"
    v-model:items-per-page="searchJobDetails.itemsPerPage"
    :headers="searchJobDetails.headers"
    :items="searchJobDetails.serverItems"
    :items-length="searchJobDetails.totalItems"
    :loading="searchJobDetails.loading"
    :search="searchJobDetails.search"
    item-value="name"
    @update:options="searchJobDetails.loadItems"
  >

    <template #top>
      <v-toolbar flat>
        <v-toolbar-title></v-toolbar-title>

        <v-btn
          border
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          text="添加任务"
          @click="editJobDetails.open"
        >
        </v-btn>
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }: {item: {jobName: string; jobGroup: string, actions: string[]}}">
      <div class="d-flex ga-2 justify-end">
        <v-icon v-if="item.actions.includes('delete')" color="medium-emphasis" icon="mdi-delete" size="small"
                @click="removeJobDetails.confirm(item.jobName, item.jobGroup)"/>
      </div>
    </template>
  </v-data-table-server>

  <v-dialog v-model="editJobDetails.dialog" max-width="800" persistent>
    <v-card subtitle="创建你想要的任务"
            title="添加任务"
    >
      <template v-slot:text>
        <v-row>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.jobName" label="任务名称"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.jobGroup" label="所属群组"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.jobClass" label="任务类型"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.cronExpression" label="cron表达式"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.startAt" label="开始时间"></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="editJobDetails.endAt" label="结束时间"></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-textarea
              v-model="editJobDetails.input"
              variant="solo-filled"
              label="任务输入"
            >
            </v-textarea>

          </v-col>


        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="editJobDetails.close"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="保存" @click="editJobDetails.save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {createJobs, delJobDetails, getJobDetailsApi} from '@/api/ApiDispatch'
import {useConfirmDialogStore} from '@/stores/Dialog'
import {useSnackbarStore} from '@/stores/Snackbar'

const snackbar = useSnackbarStore()
const confirmDialog = useConfirmDialogStore()

const searchJobDetails = reactive({
  headers: ref([
    {title: '任务名称', key: 'jobName', align: 'start'},
    {title: '任务组名', key: 'jobGroup', align: 'start'},
    {title: '任务类别', key: 'jobClassName', align: 'start'},
    {title: 'cron表达式', key: 'cronExpression', align: 'start'},
    {title: '开始时间', key: 'startTime', align: 'start'},
    {title: '结束时间', key: 'endTime', align: 'start'},
    {title: '需要恢复', key: 'requestsRecovery', align: 'start'},
    {title: '操作', key: 'actions', align: 'end'}
  ] as const),

  currentPage: 1,
  itemsPerPage: 5,
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async () => {
    searchJobDetails.loading = true;
    const {items, total} = await searchJobDetails._RealAPI();
    searchJobDetails.serverItems = items;
    searchJobDetails.totalItems = total;
    searchJobDetails.loading = false;
  },

  _RealAPI: async () => {
    const response = await getJobDetailsApi({
      page: searchJobDetails.currentPage -1,
      size: searchJobDetails.itemsPerPage
    })
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

const formatDate = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 月份从 0 开始
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const editJobDetails = reactive({
  jobName: '这是一个简单的HTTP请求任务',
  jobGroup: '每分钟运行群组',
  jobClass: 'REST_CLIENT',
  // 当前本地时间
  startAt: formatDate(new Date()),
  // 当前时间加上一分钟
  endAt: formatDate(new Date(new Date().getTime() + 60000)),
  cronExpression: '0 0/1 * * * ?',
  input: '{\n' +
    '    "url": "https://www.iokays.com/api/authorization/users",\n' +
    '    "method": "get",\n' +
    '    "headers": {\n' +
    '      "Content-Type": "application/form-urlencoded"\n' +
    '    },\n' +
    '    "body": "",\n' +
    '    "params": null\n' +
    '}',
  dialog: false,
  open: () => {
    editJobDetails.dialog = true
  },
  close: () => {
    editJobDetails.dialog = false
  },
  save: () => {
    createJobs({
      name: editJobDetails.jobName,
      group: editJobDetails.jobGroup,
      jobClass: editJobDetails.jobClass,
      cronExpression: editJobDetails.cronExpression,
      startAt: editJobDetails.startAt,
      endAt: editJobDetails.endAt,
      input: JSON.parse(editJobDetails.input)
    }).then(() => {
      editJobDetails.close()
      snackbar.open(editJobDetails.jobName + ': 已被成功添加')

      //添加后成功刷新数据
      searchJobDetails.loadItems();
    }).catch(e => {
      snackbar.open(editJobDetails.jobName + ': 添加失败: ' + e)
    })
  }
})


const removeJobDetails = reactive({
  _name: '',
  _group: '',
  confirm: (name: string, group: string) => {
    removeJobDetails._name = name;
    removeJobDetails._group = group;

    confirmDialog.confirm = () => {
      removeJobDetails._remove()
    };
    confirmDialog.open('删除任务', '是否删除任务 ' + name + '?')
  },
  _remove: () => {
    confirmDialog.close()
    delJobDetails(removeJobDetails._name, removeJobDetails._group).then(() => {
      snackbar.open(removeJobDetails._name + ': 已被您成功删除.')

      searchJobDetails.loadItems();

    }).catch(e => {
      console.log('error', e)
      snackbar.open(removeJobDetails._name + ': 删除失败.')
    })
  }
})

</script>
