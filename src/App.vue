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

  </v-app>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {useSnackbarStore} from '@/stores/Snackbar'

const snackbar = useSnackbarStore()

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
