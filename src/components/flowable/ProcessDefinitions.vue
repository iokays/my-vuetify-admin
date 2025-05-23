<template>
  <v-container>
    <v-breadcrumbs :items="['工作流', '流程定义']"></v-breadcrumbs>

    <!-- Upload Button -->
    <v-row class="mb-4">
      <v-col>
      </v-col>
    </v-row>

    <v-data-table-server
      v-model:items-per-page="searchPage.itemsPerPage"
      :headers="searchPage.headers"
      :items="searchPage.serverItems"
      :items-length="searchPage.totalItems"
      :loading="searchPage.loading"
      :search="searchPage.search"
      item-value="name"
      @update:options="searchPage.loadItems"
    >

      <template #top>
        <v-toolbar flat>
          <v-toolbar-title></v-toolbar-title>

          <v-btn
            border
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="上传流程定义"
            @click="triggerFileInput"
          >
          </v-btn>

          <input
            ref="fileInput"
            type="file"
            style="display: none"
            accept=".bpmn,.xml,.zip"
            @change="handleFileUpload"
          >

        </v-toolbar>
      </template>


    </v-data-table-server>


    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="blue" text="关闭" variant="text" @click="snackbar.close"/>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { snackbar } from "@/stores/Snackbar";
import { pageProcessDefinitionsApi, uploadProcessDefinitionApi } from '@/api/ApiFlowable';

const fileInput = ref<HTMLInputElement | null>(null);

const searchPage = reactive({
  category: null,
  headers: ref([
    {title: '定义编号', key: 'key', align: 'start'},
    {title: '定义名称', key: 'name', align: 'start'},
    {title: '类型', key: 'category', align: 'start'},
    {title: '版本号', key: 'version', align: 'start'},
    {title: '描述', key: 'messageId', align: 'start'},
  ] as const),

  search: '',
  itemsPerPage: 10,
  serverItems: [],
  loading: true,
  totalItems: 0,

  loadItems: async () => {
    searchPage.loading = true;
    const {items, total} = await searchPage._RealAPI();
    searchPage.serverItems = items;
    searchPage.totalItems = total;
    searchPage.loading = false;
  },

  _RealAPI: async () => {
    const response = await pageProcessDefinitionsApi({})
    console.log('response: ' + response)
    return {items: response.data.content, total: response.data.size};
  }
});

// Trigger the hidden file input
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    try {
      await uploadProcessDefinitionApi(file);
      snackbar.text = '流程定义上传成功'
      snackbar.open()
      searchPage.loadItems();
    } catch (error) {
      console.error('Upload failed:', error);
      snackbar.text = '流程定义上传失败'
      snackbar.open()
    } finally {
      // Reset the file input
      if (input) input.value = '';
    }
  }
};

</script>
