<template>
  <div ref="sceneContainer" class="scene-3d-container" tabindex="0"> </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// ============ 核心类型守卫 ============
function getStandardMaterial(
  material: THREE.Material | THREE.Material[]
): THREE.MeshStandardMaterial | null {
  if (Array.isArray(material)) {
    const firstMat = material.find((mat) => mat instanceof THREE.MeshStandardMaterial)
    return firstMat || null
  }
  if (material instanceof THREE.MeshStandardMaterial) {
    return material
  }
  return null
}

// ============ 事件发射器 ============
const emit = defineEmits<{
  (e: 'partHover', info: { name: string; type: string; stress: string; partType: string }): void
  (e: 'partClick', info: { name: string; type: string; stress: string }): void
  (e: 'earthquakeStart', level: number): void
  (e: 'earthquakeStop'): void
  (e: 'windStart', level: number): void
  (e: 'windStop'): void
  (e: 'showKnowledge', title: string, content: string): void
  (e: 'modelLoaded'): void
}>()

// ============ DOM 引用 ============
const sceneContainer = ref<HTMLDivElement | null>(null)

// ============ Three.js 核心对象 ============
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number | null = null

// 🔥 新增：存储初始相机/控制器位置（用于重置视角）
const initialCameraPos = new THREE.Vector3()
const initialControlsTarget = new THREE.Vector3()

// ============ 部件存储 严格类型 ============
const partsMap = new Map<string, THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>>()
const originalColorsForPart = new Map<THREE.Mesh, THREE.Color>()
const originalPositionsForShake = new Map<THREE.Mesh, THREE.Vector3>()
const originalRotationsForShake = new Map<THREE.Mesh, THREE.Euler>()

// ============ 状态变量 ============
let currentHighlighted: THREE.Mesh | null = null
let currentDisassembledPart: THREE.Mesh | null = null
let disassembleTimer: NodeJS.Timeout | null = null

let isAnimating = false
let animatedPart: THREE.Mesh | null = null
let animationStart = 0
let animationType: 'none' | 'disassemble' | 'reset' = 'none'
const partStates = new Map<THREE.Mesh, { position: THREE.Vector3; scale: THREE.Vector3 }>()

let shakeAnimationId: number | null = null
let isShakingActive = false
let isWindTesting = false
let currentWindIntensity = 1.0

let isEarthquakeTesting = false
let earthquakeStartTime = 0
let currentEarthquakeIntensity = 1.0

