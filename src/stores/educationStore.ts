import { defineStore } from 'pinia'

// 定义成就类型
interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  unlockedDate: Date | null
}

// 定义学习统计类型
interface LearningStats {
  totalLearningTime: number
  totalQuizAttempts: number
  totalGamePlays: number
  highestScore: number
}

// 定义学习路径步骤类型
interface LearningStep {
  id: number
  title: string
  description: string
  completed: boolean
}

// 定义教育科普状态
interface EducationState {
  achievements: Achievement[]
  learningStats: LearningStats
  learningSteps: LearningStep[]
  currentQuizScore: number
  currentGameScore: number
}

// 创建教育科普状态管理
export const useEducationStore = defineStore('education', {
  state: (): EducationState => ({
    // 成就列表
    achievements: [
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
    ],
    
    // 学习统计
    learningStats: {
      totalLearningTime: 15,
      totalQuizAttempts: 2,
      totalGamePlays: 0,
      highestScore: 850
    },
    
    // 学习路径
    learningSteps: [
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
    ],
    
    // 当前得分
    currentQuizScore: 0,
    currentGameScore: 0
  }),
  
  getters: {
    // 总成就数
    totalAchievements: (state) => state.achievements.length,
    
    // 已解锁成就数
    unlockedAchievements: (state) => state.achievements.filter(a => a.unlocked).length,
    
    // 成就完成率
    achievementCompletionRate: (state) => {
      if (state.achievements.length === 0) return 0
      return Math.round((state.achievements.filter(a => a.unlocked).length / state.achievements.length) * 100)
    },
    
    // 学习路径完成率
    learningPathCompletionRate: (state) => {
      if (state.learningSteps.length === 0) return 0
      return Math.round((state.learningSteps.filter(s => s.completed).length / state.learningSteps.length) * 100)
    }
  },
  
  actions: {
    // 解锁成就
    unlockAchievement(id: number) {
      const achievement = this.achievements.find(a => a.id === id)
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.progress = achievement.target
        achievement.unlockedDate = new Date()
        
        // 检查是否解锁了"斗拱专家"成就
        const otherAchievements = this.achievements.filter(a => a.id !== 5)
        if (otherAchievements.every(a => a.unlocked)) {
          this.unlockAchievement(5)
        }
      }
    },
    
    // 更新成就进度
    updateAchievementProgress(id: number, progress: number) {
      const achievement = this.achievements.find(a => a.id === id)
      if (achievement && !achievement.unlocked) {
        achievement.progress = Math.min(progress, achievement.target)
        if (achievement.progress >= achievement.target) {
          this.unlockAchievement(id)
        }
      }
    },
    
    // 完成学习步骤
    completeLearningStep(id: number) {
      const step = this.learningSteps.find(s => s.id === id)
      if (step && !step.completed) {
        step.completed = true
      }
    },
    
    // 更新学习时间
    addLearningTime(minutes: number) {
      this.learningStats.totalLearningTime += minutes
      
      // 更新"学习爱好者"成就进度
      this.updateAchievementProgress(4, this.learningStats.totalLearningTime)
    },
    
    // 记录答题次数
    recordQuizAttempt(score: number, correctRate: number) {
      this.learningStats.totalQuizAttempts++
      this.currentQuizScore = score
      
      // 解锁"斗拱初学者"成就
      this.unlockAchievement(1)
      
      // 检查"知识大师"成就
      if (correctRate >= 0.8) {
        this.unlockAchievement(3)
      }
    },
    
    // 记录游戏次数
    recordGamePlay(score: number) {
      this.learningStats.totalGamePlays++
      this.currentGameScore = score
      
      // 解锁"拼装达人"成就
      this.unlockAchievement(2)
      
      // 更新最高分
      if (score > this.learningStats.highestScore) {
        this.learningStats.highestScore = score
      }
    },
    
    // 重置所有数据
    resetAllData() {
      // 重置成就
      this.achievements.forEach(achievement => {
        achievement.unlocked = false
        achievement.progress = 0
        achievement.unlockedDate = null
      })
      
      // 重置第一个成就
      this.achievements[0].unlocked = true
      this.achievements[0].progress = 1
      this.achievements[0].unlockedDate = new Date()
      
      // 重置学习统计
      this.learningStats = {
        totalLearningTime: 0,
        totalQuizAttempts: 0,
        totalGamePlays: 0,
        highestScore: 0
      }
      
      // 重置学习路径
      this.learningSteps.forEach(step => {
        step.completed = false
      })
      
      // 重置第一个学习步骤
      this.learningSteps[0].completed = true
      
      // 重置当前得分
      this.currentQuizScore = 0
      this.currentGameScore = 0
    }
  }
})
