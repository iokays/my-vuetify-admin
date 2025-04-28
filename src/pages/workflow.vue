<template>
  <v-container>

    <v-app-bar :elevation="20">
      <v-app-bar-title>工作流平台</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer :width="200">
      <v-card class="mx-auto" width="200">
        <v-list>
          <!-- 动态渲染导航项 -->
          <template v-for="group in navItems" :key="group.title">
            <v-list-group :value="group.title">
              <template v-slot:activator="{ props }">
                <v-list-item :title="group.title" v-bind="props"></v-list-item>
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
    </v-navigation-drawer>

    <component :is="currentComponent" v-if="currentComponent" />
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <v-img class="mb-4" height="150" src="@/assets/logo.png" />
      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <div class="py-4" />
        <h1 class="text-h2 font-weight-bold">统一工作流平台</h1>
      </div>
      <div ref="canvas" style="height: 300px;"></div>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { type Component, onMounted, ref, shallowRef } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { xmlStr } from '@/assets/data/xmlStr.js';


interface NavItem {
  title: string;
  component?: Component;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navItems = ref<NavGroup[]>([
  {
    title: '工作流管理',
    items: [
      { title: '定义列表', component: undefined },
      { title: '实例列表', component: undefined },
    ],
  },
]);

const currentComponent = shallowRef<Component | null>(null);
const canvas = ref<HTMLElement | null>(null);

const showComponent = (component: Component | undefined) => {
  currentComponent.value = component || null;
};

onMounted(async () => {
  if (canvas.value) {
    const bpmnModeler = new BpmnModeler({
      container: canvas.value,
      keyboard: { bindTo: document },
    });
    try {
      await bpmnModeler.importXML(xmlStr);
      console.log('BPMN diagram rendered successfully');
    } catch (err) {
      console.error('Error importing XML:', err);
    }
  } else {
    console.error('Canvas element is not available');
  }
});
</script>

<style>
/* Hide the bpmn.io logo */
.bjs-powered-by {
  display: none !important;
}

/* 设置所有连线和箭头的颜色为红色 */
.djs-connection {
  stroke: white !important;
}

/* 箭头实际上是marker元素，需要通过SVG选择器来设置 */
.djs-connection .djs-visual > :nth-child(2) {
  stroke: white !important;
  fill: white !important;
}

/* 设置新创建连线的颜色为红色 */
.djs-connection.red {
  stroke: white !important;
}

/* 设置箭头的填充色 */
.marker-arrowheads [marker-end] path,
.marker-arrowheads [marker-start] path {
  fill: white !important;
  stroke: white !important;
}

</style>
