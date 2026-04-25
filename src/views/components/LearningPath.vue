<template>
  <div class="learning-path">
    <h2 class="section-title">
      <i class="iconfont icon-lu" style="margin-right: 8px; color: #8b4513"></i>
      学习路径
    </h2>
    <div class="path-container">
      <!-- 学习路径步骤 -->
      <div class="path-step" v-for="(step, index) in learningSteps" :key="step.id">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-content">
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.description }}</p>
          <div class="step-status" :class="{ completed: step.completed }">
            <i v-if="step.completed" class="iconfont icon-check"></i>
            <span>{{ step.completed ? '已完成' : '未完成' }}</span>
          </div>
        </div>
        <div class="step-connector" v-if="index < learningSteps.length - 1"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 学习路径步骤
const learningSteps = ref([
  {
    id: 1,
    title: '斗拱基础知识',
    description: '了解斗拱的定义、历史和基本组成',
    completed: true
  },
  {
    id: 2,
    title: '斗拱结构认知',
    description: '学习斗拱的各个部件及其功能',
    completed: false
  },
  {
    id: 3,
    title: '斗拱拼装练习',
    description: '通过游戏练习斗拱的拼装过程',
    completed: false
  },
  {
    id: 4,
    title: '知识问答测试',
    description: '测试你对斗拱知识的掌握程度',
    completed: false
  },
  {
    id: 5,
    title: '斗拱应用欣赏',
    description: '欣赏斗拱在古代建筑中的应用',
    completed: false
  }
])
</script>

<style scoped>
.learning-path {
  margin-bottom: 80px;
  animation: fadeIn 0.5s ease;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 40px 0;
  padding-left: 16px;
  border-left: 4px solid #8b4513;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.path-container {
  position: relative;
  padding-left: 60px;
}

.path-step {
  position: relative;
  margin-bottom: 48px;
  display: flex;
  align-items: flex-start;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.step-number {
  position: absolute;
  left: -60px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
  transition: all 0.3s ease;
}

.step-number:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(157, 41, 51, 0.4);
}

.step-content {
  flex: 1;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.step-content:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.step-desc {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 20px 0;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.step-status {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-status.completed {
  color: #27ae60;
}

.step-status:not(.completed) {
  color: #95a5a6;
}

.step-status i {
  margin-right: 8px;
  font-size: 18px;
}

.step-connector {
  position: absolute;
  left: -40px;
  top: 40px;
  width: 3px;
  height: calc(100% + 48px);
  background: linear-gradient(to bottom, #e6c890, #d4b17a);
  z-index: 1;
  border-radius: 2px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .path-container {
    padding-left: 48px;
  }
  
  .step-number {
    left: -48px;
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .step-connector {
    left: -32px;
    top: 32px;
  }
  
  .step-content {
    padding: 24px;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .step-desc {
    font-size: 16px;
  }
  
  .step-status {
    font-size: 14px;
  }
}
</style>