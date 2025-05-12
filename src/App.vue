<template>
  <v-app>
    <v-main>
      <v-navigation-drawer :width="70">
        <div class="d-flex flex-column" style="height: 100%;">
          <!-- 主要按钮 -->
          <div>
            <template v-for="(item, index) in navItems" :key="index">
              <v-row class="mt-1" justify="center">
                <v-col class="text-center">
                  <v-btn
                    :icon="item.icon"
                    :active="isActive(item.link)"
                    color="deep-purple-lighten-1"
                    @click="handleNavClick(item)"
                  ></v-btn>
                </v-col>
              </v-row>
            </template>
          </div>

          <!-- 固定在底部的首页按钮 -->
          <div style="margin-top: auto; margin-bottom: 16px;">
            <v-row justify="center">
              <v-col class="text-center">
                <v-btn
                  icon="mdi-home"
                  :active="isActive('/')"
                  color="deep-black-lighten-1"
                  @click="redirect('/')"
                ></v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-navigation-drawer>

      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()


// 检查当前路由是否匹配导航项
const isActive = (link?: string) => {
  if (!link) return false
  return route.path.startsWith(link)
}

// 处理导航点击
const handleNavClick = (item: any) => {
  if (item.action) {
    item.action()
  } else if (item.link) {
    redirect(item.link)
  }
}

// 路由跳转
const redirect = (url: string) => {
  router.push(url)
}

// 外部链接方法
const openGithub = () => {
  window.open('https://github.com/iokays/hexagonal-architecture-with-java', '_blank')
}

const openDocs = () => {
  window.open('https://www.iokays.com/docs/', '_blank')
}

// 导航项配置
const navItems = ref([
  {icon: "mdi-robot-happy", link: "/ai"},
  {icon: "mdi-security", link: "/authorization"},
  {icon: "mdi-calendar-clock", link: "/dispatch"},
  {icon: "mdi-sitemap", link: "/flowable"},
  {icon: "mdi-image-album", action: openDocs},
  {icon: "mdi-tools", link: "/tools"},
  {icon: "mdi-github", action: openGithub},
])

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
