<template>
  <div class="detail-page">
    <!-- 顶部面包屑导航（国风样式） -->
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

    <!-- 顶部操作栏（国风卡片） -->
    <el-card class="action-card chinese-card" shadow="never">
      <div class="action-bar">
        <div class="action-title">
          <h2>斗拱部件拆解详情</h2>
          <p>交互式拆解斗拱核心结构</p>
        </div>
      </div>
    </el-card>

    <!-- 核心布局：左3D拆解容器 + 右信息面板 -->
    <el-row :gutter="20" class="main-row">
      <!-- 左侧：3D模型展示容器 -->
      <el-col :xs="24" :sm="16" :md="16">
        <el-card class="canvas-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-kongjian" style="margin-right: 8px; color: #8b4513"></i>
                斗拱拆解可视化
              </span>
            </div>
          </template>
          <!-- 3D模型渲染容器 -->
          <div class="canvas-container" ref="canvasContainer"></div>
        </el-card>
      </el-col>

      <!-- 右侧：仅保留斗拱信息 + 3个斗拱模型切换 -->
      <el-col :xs="24" :sm="8" :md="8">
        <el-card class="info-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-xinxi" style="margin-right: 8px; color: #8b4513"></i>
                斗拱信息
              </span>
            </div>
          </template>

          <!-- 切换你的3个斗拱模型 -->
          <div class="part-selector">
            <el-radio-group
              v-model="selectedPart"
              direction="vertical"
              size="default"
              @change="switchModel"
            >
              <el-radio value="dougong1">斗拱模型 1</el-radio>
              <el-radio value="dougong2">斗拱模型 2</el-radio>
              <el-radio value="dougong3">斗拱模型 3</el-radio>
            </el-radio-group>
          </div>

          <!-- 斗拱详情（唯一展示） -->
          <div class="part-detail">
            <h3 class="part-title">斗拱</h3>
            <div class="part-stats">
              <div class="stat-item">
                <div class="stat-num">五铺作</div>
                <div class="stat-label">铺作类型</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">480</div>
                <div class="stat-label">全塔总朵数</div>
              </div>
            </div>
            <ul class="part-list">
              <li>· 斗：栌斗、交互斗、齐心斗</li>
              <li>· 栱：华栱、泥道栱、令栱</li>
              <li>· 昂：下昂、上昂、昂嘴装饰</li>
              <li>· 作用：抗震减震、承重装饰</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// 选中的斗拱模型
const selectedPart = ref('dougong1')
const canvasContainer = ref(null)

// Three.js 核心变量
let scene,
  camera,
  renderer,
  controls,
  currentModel = null

// 模型路径
const modelMap = {
  dougong1: '/models/dougong_1.glb',
  dougong2: '/models/dougong_2.glb',
  dougong3: '/models/dougong_3.glb'
}

// 初始化场景+相机+渲染器+控制器
const initThree = () => {
  const container = canvasContainer.value
  if (!container) return

  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f5e9)

  // 相机
  camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.01,
    2000
  )
  camera.position.set(0, 0.8, 3)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // 灯光
  const ambient = new THREE.AmbientLight(0xffffff, 1.3)
  scene.add(ambient)
  const directional = new THREE.DirectionalLight(0xffffff, 1.6)
  directional.position.set(5, 12, 7)
  scene.add(directional)

  // 轨道控制
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.rotateSpeed = 1
  controls.zoomSpeed = 1.2
  controls.minDistance = 1
  controls.maxDistance = 8
  controls.target.set(0, 0, 0)

  // 动画循环
  animate()
  // 窗口监听
  window.addEventListener('resize', onResize)
}

// 加载模型（居中+缩放）
const loadModel = (url) => {
  if (currentModel) scene.remove(currentModel)

  const loader = new GLTFLoader()
  loader.load(
    url,
    (gltf) => {
      currentModel = gltf.scene
      scene.add(currentModel)

      // 双面显示
      currentModel.traverse((child) => {
        if (child.isMesh) child.material.side = THREE.DoubleSide
      })

      // 正确居中+缩放
      const box = new THREE.Box3().setFromObject(currentModel)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxSize = Math.max(...size.toArray())
      const scale = 2.2 / maxSize

      currentModel.scale.setScalar(scale)
      currentModel.position.sub(center.multiplyScalar(scale))
    },
    undefined,
    (err) => {
      console.error('模型加载失败：', err)
    }
  )
}

// 切换模型
const switchModel = (val) => {
  loadModel(modelMap[val])
}

// 渲染循环
const animate = () => {
  requestAnimationFrame(animate)
  if (controls) controls.update()
  renderer.render(scene, camera)
}

// 窗口适配
const onResize = () => {
  const container = canvasContainer.value
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// 生命周期
onMounted(() => {
  initThree()
  loadModel(modelMap.dougong1)
})

onUnmounted(() => {
  renderer?.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.detail-page {
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
.detail-page::before {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.canvas-container {
  width: 100%;
  height: 520px;
  background: #f9f5e9;
  border-radius: 8px;
  border: 1px solid #e0d5c0;
  position: relative;
  overflow: hidden;
}
.info-card {
  width: 100%;
  border-radius: 16px;
}
.part-selector {
  width: 100%;
  padding: 10px 0 20px;
  border-bottom: 1px dashed #e6c890;
}
:deep(.el-radio-group) {
  width: 100%;
}
:deep(.el-radio) {
  width: 100%;
  margin-bottom: 8px;
  font-size: 15px;
  color: #6d4c41;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: #8b4513;
  background: #8b4513;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #8b4513;
  font-weight: 600;
}
.part-detail {
  padding-top: 20px;
}
.part-title {
  font-size: 20px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 16px;
  padding-left: 8px;
  border-left: 3px solid #e6c890;
}
.part-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.stat-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  background: #f9f5e9;
  border-radius: 8px;
  border: 1px solid #e0d5c0;
}
.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
}
.stat-label {
  font-size: 13px;
  color: #795548;
}
.part-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.part-list li {
  font-size: 15px;
  color: #6d4c41;
  line-height: 2.2;
  padding-left: 8px;
  border-bottom: 1px dotted #f0e6d2;
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
  .detail-page {
    padding: 12px;
  }
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .canvas-container {
    height: 360px;
  }
  .part-stats {
    flex-direction: column;
    gap: 12px;
  }
}
@media (max-width: 1200px) {
  .canvas-container {
    height: 400px;
  }
}
</style>
