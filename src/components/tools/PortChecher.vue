<template>
  <v-app>
    <v-main>
      <v-container>
        <!-- 标题部分 -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-icon large left color="white">mdi-lan-connect</v-icon>
                <span>端口检查工具</span>
              </v-card-title>
              <v-card-subtitle>检测您的IP地址和开放端口</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>

        <!-- 主要内容区域 -->
        <v-row>
          <!-- 左侧输入和结果区域 -->
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="secondary white--text">端口检查</v-card-title>
              <v-card-text>
                <!-- 外部地址显示 -->
                <v-alert dense outlined>
                  <strong>您的IP地址:</strong> {{ externalIp }}
                </v-alert>

                <!-- 输入表单 -->
                <v-form @submit.prevent="checkSinglePort">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="remoteAddress"
                        label="远程地址"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="portNumber"
                        label="端口号"
                        type="number"
                        min="1"
                        max="65535"
                        outlined
                        dense
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" align-self="center">
                      <v-btn type="submit" color="deep-purple-lighten-1" :loading="singleLoading">检查</v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <v-btn
                  small
                  color="deep-purple-lighten-1"
                  @click="useCurrentIp"
                >
                  <v-icon left small>mdi-ip</v-icon>
                  使用当前IP
                </v-btn>

                <!-- 批量扫描 -->
                <v-divider class="my-4"></v-divider>
                <v-form @submit.prevent="scanPorts">
                  <v-row>
                    <v-col cols="12" sm="8">
                      <v-combobox
                        v-model="selectedPorts"
                        :items="commonPorts.map(p => p.number)"
                        label="选择要扫描的端口"
                        multiple
                        chips
                        outlined
                        dense
                        small-chips
                        deletable-chips
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn
                        type="submit"
                        color="deep-purple-lighten-1"
                        block
                        :loading="scanLoading"
                        :disabled="!selectedPorts.length"
                      >扫描选定端口</v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <!-- 结果展示 -->
                <v-divider class="my-4"></v-divider>
                <v-textarea
                  v-model="resultText"
                  label="结果"
                  outlined
                  readonly
                  rows="5"
                  auto-grow
                ></v-textarea>

                <div class="d-flex">
                  <v-btn
                    color="deep-purple-lighten-1"
                    @click="copyResults"
                    small
                    class="mr-2"
                  >
                    <v-icon left small>mdi-content-copy</v-icon>
                    复制结果
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="clearResults"
                    small
                  >
                    <v-icon left small>mdi-delete</v-icon>
                    清除结果
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 右侧常用端口区域 -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="secondary white--text">
                <v-icon left color="white">mdi-format-list-checks</v-icon>
                常用端口
              </v-card-title>
              <v-card-text>
                <v-subheader>点击端口快速检查</v-subheader>
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="port in commonPorts"
                    :key="port.number"
                    color="primary"
                    class="ma-1"
                    @click="checkCommonPort(port)"
                  >
                    <v-avatar left>
                      <v-icon small>mdi-network</v-icon>
                    </v-avatar>
                    {{ port.number }} - {{ port.name }}
                  </v-chip>
                </div>

                <v-divider class="my-3"></v-divider>
                <v-btn
                  color="deep-purple-lighten-1"
                  block
                  @click="scanCommonPorts"
                  :loading="commonLoading"
                >
                  扫描所有常用端口
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- 关于信息 -->
            <v-card class="mt-4">
              <v-card-title class="secondary white--text">
                <v-icon left color="white">mdi-information</v-icon>
                关于
              </v-card-title>
              <v-card-text>
                <p>开放端口检查工具可用于检查您的外部IP地址并检测连接上的开放端口。</p>
                <p class="mt-2">此工具对于确定您的端口转发设置是否正确或您的服务器应用程序是否被防火墙阻止非常有用。</p>
                <v-btn
                  color="deep-purple-lighten-1"
                  href="https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers"
                  target="_blank"
                  small
                  class="mt-2"
                >
                  <v-icon left small>mdi-wikipedia</v-icon>
                  查看完整端口列表
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {ipAddressApi, portCheckerApi} from "@/api/ToolsApi";

// 响应式数据
const externalIp = ref('正在获取...')
const remoteAddress = ref('www.iokays.com')
const portNumber = ref(80)
const selectedPorts = ref<number[]>([])
const resultText = ref('')
const singleLoading = ref(false)
const scanLoading = ref(false)
const commonLoading = ref(false)

// 常用端口列表
const commonPorts = ref([
  { number: 21, name: 'FTP' },
  { number: 22, name: 'SSH' },
  { number: 23, name: 'TELNET' },
  { number: 25, name: 'SMTP' },
  { number: 53, name: 'DNS' },
  { number: 80, name: 'HTTP' },
  { number: 110, name: 'POP3' },
  { number: 115, name: 'SFTP' },
  { number: 135, name: 'RPC' },
  { number: 139, name: 'NetBIOS' },
  { number: 143, name: 'IMAP' },
  { number: 194, name: 'IRC' },
  { number: 443, name: 'SSL' },
  { number: 445, name: 'SMB' },
  { number: 1433, name: 'MSSQL' },
  { number: 3306, name: 'MySQL' },
  { number: 3389, name: 'Remote Desktop' },
  { number: 5632, name: 'PCAnywhere' },
  { number: 5900, name: 'VNC' },
  { number: 25565, name: 'Minecraft' }
])

// 生命周期钩子
onMounted(() => {
  getExternalIp()
})

// 方法
const getExternalIp = async () => {
  const response = await ipAddressApi();
  externalIp.value = response.data
}

const useCurrentIp = () => {
  remoteAddress.value = externalIp.value
}

const checkSinglePort = async () => {
  if (!remoteAddress.value || !portNumber.value) return

  singleLoading.value = true
  appendResult(`开始检查 ${remoteAddress.value}:${portNumber.value}...\n`)
  showResult(remoteAddress.value, [portNumber.value])
  singleLoading.value = false
}

const scanPorts = async () => {
  if (!selectedPorts.value.length) return

  scanLoading.value = true
  appendResult(`开始扫描 ${remoteAddress.value} 的选定端口: ${selectedPorts.value.join(', ')}...\n`)
  showResult(remoteAddress.value, selectedPorts.value)
  scanLoading.value = false

}

const checkCommonPort = (port: { number: number }) => {
  portNumber.value = port.number
  checkSinglePort()
}

const scanCommonPorts = async () => {
  commonLoading.value = true
  const ports = commonPorts.value.map(p => p.number)
  appendResult(`开始扫描 ${remoteAddress.value} 的所有常用端口...\n`)
  showResult(remoteAddress.value, ports)
  commonLoading.value = false
}

const appendResult = (text: string) => {
  resultText.value += text
}

const clearResults = () => {
  resultText.value = ''
}

const copyResults = async () => {
  try {
    await navigator.clipboard.writeText(resultText.value)
    // 这里可以添加Toast通知
    console.log('结果已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const showResult = (domain: string, ports: number[]) => {
  portCheckerApi({domain: domain, ports: ports})
    .then(stream => {
      const reader = stream?.getReader();
      const decoder = new TextDecoder();

      function readChunk() {
        reader?.read().then(({done, value}) => {
          if ((done)) return;
          const chunk = decoder.decode(value);
          console.log(chunk);
          appendResult(chunk);
          readChunk(); // 继续读取下一个块
        })
      }
      readChunk();
    });
}

</script>
