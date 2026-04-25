<template>
  <div class="education-center">
    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-jiaoyu" style="margin-right: 4px"></i>教育科普
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="iconfont icon-jiaoyu" style="margin-right: 12px; color: #8b4513"></i>
        斗拱科普教育中心
      </h1>
      <p class="page-subtitle">探索中国古代建筑的智慧，了解斗拱的结构与功能</p>
    </div>

    <!-- 核心内容区域 -->
    <div class="content-container">
      <!-- 学习路径 -->
      <LearningPath />

      <!-- 功能卡片区域 -->
      <div class="feature-cards" v-if="currentView === 'home'">
        <!-- 斗拱拼装游戏 -->
        <el-card class="feature-card xiangyun-border" shadow="hover">
          <div class="card-content">
            <div class="card-icon game-icon">
              <i class="iconfont icon-youxi"></i>
            </div>
            <div class="card-info">
              <h3 class="card-title">斗拱拼装游戏</h3>
              <p class="card-desc">通过交互式拼装，学习斗拱的结构组成</p>
              <el-button class="chinese-btn primary" @click="navigateToGame">
                开始游戏
                <i class="iconfont icon-arrow-right" style="margin-left: 4px"></i>
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 知识问答 -->
        <el-card class="feature-card xiangyun-border" shadow="hover">
          <div class="card-content">
            <div class="card-icon quiz-icon">
              <i class="iconfont icon-wenda"></i>
            </div>
            <div class="card-info">
              <h3 class="card-title">知识问答</h3>
              <p class="card-desc">测试你对斗拱和古代建筑的了解</p>
              <el-button class="chinese-btn primary" @click="navigateToQuiz">
                开始答题
                <i class="iconfont icon-arrow-right" style="margin-left: 4px"></i>
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 成就系统 -->
        <el-card class="feature-card xiangyun-border" shadow="hover">
          <div class="card-content">
            <div class="card-icon achievement-icon">
              <i class="iconfont icon-chenggong"></i>
            </div>
            <div class="card-info">
              <h3 class="card-title">成就墙</h3>
              <p class="card-desc">查看你的学习进度和获得的成就</p>
              <el-button class="chinese-btn primary" @click="navigateToAchievement">
                查看成就
                <i class="iconfont icon-arrow-right" style="margin-left: 4px"></i>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 斗拱拼装游戏 -->
      <div v-if="currentView === 'game'" class="game-container">
        <div class="view-header">
          <h2 class="view-title">
            <i class="iconfont icon-youxi" style="margin-right: 8px; color: #8b4513"></i>
            斗拱拼装游戏
          </h2>
          <el-button class="chinese-btn plain" @click="backToHome">
            <i class="iconfont icon-arrow-left" style="margin-right: 4px"></i>
            返回首页
          </el-button>
        </div>
        <DougongGame />
      </div>

      <!-- 知识问答 -->
      <div v-if="currentView === 'quiz'" class="quiz-container">
        <div class="view-header">
          <h2 class="view-title">
            <i class="iconfont icon-wenda" style="margin-right: 8px; color: #8b4513"></i>
            知识问答
          </h2>
          <el-button class="chinese-btn plain" @click="backToHome">
            <i class="iconfont icon-arrow-left" style="margin-right: 4px"></i>
            返回首页
          </el-button>
        </div>
        <QuizComponent />
      </div>

      <!-- 成就墙 -->
      <div v-if="currentView === 'achievement'" class="achievement-container">
        <div class="view-header">
          <h2 class="view-title">
            <i class="iconfont icon-chenggong" style="margin-right: 8px; color: #8b4513"></i>
            成就墙
          </h2>
          <el-button class="chinese-btn plain" @click="backToHome">
            <i class="iconfont icon-arrow-left" style="margin-right: 4px"></i>
            返回首页
          </el-button>
        </div>
        <AchievementWall />
      </div>

      <!-- 知识科普区域 -->
      <div class="knowledge-section" v-if="currentView === 'home'">
        <h2 class="section-title">
          <i class="iconfont icon-zhishi" style="margin-right: 8px; color: #8b4513"></i>
          斗拱知识科普
        </h2>
        <div class="knowledge-content">
          <div class="knowledge-card">
            <h3>什么是斗拱？</h3>
            <p>斗拱是中国古代建筑中特有的一种结构，由斗、拱、昂等部件组成，位于立柱和横梁之间，起到传递荷载、抗震减震的作用。</p>
          </div>
          <div class="knowledge-card">
            <h3>斗拱的历史</h3>
            <p>斗拱起源于西周时期，经过春秋战国、秦汉、魏晋南北朝的发展，到唐宋时期达到成熟，明清时期逐渐简化。</p>
          </div>
          <div class="knowledge-card">
            <h3>斗拱的作用</h3>
            <p>斗拱不仅是结构构件，也是装饰元素，具有传递荷载、抗震减震、延长屋檐、装饰美化等多种功能。</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LearningPath from './components/LearningPath.vue'
