<template>
  <v-container>
    <v-breadcrumbs :items="['授权管理', '客户端']"></v-breadcrumbs>
    <v-data-table-server
      v-model:items-per-page="searchRegisteredClientDetails.itemsPerPage"
      :headers="searchRegisteredClientDetails.headers"
      :items="searchRegisteredClientDetails.serverItems"
      :items-length="searchRegisteredClientDetails.totalItems"
      :loading="searchRegisteredClientDetails.loading"
      :search="searchRegisteredClientDetails.search"
      item-value="name"
      @update:options="searchRegisteredClientDetails.loadItems"
    >

      <template #top>
        <v-toolbar flat>
          <v-toolbar-title></v-toolbar-title>
          <v-btn
            border
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="添加客户端"
            @click="editRegisteredClientDetails.open()"
          >
          </v-btn>
        </v-toolbar>
      </template>


      <template
        #[`item.actions`]="{ item }: {item: {registeredClientId: string, clientName: string, actions: string[]}}">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="item.actions.includes('delete')" color="medium-emphasis" icon="mdi-delete" size="small"
                  @click="removeRegisteredClient.confirm(item.registeredClientId, item.clientName)"/>
        </div>
      </template>


    </v-data-table-server>
  </v-container>

  <v-dialog v-model="editRegisteredClientDetails.dialog" max-width="800" persistent>
    <v-card subtitle="创建你想要的客户端"
            title="添加客户端"
    >
      <template v-slot:text>
        <v-row>

          <!-- 基础信息 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.clientId"
              label="客户端ID"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.clientName"
              label="客户端名称"
              outlined
            ></v-text-field>
          </v-col>

          <!-- 安全信息 -->
          <v-col cols="12" md="12">
            <v-text-field
              v-model="editRegisteredClientDetails.clientSecret"
              label="客户端密钥"
              outlined
            ></v-text-field>
          </v-col>

          <!-- 认证与授权 -->
          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.clientAuthenticationMethods"
              :items="['client_secret_basic', 'client_secret_post', 'private_key_jwt', 'none']"
              chips
              label="认证方法"
              multiple
              outlined
            ></v-combobox>
          </v-col>

          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.authorizationGrantTypes"
              :items="['authorization_code', 'client_credentials', 'refresh_token', 'password']"
              chips
              label="授权类型"
              multiple
              outlined
            ></v-combobox>
          </v-col>

          <!-- 范围与URI -->
          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.scopes"
              :items="['openid', 'profile', 'email', 'offline_access']"
              chips
              label="权限范围"
              multiple
              outlined
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="6">
            <v-combobox
              v-model="editRegisteredClientDetails.redirectUris"
              chips
              hint="多个URI用回车分隔"
              label="重定向URI"
              multiple
              outlined
              persistent-hint
            ></v-combobox>
          </v-col>

          <v-col cols="12" md="6">
            <v-combobox
              v-model="editRegisteredClientDetails.postLogoutRedirectUris"
              chips
              label="登出重定向URI"
              multiple
              outlined
            ></v-combobox>
          </v-col>

        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="editRegisteredClientDetails.close()"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="保存" @click="editRegisteredClientDetails.save()"></v-btn>
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

  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
    {{ snackbar.text }}
    <template #actions>
      <v-btn color="blue" text="关闭" variant="text" @click="snackbar.close"/>
    </template>
  </v-snackbar>


</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {createRegisteredClientApi, getRegisteredClientsApi, removeRegisteredClientApi,} from '@/api/Api'
import {actionDialog} from "@/stores/Dialog";
import {snackbar} from "@/stores/Snackbar";

const searchRegisteredClientDetails = reactive({
  headers: ref([
    {title: '客户端ID', key: 'clientId', align: 'start'},
    {title: '名称', key: 'clientName', align: 'start'},
    {title: '授权类型', key: 'authorizationGrantTypes', align: 'start'},
    {title: '权限', key: 'scopes', align: 'start'},
    {title: '创建时间', key: 'createdDate', align: 'start'},
    {title: '更新时间', key: 'lastModifiedDate', align: 'start'},
    {title: '操作', key: 'actions', align: 'end'},
  ] as const),

  itemsPerPage: 5,
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
    searchRegisteredClientDetails.loading = true;
    const {items, total} = await searchRegisteredClientDetails._RealAPI();
    searchRegisteredClientDetails.serverItems = items;
    searchRegisteredClientDetails.totalItems = total;
    searchRegisteredClientDetails.loading = false;
  },

  _RealAPI: async () => {
    const response = await getRegisteredClientsApi();
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});


