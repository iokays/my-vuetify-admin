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
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="添加客户端"
            border
            @click="editRegisteredClientDetails.open()"
          >
          </v-btn>
        </v-toolbar>
      </template>


      <template #[`item.actions`]="{ item }: {item: {clientRegistrationId: string, actions: string[]}}">
        <div class="d-flex ga-2 justify-end">
          <v-icon v-if="item.actions.includes('delete')" color="medium-emphasis" icon="mdi-delete" size="small" />
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
              label="认证方法"
              multiple
              chips
              outlined
            ></v-combobox>
          </v-col>

          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.authorizationGrantTypes"
              :items="['authorization_code', 'client_credentials', 'refresh_token', 'password']"
              label="授权类型"
              multiple
              chips
              outlined
            ></v-combobox>
          </v-col>

          <!-- 范围与URI -->
          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.scopes"
              :items="['openid', 'profile', 'email', 'offline_access']"
              label="权限范围"
              multiple
              chips
              outlined
            ></v-combobox>
          </v-col>

          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.redirectUris"
              label="重定向URI"
              multiple
              chips
              hint="多个URI用回车分隔"
              persistent-hint
              outlined
            ></v-combobox>
          </v-col>

          <v-col cols="12">
            <v-combobox
              v-model="editRegisteredClientDetails.postLogoutRedirectUris"
              label="登出重定向URI"
              multiple
              chips
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

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {getRegisteredClientsApi} from '@/api/Api'

const searchRegisteredClientDetails = reactive({
  headers: ref([
    { title: '客户端ID', key: 'clientId', align: 'start' },
    { title: '名称', key: 'clientName', align: 'start' },
    { title: '授权类型', key: 'authorizationGrantTypes', align: 'start' },
    { title: '权限', key: 'scopes', align: 'start' },
    { title: '创建时间', key: 'createdDate', align: 'start' },
    { title: '更新时间', key: 'lastModifiedDate', align: 'start' },
    { title: '操作', key: 'actions', align: 'end' },
  ] as const),

  itemsPerPage: 5,
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async ({ page, itemsPerPage, sortBy }: {page: number, itemsPerPage: number, sortBy: never[]}) => {
    searchRegisteredClientDetails.loading = true;
    const { items, total } = await searchRegisteredClientDetails._RealAPI();
    searchRegisteredClientDetails.serverItems = items;
    searchRegisteredClientDetails.totalItems = total;
    searchRegisteredClientDetails.loading = false;
  },

  _RealAPI: async () => {
    const response = await getRegisteredClientsApi();
    console.log('response: ' + response)
    return { items: response.data.content, total: response.data.size };
  }
});


const editRegisteredClientDetails = reactive({
  clientId: '', // 客户端ID
  clientIdIssuedAt: new Date().toISOString(), // 默认当前时间
  clientSecret: '', // 客户端密钥
  clientSecretExpiresAt: null as string | null, // 默认永不过期
  clientName: '', // 客户端名称
  clientAuthenticationMethods: [] as string[], // 认证方法数组
  authorizationGrantTypes: [] as string[], // 授权类型数组
  redirectUris: [] as string[], // 重定向URI数组
  postLogoutRedirectUris: [] as string[], // 登出重定向URI数组
  scopes: [] as string[], // 权限范围数组
  clientSettings: JSON.stringify({ // 默认客户端设置(JSON字符串)
    requireProofKey: false,
    requireAuthorizationConsent: true
  }),
  tokenSettings: JSON.stringify({ // 默认令牌设置(JSON字符串)
    authorizationCodeTimeToLive: 300,
    accessTokenTimeToLive: 3600
  }),
  dialog: false,
  open: () => {editRegisteredClientDetails.dialog = true},
  close: () => {editRegisteredClientDetails.dialog = false},
  save: () => {editRegisteredClientDetails.dialog = false},
})

</script>
