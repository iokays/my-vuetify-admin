<template>
  <v-breadcrumbs :items="['用户', '本地用户']"></v-breadcrumbs>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    :search="search"
    item-value="name"
    @update:options="loadItems"
  >

    <template #top>
      <v-toolbar flat>
        <v-toolbar-title></v-toolbar-title>
        <v-btn
          border
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          text="添加用户"
          @click="user.dialog=true"
        />
      </v-toolbar>
    </template>


    <template #[`item.enabled`]="{ item }: { item: { enabled: boolean } }">
      <v-chip :color="item.enabled ? 'success' : 'error'">
        {{ item.enabled ? '启用' : '禁用' }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }: {item: {username: string}}">
      <v-icon color="medium-emphasis" icon="mdi-account-edit" size="small" @click="openGroupDialog(item.username)"/>
      <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="removeUser.confirm(item.username)"/>
    </template>
  </v-data-table-server>

  <v-dialog v-model="user.dialog" max-width="400px" persistent>
    <v-card>
      <v-card-title>
        <span>添加用户</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>

        <v-row>
          <v-text-field
            v-model="user.username"
            label="用户名"
            outlined
          ></v-text-field>
        </v-row>

        <v-row>
          <v-text-field
            v-model="user.password"
            label="密码"
            outlined
          ></v-text-field>
        </v-row>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="user.close"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="保存" @click="user.save"></v-btn>
      </v-card-actions>


    </v-card>

  </v-dialog>

  <v-dialog v-model="groupDialog" max-width="400px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>用户{{ selectedUsername }} 的权限组</span>
        <v-btn icon="mdi-close" variant="text" @click="groupDialog = false"></v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-chip
          v-for="group in userGroups"
          :key="group.groupId"
          :color="group.authorized ? 'primary' : 'info'"
          :variant="group.authorized ? 'flat' : 'outlined'"
          class="ma-1"
          style="cursor: pointer;"
          @click="toggleGroup(group)"
        >
          {{ group.groupName }}
        </v-chip>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveGroups">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {
  delUserApi,
  getUserGroupsApi,
  getUsersApi,
  saveUserApi,
  setUserGroupsApi
} from '@/api/ApiAuthorization';
import {useSnackbarStore} from "@/stores/Snackbar";
import {actionDialog} from "@/stores/Dialog";

const snackbar = useSnackbarStore()

const RealAPI = {
  async fetch({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) {
    const response = await getUsersApi();
    return {items: response.data.content, total: response.data.size};
  }
}
// 表格相关
const itemsPerPage = ref(5);
const headers = ref<{
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}[]>([
  {title: '用户名', key: 'username', align: 'start'},
  {title: '状态', key: 'enabled', sortable: false, align: 'start'},
  {title: '创建时间', key: 'createdDate', align: 'end'},
  {title: '操作', key: 'actions', align: 'end'},
]);
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

const user = reactive({
  dialog: ref(false),

  username: ref('管理员'),
  password: ref(''),


  save() {
    saveUserApi(
      {
        username: user.username,
        password: user.password
      }
    ).then(() => {
      user.close()
      //添加后成功刷新数据
      loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: itemsPerPage.value,
        sortBy: []  // 根据需要可以传递排序参数
      });
    }).catch(e => {
      console.log("添加失败")
      snackbar.open(user.username + ': 添加失败: ' + e)
    })
  },
  close() {
    user.dialog = false
    user.username = ''
    user.password = ''
  },

});

// 权限组对话框相关
const groupDialog = ref(false);
const selectedUsername = ref('');
const userGroups = ref<Array<{
  groupId: string;
  groupName: string;
  authorized: boolean
}>>([]);

const loadItems = async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
  loading.value = true;
  const {items = [], total = 0} = await RealAPI.fetch({page, itemsPerPage, sortBy}) || {};
  serverItems.value = items;
  totalItems.value = total;
  loading.value = false;
};

const openGroupDialog = async (username: string) => {
  selectedUsername.value = username;
  try {
    const response = await getUserGroupsApi(username);
    userGroups.value = response.data;
    groupDialog.value = true;
  } catch (error) {
    console.error('获取权限组失败:', error);
    userGroups.value = [];
  }
};

const toggleGroup = (group: { groupId: string, authorized: boolean }) => {
  group.authorized = !group.authorized;
};

const saveGroups = async () => {
  try {
    const selectedGroupIds = userGroups.value
      .filter(group => group.authorized)
      .map(group => group.groupId);

    await setUserGroupsApi({
      username: selectedUsername.value,
      groupIds: selectedGroupIds
    });

    groupDialog.value = false;
    // Optional: Show success message or refresh data
  } catch (error) {
    console.error('保存权限组失败:', error);
    // Optional: Show error message
  }
};



const removeUser = reactive({
  username: '',
  confirm: (username: string) => {
    removeUser.username = username;
    actionDialog.leftAction = () => {
      removeUser.remove()
    };
    actionDialog.title = '删除用户';  // 用于设置对话框标题
    actionDialog.text = '是否删除用户' + removeUser.username + '?';  // 用于设置对话框内容
    actionDialog.open()
  },
  remove: () => {
    try {
      delUserApi(removeUser.username).then(() => {
        snackbar.open(removeUser.username + ': 已被您成功删除.')
        //成功刷新数据
        loadItems({
          page: 1,  // 你可以选择保持当前页数，或者从第一页开始
          itemsPerPage: itemsPerPage.value,
          sortBy: []  // 根据需要可以传递排序参数
        });
      }).catch(e => {
        console.log('error', e)
        snackbar.open(removeUser.username + ': 删除失败.')
      })
    } finally {
      actionDialog.close()
    }
  }
})

</script>
