<template>
  <div class="walkthrough-page">
    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-yuanjing" style="margin-right: 4px"></i>第一视角漫游
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="iconfont icon-yuanjing" style="margin-right: 12px; color: #8b4513"></i>
        第一视角漫游
      </h1>
      <p class="page-subtitle">以第一人称视角探索应县木塔的内部结构与装饰</p>
    </div>

    <!-- 场景选择 -->
    <div class="scene-selection">
      <h2 class="section-title">
        <i class="iconfont icon-ceng" style="margin-right: 8px; color: #8b4513"></i>
        选择场景
      </h2>
      <div class="scene-cards">
        <router-link to="/walkthrough/ming5" class="scene-card" style="background-image: url('/images/m6.JPG'); background-size: cover; background-position: center;">
          <div class="card-content">
            <div class="card-icon">
              <i class="iconfont icon-ceng"></i>
            </div>
            <h3 class="card-title">明五层</h3>
            <p class="card-desc">体验木塔明五层的内部结构与装饰</p>
            <el-button class="card-button">
              进入漫游
              <i class="iconfont icon-arrow-right" style="margin-left: 8px"></i>
            </el-button>
          </div>
        </router-link>

        <router-link to="/walkthrough/an4" class="scene-card" style="background-image: url('/images/f9.JPG'); background-size: cover; background-position: center;">
          <div class="card-content">
            <div class="card-icon">
              <i class="iconfont icon-ceng"></i>
            </div>
            <h3 class="card-title">暗四层</h3>
            <p class="card-desc">体验木塔暗四层的内部结构与装饰</p>
            <el-button class="card-button">
              进入漫游
              <i class="iconfont icon-arrow-right" style="margin-left: 8px"></i>
            </el-button>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 操作说明 -->
    <div class="instructions-section">
      <h2 class="section-title">
        <i class="iconfont icon-zhishi" style="margin-right: 8px; color: #8b4513"></i>
        操作说明
      </h2>
      <div class="instructions-content">
        <div class="instruction-item">
          <div class="instruction-icon">🖱️</div>
          <div class="instruction-text">
            <h4>鼠标操作</h4>
            <p>拖拽：旋转视角 | 滚轮：缩放视角 | 右键：平移视角</p>
          </div>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon">⌨️</div>
          <div class="instruction-text">
            <h4>键盘操作</h4>
            <p>WASD/方向键：移动 | 空格键：重置视角</p>
          </div>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon">📱</div>
          <div class="instruction-text">
            <h4>移动设备</h4>
            <p>双指：缩放 | 单指：旋转 | 三指：平移</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型信息 -->
    <div class="model-info-section">
      <h2 class="section-title">
        <i class="iconfont icon-xinxi" style="margin-right: 8px; color: #8b4513"></i>
        模型信息
      </h2>
      <div class="model-info-content">
        <p>• 明五层模型： 明层（使用层，共5层）——柔性、功能
供佛礼拜的空间核心
明层是塔身外观可见的五层，内部空间高大开阔，每层均供奉有佛像（如一层高约11米的释迦牟尼像），是宗教活动和信徒瞻礼的主要场所。

“以柔克刚”的缓冲层
结构上相对柔韧，如同弹簧。在地震或大风时，明层可以通过适度的变形来吸收和耗散能量，避免硬力直接传递，起到缓冲减震的作用。</p>
        <p>• 暗四层模型： 暗层（结构层，共4层）——刚性、结构
布满斜撑的“刚性箍”
暗层位于各明层之间的平座（阳台）下方，外观不可见。其内部布满了大量的斜撑，构成无数稳定的三角形，使这一层具有极大的抗侧移刚度。

“以刚制柔”的稳定层
作为刚性层，如同四道铁箍，将整座塔的上下段紧紧锁固成一个整体。它有效抵抗了水平方向（如风、地震）的剪切力和扭转力，防止塔身变形解体。</p>
       <p>• 明层负责“用”，提供活动空间和柔性缓冲；暗层负责“固”，提供刚性锁合与整体稳定。两者刚柔并济，是应县木塔千年不倒的核心结构秘诀。</p> 
       <p>• 模型加载时间：根据网络速度不同，可能需要 3-10 秒</p>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无脚本逻辑，仅作为导航页面
</script>

<style scoped>
/* 页面基础样式 */
.walkthrough-page {
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
.walkthrough-page::before {
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
  text-align: center;
  margin-bottom: 80px;
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
  margin: 0 0 24px 0;
  line-height: 1.2;
  font-family: 'SimHei', 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
}

.page-subtitle {
  font-size: 24px;
  color: #6d4c41;
  margin: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 通用板块标题 */
.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 36px 0;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  display: flex;
  align-items: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 场景选择 */
.scene-selection {
  margin-bottom: 80px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.scene-selection:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.scene-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.scene-card {
  background: transparent;
  border-radius: 20px;
  border: 2px solid #e6c890;
  padding: 0;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  padding: 32px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  backdrop-filter: blur(4px);
  width: 90%;
  transition: all 0.3s ease;
}

.card-content:hover {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
}

.scene-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  opacity: 0.8;
}

.scene-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.card-icon {
  font-size: 72px;
  margin-bottom: 24px;
  color: #8b4513;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 20px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.card-desc {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 48px 0;
  line-height: 1.6;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.card-model {
  font-size: 16px;
  color: #795548;
  margin: 0 0 36px 0;
  padding: 12px 20px;
  background: rgba(139, 69, 19, 0.1);
  border-radius: 12px;
  display: inline-block;
  transition: all 0.3s ease;
}

.card-button {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
  background: linear-gradient(135deg, #802028, #a03025);
}

/* 操作说明 */
.instructions-section {
  margin-bottom: 80px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.instructions-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.instructions-content {
  background: transparent;
  border-radius: 16px;
  border: none;
  padding: 0;
  box-shadow: none;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
  transition: all 0.3s ease;
}

.instruction-icon {
  font-size: 40px;
  flex-shrink: 0;
  margin-top: 4px;
  transition: all 0.3s ease;
}

.instruction-text h4 {
  font-size: 22px;
  font-weight: 600;
  color: #8b4513;
  margin: 0 0 12px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.instruction-text p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0;
  line-height: 1.6;
  transition: all 0.3s ease;
}

/* 模型信息 */
.model-info-section {
  margin-bottom: 80px;
  background-image: url('/images/wanguguanzhan.JPG');
  background-size: cover;
  background-position: center;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.model-info-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.model-info-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.model-info-content:hover {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
}

.model-info-content p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 16px 0;
  line-height: 1.6;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .walkthrough-page {
    padding: 16px 16px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .scene-cards {
    grid-template-columns: 1fr;
  }
  
  .scene-card {
    padding: 24px;
  }
  
  .instructions-content,
  .model-info-content {
    padding: 24px;
  }
  
  .instruction-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .instruction-icon {
    margin-bottom: 12px;
  }
}
</style>