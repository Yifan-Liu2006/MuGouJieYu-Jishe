<template>
  <!-- 新增：悬浮外层容器（核心折叠定位） -->
  <div class="chat-wrapper">
    <!-- 折叠状态：右下角小按钮 -->
    <div v-if="!showChat" class="ai-toggle-btn" @click="openChat"> AI </div>

    <!-- 展开状态：你的原有对话框（保留全部功能） -->
    <div v-else class="chat-container">
      <div class="chat-header">
        <h1> DeepSeek AI 助手</h1>
        <p>你好！我是DeepSeek，有什么可以帮你的？</p>
        <!-- 新增：关闭按钮 -->
        <button class="close-btn" @click="closeChat">×</button>
      </div>

      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <div class="message-bubble">
            <strong>{{ msg.type === 'user' ? '我' : 'AI' }}:</strong>
            <span>{{ msg.content }}</span>
          </div>
        </div>

        <div v-if="loading" class="message ai">
          <div class="message-bubble">
            <strong>AI:</strong>
            <span>思考中<span class="dot-animation">...</span></span>
          </div>
        </div>
      </div>

      <div class="input-container">
        <div class="chat-input">
          <input
            v-model="question"
            @keypress.enter="sendMessage"
            :disabled="loading"
            placeholder="输入你的问题，按回车发送..."
          />
          <button @click="sendMessage" :disabled="loading || !question.trim()" class="send-btn">
            {{ loading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendToDeepSeek } from '../api/deepseek.js'

export default {
  name: 'AiChatBox',
  data() {
    return {
      question: '',
      loading: false,
      // 新增：控制显示隐藏（默认关闭）
      showChat: false,
      messages: [
        {
          type: 'ai',
          content: '你好！我是DeepSeek 古建助手，你可以问我任何关于古建筑的问题！'
        }
      ]
    }
  },
  methods: {
    // 新增：打开对话框
    openChat() {
      this.showChat = true
    },
    // 新增：关闭对话框
    closeChat() {
      this.showChat = false
    },
    // 你原有的发送消息方法（完全不动）
    async sendMessage() {
      const userQuestion = this.question.trim()
      if (!userQuestion || this.loading) return

      this.messages.push({
        type: 'user',
        content: userQuestion
      })
      this.question = ''
      this.loading = true

      try {
        const result = await sendToDeepSeek(userQuestion)
        if (result.success) {
          this.messages.push({
            type: 'ai',
            content: result.answer
          })
        } else {
          this.messages.push({
            type: 'ai',
            content: `❌ 错误：${result.error || '请求失败，请稍后重试'}`
          })
        }
      } catch (error) {
        console.error('DeepSeek API 错误:', error)
        this.messages.push({
          type: 'ai',
          content: `❌ 网络错误：${error.message}。请检查网络连接或API Key是否正确。`
        })
      } finally {
        this.loading = false
        this.$nextTick(() => {
          const messagesDiv = document.querySelector('.chat-messages')
          if (messagesDiv) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight
          }
        })
      }
    }
  }
}
</script>

<style scoped>
/* ===================== 新增：悬浮折叠样式 ===================== */
.chat-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

/* 折叠按钮样式 */
.ai-toggle-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #c49346;
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.3);
  transition: transform 0.2s;
}
.ai-toggle-btn:hover {
  transform: scale(1.1);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* ===================== 你原有样式（完全保留，仅小修改） ===================== */
.chat-container {
  width: 380px; /* 缩小宽度，适配悬浮框 */
  height: 550px; /* 缩小高度 */
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  text-align: center;
  position: relative;
}

.chat-header h1 {
  font-size: 20px;
  margin-bottom: 8px;
}

.chat-header p {
  font-size: 14px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message {
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease-in;
}

.message.user {
  text-align: right;
}

.message.ai {
  text-align: left;
}

.message-bubble {
  display: inline-block;
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message.user .message-bubble {
  background: #007bff;
  color: white;
}

.message.ai .message-bubble {
  background: white;
  color: #333;
}

.message-bubble strong {
  margin-right: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dot-animation {
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input input:focus {
  border-color: #007bff;
}

.chat-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.send-btn {
  background: #007bff;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
