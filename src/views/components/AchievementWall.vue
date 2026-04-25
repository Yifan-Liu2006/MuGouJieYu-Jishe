<template>
  <div class="achievement-wall">
    <h2 class="section-title">
      <i class="iconfont icon-chenggong" style="margin-right: 8px; color: #8b4513"></i>
      成就墙
    </h2>
    <div class="achievement-container">
      <!-- 成就概览 -->
      <div class="achievement-overview">
        <div class="overview-card">
          <div class="overview-item">
            <span class="overview-value">{{ totalAchievements }}</span>
            <span class="overview-label">总成就</span>
          </div>
          <div class="overview-item">
            <span class="overview-value">{{ unlockedAchievements }}</span>
            <span class="overview-label">已解锁</span>
          </div>
          <div class="overview-item">
            <span class="overview-value">{{ Math.round((unlockedAchievements / totalAchievements) * 100) }}%</span>
            <span class="overview-label">完成率</span>
          </div>
        </div>
      </div>

      <!-- 成就列表 -->
      <div class="achievement-list">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">
            <i :class="['iconfont', achievement.icon]"></i>
          </div>
          <div class="achievement-info">
            <h3 class="achievement-title">{{ achievement.title }}</h3>
            <p class="achievement-desc">{{ achievement.description }}</p>
            <div class="achievement-progress" v-if="!achievement.unlocked">
              <div 
                class="progress-bar" 
                :style="{ width: (achievement.progress / achievement.target) * 100 + '%' }"
              ></div>
              <span class="progress-text">{{ achievement.progress }} / {{ achievement.target }}</span>
            </div>
            <div class="achievement-date" v-if="achievement.unlocked && achievement.unlockedDate">
              解锁于：{{ formatDate(achievement.unlockedDate) }}
            </div>
          </div>
          <div class="achievement-status">
            <i v-if="achievement.unlocked" class="iconfont icon-check"></i>
            <i v-else class="iconfont icon-lock"></i>
          </div>
        </div>
      </div>

      <!-- 学习统计 -->
      <div class="learning-stats">
        <h3 class="stats-title">学习统计</h3>
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-icon time-icon">
              <i class="iconfont icon-shijian"></i>
            </div>
            <div class="stats-info">
              <span class="stats-value">{{ totalLearningTime }}</span>
              <span class="stats-label">学习时间（分钟）</span>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon quiz-icon">
              <i class="iconfont icon-wenda"></i>
            </div>
            <div class="stats-info">
              <span class="stats-value">{{ totalQuizAttempts }}</span>
              <span class="stats-label">答题次数</span>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon game-icon">
              <i class="iconfont icon-youxi"></i>
            </div>
            <div class="stats-info">
              <span class="stats-value">{{ totalGamePlays }}</span>
              <span class="stats-label">游戏次数</span>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon score-icon">
              <i class="iconfont icon-fenshu"></i>
            </div>
            <div class="stats-info">
              <span class="stats-value">{{ highestScore }}</span>
              <span class="stats-label">最高得分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 成就数据
const achievements = ref([
  {
    id: 1,
    title: '斗拱初学者',
    description: '完成第一次斗拱知识问答',
    icon: 'icon-chu xu',
    unlocked: true,
    progress: 1,
    target: 1,
    unlockedDate: new Date('2024-04-01')
  },
  {
    id: 2,
    title: '拼装达人',
    description: '完成一次斗拱拼装游戏',
    icon: 'icon-zhuang pei',
    unlocked: false,
    progress: 0,
    target: 1,
    unlockedDate: null
  },
  {
    id: 3,
    title: '知识大师',
    description: '知识问答正确率达到80%',
    icon: 'icon-da shi',
    unlocked: false,
    progress: 0,
    target: 1,
    unlockedDate: null
  },
  {
    id: 4,
    title: '学习爱好者',
    description: '累计学习时间超过30分钟',
    icon: 'icon-ai hao',
    unlocked: false,
    progress: 15,
    target: 30,
    unlockedDate: null
  },
  {
    id: 5,
    title: '斗拱专家',
    description: '解锁所有其他成就',
    icon: 'icon-zhuan jia',
    unlocked: false,
    progress: 1,
    target: 4,
    unlockedDate: null
  }
])

// 学习统计数据
const totalLearningTime = ref(15)
const totalQuizAttempts = ref(2)
const totalGamePlays = ref(0)
const highestScore = ref(850)

// 计算属性
const totalAchievements = computed(() => achievements.value.length)

const unlockedAchievements = computed(() => {
  return achievements.value.filter(a => a.unlocked).length
})

// 方法
const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.achievement-wall {
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

.achievement-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 成就概览 */
.achievement-overview {
  margin-bottom: 60px;
}

.overview-card {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.overview-item {
  text-align: center;
  transition: all 0.3s ease;
}

.overview-value {
  display: block;
  font-size: 48px;
  font-weight: 800;
  color: #9d2933;
  margin-bottom: 12px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.overview-label {
  display: block;
  font-size: 18px;
  color: #6d4c41;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 成就列表 */
.achievement-list {
  margin-bottom: 80px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 32px;
}

.achievement-card {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.achievement-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.achievement-card.unlocked {
  border-color: #27ae60;
  background: linear-gradient(145deg, #f0fff4, #e6f7ee);
}

.achievement-card.unlocked::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  opacity: 0.2;
}

.achievement-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f0e6d2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #8b4513;
  margin-right: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.15);
}

.achievement-card.unlocked .achievement-icon {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #fff;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.achievement-desc {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 20px 0;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.achievement-progress {
  background: #f0e6d2;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #9d2933, #c0392b);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 16px;
  color: #6d4c41;
  position: absolute;
  right: 12px;
  top: -24px;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.achievement-date {
  font-size: 16px;
  color: #27ae60;
  font-weight: 600;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.achievement-status {
  margin-left: 16px;
  font-size: 28px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.achievement-card.unlocked .achievement-status {
  color: #27ae60;
}

.achievement-card:not(.unlocked) .achievement-status {
  color: #95a5a6;
}

/* 学习统计 */
.learning-stats {
  margin-top: 80px;
}

.stats-title {
  font-size: 28px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 32px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.stats-card {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease;
}

.stats-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.stats-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  margin-right: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.stats-icon:hover {
  transform: scale(1.1);
}

.time-icon {
  background: linear-gradient(135deg, #9d2933, #c0392b);
}

.quiz-icon {
  background: linear-gradient(135deg, #1e8883, #26a69a);
}

.game-icon {
  background: linear-gradient(135deg, #e67e22, #f39c12);
}

.score-icon {
  background: linear-gradient(135deg, #8e44ad, #9b59b6);
}

.stats-info {
  flex: 1;
  min-width: 0;
}

.stats-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #8b4513;
  margin-bottom: 8px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.stats-label {
  display: block;
  font-size: 16px;
  color: #6d4c41;
  line-height: 1.4;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .achievement-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .overview-card {
    flex-direction: column;
    gap: 32px;
  }
  
  .achievement-list {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-card {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-icon {
    margin-right: 0;
    margin-bottom: 24px;
  }
  
  .achievement-status {
    margin-left: 0;
    margin-top: 16px;
  }
  
  .stats-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .overview-value {
    font-size: 32px;
  }
  
  .overview-label {
    font-size: 16px;
  }
  
  .achievement-title {
    font-size: 20px;
  }
  
  .achievement-desc {
    font-size: 16px;
  }
  
  .stats-value {
    font-size: 24px;
  }
  
  .stats-label {
    font-size: 14px;
  }
}
</style>