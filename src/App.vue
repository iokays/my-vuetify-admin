<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>


    <!-- 其他内容 -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="pink" text="关闭" variant="text" @click="snackbar.close"/>
      </template>
    </v-snackbar>

    <v-dialog v-model="confirmDialog.visible" max-width="400px">
      <v-card
        :text="confirmDialog.text"
        :title="confirmDialog.title"
      >
        <v-card-actions>
          <v-btn text="取消" @click="confirmDialog.close"/>
          <v-btn text="确定" @click="confirmDialog.confirm"/>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-app>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {useSnackbarStore} from '@/stores/Snackbar'
import {useConfirmDialogStore} from "@/stores/Dialog";

const snackbar = useSnackbarStore()
const confirmDialog = useConfirmDialogStore()

// 初始化时检查当前路由
onMounted(() => {
  // 这里不需要额外处理，因为isActive是响应式的
})
</script>

<style>
/* 可选：自定义激活状态样式 */
.v-btn--active {
  color: #4527A0 !important;
}
</style>
