<template>
  <v-breadcrumbs :items="['用户', '权限群组']"></v-breadcrumbs>
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
          text="添加权限组"
          @click="group.openGroupDialog()"
        />
      </v-toolbar>
    </template>

    <template #[`item.authorities`]="{ item }: {item: {authorities: any}}">
      <v-chip
        v-for="(auth, index) in item.authorities"
        :key="index"
        class="ma-1"
        color="primary"
        small
      >
        {{ getAuthorityTitle(auth) }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }: {item: {groupId: string, groupName: string, authorities: string[] }}">
      <v-icon color="medium-emphasis" icon="mdi-shield-edit" size="small" @click="group.openGroupDialog(item)"/>
      <v-icon color="medium-emphasis" icon="mdi-delete" size="small"
              @click="removeGroup.confirm(item.groupId, item.groupName)"/>
    </template>
  </v-data-table-server>

  <v-dialog v-model="group.dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span>{{ group.editMode ? '编辑权限组' : '添加权限组' }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="group.groupName"
              clearable
              label="权限群组名"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-card outlined>
              <v-card-title class="text-subtitle-1">选择权限</v-card-title>
              <v-divider></v-divider>
              <v-chip-group v-model="group.selectedAuthorities" column multiple>
                <v-card-text v-for="item in allAuthorities" :key="item.title" class="pa-4">
                  <h3 class="text-h6 mb-2">{{ item.title }}</h3>
                  <v-chip
                    v-for="child in item.children"
                    :key="child.id"
                    :value="child.id"
                    filter
                  >
                    {{ child.title }}
                  </v-chip>
                </v-card-text>
              </v-chip-group>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="group.close"></v-btn>
        <v-spacer></v-spacer>
        <v-btn :loading="group.saving" text="保存" @click="group.save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {delGroupApi, editGroupApi, getGroupsApi, saveGroupApi} from '@/api/ApiAuthorization';
import {useSnackbarStore} from "@/stores/Snackbar";
import {allAuthorities} from "@/assets/data/authorization/authorities";
import {useConfirmDialogStore} from "@/stores/Dialog";

const snackbar = useSnackbarStore()
const confirmDialog = useConfirmDialogStore()

const RealAPI = {
  async fetch({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) {
    const response = await getGroupsApi();
    console.log('response: ', response);
    return {items: response.data.content, total: response.data.size};
  }
};

// 定义响应式变量
const itemsPerPage = ref(5);
const headers = ref<{
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}[]>([
  {title: '群组名', key: 'groupName', sortable: false, align: 'start'},
  {title: '权限列表', key: 'authorities', sortable: false, align: 'start'},
  {title: '创建时间', key: 'createdDate', align: 'end'},
  {title: '操作', key: 'actions', align: 'end'},
]);
const search = ref('');
const serverItems = ref([]);
const loading = ref(true);
const totalItems = ref(0);

const group = reactive({
  dialog: false,
  editMode: false,
  saving: false,
  groupId: null as string | null,
  groupName: '',
  selectedAuthorities: [] as string[],

  init() {
    group.dialog = false;
    group.editMode = false;
    group.saving = false;
    group.groupId = null;
    group.groupName = '';
    group.selectedAuthorities = [];
  },

  openGroupDialog(item?: { groupId: string, groupName: string, authorities: string[] }) {
    group.init();
    group.dialog = true;
    if (item) {
      group.editMode = true;
      group.groupId = item.groupId;
      group.groupName = item.groupName;
      group.selectedAuthorities = [...item.authorities];
    }
  },

  save() {
    console.log(group)
    group.saving = true;
    const api = group.editMode
      ? editGroupApi({
        groupId: group.groupId!,
        authorities: group.selectedAuthorities
      })
      : saveGroupApi({
        groupName: group.groupName,
        authorities: group.selectedAuthorities
      });

    api
      .then(() => {
        snackbar.open(`${group.groupName}: 保存成功`);
        group.close();
        loadItems({
          page: 1,
          itemsPerPage: itemsPerPage.value,
          sortBy: []
        });
      })
      .catch((e) => {
        console.error("保存失败", e);
        snackbar.open(
          `${group.groupName}: 保存失败: ${e instanceof Error ? e.message : String(e)}`
        );
      })
      .finally(() => {
        group.saving = false;
      }); // 用finally保证请求完后重置saving状态
  },

  close() {
    group.dialog = false;
    group.init();
  }
});

// 定义方法
const loadItems = async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
  loading.value = true;
  try {
    const {items = [], total = 0} = await RealAPI.fetch({page, itemsPerPage, sortBy}) || {};
    serverItems.value = items;
    totalItems.value = total;
  } catch (e) {
    console.error("加载数据失败", e);
    serverItems.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// 创建一个权限ID到标题的映射
const authorityMap = new Map<string, string>();

// 初始化权限映射
allAuthorities.forEach(category => {
  category.children.forEach(child => {
    authorityMap.set(child.id, child.title);
  });
});

// 添加一个方法来获取权限标题
const getAuthorityTitle = (id: string) => {
  return authorityMap.get(id) || id; // 如果找不到则返回ID本身
};


const removeGroup = reactive({
  groupId: '',
  groupName: '',
  confirm: (groupId: string, groupName: string) => {
    removeGroup.groupId = groupId;
    removeGroup.groupName = groupName;
    confirmDialog.confirm = () => {
      removeGroup.remove()
    };
    confirmDialog.open('删除权限组', '是否删除权限组' + removeGroup.groupName + '?')
  },
  remove: () => {
    try {
      delGroupApi(removeGroup.groupId).then(() => {
        snackbar.open(removeGroup.groupName + ': 已被您成功删除.')
        //成功刷新数据
        loadItems({
          page: 1,  // 你可以选择保持当前页数，或者从第一页开始
          itemsPerPage: itemsPerPage.value,
          sortBy: []  // 根据需要可以传递排序参数
        });
      }).catch(e => {
        console.log('error', e)
        snackbar.open(removeGroup.groupName + ': 删除失败.')
      })
    } finally {
      confirmDialog.close()
    }
  }

})

// 初始化加载数据
onMounted(() => {
  loadItems({
    page: 1,
    itemsPerPage: itemsPerPage.value,
    sortBy: []
  });
});


</script>

<style scoped>
</style>
