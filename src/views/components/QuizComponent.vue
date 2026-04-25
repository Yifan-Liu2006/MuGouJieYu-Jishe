<template>
  <div class="quiz-component">
    <h2 class="section-title">
      <i class="iconfont icon-wenda" style="margin-right: 8px; color: #8b4513"></i>
      斗拱知识问答
    </h2>
    <div class="quiz-container">
      <!-- 问题区域 -->
      <div v-if="currentQuestion" class="question-card">
        <div class="question-header">
          <span class="question-number">问题 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <h3 class="question-text">{{ currentQuestion.question }}</h3>
        <div class="options">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="option"
            :class="{ 
              selected: selectedOption === index,
              correct: isAnswered && index === currentQuestion.correctAnswer,
              incorrect: isAnswered && selectedOption === index && selectedOption !== currentQuestion.correctAnswer
            }"
            @click="selectOption(index)"
          >
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="option-text">{{ option }}</span>
            <span v-if="isAnswered" class="option-status">
              <i v-if="index === currentQuestion.correctAnswer" class="iconfont icon-check"></i>
              <i v-else-if="selectedOption === index" class="iconfont icon-close"></i>
            </span>
          </div>
        </div>
        <div class="question-feedback" v-if="isAnswered">
          <p>{{ currentQuestion.feedback }}</p>
        </div>
        <div class="question-actions">
          <el-button 
            v-if="isAnswered" 
            class="chinese-btn primary" 
            @click="nextQuestion"
          >
            {{ currentQuestionIndex < questions.length - 1 ? '下一题' : '查看结果' }}
          </el-button>
        </div>
      </div>

      <!-- 结果区域 -->
      <div v-else-if="showResults" class="result-card">
        <h3 class="result-title">答题完成！</h3>
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-value">{{ correctAnswers }}</span>
            <span class="stat-label">正确答案</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ questions.length }}</span>
            <span class="stat-label">总题数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ Math.round((correctAnswers / questions.length) * 100) }}%</span>
            <span class="stat-label">正确率</span>
          </div>
        </div>
        <div class="result-message">
          <p v-if="correctAnswers === questions.length">
            <i class="iconfont icon-chenggong" style="color: #27ae60; margin-right: 8px"></i>
            太棒了！你对斗拱知识掌握得非常全面。
          </p>
          <p v-else-if="correctAnswers >= questions.length / 2">
            <i class="iconfont icon-zan" style="color: #f39c12; margin-right: 8px"></i>
            不错！你已经掌握了大部分斗拱知识。
          </p>
          <p v-else>
            <i class="iconfont icon-jiahao" style="color: #e74c3c; margin-right: 8px"></i>
            继续努力！多学习斗拱知识，你会做得更好。
          </p>
        </div>
        <el-button class="chinese-btn primary" @click="resetQuiz">
          重新答题
        </el-button>
      </div>

      <!-- 开始按钮 -->
      <div v-else class="start-card">
        <h3 class="start-title">准备好测试你的斗拱知识了吗？</h3>
        <p class="start-desc">
          测试含 {{ questions.length }} 道关于斗拱的问题，
          测试你对中国古代建筑中斗拱结构、历史和功能的了解。
        </p>
        <el-button class="chinese-btn primary start-btn" @click="startQuiz">
          开始答题
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 问题数据
const questions = ref([
  {
    question: '斗拱起源于哪个时期？',
    options: ['西周时期', '春秋战国时期', '秦汉时期', '魏晋南北朝时期'],
    correctAnswer: 0,
    feedback: '斗拱起源于西周时期，经过春秋战国、秦汉、魏晋南北朝的发展，到唐宋时期达到成熟。'
  },
  {
    question: '斗拱的主要功能是什么？',
    options: ['仅作为装饰', '传递荷载和抗震减震', '仅用于支撑屋檐', '以上都不对'],
    correctAnswer: 1,
    feedback: '斗拱不仅是结构构件，也是装饰元素，具有传递荷载、抗震减震、延长屋檐、装饰美化等多种功能。'
  },
  {
    question: '斗拱由哪些主要部件组成？',
    options: ['斗、拱、昂', '柱、梁、枋', '砖、瓦、木', '以上都不对'],
    correctAnswer: 0,
    feedback: '斗拱由斗、拱、昂等部件组成，位于立柱和横梁之间，起到传递荷载、抗震减震的作用。'
  },
  {
    question: '斗拱在哪个时期达到成熟？',
    options: ['秦汉时期', '魏晋南北朝时期', '唐宋时期', '明清时期'],
    correctAnswer: 2,
    feedback: '斗拱在唐宋时期达到成熟，明清时期逐渐简化。'
  },
  {
    question: '应县木塔中斗拱的作用是什么？',
    options: ['仅作为装饰', '抗震减震', '支撑屋檐', '以上都是'],
    correctAnswer: 3,
    feedback: '应县木塔中的斗拱不仅起到抗震减震的作用，也支撑屋檐并作为装饰元素。'
  }
])

// 状态变量
const currentQuestionIndex = ref(-1)
const selectedOption = ref(-1)
const isAnswered = ref(false)
const showResults = ref(false)
const correctAnswers = ref(0)

// 计算属性
const currentQuestion = computed(() => {
  if (currentQuestionIndex.value >= 0 && currentQuestionIndex.value < questions.value.length) {
    return questions.value[currentQuestionIndex.value]
  }
  return null
})

