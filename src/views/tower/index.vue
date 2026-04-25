<template>
  <div class="tower-page">
    <!-- AI悬浮框 -->
    <AIChatBox />

    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 核心布局：强制左右不换行 -->
    <div class="main-container">
      <!-- 左侧：3D展示容器 -->
      <div class="left-panel">
        <el-card
          class="canvas-card chinese-card"
          shadow="never"
          :body-style="{ height: 'calc(100% - 57px)', padding: '20px' }"
        >
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-ta" style="margin-right: 8px; color: #8b4513"></i>
                应县木塔3D模型（此页可进行古塔部件拆解）
              </span>
              <div class="header-tools">
                <el-button size="small" class="chinese-btn plain" @click="handleResetView">
                  <i class="iconfont icon-zhongzhi" style="margin-right: 4px"></i>重置视角
                </el-button>
                <el-button size="small" class="chinese-btn primary" @click="handleFullscreen">
                  <i class="iconfont icon-quanping" style="margin-right: 4px"></i>全屏查看
                </el-button>
              </div>
            </div>
          </template>
          <div class="canvas-container">
            <!-- 加载中状态 -->
            <div class="canvas-placeholder" v-if="!modelLoaded">
              <div class="loading-spinner"></div>
              <p class="placeholder-text">应县木塔3D模型加载中</p>
              <p class="placeholder-desc">千年木构 · 数字重生</p>
            </div>
            <!-- 核心改动：加载完成后直接挂载Scene3D组件 -->
            <div class="canvas-mount" v-else>
              <Scene3D ref="scene3dRef" />
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧：3个功能按钮 -->
      <div class="right-panel">
        <div class="btn-section">
          <h2 class="section-title">
            <i class="iconfont icon-gujian" style="margin-right: 8px; color: #8b4513"></i>
            深度解析
          </h2>

          <!-- 结构分析按钮 -->
          <router-link to="/tower/structure" class="nav-link">
            <el-card class="nav-card xiangyun-border" shadow="hover" style="background-image: url('/images/m14.JPG'); background-size: cover; background-position: center;">
              <div class="nav-content">
                <h3 class="nav-title">结构分析</h3>
                <p class="nav-desc">拆解木塔千年营造结构</p>
              </div>
              <div class="nav-arrow">→</div>
            </el-card>
          </router-link>

          <!-- 力学分析按钮 -->
          <router-link to="/tower/mechanics" class="nav-link">
            <el-card class="nav-card xiangyun-border" shadow="hover" style="background-image: url('/images/dougong2.JPG'); background-size: cover; background-position: center;">
              <div class="nav-content">
                <h3 class="nav-title">力学分析</h3>
                <p class="nav-desc">探究抗震抗风力学原理</p>
              </div>
              <div class="nav-arrow">→</div>
            </el-card>
          </router-link>

          <!-- 装饰工艺按钮 -->
          <router-link to="/tower/decoration" class="nav-link">
            <el-card class="nav-card xiangyun-border" shadow="hover" style="background-image: url('/images/paibian2.JPG'); background-size: cover; background-position: center;">
              <div class="nav-content">
                <h3 class="nav-title">装饰工艺</h3>
                <p class="nav-desc">赏析古建装饰艺术细节</p>
              </div>
              <div class="nav-arrow">→</div>
            </el-card>
          </router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 1. 引入Scene3D组件
import Scene3D from '@/components/Scene3D.vue'
// 引入AI悬浮框（修正组件名，保持和你文件名一致）
import AIChatBox from '@/components/AIChatBox.vue'

// 2. 获取Scene3D组件的ref（用于后续调用方法）
const scene3dRef = ref<InstanceType<typeof Scene3D> | null>(null)

// 模拟3D模型加载状态
const modelLoaded = ref(false)

// 3. 3D控制按钮事件（关联Scene3D的方法）
const handleResetView = (): void => {
  console.log('点击重置视角按钮')
  // ✅ 调用子组件的重置视角方法
  scene3dRef.value?.resetView()
}

