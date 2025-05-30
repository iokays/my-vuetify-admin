<template>
  <v-container fluid>

    <v-app-bar :elevation="20">
      <v-app-bar-title>消息与事件调度平台</v-app-bar-title>
    </v-app-bar>

    <!-- 导航栏 -->
    <v-navigation-drawer :width="210">
      <v-row no-gutters style="height: 100%;">
        <v-col cols="4">
          <app-navigation-drawer-left/>
        </v-col>

        <v-col cols="8">
          <v-card class="mx-auto" width="200">
            <v-list>
              <!-- 动态渲染导航项 -->
              <template v-for="group in navItems" :key="group.title">
                <v-list-group :value="group.title">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      :title="group.title"
                      v-bind="props"
                    ></v-list-item>
                  </template>
                  <!-- 动态渲染子菜单项 -->
                  <v-list-item
                    v-for="item in group.items"
                    :key="item.title"
                    :title="item.title"
                    @click="showComponent(item.component)"
                  ></v-list-item>
                </v-list-group>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <!-- 动态组件 -->
    <component :is="currentComponent" v-if="currentComponent"/>
    <!-- 默认内容 -->
    <template v-else>
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="900"
      >
        <v-img
          class="mb-4"
          height="150"
          src="@/assets/logo.png"
        />
        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
          <div class="py-4"/>
          <h1 class="text-h2 font-weight-bold">消息与事件调度平台</h1>
        </div>
      </v-responsive>
    </template>

  </v-container>
</template>

<script lang="ts" setup>
//
import {type Component, ref, shallowRef} from 'vue';
import JobDetails from "@/components/dispatch/schedule/JobDetails.vue";
import DomainEvents from "@/components/dispatch/message/DomainEvents.vue";
import AppNavigationDrawerLeft from "@/components/AppNavigationDrawerLeft.vue"; // 导入模块组件

// 定义导航栏数据结构
interface NavItem {
  title: string;
  component?: Component; // 关联的组件
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// 导航栏数据
const navItems = ref<NavGroup[]>([
  {
    title: '任务调度',
    items: [
      {title: '任务', component: JobDetails}, // 如果没有关联组件，可以设为 null
      // { title: '触发器', component: ClientRegistration }, // 如果没有关联组件，可以设为 null
    ],
  },
  {
    title: '事件消息',
    items: [
      {title: '领域事件', component: DomainEvents},
    ],
  },
  // 可以添加更多导航组
  // {
  //   title: '鉴权管理',
  //   items: [
  //     { title: '角色', component: undefined }, // 如果没有关联组件，可以设为 null
  //     { title: '权限', component: undefined },
  //   ],
  // },
]);

// 当前显示的组件
const currentComponent = shallowRef<Component>();

// 切换显示模块
const showComponent = (component: Component | undefined) => {
  if (component) {
    currentComponent.value = component;
  }
};

</script>
