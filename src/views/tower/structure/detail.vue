<template>
  <div class="structure-detail-page">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb chinese-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tower' }">
        <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tower/structure' }">
        <i class="iconfont icon-jiegou" style="margin-right: 4px"></i>结构分析
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="iconfont icon-chaijie" style="margin-right: 4px"></i>部件拆解
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部操作栏 -->
    <el-card class="action-card chinese-card" shadow="never">
      <div class="action-bar">
        <div class="action-title">
          <h2>应县木塔部件拆解</h2>
          <p>逐层拆解塔体部件，深入了解榫卯结构</p>
        </div>
        <div class="action-btns">
          <el-button class="chinese-btn primary" size="default" @click="resetView">
            <i class="iconfont icon-zhongzhi" style="margin-right: 4px"></i>重置视图
          </el-button>
          <el-button class="chinese-btn plain" size="default" @click="toggleAllParts">
            <i class="iconfont icon-suoxiao" style="margin-right: 4px"></i>{{ isAllPartsVisible ? '收起部件' : '展开所有部件' }}
          </el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="main-row">
      <!-- 左侧3D模型拆解视图 -->
      <el-col :xs="24" :sm="16" :md="16">
        <el-card class="canvas-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-kongjian" style="margin-right: 8px; color: #8b4513"></i>
                3D模型拆解视图
              </span>
            </div>
          </template>
          <div class="canvas-container">
            <div class="canvas-placeholder" v-if="!modelLoaded">
              <div class="loading-spinner"></div>
              <p class="placeholder-text">模型拆解展示区域</p>
              <p class="placeholder-desc">千年木构 · 榫卯匠心</p>
            </div>
            <div
              class="canvas-mount"
              v-else
            >
              <Scene3D ref="scene3dRef" />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧部件列表 -->
      <el-col :xs="24" :sm="8" :md="8">
        <el-card class="parts-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-biaoge" style="margin-right: 8px; color: #8b4513"></i>
                部件列表
              </span>
            </div>
          </template>
          <div class="parts-list">
            <div
              v-for="part in partsList"
              :key="part.id"
              class="part-item"
              :class="{ active: selectedPart === part.id }"
              @click="selectPart(part.id)"
            >
              <div class="part-name">{{ part.name }}</div>
              <div class="part-desc">{{ part.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Scene3D from '@/components/Scene3D.vue'

const modelLoaded = ref(false)
const scene3dRef = ref<InstanceType<typeof Scene3D> | null>(null)
const selectedPart = ref<number | null>(null)
const isAllPartsVisible = ref(false)

// 部件列表数据
const partsList = [
  { id: 1, name: '柱子', description: '垂直承重核心构件' },
  { id: 2, name: '斗拱', description: '核心抗震减震构件' },
  { id: 3, name: '梁枋', description: '水平拉结，形成整体框架' },
  { id: 4, name: '墙体', description: '围护构件，不承担承重' },
  { id: 5, name: '屋檐', description: '重檐结构，分散风压' }
]

// 重置视图
const resetView = () => {
  scene3dRef.value?.resetView()
}

// 切换所有部件显示/隐藏
const toggleAllParts = () => {
  isAllPartsVisible.value = !isAllPartsVisible.value
  // 这里可以添加展开/收起所有部件的逻辑
}

// 选择部件
const selectPart = (partId: number) => {
  selectedPart.value = partId
  // 这里可以添加高亮对应部件的逻辑
  const part = partsList.find(p => p.id === partId)
  if (part) {
    console.log(`Selected part: ${part.name}`)
    // 调用Scene3D组件的方法来高亮对应部件
  }
}

onMounted(() => {
  setTimeout(() => {
    modelLoaded.value = true
  }, 2000)
})
</script>

<style scoped>
.structure-detail-page {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 24px 32px;
  box-sizing: border-box;
  background-image: url('/images/background1.png');
  background-repeat: repeat;
  background-color: #f9f5e9;
  background-blend-mode: normal;
  min-height: 100vh;
  position: relative;
  animation: fadeIn 0.5s ease;
}
.structure-detail-page::before {
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
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}
.chinese-breadcrumb {
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}
.chinese-breadcrumb :deep(.el-breadcrumb__item) {
  color: #6d4c41;
}
.chinese-breadcrumb :deep(.el-breadcrumb__item:last-child) {
  color: #8b4513;
  font-weight: 600;
}
.action-card {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 20px;
}
.chinese-card {
  width: 100%;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e0d5c0;
  box-shadow:
    0 6px 15px rgba(0, 0, 0, 0.08),
    0 0 0 4px rgba(249, 245, 233, 0.5);
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.action-title h2 {
  font-size: 26px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 4px;
}
.action-title p {
  font-size: 15px;
  color: #795548;
  margin: 0;
}
.main-row {
  align-items: flex-start;
}
.canvas-card {
  width: 100%;
  border-radius: 16px;
}
.card-header {
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e6c890;
}
.canvas-container {
  width: 100%;
  height: 520px;
  background: #f9f5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0d5c0;
  position: relative;
  overflow: hidden;
}
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  border-top-color: #8b4513;
  animation: spin 1s infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.canvas-placeholder {
  text-align: center;
  color: #6d4c41;
}
.placeholder-text {
  font-size: 18px;
  font-weight: 600;
  color: #8b4513;
}
.placeholder-desc {
  font-size: 13px;
  opacity: 0.8;
  color: #795548;
}
.canvas-mount {
  width: 100%;
  height: 100%;
  position: relative;
}
.parts-card {
  width: 100%;
  border-radius: 16px;
}
.parts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0;
}
.part-item {
  padding: 16px;
  background: #f9f5e9;
  border: 1px solid #e0d5c0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.part-item:hover {
  border-color: #8b4513;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.1);
}
.part-item.active {
  background: rgba(139, 69, 19, 0.1);
  border-color: #8b4513;
}
.part-name {
  font-size: 16px;
  font-weight: 600;
  color: #8b4513;
  margin-bottom: 8px;
}
.part-desc {
  font-size: 14px;
  color: #6d4c41;
  line-height: 1.4;
}
.chinese-btn {
  border-radius: 8px;
  transition: all 0.3s;
}
.chinese-btn.plain {
  border-color: #e6c890;
  color: #6d4c41;
}
.chinese-btn.plain:hover {
  border-color: #8b4513;
  color: #8b4513;
  background: rgba(139, 69, 19, 0.05);
}
.chinese-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
}
.chinese-btn.primary:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .structure-detail-page {
    padding: 12px;
  }
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .action-btns {
    width: 100%;
    display: flex;
    gap: 12px;
  }
  .action-btns button {
    flex: 1;
  }
  .canvas-container {
    height: 360px;
  }
}
@media (max-width: 1200px) {
  .canvas-container {
    height: 400px;
  }
}
</style>