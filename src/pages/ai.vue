<template>
  <v-container>
    <!-- 应用栏 -->
    <v-app-bar :elevation="20">
      <v-app-bar-title>AI 智能机器人</v-app-bar-title>
    </v-app-bar>

    <!-- 导航栏 -->
    <v-navigation-drawer :width="200">
      <v-card class="mx-auto" width="200">
        <v-list>
          <!-- 动态渲染导航项 -->
          <v-list-item
            v-for="item in navItems"
            :key="item.title"
            :title="item.title"
            @click="showComponent(item.component)"
            :class="{ 'v-list-item--active': currentComponent === item.component }"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-navigation-drawer>

    <!-- 动态组件显示区域 -->
    <component :is="currentComponent" v-if="currentComponent"/>

    <!-- 默认内容 -->
    <template v-else>
      <v-responsive class="align-centerfill-height mx-auto" max-width="900">
        <v-img class="mb-4" height="150" src="@/assets/logo.png" />
        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
          <div class="py-4"/>
          <h1 class="text-h2 font-weight-bold">AI</h1>
        </div>
      </v-responsive>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { type Component, ref, shallowRef } from 'vue';
import ChatBot from "@/components/ai/ChatBot.vue";

// 定义每个导航项的数据类型
interface NavItem {
  title: string;
  component?: Component;
}

// 直接以一维数组存储菜单项
const navItems = ref<NavItem[]>([
  { title: '聊天机器人', component: ChatBot },
  // { title: '语音机器人', component: undefined },
  // { title: '图像机器人', component: undefined },
]);

// 当前显示的组件
const currentComponent = shallowRef<Component | null>(null);

// 切换组件的函数
const showComponent = (component: Component | undefined) => {
  currentComponent.value = component || null;
};
</script>

