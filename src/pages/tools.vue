<template>
  <v-container>
    <!-- 应用栏 -->
    <v-app-bar :elevation="20">
      <v-app-bar-title>工具包</v-app-bar-title>
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
      <v-responsive class="align-center fill-height mx-auto" max-width="900">
        <v-img class="mb-4" height="150" src="@/assets/logo.png" />
        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
          <div class="py-4"/>
          <h1 class="text-h2 font-weight-bold">工具包</h1>
        </div>
      </v-responsive>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { type Component, ref, shallowRef, onMounted } from 'vue';
import PortChecher from "@/components/tools/PortChecher.vue";

// 定义每个导航项的数据类型
interface NavItem {
  title: string;
  component?: Component;
}

// 直接以一维数组存储菜单项
const navItems = ref<NavItem[]>([
  { title: '端口检测', component: PortChecher },
  // { title: '语音机器人', component: undefined },
  // { title: '图像机器人', component: undefined },
]);

// 当前显示的组件
const currentComponent = shallowRef<Component | null>(null);

// 切换组件的函数
const showComponent = (component: Component | undefined) => {
  currentComponent.value = component || null;
};

// 组件挂载时，如果只有一个有效选项卡则自动打开
onMounted(() => {
  const validItems = navItems.value.filter((item): item is { title: string; component: Component } =>
    item.component !== undefined
  );

  if (validItems.length === 1) {
    currentComponent.value = validItems[0].component as Component;
  }
});
</script>
