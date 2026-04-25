<template>
  <div class="walkthrough-page">
    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/walkthrough' }">
          <i class="iconfont icon-yuanjing" style="margin-right: 4px"></i>第一视角漫游
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-ceng" style="margin-right: 4px"></i>明五层
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="iconfont icon-ceng" style="margin-right: 12px; color: #8b4513"></i>
        第一视角漫游：明五层
      </h1>
      <p class="page-subtitle">沉浸式体验应县木塔明五层的内部结构与装饰</p>
    </div>

    <!-- 3D场景容器 -->
    <div class="scene-container" ref="sceneContainer">
      <div class="loading-overlay" v-if="!modelLoaded">
        <div class="loading-spinner"></div>
        <p>模型正在加载中</p>
      </div>
      <canvas ref="rendererCanvas" class="renderer-canvas"></canvas>
    </div>

    <!-- 控制按钮 -->
    <div class="controls-container">
      <div class="control-group">
        <h3>场景切换</h3>
        <div class="button-row">
          <el-button @click="navigateTo('/walkthrough/an4')" class="control-button">
            <i class="iconfont icon-ceng" style="margin-right: 8px"></i>
            切换到暗四层
          </el-button>
          <el-button @click="navigateTo('/walkthrough')" class="control-button secondary">
            <i class="iconfont icon-arrow-left" style="margin-right: 8px"></i>
            返回主页面
          </el-button>
        </div>
      </div>
      <div class="control-group">
        <h3>操作说明</h3>
        <ul class="control-list">
          <li>• 鼠标拖拽：旋转视角</li>
          <li>• 鼠标滚轮：缩放视角</li>
          <li>• 鼠标右键：平移视角</li>
          <li>• WASD/方向键：移动</li>
          <li>• 空格键：重置视角</li>
        </ul>
      </div>
      <div class="control-group">
        <h3>明五层科普</h3>
        <div class="科普-content">
          <p>应县木塔明五层是木塔的顶层，也是最精华的部分。这里供奉着释迦牟尼佛牙舍利，是木塔的核心所在。</p>
          <p>明五层的结构最为精巧，采用了独特的八角形布局，每面都有精美的窗户和门。从这里可以俯瞰应县全景，视野开阔。</p>
          <p>明五层的斗拱结构尤为复杂，共有240朵斗拱，展现了中国古代建筑的高超技艺。屋顶采用攒尖顶设计，上覆琉璃瓦，气势恢宏。</p>
          <p>作为木塔的最高点，明五层不仅是宗教活动的重要场所，也是观赏木塔整体结构的最佳位置。</p>
        </div>
      </div>
    </div>

    <!-- 模型加载错误提示 -->
    <el-dialog
      v-model="errorDialogVisible"
      title="模型加载失败"
      width="500px"
    >
      <div class="error-content">
        <p>无法加载模型文件 Ming5.glb，请检查文件是否存在。</p>
        <p>错误信息：{{ errorMessage }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="errorDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="retryLoadModel">重试</el-button>
        </span>
      </template>
    </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const router = useRouter()

// 场景容器
const sceneContainer = ref<HTMLElement | null>(null)
const rendererCanvas = ref<HTMLCanvasElement | null>(null)

// 状态
const modelLoaded = ref(false)
const errorDialogVisible = ref(false)
const errorMessage = ref('')

// Three.js对象
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let model: any = null
let animationId: number | null = null

// 导航到其他页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 初始化场景
const initScene = () => {
  if (!sceneContainer.value || !rendererCanvas.value) return

  const container = sceneContainer.value
  const canvas = rendererCanvas.value
  const width = container.clientWidth
  const height = container.clientHeight

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f5e9)
  scene.fog = new THREE.FogExp2(0xf9f5e9, 0.008)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 1.6, 3)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.target.set(0, 1.6, 0)
  controls.enableRotate = true
  controls.enableZoom = true
  controls.enablePan = true
  controls.zoomSpeed = 1.0
  controls.minDistance = 0.5
  controls.maxDistance = 10

  // 添加光源
  scene.add(new THREE.AmbientLight(0xffffff, 1.5))
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.0)
  mainLight.position.set(5, 10, 7)
  mainLight.castShadow = true
  scene.add(mainLight)
  const fillLight = new THREE.PointLight(0xffffff, 0.8)
  fillLight.position.set(0, 2, 0)
  scene.add(fillLight)

  // 添加地面
  const groundGeometry = new THREE.PlaneGeometry(50, 50)
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B7355, side: THREE.DoubleSide, roughness: 0.8, metalness: 0.1 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.1
  ground.receiveShadow = true
  scene.add(ground)

  // 加载模型
  loadModel()

  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (controls) {
      controls.update()
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  // 窗口大小调整
  const handleResize = () => {
    if (!sceneContainer.value || !camera || !renderer) return
    const width = sceneContainer.value.clientWidth
    const height = sceneContainer.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  window.addEventListener('resize', handleResize)

  // 键盘控制
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!camera) return

    const speed = 0.1
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        camera.position.z -= speed
        break
      case 'KeyS':
      case 'ArrowDown':
        camera.position.z += speed
        break
      case 'KeyA':
      case 'ArrowLeft':
        camera.position.x -= speed
        break
      case 'KeyD':
      case 'ArrowRight':
        camera.position.x += speed
        break
      case 'Space':
        camera.position.set(0, 1.6, 3)
        controls?.target.set(0, 1.6, 0)
        break
    }
  }
  window.addEventListener('keydown', handleKeyDown)

  return () => {
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('keydown', handleKeyDown)
  }
}