const coloredState = {
  DouGong: false,
  Column: false,
  Bracing: false,
  Wall: false
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// ============ 数据存储 ============
let earthquakeData: Record<string, any> | null = null
let mechanicsData: Record<string, any> | null = null
let windData: Record<string, any> | null = null



// ============ 部件类型配置 🔥 强化差异化振幅 ============
const partTypeConfig: Record<
  string,
  {
    name: string
    color: number
    shakeAmplitude: number
    shakeFrequency: number
    description: string
  }
> = {
  Column: {
    name: '柱子',
    color: 0x0066ff,
    shakeAmplitude: 0.35,
    shakeFrequency: 0.7,
    description: '柱子柔性摆动，消耗地震能量，柱根摩擦耗散震动'
  },
  DouGong: {
    name: '斗拱',
    color: 0x00ff00,
    shakeAmplitude: 0.45,
    shakeFrequency: 1.0,
    description: '斗拱通过摩擦和错动消耗地震能量，是抗震关键部件'
  },
  Bracing: {
    name: '梁枋',
    color: 0xff6600,
    shakeAmplitude: 0.25,
    shakeFrequency: 0.9,
    description: '梁枋连接柱子形成刚性环，传递水平力'
  },
  Wall: {
    name: '墙体',
    color: 0xffdd00,
    shakeAmplitude: 0.05,
    shakeFrequency: 1.8,
    description: '墙体不承重，墙倒屋不塌'
  },
  Windows: {
    name: '窗户',
    color: 0xddbb77,
    shakeAmplitude: 0.1,
    shakeFrequency: 1.3,
    description: '花格窗，装饰性构件'
  },
  Door: {
    name: '门',
    color: 0xccaa66,
    shakeAmplitude: 0.1,
    shakeFrequency: 1.3,
    description: '实心板门，装饰性构件'
  }
}

const partsByType: Record<string, THREE.Mesh[]> = {
  Column: [],
  DouGong: [],
  Bracing: [],
  Wall: [],
  Windows: [],
  Door: []
}

const ALL_TYPES = ['Column', 'DouGong', 'Bracing', 'Wall', 'Windows', 'Door']

// ============ 数据加载 ============
async function loadData() {
  try {
    const [earthquakeRes, mechanicsRes, windRes] = await Promise.all([
      fetch('/earthquake-data.json')
        .then((r) => r.json())
        .catch(() => null),
      fetch('/mechanics-data.json')
        .then((r) => r.json())
        .catch(() => null),
      fetch('/wind-data.json')
        .then((r) => r.json())
        .catch(() => null)
    ])
    earthquakeData = earthquakeRes
    mechanicsData = mechanicsRes
    windData = windRes
    console.log('✅ 数据加载成功')
  } catch (error) {
    console.error('数据加载失败:', error)
  }
}

// ============ 知识科普 ============
function getEarthquakeKnowledge(): string {
  let content = '<div style="font-family: monospace; line-height: 1.6;">'
  content += '<h3 style="color: #ffaa66;">⚠️ 抗震性能分析</h3>'
  if (earthquakeData?.records) {
    const modalRecords = earthquakeData.records.filter((r: any) => r.scenario === '模态分析')
    if (modalRecords.length > 0) {
      content += '<div style="margin: 10px 0;"><strong>📊 模态周期数据：</strong></div>'
      modalRecords.slice(0, 5).forEach((r: any) => {
        if (r.period)
          content += `<div style="margin-left: 10px;">• ${r.note || `周期 T = ${r.period}s`}</div>`
      })
    }
    const siteRecord = earthquakeData.records.find((r: any) => r.scenario === '抗震设防参数')
    if (siteRecord) {
      content += '<div style="margin: 10px 0;"><strong>🏗️ 抗震设防参数：</strong></div>'
      if (siteRecord.note) content += `<div style="margin-left: 10px;">• ${siteRecord.note}</div>`
    }
  }
  content += '<div style="margin-top: 15px;"><strong>🔧 抗震原理：</strong></div>'
  content += '<div style="margin-left: 10px;">• 斗拱耗能：通过摩擦和错动消耗地震能量</div>'
  content += '<div style="margin-left: 10px;">• 柱子柔性：柱子不是刚性固定，可轻微摆动</div>'
  content += '<div style="margin-left: 10px;">• 梁枋传力：形成"圈梁"效应，均匀传递水平力</div>'
  content += '<div style="margin-left: 10px;">• 墙体不承重："墙倒屋不塌"</div>'
  return content + '</div>'
}
function getWindKnowledge(): string {
  let content = '<div style="font-family: monospace; line-height: 1.6;">'
  content += '<h3 style="color: #ffaa66;">🌬️ 风荷载分析</h3>'
  if (windData?.records) {
    content += '<div style="margin: 10px 0;"><strong>📊 风荷载数据：</strong></div>'
    windData.records.forEach((r: any) => {
      if (r.position && r.QTotal)
        content += `<div style="margin-left: 10px;">• ${r.position}：剪力 Q=${r.QTotal} kN，弯矩 M=${r.MTotal || 0} kN·m</div>`
      else if (r.position)
        content += `<div style="margin-left: 10px;">• ${r.position}：高度 ${r.height}m</div>`
    })
  }
  content += '<div style="margin-top: 15px;"><strong>🏗️ 风振响应：</strong></div>'
  content += '<div style="margin-left: 10px;">• 木塔体型系数较大，风荷载显著</div>'
  content += '<div style="margin-left: 10px;">• 斗拱和梁枋的柔性连接有效耗散风能</div>'
  content += '<div style="margin-left: 10px;">• 整体结构刚度分布均匀，抗风性能良好</div>'
  return content + '</div>'
}
function getPartKnowledge(partType: string): string {
  let content = '<div style="font-family: monospace; line-height: 1.6;">'
  if (partType === 'Column') {
    content += '<h3 style="color: #ffaa66;">🏛️ 柱子结构系统</h3><p>柱子是木塔的垂直承重构件</p>'
    if (mechanicsData?.records) {
      const stiffnessRecords = mechanicsData.records.filter((r: any) => r.dataType === '刚度')
      if (stiffnessRecords.length > 0) {
        content += '<div style="margin: 10px 0;"><strong>📐 实测刚度数据：</strong></div>'
        stiffnessRecords.forEach(
          (r: any) => (content += `<div style="margin-left: 10px;">• ${r.note}</div>`)
        )
      }
    }
    content +=
      '<div style="margin-top: 15px;"><strong>🔧 抗震作用：</strong></div><div style="margin-left: 10px;">• 柔性承重</div><div style="margin-left: 10px;">• 柱根摩擦耗散</div><div style="margin-left: 10px;">• 错开共振频率</div>'
  } else if (partType === 'DouGong') {
    content += '<h3 style="color: #ffaa66;">🏛️ 斗拱结构系统</h3><p>木塔抗震核心</p>'
    if (mechanicsData?.records) {
      const dampingRecords = mechanicsData.records.filter((r: any) => r.dataType === '等效阻尼')
      if (dampingRecords.length > 0) {
        content += '<div style="margin: 10px 0;"><strong>📊 实测阻尼数据：</strong></div>'
        dampingRecords.forEach(
          (r: any) => (content += `<div style="margin-left: 10px;">• ${r.note}</div>`)
        )
      }
    }
    content +=
      '<div style="margin-top: 15px;"><strong>🔧 抗震作用：</strong></div><div style="margin-left: 10px;">• 天然减震器</div><div style="margin-left: 10px;">• 摩擦耗能</div><div style="margin-left: 10px;">• 柔性连接</div>'
  } else if (partType === 'Bracing') {
    content += '<h3 style="color: #ffaa66;">🏛️ 梁枋结构系统</h3><p>水平连接构件</p>'
    content +=
      '<div style="margin-top: 15px;"><strong>🔧 抗震作用：</strong></div><div style="margin-left: 10px;">• 圈梁效应</div><div style="margin-left: 10px;">• 传递水平力</div><div style="margin-left: 10px;">• 整体稳定</div>'
  } else if (partType === 'Wall') {
    content += '<h3 style="color: #ffaa66;">🏛️ 墙体结构系统</h3><p>围护构件，墙倒屋不塌</p>'
    content +=
      '<div style="margin-top: 15px;"><strong>🔧 抗震作用：</strong></div><div style="margin-left: 10px;">• 不承重</div><div style="margin-left: 10px;">• 填充耗能</div><div style="margin-left: 10px;">• 柔性变形</div>'
  } else {
    content += '<h3 style="color: #ffaa66;">🏛️ 建筑构件</h3><p>装饰性构件</p>'
  }
  return content + '</div>'
}
function showKnowledgePanel(title: string, content: string) {
  emit('showKnowledge', title, content)
}

// ============ 辅助函数 ============
function getPartType(partName: string): string {
  if (!partName) return 'Other'
  const lowerName = partName.toLowerCase()
  if (lowerName.includes('column')) return 'Column'
  if (lowerName.includes('dougong') || lowerName.includes('bracket')) return 'DouGong'
  if (lowerName.includes('bracing') || lowerName.includes('beam')) return 'Bracing'
  if (lowerName.includes('wall')) return 'Wall'
  if (lowerName.includes('window')) return 'Windows'
  if (lowerName.includes('door')) return 'Door'
  return 'Other'
}
function getPartDisplayName(partName: string): string {
  const type = getPartType(partName)
  return partTypeConfig[type]?.name || '构件'
}
function getPartStress(partName: string): string {
  const type = getPartType(partName)
  const stressMap: Record<string, string> = {
    Column: '中等',
    DouGong: '高',
    Bracing: '中等',
    Wall: '低',
    Windows: '低',
    Door: '低'
  }
  return stressMap[type] || '未知'
}
function parsePartInfo(partName: string) {
  const type = getPartType(partName)
  const typeNameMap: Record<string, string> = {
    Column: '柱体',
    DouGong: '斗拱',
    Bracing: '梁枋',
    Wall: '墙体',
    Windows: '窗户',
    Door: '门'
  }
  const displayName = getPartDisplayName(partName)
  return { name: displayName, type: typeNameMap[type] || '其他' }
}

// ============ 高亮功能 ============
function highlightPart(mesh: THREE.Mesh) {
  const material = getStandardMaterial(mesh.material)
  if (!material) return
  material.emissive = new THREE.Color(0xffaa66)
  material.emissiveIntensity = 0.5
}
function resetHighlight(mesh: THREE.Mesh) {
  const material = getStandardMaterial(mesh.material)
  if (!material) return
  material.emissive = new THREE.Color(0x000000)
  material.emissiveIntensity = 0
}

// ============ 拆解动画 🔥 核心修复 ============
function disassemblePart(mesh: THREE.Mesh) {
  if (isAnimating) return

  // 🔥 修复1：点击新部件前，强制重置所有高亮状态
  if (currentHighlighted && currentHighlighted !== mesh) {
    resetHighlight(currentHighlighted)
    currentHighlighted = null
  }

  if (animatedPart) {
    resetPart()
    setTimeout(() => startDisassemble(mesh), 300)
  } else startDisassemble(mesh)
}
function startDisassemble(mesh: THREE.Mesh) {
  if (partStates.has(mesh)) return
  if (disassembleTimer) clearTimeout(disassembleTimer)
  currentDisassembledPart = mesh

  // 🔥 修复2：彻底移除点击高亮（已注释）
  // highlightPart(mesh)

  isAnimating = true
  animatedPart = mesh
  animationType = 'disassemble'
  animationStart = performance.now()
  partStates.set(mesh, { position: mesh.position.clone(), scale: mesh.scale.clone() })
  const info = parsePartInfo(mesh.name || '')
  emit('partClick', { name: info.name, type: info.type, stress: getPartStress(mesh.name || '') })
  const partType = getPartType(mesh.name || '')
  showKnowledgePanel(`${info.type}结构知识`, getPartKnowledge(partType))
  disassembleTimer = setTimeout(() => (disassembleTimer = null), 3000)
}
function resetPart() {
  if (!animatedPart) return
  if (disassembleTimer) clearTimeout(disassembleTimer)

  // 🔥 修复3：重置时彻底清除高亮
  resetHighlight(animatedPart)
  if (currentHighlighted === animatedPart) {
    currentHighlighted = null
  }

  currentDisassembledPart = null
  isAnimating = true
  animationType = 'reset'
  animationStart = performance.now()
}
function updateAnimation() {
  if (!isAnimating || !animatedPart) return
  const elapsed = performance.now() - animationStart
  const duration = 300
  const progress = Math.min(1, elapsed / duration)
  const ease = 1 - (1 - progress) * (1 - progress)
  const originalState = partStates.get(animatedPart)
  if (!originalState) return
  if (animationType === 'disassemble') {
    animatedPart.position.y = originalState.position.y + 0.15 * ease
    animatedPart.scale.multiplyScalar(1 + 0.05 * ease)
    if (progress >= 1) isAnimating = false
  } else if (animationType === 'reset') {
    animatedPart.position.lerp(originalState.position, ease)
    animatedPart.scale.lerp(originalState.scale, ease)
    if (progress >= 1) {
      animatedPart.position.copy(originalState.position)
      animatedPart.scale.copy(originalState.scale)
      partStates.delete(animatedPart)
      animatedPart = null
      isAnimating = false
      animationType = 'none'
    }
  }
}

// ============ 上色功能 🔥 修复状态冲突 ============
function toggleColorByType(type: string) {
  const config = partTypeConfig[type]
  if (!config) return
  const parts = partsByType[type] || []

  if (!coloredState[type as keyof typeof coloredState]) {
    for (const part of parts) {
      const material = getStandardMaterial(part.material)
      if (!material) continue
      if (!originalColorsForPart.has(part)) originalColorsForPart.set(part, material.color.clone())
      material.color.set(config.color)
      material.emissive.set(config.color)
      material.emissiveIntensity = 0.8
    }
    coloredState[type as keyof typeof coloredState] = true
  } else {
    for (const part of parts) {
      const material = getStandardMaterial(part.material)
      if (!material) continue
      if (originalColorsForPart.has(part)) material.color.copy(originalColorsForPart.get(part)!)
      material.emissive.set(0x000000)
      material.emissiveIntensity = 0
    }
    coloredState[type as keyof typeof coloredState] = false
  }
}

// ============ 风振测试 🔥 严格启停 ============
function startWindTest(intensity: number) {
  if (isWindTesting) return
  currentWindIntensity = intensity
  isShakingActive = true
  isWindTesting = true
  const startTime = performance.now()

  partsMap.forEach((part) => {
    if (!originalPositionsForShake.has(part))
      originalPositionsForShake.set(part, part.position.clone())
    if (!originalRotationsForShake.has(part))
      originalRotationsForShake.set(part, part.rotation.clone())
  })

  function animateShake(now: number) {
    if (!isShakingActive) return
    const elapsed = now - startTime
    if (elapsed >= 5000) {
      stopWindTest()
      showKnowledgePanel('🌬️ 风荷载与风振分析', getWindKnowledge())
      return
    }
    const t = elapsed / 5000
    const factor = 1 - t * 0.5
    partsMap.forEach((part, name) => {
      const cfg = partTypeConfig[getPartType(name)]
      const pos = originalPositionsForShake.get(part)
      const rot = originalRotationsForShake.get(part)
      if (!cfg || !pos || !rot) return
      const amp = cfg.shakeAmplitude * currentWindIntensity * factor * 3
      part.position.x = pos.x + Math.sin(now * 0.005 * cfg.shakeFrequency) * amp
      part.position.z = pos.z + Math.cos(now * 0.004 * cfg.shakeFrequency) * amp * 0.7

      if (cfg.name === '斗拱' || cfg.name === '柱子') {
        part.rotation.y = rot.y + Math.sin(now * 0.003) * amp * 0.2
      }
    })
    shakeAnimationId = requestAnimationFrame(animateShake)
  }
  shakeAnimationId = requestAnimationFrame(animateShake)
  emit('windStart', intensity)
}

// 🔥 新增：严格停止风振测试
function stopWindTest() {
  if (shakeAnimationId) cancelAnimationFrame(shakeAnimationId)
  isShakingActive = false
  isWindTesting = false
  partsMap.forEach((part) => {
    const p = originalPositionsForShake.get(part)
    const r = originalRotationsForShake.get(part)
    if (p) part.position.copy(p)
    if (r) part.rotation.copy(r)
  })
  emit('windStop')
}

// ============ 抗震测试 🔥 严格启停 ============
function startEarthquakeTest(level: number) {
  if (isEarthquakeTesting) return
  currentEarthquakeIntensity = level * 2.0
  isEarthquakeTesting = true
  earthquakeStartTime = performance.now()

  partsMap.forEach((part) => {
    if (!part.userData.originalPosition) {
      part.userData.originalPosition = part.position.clone()
      part.userData.originalRotation = part.rotation.clone()
    }
  })
  emit('earthquakeStart', level)

  setTimeout(() => {
    if (isEarthquakeTesting) {
      stopEarthquakeTest()
      showKnowledgePanel('⚠️ 抗震性能分析报告', getEarthquakeKnowledge())
    }
  }, 10000)
}

// 🔥 新增：严格停止抗震测试
function stopEarthquakeTest() {
  isEarthquakeTesting = false
  partsMap.forEach((part) => {
    if (part.userData.originalPosition) part.position.copy(part.userData.originalPosition)
    if (part.userData.originalRotation) part.rotation.copy(part.userData.originalRotation)
  })
  emit('earthquakeStop')
}

// 🔥 强化地震更新函数
function updateEarthquake() {
  if (!isEarthquakeTesting) return
  const elapsed = (performance.now() - earthquakeStartTime) / 1000
  const intensityScale = Math.min(1.5, elapsed / 2)
  const baseAmp = 0.15 * currentEarthquakeIntensity * intensityScale

  partsMap.forEach((part, name) => {
    const orig = part.userData.originalPosition as THREE.Vector3
    const origRot = part.userData.originalRotation as THREE.Euler
    if (!orig || !origRot) return
    const type = getPartType(name)
    const config = partTypeConfig[type]
    if (!config) return

    const amp = baseAmp * config.shakeAmplitude
    const randomShake = (Math.random() - 0.5) * 0.5
    part.position.x = orig.x + Math.sin(elapsed * 6) * amp + randomShake
    part.position.z = orig.z + Math.cos(elapsed * 5) * amp * 0.6 + randomShake

    if (type === 'DouGong' || type === 'Column') {
      part.rotation.z = origRot.z + Math.sin(elapsed * 4) * amp * 0.4
    }
  })
}

// ============ 鼠标交互 🔥 修复悬停与点击冲突 ============
function onMouseMove(event: MouseEvent) {
  if (!sceneContainer.value || partsMap.size === 0) return
  const rect = sceneContainer.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(partsMap.values()))

  // 🔥 修复4：如果有正在拆解的部件，不显示悬停高亮
  if (currentDisassembledPart) {
    if (currentHighlighted && currentHighlighted !== currentDisassembledPart) {
      resetHighlight(currentHighlighted)
      currentHighlighted = null
    }
    return
  }

  if (currentHighlighted) {
    resetHighlight(currentHighlighted)
    currentHighlighted = null
  }

  if (intersects.length > 0) {
    const hit = intersects[0].object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
    currentHighlighted = hit
    highlightPart(hit)
    const info = parsePartInfo(hit.name || '')
    const partType = getPartType(hit.name || '')
    emit('partHover', {
      name: info.name,
      type: info.type,
      stress: getPartStress(hit.name || ''),
      partType: partType
    })
  } else {
    emit('partHover', { name: '', type: '', stress: '', partType: '' })
  }
}

