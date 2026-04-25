<template>
  <!-- 纯功能组件，无任何UI界面 -->
  <div style="display: none"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 接收父组件传递的 Three.js 核心对象和模型状态
const props = defineProps({
  scene: { type: Object, required: true },
  camera: { type: Object, required: true },
  renderer: { type: Object, required: true },
  currentModel: { type: Object, default: null },
  modelState: { type: Object, required: true }
})

// 控制器变量
let controls = null
let animationId = null

// 初始化轨道控制器（核心：自由旋转/缩放/平移）
const initControls = () => {
  // 加判断，避免undefined报错
  if (!props.camera || !props.renderer) return

  // 创建控制器，绑定渲染器的DOM元素
  controls = new OrbitControls(props.camera, props.renderer.domElement)

  // 核心控制配置
  controls.enableDamping = true // 平滑阻尼效果
  controls.dampingFactor = 0.05 // 阻尼系数
  controls.rotateSpeed = 1.0 // 旋转速度
  controls.zoomSpeed = 1.2 // 缩放速度
  controls.enableZoom = true // 允许滚轮缩放（放大缩小）
  controls.enableRotate = true // 允许左键旋转
  controls.enablePan = true // 允许右键平移
  controls.target.set(0, 0, 0) // 观察中心点
  controls.autoRotate = false // 关闭自动旋转（手动控制）

  // 限制相机距离，防止模型消失
  controls.minDistance = 0.5
  controls.maxDistance = 10

  // 动画循环
  animate()
}

// 渲染循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (controls) controls.update() // 更新控制器
  // 加判断，避免undefined报错
  if (props.renderer && props.scene && props.camera) {
    props.renderer.render(props.scene, props.camera)
  }
}

// 监听模型状态变化，更新控制器目标点
watch(
  [() => props.currentModel, () => props.modelState],
  () => {
    if (props.currentModel && controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  initControls()
})

onBeforeUnmount(() => {
  // 销毁控制器和动画
  if (animationId) cancelAnimationFrame(animationId)
  if (controls) controls.dispose()
})
</script>

<style scoped>
/* 无任何样式 */
</style>
