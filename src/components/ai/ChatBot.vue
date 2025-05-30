<template>
  <!-- 聊天消息列表 -->
  <v-card class="flex-grow-1 overflow-auto mb-4" rounded="xl" elevation="4">
    <v-card-text>
      <div v-for="(msg, index) in messages" :key="index" class="d-flex mb-3" :class="msg.from === 'user' ? 'justify-end' : 'justify-start'">

        <!-- 机器人图标 - 添加点击事件 -->
        <v-avatar v-if="msg.from === 'bot'" class="mb-2" @click="openRoleDialog">
          <v-icon :color="currentPrompt.act !== '默认' ? 'primary' : ''">mdi-robot</v-icon>
        </v-avatar>

        <!-- 消息内容部分 -->
        <div
          :class="msg.from === 'bot' ? 'bg-blue-lighten-5 text-blue-darken-4' : 'bg-green-lighten-5 text-green-darken-4'"
          class="pa-3 rounded-lg"
          style="
            max-width: 70%;
            white-space: normal;
            overflow-x: auto;
            word-wrap: break-word;
            "
          v-html="renderMarkdown(msg.text || '回答中...')"
        ></div>

        <!-- 复制按钮 -->
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

  <!-- 角色选择对话框 -->
  <v-dialog v-model="roleDialog" >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>选择角色</span>
        <v-btn icon="mdi-close" variant="text" @click="roleDialog = false"></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <div class="d-flex flex-wrap gap-2">
          <!-- 当前选中的角色 -->
          <v-tooltip location="top" :text="currentPrompt.prompt" max-width="600">
            <template v-slot:activator="{ props }">
              <v-chip
                v-bind="props"
                color="primary"
                @click="selectPrompt(currentPrompt)"
              >
                <v-icon start>mdi-check</v-icon>
                {{ currentPrompt.act }}
              </v-chip>
            </template>
          </v-tooltip>

          <!-- 其他角色 -->
          <v-tooltip
            v-for="(prompt, index) in otherPrompts"
            :key="index"
            location="top"
            :text="prompt.prompt"
            max-width="600"
          >
            <template v-slot:activator="{ props }">
              <v-chip
                v-bind="props"
                @click="selectPrompt(prompt)"
              >
                {{ prompt.act }}
              </v-chip>
            </template>
          </v-tooltip>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { aiConversationApi } from "@/api/ApiAi";
import { marked } from 'marked'
import { promptsZh } from '@/assets/data/ai/prompts-zh'

const messages = ref<Array<{from: string, text: string}>>([])
const newMessage = ref('')
const conversationId = ref(typeof crypto !== 'undefined' ? crypto.randomUUID() : '');
const roleDialog = ref(false);
const currentPrompt = ref(promptsZh[0]);

// 初始化欢迎消息
function initWelcomeMessage() {
  let welcomeText = `你好，我是你的 "***${currentPrompt.value.act}***"。`;

  if (currentPrompt.value.act === 'AI机器人') {
    welcomeText += `\n\n*或点击我的头像, 切换不同的AI角色*。`;
  } else {
    // 如果有question字段，添加提示
    if (currentPrompt.value.question) {
      welcomeText += `你可以这样问我：\n\n*${currentPrompt.value.question}*`;
    } else {
      welcomeText += '开始我们新的对话吧!';
    }
  }

  messages.value = [{
    from: 'bot',
    text: welcomeText
  }];
}

// 计算属性：其他角色（排除当前选中的角色）
const otherPrompts = computed(() => {
  return promptsZh.filter(prompt => prompt.act !== currentPrompt.value?.act);
});

// 使用 marked 库解析 markdown
function renderMarkdown(text: string) {
  return marked(text);
}

// 复制文本到剪贴板
function copyText(text: string) {
  navigator.clipboard.writeText(text);
}

function openRoleDialog() {
  roleDialog.value = true;
}

function selectPrompt(prompt: typeof promptsZh[0]) {
  // 如果选择的角色和当前角色相同，则不执行任何操作
  if (prompt.act === currentPrompt.value.act) {
    roleDialog.value = false;
    return;
  }

  currentPrompt.value = prompt;
  roleDialog.value = false;
  conversationId.value = typeof crypto !== 'undefined' ? crypto.randomUUID() : '';
  initWelcomeMessage(); // 重新初始化欢迎消息
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
      message: text,
      prompt: currentPrompt.value.prompt
    }).then(stream => {
      const reader = stream?.getReader();
      const decoder = new TextDecoder();

      function readChunk() {
        reader?.read().then(({ done, value }) => {
          if (done) return;

          // 解码并处理数据块
          const chunk = decoder.decode(value);
          botMessage.text += chunk;
          messages.value = [...messages.value];

          readChunk();
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

// 初始化时显示欢迎消息
onMounted(() => {
  initWelcomeMessage();
});
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
