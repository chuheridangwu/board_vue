<script setup>
import { ref, onMounted } from 'vue'
import { getMessages, addMessage, deleteMessage } from '../utils/airtable'

// 状态管理
const messages = ref([])
const newMessage = ref({ name: '', content: '' })
const isAdmin = ref(false)
const adminPassword = '123456' // 改为你的密码
const passwordInput = ref('')
const loading = ref(true)

// 获取留言
const fetchMessages = async () => {
  loading.value = true
  messages.value = await getMessages()
  loading.value = false
}

// 提交新留言
const submitMessage = async () => {
  if (newMessage.value.name && newMessage.value.content) {
    await addMessage({
      name: newMessage.value.name,
      message: newMessage.value.content,
    })
    newMessage.value = { name: '', content: '' }
    await fetchMessages()
  }
}

// 删除留言
const removeMessage = async (id) => {
  if (isAdmin.value) {
    await deleteMessage(id)
    await fetchMessages()
  }
}

// 管理员登录
const handleAdminLogin = () => {
  isAdmin.value = passwordInput.value === adminPassword
  passwordInput.value = ''
}

// 初始化
onMounted(fetchMessages)
</script>

<template>
  <div class="container">
    <header>
      <h1>留言板</h1>
      <p>分享你的想法</p>
    </header>

    <!-- 留言表单 -->
    <div class="message-form">
      <h2>留下你的留言</h2>
      <input v-model="newMessage.name" placeholder="你的名字" required />
      <textarea v-model="newMessage.content" placeholder="留言内容..." required rows="3"></textarea>
      <button @click="submitMessage">提交</button>
    </div>

    <!-- 留言列表 -->
    <div class="message-list">
      <h2>所有留言</h2>
      <div v-if="loading">加载中...</div>
      <div v-else-if="messages.length === 0">暂无留言</div>
      <div v-else class="messages">
        <div v-for="message in messages" :key="message.id" class="message">
          <div class="message-header">
            <strong>{{ message.name }}</strong>
            <span>{{ new Date(message.createdAt).toLocaleString() }}</span>
          </div>
          <p>{{ message.message }}</p>
          <button v-if="isAdmin" @click="removeMessage(message.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 管理员登录 -->
    <div class="admin-section">
      <h2>管理员</h2>
      <div v-if="!isAdmin">
        <input v-model="passwordInput" type="password" placeholder="输入管理员密码" />
        <button @click="handleAdminLogin">登录</button>
      </div>
      <div v-else>
        <p>管理员已登录</p>
        <button @click="isAdmin = false">退出</button>
      </div>
    </div>
  </div>
</template>

<style>
/* 全局样式 */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  color: #333;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

/* 表单样式 */
.message-form,
.message-list,
.admin-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.message-form h2,
.message-list h2,
.admin-section h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  min-height: 100px;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #2980b9;
}

.delete-btn {
  background: #e74c3c;
  font-size: 14px;
  padding: 5px 10px;
}

.delete-btn:hover {
  background: #c0392b;
}

/* 留言列表样式 */
.message {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  position: relative;
}

.message:last-child {
  border-bottom: none;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-header span {
  color: #7f8c8d;
  font-size: 14px;
}

.message p {
  margin: 0;
}

/* 管理员区域 */
.admin-section {
  background: #f8f9fa;
}
</style>
