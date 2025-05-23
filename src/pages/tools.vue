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
import SqlPretty from "@/components/tools/SqlPretty.vue";
import JsonPretty from "@/components/tools/JsonPretty.vue";

interface NavItem {
  title: string;
  component?: Component;
}

// 从localStorage加载排序后的导航项，如果没有则使用默认顺序
const loadNavItems = (): NavItem[] => {
  const defaultItems: NavItem[] = [
    { title: '端口检测', component: PortChecher },
    { title: 'SQL格式化', component: SqlPretty },
    { title: 'JSON格式化', component: JsonPretty },
    // { title: '语音机器人', component: undefined },
    // { title: '图像机器人', component: undefined },
  ];

  const savedOrder = localStorage.getItem('navItemsOrder');
  if (!savedOrder) return defaultItems;

  try {
    const order = JSON.parse(savedOrder) as string[];
    // 确保所有默认项都在排序中
    const allTitles = new Set([...order, ...defaultItems.map(item => item.title)]);

    return Array.from(allTitles).map(title => {
      const item = defaultItems.find(i => i.title === title) || { title };
      return item;
    });
  } catch {
    return defaultItems;
  }
};

const navItems = ref<NavItem[]>(loadNavItems());
const currentComponent = shallowRef<Component | null>(null);

// 切换组件并更新排序
const showComponent = (component: Component | undefined) => {
  if (!component) return;

  currentComponent.value = component;

  // 找到点击的项
  const clickedItem = navItems.value.find(item => item.component === component);
  if (!clickedItem) return;

  // 重新排序：将点击的项移到最前面
  const newItems = [
    clickedItem,
    ...navItems.value.filter(item => item !== clickedItem)
  ];

  navItems.value = newItems;

  // 保存排序到localStorage
  localStorage.setItem(
    'navItemsOrder',
    JSON.stringify(newItems.map(item => item.title))
  );
};

onMounted(() => {
  // 获取所有有组件的导航项
  const validItems = navItems.value.filter(item => item.component !== undefined);

  // 如果有可用的组件，默认选中第一个
  if (validItems.length > 0) {
    currentComponent.value = validItems[0].component as Component;

    // 确保第一个项目在导航栏中也被高亮显示
    // 这里不需要额外操作，因为 currentComponent 的变化会自动更新 :class 绑定
  }
});
</script>
