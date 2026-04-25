// 成就类型定义
export interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  unlockedDate: Date | null
}

// 学习统计类型定义
export interface LearningStats {
  totalLearningTime: number
  totalQuizAttempts: number
  totalGamePlays: number
  highestScore: number
}

// 学习路径步骤类型定义
export interface LearningStep {
  id: number
  title: string
  description: string
  completed: boolean
}

// 问题类型定义
export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  feedback: string
}

// 游戏状态类型定义
export interface GameState {
  started: boolean
  completed: boolean
  timeElapsed: number
  score: number
  completedParts: number
  totalParts: number
}

// 教育科普状态类型定义
export interface EducationState {
  achievements: Achievement[]
  learningStats: LearningStats
  learningSteps: LearningStep[]
  currentQuizScore: number
  currentGameScore: number
}