// 加载模型
const loadModel = () => {
  if (!scene) return

  const modelPath = '/Ming5.glb'
  const loader = new GLTFLoader()

  loader.load(
    modelPath,
    (gltf) => {
      if (!scene) return
      model = gltf.scene
      scene.add(model)

      // 调整模型大小和位置
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      // 调整模型大小
      const targetSize = 5
      const scale = targetSize / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(scale)

      // 计算模型底部位置
      const modelBottom = center.y - size.y / 2
      const groundLevel = 0
      const distanceToGround = groundLevel - (modelBottom * scale)

      // 居中模型，以模型最底层为水平面
      model.position.set(-center.x * scale, distanceToGround, -center.z * scale)

      // 添加阴影
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      modelLoaded.value = true
      console.log('明五层模型加载成功')
    },
    (xhr) => {
      console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`)
    },
    (error: Error) => {
      console.error('模型加载失败', error)
      errorMessage.value = error.message
      errorDialogVisible.value = true
    }
  )
}

// 重试加载模型
const retryLoadModel = () => {
  errorDialogVisible.value = false
  loadModel()
}

// 生命周期
onMounted(() => {
  initScene()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
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

/* 场景容器 */
.scene-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #f9f5e9;
  border-radius: 24px;
  border: 2px solid #e6c890;
  overflow: hidden;
  margin-bottom: 80px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.scene-container:hover {
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
}

/* 加载覆盖层 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(249, 245, 233, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  border-top-color: #8b4513;
  animation: spin 1s infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0 0 8px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.loading-hint {
  font-size: 16px;
  color: #795548;
  margin-top: 8px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

/* 渲染画布 */
.renderer-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* 控制容器 */
.controls-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.control-group {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border-radius: 24px;
  border: 2px solid #e6c890;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
}

.control-group h3 {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 24px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 按钮行容器 - 让两个按钮水平并排 */
.button-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.button-row .control-button {
  flex: 1;
  margin: 0;
}

.control-button {
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  text-align: center;
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
  background: linear-gradient(135deg, #802028, #a03025);
}

.control-button.secondary {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  color: #8b4513;
  border: 2px solid #e6c890;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-button.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(196, 147, 70, 0.2);
  border-color: #d4b17a;
}

.control-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.control-list li {
  font-size: 18px;
  color: #6d4c41;
  margin-bottom: 12px;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.科普-content {
  font-size: 18px;
  color: #6d4c41;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.科普-content p {
  margin: 0 0 16px 0;
  transition: all 0.3s ease;
}

.科普-content p:last-child {
  margin-bottom: 0;
}

/* 错误对话框 */
.error-content {
  padding: 24px 0;
}

.error-content p {
  margin: 0 0 16px 0;
  color: #6d4c41;
  line-height: 1.8;
  font-size: 16px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .controls-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .walkthrough-page {
    padding: 16px 16px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 18px;
  }
  
  .scene-container {
    height: 400px;
  }
  
  .control-group {
    padding: 24px;
  }
  
  .control-group h3 {
    font-size: 20px;
  }
  
  .control-list li {
    font-size: 16px;
  }
  
  /* 移动端按钮间距调整 */
  .button-row {
    gap: 12px;
  }
  
  .button-row .control-button {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>