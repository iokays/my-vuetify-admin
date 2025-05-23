<template>
  <v-container fluid>

    <!-- 标题部分 -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon>mdi-lan-connect</v-icon>
            <span>SQL格式化工具</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-textarea
          v-model="input"
          label="输入"
          auto-grow
          :rows="18"
          class="sql-textarea"
          @input="formatSql" />
      </v-col>
      <v-col cols="12" md="6">
        <v-textarea
          v-model="output"
          label="输出"
          auto-grow
          :rows="18"
          class="sql-textarea output-area"
          readonly />
        <div v-if="error" class="error text-error mt-2">{{ error }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { sqlPrettyApi } from "@/api/ApiTools";

interface RequestModel {
  sql: string;
}

export default defineComponent({
  name: 'SqlFormatter',
  data() {
    return {
      input: 'select * from t_iokays',
      output: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async formatSql() {
      if (!this.input.trim()) {
        this.error = 'Please enter SQL to format';
        this.output = '';  // 清空输出内容
        return;
      }

      this.loading = true;
      this.error = '';

      const request: RequestModel = {
        sql: this.input
      };

      try {
        const res = await sqlPrettyApi(request);
        this.output = res.data;
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
.sql-textarea {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-weight: bold;  /* 直接加粗 */
}

/* 调整文本区域的边框和阴影 */
.v-textarea :deep(textarea) {
  font-family: inherit;
}

</style>
