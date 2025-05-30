<template>
  <!-- 标题部分 -->
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-icon>mdi-code-json</v-icon>
          <span>Json格式化工具</span>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="6">
      <v-textarea
        v-model="input"
        :rows="18"
        auto-grow
        class="json-textarea"
        label="输入"
        @input="formatSql"/>
    </v-col>
    <v-col cols="12" md="6">
      <v-textarea
        v-model="output"
        :rows="18"
        auto-grow
        class="json-textarea output-area"
        label="输出"
        readonly/>
      <div v-if="error" class="error text-error mt-2">{{ error }}</div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {jsonPrettyApi} from "@/api/ApiTools";

export default defineComponent({
  name: 'JsonFormatter',
  data() {
    return {
      input: '',
      output: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async formatSql() {
      if (!this.input.trim()) {
        this.error = 'Please enter Json to format';
        this.output = '';  // 清空输出内容
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const res = await jsonPrettyApi({
          content: this.input
        });
        console.log(res.data)
        this.output = res.data.toString();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred';
        this.output = '';  // 出错时清空输出
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped>
.error {
  color: #ff5252;
}

/* 添加新的样式 */
.json-textarea {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-weight: bold; /* 直接加粗 */
}

/* 调整文本区域的边框和阴影 */
.v-textarea :deep(textarea) {
  font-family: inherit;
}

</style>
