<template>
  <v-app>
    <v-main>

      <v-navigation-drawer :width="80">

        <template v-for="(item, index) in items" :key="index">
          <v-row justify="center" class="mt-1">
            <v-col class="text-center">
                <v-btn
                  color="deep-purple-lighten-1"
                  :icon="item.icon"
                  @click="() => item.link && redirect(item.link)"
                  :disabled="!item.link"
                  size="large"
                >
                </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-navigation-drawer>

      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
  import {ref} from 'vue'
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const redirect = (url: string) => {
    router.push(url);
  };

  const items = ref([
    { icon: "mdi-security", link: "authorization" },
    { icon: "mdi-calendar-clock", link: "dispatch" },
    { icon: "mdi-database-eye", link: "" },
    { icon: "mdi-post", link: "" },
    { icon: "mdi-archive-search", link: "" },
    { icon: "mdi-tools", link: "tools" }
  ]);
</script>
