<template>
  <v-container>
    <!-- 聊天消息列表 -->
    <v-card class="flex-grow-1 overflow-auto mb-4" rounded="xl" elevation="4">
      <v-card-text>
        <div v-for="(msg, index) in messages" :key="index" class="d-flex mb-3" :class="msg.from === 'user' ? 'justify-end' : 'justify-start'">

          <!-- 机器人图标 -->
          <v-avatar v-if="msg.from === 'bot'" class="mb-2">
            <v-icon>mdi-robot</v-icon>
          </v-avatar>

          <div
            :class="msg.from === 'bot' ? 'bg-blue-lighten-5 text-blue-darken-4' : 'bg-green-lighten-5 text-green-darken-4'"
            class="pa-3 rounded-lg"
            style="max-width: 70%; white-space: pre-wrap;"
            v-html="renderMarkdown(msg.text || '回答中...')"
          ></div>

          <!-- 复制按钮，只有当渲染后的文本不为空时才显示 -->
          <v-btn
            v-if="msg.from === 'bot' && renderMarkdown(msg.text) !== ''"
            variant="plain"
            size="x-small"
            icon="mdi-content-copy"
            @click="copyText(msg.text)"
            class="mb-2"
          />

          <!-- 用户图标 -->
          <v-avatar v-if="msg.from === 'user'" class="mb-2">
            <v-icon>mdi-account</v-icon>
          </v-avatar>

        </div>
      </v-card-text>
    </v-card>

    <!-- 输入框和发送按钮 -->
    <v-row no-gutters>
      <v-textarea
        v-model="newMessage"
        variant="solo-filled"
        density="comfortable"
        auto-grow
        rows="1.5"
        no-resize
        rounded="xl"
        @keydown="handleKeydown"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send-circle"
            variant="text"
            color="deep-purple-lighten-1"
            @click="sendMessage"
          ></v-btn>
        </template>
      </v-textarea>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { aiConversationApi } from "@/api/Api";
import { marked } from 'marked'  // 导入 marked 库

const messages = ref([
  { from: 'bot', text: '你好！开始我们新的对话吧!' },
])

const newMessage = ref('')
const conversationId = ref(typeof crypto !== 'undefined' ? crypto.randomUUID() : '');

// 使用 marked 库解析 markdown
function renderMarkdown(text: string) {
  return marked(text); // 将消息文本解析为 HTML
}

// 复制文本到剪贴板
function copyText(text: string) {
  navigator.clipboard.writeText(text);
}

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    const text = newMessage.value.trim()
    messages.value.push({ from: 'user', text: text })

    // 创建新的bot消息对象（初始为空）
    const botMessage = { from: 'bot', text: '' };
    messages.value.push(botMessage);

    // 调用API（假设返回Flux<String>）
    aiConversationApi({
      conversationId: conversationId.value,
      message: text
    }).then(stream => {

      const reader = stream?.getReader();
      const decoder = new TextDecoder();

      function readChunk() {
        reader?.read().then(({ done, value }) => {
          if (done) return;

          // 解码并处理数据块
          const chunk = decoder.decode(value);
          botMessage.text += chunk; // 追加到当前消息
          messages.value = [...messages.value]; // 触发响应式更新

          readChunk(); // 继续读取下一个块
        });
      }

      readChunk();
    });

    newMessage.value = '';
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
</script>

<style scoped>
/* 样式保持不变 */
</style>
