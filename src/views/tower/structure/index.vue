<template>
  <div class="structure-page">
    <div class="content-container">
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb chinese-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tower' }">
        <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="iconfont icon-jiegou" style="margin-right: 4px"></i>结构分析
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部操作栏 -->
    <el-card class="action-card chinese-card" shadow="never">
      <div class="action-bar">
        <div class="action-title">
          <h2>应县木塔结构分析</h2>
          <p>逐层解析塔体营造结构与榫卯工艺</p>
        </div>
        <div class="action-btns">
          <router-link to="/tower/structure/detail">
            <el-button class="chinese-btn primary" size="default">
              <i class="iconfont icon-chaijie" style="margin-right: 4px"></i>进入部件拆解
            </el-button>
          </router-link>
          <el-button class="chinese-btn plain" size="default" @click="resetToInitialState">
            <i class="iconfont icon-zhongzhi" style="margin-right: 4px"></i>恢复原样
          </el-button>
          <el-button class="chinese-btn plain" size="default" @click="downloadStructureDrawing">
            <i class="iconfont icon-xiazai" style="margin-right: 4px"></i>下载结构图纸
          </el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="main-row">
      <!-- 左侧3D -->
      <el-col :xs="24" :sm="16" :md="16">
        <el-card class="canvas-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-kongjian" style="margin-right: 8px; color: #8b4513"></i>
                结构可视化
              </span>
            </div>
          </template>
          <div class="canvas-container">
            <div class="canvas-placeholder" v-if="!modelLoaded">
              <div class="loading-spinner"></div>
              <p class="placeholder-text">结构分析展示区域</p>
              <p class="placeholder-desc">千年木构 · 榫卯匠心</p>
            </div>
            <div
              class="canvas-mount"
              v-else
              @mousemove="updateTooltipPos"
              @mouseleave="hideTooltip"
            >
              <Scene3D
                ref="scene3dRef"
                @part-click="onModelPartClick"
                @part-hover="onModelPartHover"
              />
              <!-- 结构页专属悬浮提示 -->
              <div
                v-show="tooltip.show"
                class="structure-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
              >
                {{ tooltip.name }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧TAB -->
      <el-col :xs="24" :sm="8" :md="8">
        <el-card class="tab-card chinese-card" shadow="never">
          <el-tabs v-model="activeTab" class="structure-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="柱子" name="Column">
              <div class="tab-content">
                <h3 class="layer-title">柱体结构系统</h3>
                <ul class="layer-list">
                  <li>· 垂直承重核心构件</li>
                  <li>· 内外双环柱网布局</li>
                  <li>· 柔性连接，允许摆动耗能</li>
                  <li>· 管脚榫定位，防位移</li>
                  <li>· 木塔抗震第一道防线</li>
                </ul>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">36</div>
                    <div class="stat-label">总柱数量</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">柔性</div>
                    <div class="stat-label">结构特性</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="斗拱" name="DouGong">
              <div class="tab-content">
                <h3 class="layer-title">斗拱结构系统</h3>
                <ul class="layer-list">
                  <li>· 木塔核心抗震减震构件</li>
                  <li>· 全塔54种共480朵斗拱</li>
                  <li>· 摩擦错动，消耗地震能量</li>
                  <li>· 榫卯拼接，无钉加固</li>
                  <li>· 古建天然减震器</li>
                </ul>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">480</div>
                    <div class="stat-label">斗拱总数</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">耗能</div>
                    <div class="stat-label">核心作用</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="屋檐" name="Bracing">
              <div class="tab-content">
                <h3 class="layer-title">屋檐结构系统</h3>
                <ul class="layer-list">
                  <li>· 水平拉结，形成整体框架</li>
                  <li>· 圈梁效应，加固塔体</li>
                  <li>· 传递水平力与垂直荷载</li>
                  <li>· 透榫/燕尾榫加固连接</li>
                  <li>· 保证结构整体性</li>
                </ul>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">闭环</div>
                    <div class="stat-label">结构形式</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">拉结</div>
                    <div class="stat-label">核心作用</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="墙体" name="Wall">
              <div class="tab-content">
                <h3 class="layer-title">墙体结构系统</h3>
                <ul class="layer-list">
                  <li>· 围护构件，不承担承重</li>
                  <li>· 墙倒屋不塌结构设计</li>
                  <li>· 填充木框架，柔性连接</li>
                  <li>· 辅助消耗部分地震能量</li>
                  <li>· 土坯+木骨构造工艺</li>
                </ul>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">不承重</div>
                    <div class="stat-label">结构特性</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">围护</div>
                    <div class="stat-label">核心作用</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import Scene3D from '@/components/Scene3D.vue'

// 初始状态：Tab无选中，完全是刚进页面的样子
const activeTab = ref('')
const modelLoaded = ref(false)
const scene3dRef = ref<any>(null)

// 鼠标悬浮提示
const tooltip = reactive({
  show: false,
  x: 0,
  y: 0,
  name: ''
})

// 结构类型
const ALL_TYPES = ['Column', 'DouGong', 'Bracing', 'Wall']

// ==============================================
// 🔥 恢复原样 = 刷新页面（完全和刚进入页面一致）
// ==============================================
const resetToInitialState = () => {
  window.location.reload()
}

// ==============================================
// 右侧TAB切换 → 仅上色，不放大模型
// ==============================================
const handleTabChange = (currentType: string) => {
  if (!scene3dRef.value || !currentType) return
  const s = scene3dRef.value

  // 先清空所有颜色
  ALL_TYPES.forEach((type) => s.toggleColorByType(type))
  // 仅给当前类型上色
  s.setColorByType(currentType)
}

// ==============================================
// 左侧模型点击 → 仅放大，不上色 + 同步右侧Tab
// ==============================================
const onModelPartClick = (info: any) => {
  if (!scene3dRef.value) return
  const s = scene3dRef.value

  // 类型映射
  const typeMap = {
    柱体: 'Column',
    斗拱: 'DouGong',
    屋檐: 'Bracing',
    墙体: 'Wall'
  }
  const targetType = typeMap[info.type] || 'Column'

  // 仅复位模型位置，不上色
  s.resetPart()

  // 仅放大对应部件，无任何上色操作
  const parts = s.partsByType?.[targetType]
  if (parts && parts.length > 0) {
    s.disassemblePart(parts[0])
  }

  // 同步右侧Tab
  activeTab.value = targetType
}

// ==============================================
// 鼠标悬浮提示（不变）
// ==============================================
const onModelPartHover = (data: any) => {
  if (!data.name) {
    tooltip.show = false
    return
  }
  tooltip.name = data.name
  tooltip.show = true
}
const updateTooltipPos = (e: MouseEvent) => {
  tooltip.x = e.offsetX + 15
  tooltip.y = e.offsetY + 15
}
const hideTooltip = () => {
  tooltip.show = false
}

// 下载结构图纸
const downloadStructureDrawing = () => {
  // 由于是占位PDF，这里提示用户该功能正在开发中
  alert('结构图纸下载功能正在开发中，敬请期待！')
  // 实际项目中可以使用以下代码下载文件
  // const link = document.createElement('a')
  // link.href = '/path/to/structure-drawing.pdf'
  // link.download = '应县木塔结构图纸.pdf'
  // link.click()
}

// ==============================================
// 页面初始化
// ==============================================
onMounted(() => {
  setTimeout(() => {
    modelLoaded.value = true
  }, 2000)
})
</script>

<style scoped>
.structure-page {
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

.structure-page::before {
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
  margin-bottom: 32px;
  font-size: 18px;
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
.action-card {
  width: 100%;
  border-radius: 24px;
  margin-bottom: 32px;
  padding: 32px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  border: 2px solid #b98c58;
  box-shadow: 0 12px 30px rgba(185, 140, 88, 0.2);
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(185, 140, 88, 0.3);
}

.chinese-card {
  width: 100%;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.chinese-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.2);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.action-title h2 {
  font-size: 36px;
  font-weight: 800;
  color: #8b4513;
  margin: 0 0 12px;
  font-family: 'SimHei', 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
}

.action-title p {
  font-size: 20px;
  color: #6d4c41;
  margin: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}
.main-row {
  align-items: flex-start;
}
.canvas-card {
  width: 100%;
  border-radius: 20px;
  margin-bottom: 32px;
}

.card-header {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e6c890;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.canvas-container {
  width: 100%;
  height: 600px;
  background: #f9f5e9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e6c890;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
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
.tab-card {
  width: 100%;
  border-radius: 20px;
  margin-bottom: 32px;
}

.structure-tabs {
  width: 100%;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.structure-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.structure-tabs :deep(.el-tabs__nav-wrap) {
  border-bottom: 1px dashed #e6c890;
}

.structure-tabs :deep(.el-tabs__item) {
  color: #6d4c41;
  font-size: 18px;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.structure-tabs :deep(.el-tabs__item.is-active) {
  color: #8b4513;
  font-weight: 700;
  font-size: 20px;
}

.structure-tabs :deep(.el-tabs__active-bar) {
  background-color: #8b4513;
  height: 3px;
  transition: all 0.3s ease;
}

.tab-content {
  width: 100%;
  padding: 20px 0;
}

.layer-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  transition: all 0.3s ease;
}

.layer-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.layer-list li {
  font-size: 16px;
  color: #6d4c41;
  line-height: 2.2;
  padding-left: 12px;
  border-bottom: 1px dotted #f0e6d2;
  padding-bottom: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.layer-stats {
  display: flex;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px dashed #e6c890;
}

.stat-item {
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-num {
  font-size: 32px;
  font-weight: 800;
  color: #8b4513;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 16px;
  color: #6d4c41;
  transition: all 0.3s ease;
}
.chinese-btn {
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 18px;
  padding: 12px 24px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.chinese-btn.plain {
  border-color: #e6c890;
  color: #6d4c41;
  background: rgba(255, 255, 255, 0.8);
}

.chinese-btn.plain:hover {
  border-color: #8b4513;
  color: #8b4513;
  background: rgba(139, 69, 19, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
}

.chinese-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.chinese-btn.primary:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
}

a {
  text-decoration: none;
  color: inherit;
}

.structure-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 8px;
  font-size: 16px;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: tooltipFade 0.2s ease;
  white-space: nowrap;
  border: 1px solid #e6c890;
}
@keyframes tooltipFade {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .structure-page {
    padding: 40px 5%;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-btns {
    width: 100%;
    display: flex;
    gap: 16px;
  }
  
  .action-btns button {
    flex: 1;
  }
  
  .action-title h2 {
    font-size: 28px;
  }
  
  .action-title p {
    font-size: 18px;
  }
  
  .card-header {
    font-size: 20px;
  }
  
  .canvas-container {
    height: 400px;
  }
  
  .layer-title {
    font-size: 20px;
  }
  
  .layer-list li {
    font-size: 14px;
  }
  
  .stat-num {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 14px;
  }
  
  .layer-stats {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 1200px) {
  .canvas-container {
    height: 500px;
  }
  
  .action-title h2 {
    font-size: 32px;
  }
  
  .action-title p {
    font-size: 18px;
  }
}
</style>
