<template>
  <v-container fluid>
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

        <h1 class="text-h2 font-weight-bold">Iokays</h1>
      </div>

      <div class="py-4"/>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            href="https://www.iokays.com/docs/hexagonal-architecture-with-java/index.html"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            target="_blank"
            variant="outlined"
          >
            <template #image>
              <v-img
                class="d-none d-md-block"
                position="top right"
              />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">公共服务聚合平台</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                这是一个基于Java 23 的 六边形架构与领域驱动设计的一个通用项目, 并整理了本系列的文档。
              </div>
            </template>

            <v-overlay
              contained
              model-value
              opacity=".12"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="/ai"
            prepend-icon="mdi-robot-happy"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="基于Spring-AI和DeepSeek实现的聊天机器人"
            target="_blank"
            title="AI智能机器人"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>


        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="/authorization"
            prepend-icon="mdi-text-box-outline"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="基于Spring Security&Server实现了表单, Oauth2登录，并提供了Oauth2认证服务"
            target="_blank"
            title="统一授权&鉴权平台"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>


      </v-row>

      <v-row>
        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="/dispatch"
            prepend-icon="mdi-star-circle-outline"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="基于Quartz实现了任务的查询，删除等行为"
            target="_blank"
            title="消息与事件调度平台"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="/flowable"
            prepend-icon="mdi-clipboard-flow"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="基于Flowable提供工作流基于Oauth2接口的调用."
            target="_blank"
            title="工作流平台"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-row>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="https://www.iokays.com/docs/"
            prepend-icon="mdi-book"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="利用 Gemini-AI 对英文技术文档进行翻译。"
            target="_blank"
            title="计算机编程技术中文文档库"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>


        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="/tools"
            prepend-icon="mdi-tools"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="收集了一些实用小工具"
            target="_blank"
            title="工具箱"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

      </v-row>

    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
