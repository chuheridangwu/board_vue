<script setup>
import { onMounted, ref } from 'vue'
import { addMessage, deleteMessage, getMessages } from '../utils/airtable'

// 状态管理
const messages = ref([])
const newMessage = ref({ name: '', content: '' })
const adminPassword = '123456' // 改为你的密码
const passwordInput = ref('')
const loading = ref(true)
const isShowAdminView = ref(false)

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
      <h1>在线留言板</h1>
    </header>

    <!-- 留言表单 -->
    <div class="message-form">
      <label for="name">您的名字</label>
      <input v-model="newMessage.name" placeholder="" required />
      <label for="content">留言内容</label>
      <textarea v-model="newMessage.content" placeholder="" required rows="3"></textarea>
      <button @click="submitMessage">提交新留言</button>
    </div>

    <!-- 留言列表 -->
    <div class="message-list">
      <h2>留言列表</h2>
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
      <div v-if="!isShowAdminView">
        <button @click="isShowAdminView = true">管理员登录</button>
      </div>
      <div v-else>
        <div class="admin-login">
          <input v-model="passwordInput" type="password" placeholder="输入管理员密码" />
          <button @click="handleAdminLogin">登录</button>
        </div>
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
.message-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.message-form h2,
.message-list h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.message-form label,
.message-list label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 100%;
  font-size: 16px;
  box-sizing: border-box; /* 关键属性：让宽度包含padding和border */
}

textarea {
  min-height: 100px;
}

.admin-section {
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 15px;
  justify-content: center; /* 新增：水平居中 */
  align-items: center; /* 新增：垂直居中 */
}

.admin-section button {
  align-self: center;
}

.admin-login {
  display: flex;
}

button {
  background: #45a049;
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
