<template>
  <div class="coming-soon-page">
    <div class="content-container">
      <div class="content-box">
        <div class="icon-box"></div>
        <h1 class="title">
          <i class="iconfont icon-guofengxiangyun" style="margin-right: 16px"></i>
          🏮 敬请期待 🏮
        </h1>
        <p class="desc">该建筑详情页正在开发中，即将上线，敬请关注</p>
        <el-button type="primary" size="large" @click="goBackHome" class="back-button">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

// 返回首页
const goBackHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 🔥 完全复制【首页生效的背景代码】，一字不差，必显示！ */
.coming-soon-page {
  width: 100%;
  min-height: 100vh;
  /* 首页能显示的背景，直接照搬 */
  background-image: url('/images/background1.png');
  background-repeat: repeat;
  background-color: #f9f5e9;
  background-blend-mode: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.5s ease;
  position: relative;
  padding: 60px 5%;
  box-sizing: border-box;
}

/* 内容容器 */
.content-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 首页同款遮罩，同步质感 */
.coming-soon-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;
}

/* ====================== 以下完全保留你原版好看的样式 ====================== */
.content-box {
  text-align: center;
  max-width: 800px;
  padding: 60px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease;
}

.content-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.icon-box {
  width: 160px;
  height: 160px;
  margin: 0 auto 40px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(157, 41, 51, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(157, 41, 51, 0.4);
}

.icon-box::before {
  content: '🏮';
  font-size: 80px;
  opacity: 0.8;
}

.title {
  font-size: 64px;
  font-weight: 800;
  color: #8b4513;
  margin: 0 0 24px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  animation: titleAnimation 0.5s ease;
}

.desc {
  font-size: 24px;
  color: #6d4c41;
  margin: 0 0 48px;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  animation: messageAnimation 0.5s ease;
}

.back-button {
  padding: 16px 48px;
  font-size: 20px;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
  transition: all 0.3s ease;
  animation: buttonAnimation 0.5s ease;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.back-button:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleAnimation {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes messageAnimation {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes buttonAnimation {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .content-box {
    padding: 40px 24px;
  }
  
  .icon-box {
    width: 120px;
    height: 120px;
    margin-bottom: 32px;
  }
  
  .icon-box::before {
    font-size: 60px;
  }
  
  .title {
    font-size: 48px;
  }
  
  .desc {
    font-size: 18px;
  }
  
  .back-button {
    padding: 12px 32px;
    font-size: 16px;
  }
}
</style>