import DougongGame from './components/DougongGame.vue'
import QuizComponent from './components/QuizComponent.vue'
import AchievementWall from './components/AchievementWall.vue'

const router = useRouter()

// 当前视图
const currentView = ref('home')

// 导航到斗拱拼装游戏
const navigateToGame = () => {
  currentView.value = 'game'
}

// 导航到知识问答
const navigateToQuiz = () => {
  currentView.value = 'quiz'
}

// 导航到成就墙
const navigateToAchievement = () => {
  currentView.value = 'achievement'
}

// 返回首页
const backToHome = () => {
  currentView.value = 'home'
}
</script>

<style scoped>
.education-center {
  width: 100%;
  margin: 0;
  padding: 60px 5%;
  box-sizing: border-box;
  background-image: url('/images/background1.png');
  background-repeat: repeat;
  background-color: #f9f5e9;
  background-blend-mode: normal;
  min-height: 100vh;
  position: relative;
  animation: fadeIn 0.5s ease;
}

/* 内容容器 */
.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

.education-center::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;
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

/* 国风面包屑 */
.breadcrumb-wrapper {
  margin-bottom: 24px;
  font-size: 18px;
  flex-shrink: 0;
}

.chinese-breadcrumb {
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.chinese-breadcrumb :deep(.el-breadcrumb__item) {
  color: #6d4c41;
  font-size: 16px;
}

.chinese-breadcrumb :deep(.el-breadcrumb__item:last-child) {
  color: #8b4513;
  font-weight: 600;
  font-size: 18px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 80px;
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  border-radius: 24px;
  border: 2px solid #b98c58;
  box-shadow: 0 12px 30px rgba(185, 140, 88, 0.2);
  transition: all 0.3s ease;
}

.page-header:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(185, 140, 88, 0.3);
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.page-subtitle {
  font-size: 24px;
  color: #795548;
  margin: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 内容容器 */
.content-container {
  width: 100%;
}

/* 功能卡片 */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 60px 0;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.feature-cards:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.feature-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 16px 32px rgba(139, 69, 19, 0.25);
  border-color: #d4b17a;
}

/* 卡片右上角古风角标 */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #8b4513;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  opacity: 0.7;
}

.xiangyun-border {
  box-shadow:
    0 4px 10px rgba(230, 200, 144, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 32px;
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  margin-right: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.game-icon {
  background: linear-gradient(135deg, #9d2933, #c0392b);
}

.quiz-icon {
  background: linear-gradient(135deg, #1e8883, #26a69a);
}

.achievement-icon {
  background: linear-gradient(135deg, #e67e22, #f39c12);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #8b4513;
  margin: 0 0 12px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.card-desc {
  font-size: 18px;
  color: #795548;
  margin: 0 0 20px 0;
  line-height: 1.6;
  transition: all 0.3s ease;
}

/* 国风按钮 */
.chinese-btn {
  border-radius: 8px;
  font-family: 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
}

.chinese-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
}

.chinese-btn.primary:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
}

/* 知识科普区域 */
.knowledge-section {
  margin-top: 80px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.knowledge-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 32px 0;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.knowledge-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.knowledge-card {
  background: #ffffff;
  border: 1px solid #e0d5c0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.knowledge-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(139, 69, 19, 0.2);
  border-color: #d4b17a;
}

.knowledge-card h3 {
  font-size: 22px;
  font-weight: 600;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.knowledge-card p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0;
  line-height: 1.6;
  transition: all 0.3s ease;
}

/* 视图头部 */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0d5c0;
}

.view-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.chinese-btn.plain {
  background: transparent;
  border: 1px solid #8b4513;
  color: #8b4513;
}

.chinese-btn.plain:hover {
  background: rgba(139, 69, 19, 0.1);
  transform: translateY(-2px);
}

/* 游戏容器 */
.game-container {
  margin: 40px 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 问答容器 */
.quiz-container {
  margin: 40px 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 成就墙容器 */
.achievement-container {
  margin: 40px 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .feature-cards,
  .knowledge-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .feature-cards,
  .knowledge-content {
    grid-template-columns: 1fr;
  }
  
  .education-center {
    padding: 16px 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .card-content {
    flex-direction: column;
    text-align: center;
  }
  
  .card-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .game-container,
  .quiz-container,
  .achievement-container {
    padding: 16px;
  }
  
  .view-title {
    font-size: 20px;
  }
}

</style>