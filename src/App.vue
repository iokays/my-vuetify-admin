<template>
  <v-app>
    <v-main>
      <v-navigation-drawer :width="80">
        <div class="d-flex flex-column" style="height: 100%;">
          <!-- 主要按钮 -->
          <div>
            <template v-for="(item, index) in items" :key="index">
              <v-row justify="center" class="mt-1">
                <v-col class="text-center">
                  <v-btn
                    color="deep-purple-lighten-1"
                    :icon="item.icon"
                    @click="item.action ? item.action() : (item.link && redirect(item.link))"
                    :disabled="!item.link && !item.action"
                    size="large"
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
                  color="deep-black-lighten-1"
                  icon="mdi-home"
                  @click="redirect('/')"
                  size="large"
                ></v-btn>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-navigation-drawer>

      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const redirect = (url: string) => {
  router.push(url);
};

const openGithub = () => {
  window.open('https://github.com/iokays/hexagonal-architecture-with-java', '_blank');
};

const openDocs = () => {
  window.open('https://www.iokays.com/docs/', '_blank');
};

const items = ref([
  { icon: "mdi-security", link: "authorization" },
  { icon: "mdi-calendar-clock", link: "dispatch" },
  { icon: "mdi-book-multiple", action: openDocs },
  { icon: "mdi-tools", link: "tools" },
  { icon: "mdi-github", action: openGithub },
  // 已移除 mdi-home
]);
</script>