const handleFullscreen = (): void => {
  console.log('点击全屏查看按钮')
  const container = document.querySelector('.canvas-container') as HTMLElement
  if (!container) return

  // ✅ 兼容全浏览器全屏API
  const requestFullscreen =
    container.requestFullscreen ||
    (container as any).webkitRequestFullscreen ||
    (container as any).msRequestFullscreen ||
    (container as any).mozRequestFullScreen

  if (requestFullscreen) {
    requestFullscreen.call(container)
  }
}

// 4. 模拟3D模型加载（2秒后显示Scene3D）
onMounted(() => {
  setTimeout(() => {
    modelLoaded.value = true
  }, 2000)
})
</script>

<style scoped>
/* 页面基础样式 */
.tower-page {
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

/* 遮罩，同步质感 */
.tower-page::before {
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

/* 面包屑导航 */
.breadcrumb-wrapper {
  margin-bottom: 32px;
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

/* 核心布局 */
.main-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 32px;
  margin-bottom: 60px;
  align-items: stretch;
}

.left-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

/* 国风卡片（完全复用首页的画框样式） */
.canvas-card {
  width: 100%;
  border-radius: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chinese-card {
  width: 100%;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  box-shadow:
    0 6px 15px rgba(0, 0, 0, 0.08),
    0 0 0 4px rgba(249, 245, 233, 0.5);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e6c890;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  margin-bottom: 16px;
}

/* 国风按钮（对齐首页的古建配色） */
.chinese-btn {
  border-radius: 8px;
  font-family: 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
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
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
}

/* 3D容器样式 */
.canvas-container {
  width: 100%;
  height: 100%;
  background: #f9f5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid #e0d5c0;
}

/* 加载动画（适配首页配色） */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  border-top-color: #8b4513;
  animation: spin 1s ease-in-out infinite;
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
  font-family: 'Microsoft YaHei', serif;
}

.placeholder-text {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #8b4513;
}

.placeholder-desc {
  font-size: 13px;
  opacity: 0.8;
  margin: 0;
  color: #795548;
}

/* 核心改动：给canvas-mount设置宽高，让Scene3D占满 */
.canvas-mount {
  width: 100%;
  height: 100%;
}

/* 右侧按钮区域 */
.btn-section {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 24px 0;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  flex-shrink: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

/* 导航卡片 */
.nav-card {
  width: 100%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 24px 20px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  position: relative;
  overflow: hidden;
}

/* 卡片右上角古风角标（和首页档案卡片一致） */
.nav-card::before {
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

.nav-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(139, 69, 19, 0.2);
  border-color: #d4b17a;
}

/* 图标配色（保留原有图标，仅调整渐变色对齐首页） */
.nav-icon {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  margin-right: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 复用首页的古建三色：朱红、青黛、赭石 */
.icon1 {
  background: linear-gradient(135deg, #9d2933, #c0392b);
}
.icon2 {
  background: linear-gradient(135deg, #1e8883, #26a69a);
}
.icon3 {
  background: linear-gradient(135deg, #e67e22, #f39c12);
}

.nav-content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(1px);
}

.nav-title {
  font-size: 22px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 8px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.nav-desc {
  font-size: 16px;
  color: #6d4c41;
  margin: 0;
  line-height: 1.6;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.nav-arrow {
  font-size: 24px;
  color: #8b4513;
  font-weight: 300;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.nav-card:hover .nav-arrow {
  transform: translateX(4px);
  color: #6d4c41;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
  .left-panel,
  .right-panel {
    width: 100%;
    min-width: unset;
  }
  .left-panel {
    height: 60vh;
  }
  .right-panel {
    height: auto;
  }
  .btn-section {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }
  .nav-link {
    width: calc(33.33% - 12px);
  }
}

@media (max-width: 768px) {
  .tower-page {
    padding: 40px 5%;
  }
  
  .card-header {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .nav-title {
    font-size: 20px;
  }
  
  .nav-desc {
    font-size: 14px;
  }
  
  .btn-section {
    flex-direction: column;
  }
  
  .nav-link {
    width: 100%;
  }
  
  .left-panel {
    height: 50vh;
  }
}
</style>
