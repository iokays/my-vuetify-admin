<template>
  <v-container fluid>
    <!-- 应用栏 -->
    <v-app-bar :elevation="20">
      <v-app-bar-title>网址黄页</v-app-bar-title>
    </v-app-bar>


    <!-- 导航栏 -->
    <v-navigation-drawer :width="70">
      <app-navigation-drawer-left />
    </v-navigation-drawer>

    <v-card
      v-for="(category, index) in data"
      :key="index"
      :prepend-icon="category.icon"
      :subtitle="category.category"
      class="mb-4"
    >
      <v-card-text>
        <v-chip-group column>
          <v-chip
            v-for="(child, idx) in category.children"
            :key="idx"
            :href="child.url"
            target="_blank"
          >
            {{ child.name }} <!-- 直接在这里显示 child.name -->
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { data } from '@/assets/data/yellow/urlJson';
import AppNavigationDrawerLeft from "@/components/AppNavigationDrawerLeft.vue";
</script>
