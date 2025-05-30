<template>
  <v-breadcrumbs :items="['授权管理', '服务端']"/>
  <v-data-table-server
    v-model:items-per-page="searchClientRegistrationDetails.itemsPerPage"
    :headers="searchClientRegistrationDetails.headers"
    :items="searchClientRegistrationDetails.serverItems"
    :items-length="searchClientRegistrationDetails.totalItems"
    :loading="searchClientRegistrationDetails.loading"
    :search="searchClientRegistrationDetails.search"
    item-value="name"
    @update:options="searchClientRegistrationDetails.loadItems"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title></v-toolbar-title>
        <v-btn
          border
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          text="添加服务方"
          @click="editRegisteredClientDetails.open()"
        />
      </v-toolbar>
    </template>

    <template #[`item.actions`]="{ item }: {item: {registrationId: string, clientName: string, actions: string[]}}">
      <div class="d-flex ga-2 justify-end">
        <v-icon v-if="item.actions.includes('delete')" color="medium-emphasis" icon="mdi-delete" size="small"
                @click="removeClientRegistration.confirm(item.registrationId, item.clientName)"/>
      </div>
    </template>

  </v-data-table-server>

  <v-dialog v-model="editRegisteredClientDetails.dialog" max-width="800" persistent>
    <v-card subtitle="创建你想要的客户端" title="添加客户端">
      <template v-slot:text>


        <v-row>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.registrationId"
              label="客户端标识"
              outlined
            ></v-text-field>
          </v-col>

          <!-- 注册类型 -->
          <v-col cols="12" md="6">
            <v-select
              v-model="editRegisteredClientDetails.clientRegistrationType"
              :items="['GOOGLE', 'IOKAYS']"
              label="客户端注册类型"
              outlined
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.clientName"
              label="客户端名称"
              outlined
            ></v-text-field>
          </v-col>

          <!-- 基础信息 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.clientId"
              label="客户端ID"
              outlined
            ></v-text-field>
          </v-col>


          <!-- 安全信息 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.clientSecret"
              label="客户端密钥"
              outlined
            ></v-text-field>
          </v-col>

          <!-- 认证与授权 -->
          <v-col cols="12" md="6">
            <v-select
              v-model="editRegisteredClientDetails.clientAuthenticationMethod"
              :items="['client_secret_basic', 'client_secret_post', 'private_key_jwt', 'none']"
              label="认证方法"
              outlined
            ></v-select>
          </v-col>

          <v-col cols="12" md="12">
            <v-select
              v-model="editRegisteredClientDetails.authorizationGrantType"
              :items="['authorization_code', 'client_credentials', 'refresh_token', 'password']"
              label="授权类型"
              outlined
            ></v-select>
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

          <!-- OAuth2/OIDC 端点 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.authorizationUri"
              label="授权端点"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.tokenUri"
              label="令牌端点"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.userInfoUri"
              label="用户信息端点"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="editRegisteredClientDetails.userNameAttributeName"
              label="用户名属性名"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="editRegisteredClientDetails.jwkSetUri"
              label="JWKS端点"
              outlined
            ></v-text-field>
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

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {
  createClientRegistrationApi,
  deleteClientRegistrationApi,
  getClientRegistrationsApi
} from '@/api/ApiAuthorization'
import {useSnackbarStore} from '@/stores/Snackbar'
import {actionDialog} from "@/stores/Dialog";

const snackbar = useSnackbarStore()

