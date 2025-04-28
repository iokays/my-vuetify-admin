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
          >
            {{ msg.text }}
          </div>

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

const messages = ref([
  { from: 'bot', text: '你好！有什么可以帮你的？' },
])

const newMessage = ref('')

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({ from: 'user', text: newMessage.value.trim() })
    // 模拟机器人回复
    setTimeout(() => {
      messages.value.push({ from: 'bot', text: '已收到：' + newMessage.value.trim() })
    }, 500)
    newMessage.value = ''
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    // 只有按 Enter（没有 Shift）才发送
    event.preventDefault() // 阻止默认换行
    sendMessage()
  }
  // 如果 Shift+Enter，就默认行为（换行），不拦截
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}

.v-container {
  display: flex;
  flex-direction: column;
}

.v-card {
  flex-grow: 1;
}

.v-row {
  margin-top: auto;  /* 使输入区域固定在底部 */
}

.v-avatar {
  width: 36px;
  height: 36px;
  margin-bottom: 8px; /* 给图标与消息文本之间留一些空间 */
}
</style>
