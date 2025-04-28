<template>
  <v-container>
    <v-breadcrumbs :items="['任务调度', '任务']"></v-breadcrumbs>
    <v-data-table-server
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
  </v-container>

  <v-dialog v-model="actionDialog.visible" max-width="400px">
    <v-card
      :text="actionDialog.text"
      :title="actionDialog.title"
    >
      <v-card-actions>
        <v-btn text="确定" @click="actionDialog.leftAction"/>
        <v-btn text="取消" @click="actionDialog.rightAction"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
    {{ snackbar.text }}
    <template #actions>
      <v-btn color="blue" text="关闭" variant="text" @click="snackbar.close"/>
    </template>
  </v-snackbar>

  <v-dialog v-model="editJobDetails.dialog" max-width="500" persistent>
    <v-card subtitle="创建你想要的任务"
            title="添加任务"
    >
      <template v-slot:text>
        <v-row>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.jobName" label="任务名称"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.jobGroup" label="所属群组"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.jobClass" label="任务类型"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.cronExpression" label="cron表达式"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.startAt" label="开始时间"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="editJobDetails.endAt" label="结束时间"></v-text-field>
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
import {createJobs, delJobDetails, getJobDetailsApi} from '@/api/Api'
import {actionDialog} from '@/stores/Dialog'
import {snackbar} from "@/stores/Snackbar";

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

  itemsPerPage: 5,
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
    searchJobDetails.loading = true;
    const {items, total} = await searchJobDetails._RealAPI();
    searchJobDetails.serverItems = items;
    searchJobDetails.totalItems = total;
    searchJobDetails.loading = false;
  },

  _RealAPI: async () => {
    const response = await getJobDetailsApi()
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
  jobName: '这是一个的简单任务',
  jobGroup: '每分钟运行群组',
  jobClass: 'SAMPLE',
  // 当前本地时间
  startAt: formatDate(new Date()),
  // 当前时间加上一分钟
  endAt: formatDate(new Date(new Date().getTime() + 60000)),
  cronExpression: '0 0/1 * * * ?',
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
    }).then(() => {
      editJobDetails.close()
      snackbar.text = editJobDetails.jobName + ': 已被成功添加';
      snackbar.open()

      //添加后成功刷新数据
      searchJobDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchJobDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });
    }).catch(e => {
      snackbar.text = editJobDetails.jobName + ': 添加失败: ' + e;
      snackbar.open()
    })
  }
})


const removeJobDetails = reactive({
  _name: '',
  _group: '',
  confirm: (name: string, group: string) => {
    removeJobDetails._name = name;
    removeJobDetails._group = group;

    actionDialog.leftAction = () => {
      removeJobDetails._remove()
    };
    actionDialog.title = '删除任务';  // 用于设置对话框标题
    actionDialog.text = '是否删除任务 ' + name + '?';  // 用于设置对话框内容
    actionDialog.open()
  },
  _remove: () => {
    actionDialog.close()
    delJobDetails(removeJobDetails._name, removeJobDetails._group).then(() => {
      snackbar.text = removeJobDetails._name + ': 已被您成功删除.';
      snackbar.open()

      searchJobDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchJobDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });

    }).catch(e => {
      console.log('error', e)
      snackbar.text = removeJobDetails._name + ': 删除失败.';
      snackbar.open()
    })
  }
})

</script>