const searchClientRegistrationDetails = reactive({
  headers: ref([
    {title: '客户端ID', key: 'clientId', align: 'start'},
    {title: '名称', key: 'clientName', align: 'start'},
    {title: '类型', key: 'clientRegistrationType', align: 'start'},
    {title: '授权类型', key: 'authorizationGrantType', align: 'start'},
    {title: '权限范围', key: 'scopes', align: 'start'},
    {title: '更新时间', key: 'lastModifiedDate', align: 'start'},
    {title: '操作', key: 'actions', align: 'end'},
  ] as const),

  itemsPerPage: 5,
  search: '',
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async ({page, itemsPerPage, sortBy}: { page: number, itemsPerPage: number, sortBy: never[] }) => {
    searchClientRegistrationDetails.loading = true;
    const {items, total} = await searchClientRegistrationDetails._RealAPI();
    searchClientRegistrationDetails.serverItems = items;
    searchClientRegistrationDetails.totalItems = total;
    searchClientRegistrationDetails.loading = false;
  },

  _RealAPI: async () => {
    const response = await getClientRegistrationsApi();
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

const editRegisteredClientDetails = reactive({
  // Client registration info
  registrationId: 'GOOGLE-2',
  clientRegistrationType: 'GOOGLE', // 客户端注册类型
  clientId: '297202495616-54ij9h7ta0e426tktjipltkbg4auiean.apps.googleusercontent.com', // 客户端ID
  clientName: 'Google客户端', // 客户端名称
  clientSecret: 'GOCSPX-HQDuQ9El4k7qWFiKMXtIUa_7yPk', // 客户端密钥
  clientAuthenticationMethod: 'client_secret_basic', // 认证方法
  authorizationGrantType: 'authorization_code', // 授权类型
  scopes: ["openid", "profile", "email", "address", "phone"], // 权限范围
  authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth', // 授权端点
  tokenUri: 'https://www.googleapis.com/oauth2/v4/token', // 令牌端点
  // Optional OIDC fields
  userInfoUri: 'https://www.googleapis.com/oauth2/v3/userinfo', // 用户信息端点(OIDC可选)
  userNameAttributeName: 'sub', // 用户名属性名(OIDC)
  jwkSetUri: 'https://www.googleapis.com/oauth2/v3/certs', // JWKS端点(OIDC)

  // Dialog control
  dialog: false,
  open: () => {
    editRegisteredClientDetails.dialog = true
  },
  close: () => {
    editRegisteredClientDetails.dialog = false
  },
  save: () => {
    createClientRegistrationApi({
      registrationId: editRegisteredClientDetails.registrationId,
      clientRegistrationType: editRegisteredClientDetails.clientRegistrationType,
      clientId: editRegisteredClientDetails.clientId,
      clientName: editRegisteredClientDetails.clientName,
      clientSecret: editRegisteredClientDetails.clientSecret,
      clientAuthenticationMethod: editRegisteredClientDetails.clientAuthenticationMethod,
      authorizationGrantType: editRegisteredClientDetails.authorizationGrantType,
      scopes: editRegisteredClientDetails.scopes,
      authorizationUri: editRegisteredClientDetails.authorizationUri,
      tokenUri: editRegisteredClientDetails.tokenUri,
      userInfoUri: editRegisteredClientDetails.userInfoUri,
      userNameAttributeName: editRegisteredClientDetails.userNameAttributeName,
      jwkSetUri: editRegisteredClientDetails.jwkSetUri
    }).then(() => {
      editRegisteredClientDetails.close()
      snackbar.open(editRegisteredClientDetails.clientName + ': 已被成功添加')

      //添加后成功刷新数据
      searchClientRegistrationDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchClientRegistrationDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });
    }).catch(e => {
      snackbar.open(editRegisteredClientDetails.clientName + ': 添加失败: ' + e)
    })

    editRegisteredClientDetails.dialog = false
  }
})

const removeClientRegistration = reactive({
  _registrationId: '',
  _clientName: '',
  confirm: (clientRegistrationId: string, clientName: string) => {
    removeClientRegistration._registrationId = clientRegistrationId;
    removeClientRegistration._clientName = clientName;
    actionDialog.leftAction = () => {
      removeClientRegistration._remove()
    };
    actionDialog.title = '删除客户端';  // 用于设置对话框标题
    actionDialog.text = '是否删除客户端 ' + removeClientRegistration._clientName + '?';  // 用于设置对话框内容
    actionDialog.open()
  },
  _remove: () => {
    actionDialog.close()
    deleteClientRegistrationApi(removeClientRegistration._registrationId).then(() => {
      snackbar.open(removeClientRegistration._clientName + ': 已被您成功删除.')

      searchClientRegistrationDetails.loadItems({
        page: 1,  // 你可以选择保持当前页数，或者从第一页开始
        itemsPerPage: searchClientRegistrationDetails.itemsPerPage,
        sortBy: []  // 根据需要可以传递排序参数
      });

    }).catch(e => {
      console.log('error', e)
      snackbar.open(removeClientRegistration._clientName + ': 删除失败.')
    })
  }
})

</script>
