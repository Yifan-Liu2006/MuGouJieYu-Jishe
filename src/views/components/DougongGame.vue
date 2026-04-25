<template>
  <div class="dougong-game">
    <h2 class="section-title">
      <i class="iconfont icon-youxi" style="margin-right: 8px; color: #8b4513"></i>
      斗拱拼装游戏
    </h2>
    <div class="game-container">
      <!-- 游戏说明 -->
      <div class="game-info">
        <h3 class="info-title">游戏规则</h3>
        <ul class="info-list">
          <li>使用鼠标拖拽斗拱部件到正确的位置</li>
          <li>每个部件都有特定的安装位置</li>
          <li>拼装完成后点击"检查"按钮验证</li>
          <li>计时完成，看看你能多快完成拼装</li>
        </ul>
        <div class="game-stats">
          <div class="stat-item">
            <span class="stat-label">时间：</span>
            <span class="stat-value">{{ formattedTime }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">分数：</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">进度：</span>
            <span class="stat-value">{{ completedParts }} / {{ totalParts }}</span>
          </div>
        </div>
        <div class="game-controls">
          <el-button class="chinese-btn primary" @click="startGame" :disabled="!modelLoaded">
            开始游戏
          </el-button>
          <el-button class="chinese-btn plain" @click="resetGame">
            重置游戏
          </el-button>
          <el-button class="chinese-btn plain" @click="checkGame">
            检查
          </el-button>
        </div>
        <div v-if="!modelLoaded" class="loading-warning">
          ⚠️ 模型加载中，请稍后...
        </div>
      </div>

      <!-- 3D游戏区域 -->
      <div class="game-3d-container">
        <div class="canvas-container" ref="canvasContainer">
          <div v-if="!modelLoaded" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>斗拱模型加载中...</p>
            <p class="loading-hint">请确保 /floor.glb 文件存在于 public 目录</p>
          </div>
          <canvas ref="gameCanvas" class="game-canvas" style="width:100%;height:100%"></canvas>
        </div>
        <div class="game-instructions">
          <h4>操作说明：</h4>
          <p>• 鼠标左键：选择并拖拽部件</p>
          <p>• 鼠标右键：旋转视角</p>
          <p>• 鼠标滚轮：缩放视角</p>
          <p>• 空格键：重置视角</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// 状态变量
const canvasContainer = ref<HTMLElement | null>(null)
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const modelLoaded = ref(false)
const gameStarted = ref(false)
const gameCompleted = ref(false)
const startTime = ref(0)
const elapsedTime = ref(0)
const score = ref(0)
const completedParts = ref(0)
const totalParts = ref(0)

// 3D场景变量
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let model: any = null
let animationId: number | null = null

// 部件相关
let parts: THREE.Mesh[] = []
let draggedPart: THREE.Mesh | null = null
let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
let originalPositions: Map<THREE.Mesh, THREE.Vector3> = new Map()
let targetPositions: Map<THREE.Mesh, THREE.Vector3> = new Map()
let isDragging = false

// 计时器
let timerInterval: number | NodeJS.Timeout | null = null

// 计算属性
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = Math.floor(elapsedTime.value % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 创建测试立方体（当模型加载失败时使用）
const createTestParts = () => {
  if (!scene) return
  
  // 创建几个测试用的立方体部件
  const colors = [0x8B4513, 0xA0522D, 0xCD853F, 0xDEB887]
  const positions = [
    { x: -0.5, y: 0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 },
    { x: 0, y: 0.5, z: -0.5 },
    { x: 0, y: 0.5, z: 0.5 }
  ]
  const targetPositionsList = [
    { x: -1, y: 0.5, z: 0 },
    { x: 1, y: 0.5, z: 0 },
    { x: 0, y: 0.5, z: -1 },
    { x: 0, y: 0.5, z: 1 }
  ]
  
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const material = new THREE.MeshStandardMaterial({ color: colors[i % colors.length] })
    const cube = new THREE.Mesh(geometry, material)
    cube.name = `part_${i}`
    cube.position.set(positions[i].x, positions[i].y, positions[i].z)
    cube.castShadow = true
    cube.userData = { isDraggable: true, targetPos: new THREE.Vector3(targetPositionsList[i].x, targetPositionsList[i].y, targetPositionsList[i].z) }
    
    scene.add(cube)
    parts.push(cube)
    originalPositions.set(cube, cube.position.clone())
    targetPositions.set(cube, new THREE.Vector3(targetPositionsList[i].x, targetPositionsList[i].y, targetPositionsList[i].z))
  }
  
  totalParts.value = parts.length
  modelLoaded.value = true
  console.log('使用测试部件，共', parts.length, '个')
}

// 初始化场景
const initScene = () => {
  if (!canvasContainer.value || !gameCanvas.value) return

  const container = canvasContainer.value
  const canvas = gameCanvas.value
  const width = container.clientWidth
  const height = container.clientHeight

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f5e9)
  scene.fog = new THREE.FogExp2(0xf9f5e9, 0.008)

  // 创建相机
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(3, 2, 4)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.target.set(0, 0.5, 0)
  controls.enableZoom = true
  controls.zoomSpeed = 1.2

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
  scene.add(ambientLight)
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5)
  mainLight.position.set(5, 10, 7)
  mainLight.castShadow = true
  scene.add(mainLight)
  
  const fillLight = new THREE.PointLight(0x8866aa, 0.5)
  fillLight.position.set(0, 2, 0)
  scene.add(fillLight)

  // 添加地面参考
  const gridHelper = new THREE.GridHelper(8, 20, 0x8b4513, 0xe6c890)
  gridHelper.position.y = -0.5
  gridHelper.material.transparent = true
  ;(gridHelper.material as THREE.Material).opacity = 0.4
  scene.add(gridHelper)

  // 尝试加载模型
  const loader = new GLTFLoader()
  loader.load(
    '/floor.glb',
    (gltf) => {
      model = gltf.scene
      scene?.add(model)
      
      // 调整模型大小
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const scale = 2 / Math.max(size.x, size.y, size.z)
      model.scale.setScalar(scale)
      
      // 居中
      const center = box.getCenter(new THREE.Vector3())
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
      
      // 处理模型部件
      processModelParts()
      
      modelLoaded.value = true
      console.log('斗拱模型加载成功')
    },
    (xhr) => {
      console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`)
    },
    (err) => {
      console.warn('模型加载失败，使用测试部件', err)
      createTestParts()
    }
  )



  // 鼠标事件
  canvas.addEventListener('mousedown', onMouseDown)
  canvas.addEventListener('mousemove', onMouseMove)
  canvas.addEventListener('mouseup', onMouseUp)
  canvas.addEventListener('mouseleave', onMouseUp)
  
  // 键盘事件
  window.addEventListener('keydown', onKeyDown)

  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    
    if (controls) controls.update()
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }
  animate()

  // 窗口大小调整
  const handleResize = () => {
    if (!canvasContainer.value || !camera || !renderer) return
    const w = canvasContainer.value.clientWidth
    const h = canvasContainer.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)
}

// 处理模型部件
const processModelParts = () => {
  if (!model) return

  parts = []
  originalPositions.clear()
  targetPositions.clear()

  model.traverse((child) => {
    if (child.isMesh) {
      const mesh = child as THREE.Mesh
      parts.push(mesh)
      originalPositions.set(mesh, mesh.position.clone())
      
      // 设置目标位置（可以在编辑器中预设，这里简单使用原始位置）
      targetPositions.set(mesh, mesh.position.clone())
      
      // 添加阴影
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  totalParts.value = parts.length
  modelLoaded.value = true
  console.log(`找到 ${parts.length} 个部件`)
}

// 鼠标事件
const onMouseDown = (event: MouseEvent) => {
  if (!scene || !camera || !gameStarted.value || gameCompleted.value) return
  if (event.button !== 0) return // 只响应左键

  const rect = gameCanvas.value?.getBoundingClientRect()
  if (!rect) return
  
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(parts)

  if (intersects.length > 0) {
    draggedPart = intersects[0].object as THREE.Mesh
    isDragging = true
    console.log('开始拖拽:', draggedPart.name)
    
    // 禁用 OrbitControls 拖拽
    if (controls) controls.enabled = false
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (!scene || !camera || !isDragging || !draggedPart) return

  const rect = gameCanvas.value?.getBoundingClientRect()
  if (!rect) return
  
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  
  // 射线与平面相交
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const intersectPoint = new THREE.Vector3()
  
  if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
    draggedPart.position.copy(intersectPoint)
  }
}

const onMouseUp = () => {
  if (!draggedPart) return

  const targetPos = targetPositions.get(draggedPart)
  if (targetPos) {
    const distance = draggedPart.position.distanceTo(targetPos)
    if (distance < 0.3) {
      draggedPart.position.copy(targetPos)
      if (!gameCompleted.value) {
        completedParts.value++
        score.value = Math.floor(completedParts.value / totalParts.value * 100)
      }
      console.log('部件放置成功:', draggedPart.name)
    } else {
      const originalPos = originalPositions.get(draggedPart)
      if (originalPos) draggedPart.position.copy(originalPos)
    }
  } else {
    const originalPos = originalPositions.get(draggedPart)
    if (originalPos) draggedPart.position.copy(originalPos)
  }

  isDragging = false
  draggedPart = null
  
  // 恢复 OrbitControls
  if (controls) controls.enabled = true
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    event.preventDefault()
    if (camera) camera.position.set(3, 2, 4)
    if (controls) controls.target.set(0, 0.5, 0)
  }
}

const startGame = () => {
  if (!modelLoaded.value) return
  
  gameStarted.value = true
  gameCompleted.value = false
  startTime.value = Date.now()
  elapsedTime.value = 0
  score.value = 0
  completedParts.value = 0
  
  // 打乱部件位置
  parts.forEach(part => {
    const randomX = (Math.random() - 0.5) * 3
    const randomY = Math.random() * 1.5
    const randomZ = (Math.random() - 0.5) * 3
    part.position.set(randomX, randomY, randomZ)
  })
  
  // 计时器
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (gameStarted.value && !gameCompleted.value) {
      elapsedTime.value++
    }
  }, 1000)
  
  console.log('游戏开始')
}

const resetGame = () => {
  gameStarted.value = false
  gameCompleted.value = false
  if (timerInterval) clearInterval(timerInterval)
  elapsedTime.value = 0
  score.value = 0
  completedParts.value = 0
  
  // 重置部件位置
  parts.forEach(part => {
    const originalPos = originalPositions.get(part)
    if (originalPos) part.position.copy(originalPos)
  })
  
  console.log('游戏重置')
}

const checkGame = () => {
  if (!gameStarted.value) return
  
  let allCorrect = true
  parts.forEach(part => {
    const targetPos = targetPositions.get(part)
    if (targetPos) {
      const distance = part.position.distanceTo(targetPos)
      if (distance >= 0.2) allCorrect = false
    }
  })
  
  if (allCorrect) {
    gameCompleted.value = true
    if (timerInterval) clearInterval(timerInterval)
    completedParts.value = totalParts.value
    score.value = Math.max(0, 1000 - Math.floor(elapsedTime.value * 5))
    console.log('🎉 游戏完成！得分：', score.value)
  } else {
    console.log('还有部件未正确放置')
  }
}

// 生命周期
onMounted(() => {
  initScene()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (timerInterval) clearInterval(timerInterval)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.dougong-game {
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

.game-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
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

.game-info {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.game-info:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.info-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 24px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.info-list {
  margin: 0 0 32px 0;
  padding-left: 24px;
}

.info-list li {
  font-size: 18px;
  color: #6d4c41;
  margin-bottom: 12px;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.game-stats {
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(145deg, #f8f9fa, #f0e6d2);
  border-radius: 16px;
  border: 1px solid #e6c890;
  transition: all 0.3s ease;
}

.game-stats:hover {
  border-color: #d4b17a;
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.15);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 18px;
  color: #6d4c41;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #8b4513;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading-warning {
  margin-top: 16px;
  padding: 16px;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  font-size: 16px;
  color: #856404;
  text-align: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.game-3d-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.canvas-container {
  flex: 1;
  background: linear-gradient(145deg, #f9f5e9, #f0e6d2);
  border-radius: 24px;
  position: relative;
  min-height: 500px;
  overflow: hidden;
  border: 2px solid #e6c890;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.canvas-container:hover {
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 10;
  border-radius: 24px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffaa66;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 24px;
}

.loading-overlay p {
  font-size: 18px;
  color: #fff;
  margin: 0 0 8px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.loading-hint {
  font-size: 16px;
  color: #aaa;
  margin-top: 8px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.game-instructions {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border: 2px solid #e6c890;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.game-instructions:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

.game-instructions h4 {
  font-size: 20px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 20px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.game-instructions p {
  font-size: 16px;
  color: #6d4c41;
  margin: 0 0 12px 0;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.chinese-btn {
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.chinese-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.chinese-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
}

.chinese-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chinese-btn.plain {
  border-color: #e6c890;
  color: #6d4c41;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.15);
}

.chinese-btn.plain:hover {
  border-color: #8b4513;
  color: #8b4513;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(196, 147, 70, 0.25);
}

@media (max-width: 1200px) {
  .game-container {
    grid-template-columns: 1fr;
  }
  .game-info {
    width: 100%;
  }
  .game-controls {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }
  .chinese-btn {
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .canvas-container {
    min-height: 400px;
  }
  .game-controls {
    flex-direction: column;
  }
  .chinese-btn {
    width: 100%;
  }
  .game-info {
    padding: 24px;
  }
  .game-instructions {
    padding: 24px;
  }
  .info-title {
    font-size: 20px;
  }
  .info-list li {
    font-size: 16px;
  }
  .stat-label,
  .stat-value {
    font-size: 16px;
  }
  .game-instructions h4 {
    font-size: 18px;
  }
  .game-instructions p {
    font-size: 14px;
  }
}
</style>