function onClick(event: MouseEvent) {
  if (isAnimating || isEarthquakeTesting || isWindTesting || partsMap.size === 0) return
  if (!sceneContainer.value) return
  const rect = sceneContainer.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(partsMap.values()))
  if (intersects.length > 0) {
    const hit = intersects[0].object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
    disassemblePart(hit)
  } else if (animatedPart) {
    resetPart()
  }
}



// 🔥 新增：重置视角函数（核心功能）
const resetView = () => {
  if (!camera || !controls) return
  // 恢复初始相机位置 + 控制器目标
  camera.position.copy(initialCameraPos)
  controls.target.copy(initialControlsTarget)
  controls.update()
}

// ============ 初始化 ============
function initScene() {
  if (!sceneContainer.value) return
  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f5e9) // 与页面背景一致
  scene.fog = new THREE.FogExp2(0xf9f5e9, 0.003)

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(8, 6, 12)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  sceneContainer.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.target.set(0, 3.5, 0)

  // 模拟自然环境光
  scene.add(new THREE.AmbientLight(0xffffff, 1.5)) // 增强环境光
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5) // 增强主光源
  mainLight.position.set(5, 10, 7)
  mainLight.castShadow = true
  scene.add(mainLight)
  const backLight = new THREE.DirectionalLight(0xffffff, 1.0) // 增强背光
  backLight.position.set(-3, 2, -5)
  scene.add(backLight)
  const fillLight = new THREE.PointLight(0xffffff, 0.8) // 增强填充光
  fillLight.position.set(0, 1, 0)
  scene.add(fillLight)

  // 调整网格颜色，与新背景协调
  const grid = new THREE.GridHelper(20, 20, 0x8b4513, 0xe6c890)
  grid.position.y = -0.5
  grid.material.transparent = true
  grid.material.opacity = 0.3
  scene.add(grid)

  new GLTFLoader().load(
    '/YingXian.glb',
    (gltf) => {
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const scale = 10 / Math.max(...box.getSize(new THREE.Vector3()).toArray())
      model.scale.setScalar(scale)
      scene.add(model)

      model.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
          partsMap.set(mesh.name || mesh.uuid, mesh)
          const mat = getStandardMaterial(mesh.material)
          if (mat?.color) originalColorsForPart.set(mesh, mat.color.clone())
          const type = getPartType(mesh.name)
          partsByType[type]?.push(mesh)
        }
      })

      const newBox = new THREE.Box3().setFromObject(model)
      const center = newBox.getCenter(new THREE.Vector3())
      const distance = Math.max(...newBox.getSize(new THREE.Vector3()).toArray()) * 2
      camera.position.set(distance * 1.2, distance * 0.8, distance * 1.5)
      controls.target.copy(center)

      // 🔥 保存模型加载后的初始位置（重置视角用）
      initialCameraPos.copy(camera.position)
      initialControlsTarget.copy(controls.target)

      controls.update()
      console.log(`✅ 模型加载成功，部件数: ${partsMap.size}`)
      // 触发模型加载完成事件
      emit('modelLoaded')
    },
    (xhr) => console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`),
    (err) => console.error('模型加载失败', err)
  )

  sceneContainer.value.addEventListener('mousemove', onMouseMove)
  sceneContainer.value.addEventListener('click', onClick)
  window.addEventListener('resize', handleResize)
  loadData()
  animate()
}

function animate() {
  animationId = requestAnimationFrame(animate)
  updateAnimation()
  updateEarthquake()
  controls.update()
  renderer?.render(scene, camera)
}

// ============ 生命周期 ============
onMounted(() => initScene())
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (shakeAnimationId) cancelAnimationFrame(shakeAnimationId)
  window.removeEventListener('resize', handleResize)
  if (renderer && sceneContainer.value) sceneContainer.value.removeChild(renderer.domElement)
  renderer?.dispose()
})

// ============ 上色逻辑 ============
function setColorByType(targetType: string) {
  ALL_TYPES.forEach((type) => {
    const parts = partsByType[type] || []
    for (const part of parts) {
      const material = getStandardMaterial(part.material)
      if (!material) continue
      if (originalColorsForPart.has(part)) {
        material.color.copy(originalColorsForPart.get(part)!)
      }
      material.emissive.set(0x000000)
      material.emissiveIntensity = 0
      coloredState[type as keyof typeof coloredState] = false
    }
  })

  const config = partTypeConfig[targetType]
  if (!config) return
  const targetParts = partsByType[targetType] || []
  for (const part of targetParts) {
    const material = getStandardMaterial(part.material)
    if (!material) continue
    if (!originalColorsForPart.has(part)) {
      originalColorsForPart.set(part, material.color.clone())
    }
    material.color.set(config.color)
    material.emissive.set(config.color)
    material.emissiveIntensity = 0.8
    coloredState[targetType as keyof typeof coloredState] = true
  }
}

// 🔥 新增：调整渲染器大小方法
const resizeRenderer = () => {
  if (!sceneContainer.value || !renderer || !camera) return
  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

// 🔥 新增：监听窗口大小变化
const handleResize = () => {
  resizeRenderer()
}

// ============ 对外暴露 🔥 新增重置视角方法 ============
defineExpose({
  setColorByType,
  toggleColorByType,
  startWindTest,
  stopWindTest,
  startEarthquakeTest,
  stopEarthquakeTest,
  resetPart,
  disassemblePart,
  resetView, // 🔥 暴露重置视角方法
  resizeRenderer, // 🔥 暴露调整大小方法
  dispose: () => {
    if (animationId) cancelAnimationFrame(animationId)
    if (shakeAnimationId) cancelAnimationFrame(shakeAnimationId)
    renderer?.dispose()
  }
})
</script>

<style scoped>
.scene-3d-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  outline: none;
  flex: 1;
}
</style>