const editRegisteredClientDetails = reactive({
  clientId: 'login-client', // 客户端ID
  clientIdIssuedAt: new Date().toISOString(), // 默认当前时间
  clientSecret: '{noop}secret', // 客户端密钥
  clientSecretExpiresAt: new Date(8640000000000000).toISOString(), // 默认永不过期 (对应Java的Instant.MAX)
  clientName: '内部微服务之间认证', // 客户端名称
  clientAuthenticationMethods: ['client_secret_basic', 'none'], // 认证方法数组
  authorizationGrantTypes: ['client_credentials', 'refresh_token'], // 授权类型数组
  redirectUris: [] as string[], // 重定向URI数组 (空数组)
  postLogoutRedirectUris: [] as string[], // 登出重定向URI数组 (空数组)
  scopes: ['read', 'write'], // 权限范围数组
  clientSettings: JSON.stringify({ // 默认客户端设置(JSON字符串)
    requireProofKey: false,
    requireAuthorizationConsent: true
  }),
  tokenSettings: JSON.stringify({ // 默认令牌设置(JSON字符串)
    authorizationCodeTimeToLive: 300,
    accessTokenTimeToLive: 3600
  }),
  dialog: false,
  open: () => {
    editRegisteredClientDetails.dialog = true
  },
  close: () => {
    editRegisteredClientDetails.dialog = false
  },
  save: () => {
    createRegisteredClientApi({
      clientId: editRegisteredClientDetails.clientId,
      clientIdIssuedAt: editRegisteredClientDetails.clientIdIssuedAt, // ISO8601格式时间字符串
      clientSecret: editRegisteredClientDetails.clientSecret,
      clientSecretExpiresAt: editRegisteredClientDetails.clientSecretExpiresAt, // ISO8601格式时间字符串，null表示永不过期
      clientName: editRegisteredClientDetails.clientName,
      clientAuthenticationMethods: editRegisteredClientDetails.clientAuthenticationMethods,
      authorizationGrantTypes: editRegisteredClientDetails.authorizationGrantTypes,
      redirectUris: editRegisteredClientDetails.redirectUris,
      postLogoutRedirectUris: editRegisteredClientDetails.postLogoutRedirectUris,
      scopes: editRegisteredClientDetails.scopes,
    }).then(() => {
      editRegisteredClientDetails.close()
      snackbar.text = editRegisteredClientDetails.clientName + ': 已被成功添加';
      snackbar.open()

      //添加后成功刷新数据
      searchRegisteredClientDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchRegisteredClientDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });
    }).catch(e => {
      snackbar.text = editRegisteredClientDetails.clientName + ': 添加失败: ' + e;
      snackbar.open()
    })

    editRegisteredClientDetails.dialog = false
  }
})

const removeRegisteredClient = reactive({
  _registeredClientId: '',
  _clientName: '',
  confirm: (registeredClientId: string, clientName: string) => {
    removeRegisteredClient._registeredClientId = registeredClientId;
    removeRegisteredClient._clientName = clientName;
    actionDialog.leftAction = () => {
      removeRegisteredClient._remove()
    };
    actionDialog.title = '删除客户端';  // 用于设置对话框标题
    actionDialog.text = '是否删除客户端 ' + removeRegisteredClient._clientName + '?';  // 用于设置对话框内容
    actionDialog.open()
  },
  _remove: () => {
    actionDialog.close()
    removeRegisteredClientApi(removeRegisteredClient._registeredClientId).then(() => {
      snackbar.text = removeRegisteredClient._clientName + ': 已被您成功删除.';
      snackbar.open()

      searchRegisteredClientDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchRegisteredClientDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });

    }).catch(e => {
      console.log('error', e)
      snackbar.text = removeRegisteredClient._clientName + ': 删除失败.';
      snackbar.open()
    })
  }
})

</script>