const progressPercentage = computed(() => {
  if (questions.value.length === 0) return 0
  return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
})

// 方法
const startQuiz = () => {
  currentQuestionIndex.value = 0
  selectedOption.value = -1
  isAnswered.value = false
  showResults.value = false
  correctAnswers.value = 0
}

const selectOption = (index: number) => {
  if (!isAnswered.value) {
    selectedOption.value = index
    isAnswered.value = true
    if (index === currentQuestion.value?.correctAnswer) {
      correctAnswers.value++
    }
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedOption.value = -1
    isAnswered.value = false
  } else {
    showResults.value = true
  }
}

const resetQuiz = () => {
  startQuiz()
}
</script>

<style scoped>
.quiz-component {
  margin-bottom: 80px;
  animation: fadeIn 0.5s ease;
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

.quiz-container {
  max-width: 1000px;
  margin: 0 auto;
}

.question-card,
.result-card,
.start-card {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  margin-bottom: 40px;
  transition: all 0.3s ease;
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

.question-card:hover,
.result-card:hover,
.start-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px dashed #e6c890;
}

.question-number {
  font-size: 18px;
  font-weight: 700;
  color: #8b4513;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #f0e6d2;
  border-radius: 8px;
  overflow: hidden;
  margin-left: 32px;
  border: 1px solid #e6c890;
  transition: all 0.3s ease;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9d2933, #c0392b);
  border-radius: 8px;
  transition: width 0.3s ease;
}

.question-text {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 32px 0;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.options {
  margin-bottom: 32px;
}

.option {
  display: flex;
  align-items: center;
  padding: 24px;
  margin-bottom: 16px;
  border: 2px solid #e6c890;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
}

.option:hover {
  border-color: #d4b17a;
  background: linear-gradient(145deg, #f8f2e4, #f0e6d2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.15);
}

.option.selected {
  border-color: #9d2933;
  background: linear-gradient(145deg, #f0e6d2, #e6c890);
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.15);
}

.option.correct {
  border-color: #27ae60;
  background: linear-gradient(145deg, #e6f7ee, #d4edda);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.15);
}

.option.incorrect {
  border-color: #e74c3c;
  background: linear-gradient(145deg, #f8d7da, #f5c6cb);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.15);
}

.option-letter {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0e6d2;
  color: #8b4513;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  margin-right: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(196, 147, 70, 0.15);
}

.option.selected .option-letter {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
  transform: scale(1.1);
}

.option.correct .option-letter {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: #fff;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  transform: scale(1.1);
}

.option.incorrect .option-letter {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  transform: scale(1.1);
}

.option-text {
  flex: 1;
  font-size: 18px;
  color: #333;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.option-status {
  margin-left: 24px;
  font-size: 24px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.option-status .icon-check {
  color: #27ae60;
  animation: checkAnimation 0.5s ease;
}

.option-status .icon-close {
  color: #e74c3c;
  animation: closeAnimation 0.5s ease;
}

@keyframes checkAnimation {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes closeAnimation {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.question-feedback {
  background: linear-gradient(145deg, #f8f9fa, #f0e6d2);
  border-left: 4px solid #9d2933;
  padding: 24px;
  border-radius: 0 16px 16px 0;
  margin-bottom: 32px;
  border: 1px solid #e6c890;
  transition: all 0.3s ease;
}

.question-feedback:hover {
  border-color: #d4b17a;
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.15);
}

.question-feedback p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.question-actions {
  text-align: right;
}

.result-title {
  font-size: 32px;
  font-weight: 800;
  color: #8b4513;
  margin: 0 0 40px 0;
  text-align: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  animation: titleAnimation 0.5s ease;
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

.result-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 2px dashed #e6c890;
  animation: statsAnimation 0.5s ease;
}

@keyframes statsAnimation {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.stat-item {
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-value {
  display: block;
  font-size: 48px;
  font-weight: 800;
  color: #9d2933;
  margin-bottom: 12px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.stat-label {
  display: block;
  font-size: 18px;
  color: #6d4c41;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.result-message {
  text-align: center;
  margin-bottom: 40px;
  animation: messageAnimation 0.5s ease;
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

.result-message p {
  font-size: 20px;
  color: #333;
  margin: 0;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.start-title {
  font-size: 32px;
  font-weight: 800;
  color: #8b4513;
  margin: 0 0 24px 0;
  text-align: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  animation: titleAnimation 0.5s ease;
}

.start-desc {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 40px 0;
  text-align: center;
  line-height: 1.8;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  animation: messageAnimation 0.5s ease;
}

.start-btn {
  display: block;
  margin: 0 auto;
  padding: 16px 48px;
  font-size: 20px;
  font-weight: 700;
  animation: buttonAnimation 0.5s ease;
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

/* 国风按钮 */
.chinese-btn {
  border-radius: 12px;
  font-family: 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.chinese-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
}

.chinese-btn.primary:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .question-card,
  .result-card,
  .start-card {
    padding: 24px;
  }
  
  .question-text {
    font-size: 20px;
  }
  
  .option {
    padding: 16px;
  }
  
  .option-letter {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .option-text {
    font-size: 16px;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 32px;
  }
  
  .stat-value {
    font-size: 36px;
  }
  
  .stat-label {
    font-size: 16px;
  }
  
  .result-message p {
    font-size: 18px;
  }
  
  .start-title {
    font-size: 24px;
  }
  
  .start-desc {
    font-size: 16px;
  }
}
</style>