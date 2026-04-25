<template>
  <div class="mechanics-page">
    <div class="content-container">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb chinese-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tower' }">
        <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <i class="iconfont icon-l力学" style="margin-right: 4px"></i>力学分析
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 操作栏 -->
    <el-card class="action-card chinese-card" shadow="never">
      <div class="action-bar">
        <div class="action-title">
          <h2>应县木塔力学分析</h2>
          <p>探究千年木塔抗震抗风的力学智慧</p>
        </div>
        <div class="action-btns">
          <el-button class="chinese-btn primary" size="default" @click="handleSimulation">
            <i class="iconfont icon-moni" style="margin-right: 4px"></i>
            {{ isRunning ? '停止模拟' : `启动${activeTab === 'earthquake' ? '抗震' : '抗风'}模拟` }}
          </el-button>
          <el-button class="chinese-btn plain" size="default" @click="openAIChat">
            <i class="iconfont icon-xiazai" style="margin-right: 4px"></i>生成力学报告
          </el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="main-row">
      <!-- 左侧3D容器 -->
      <el-col :xs="24" :sm="16" :md="16">
        <el-card class="canvas-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-kongjian" style="margin-right: 8px; color: #8b4513"></i>
                力学模拟可视化
              </span>
            </div>
          </template>
          <div class="canvas-container">
            <div class="canvas-placeholder" v-if="!modelLoaded">
              <div class="loading-spinner"></div>
              <p class="placeholder-text">力学模拟展示区域</p>
              <p class="placeholder-desc">千年木构 · 力学智慧</p>
            </div>
            <div
              class="canvas-mount"
              v-else
              @mousemove="updateTooltipPos"
              @mouseleave="hideTooltip"
            >
              <Scene3D ref="scene3dRef" @partHover="handlePartHover" @modelLoaded="handleModelLoaded" />
              <div
                v-show="tooltip.show"
                class="mech-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
              >
                <div class="tooltip-name">{{ tooltip.name }}</div>
                <div class="tooltip-desc">{{ tooltip.desc }}</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 图表区域 - 改为2x2网格布局 -->
        <el-row :gutter="16" class="charts-row" style="margin-top: 20px">
          <!-- 自振周期图表 -->
          <el-col :xs="24" :sm="12" :md="12" class="chart-col">
            <el-card class="chart-card chinese-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>
                    <i class="iconfont icon-biaoge" style="margin-right: 8px; color: #8b4513"></i>
                    自振周期图表
                  </span>
                </div>
              </template>
              <div ref="periodChartRef" class="chart-container"></div>
            </el-card>
          </el-col>

          <!-- 层间位移角曲线 -->
          <el-col :xs="24" :sm="12" :md="12" class="chart-col">
            <el-card class="chart-card chinese-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>
                    <i class="iconfont icon-quxian" style="margin-right: 8px; color: #8b4513"></i>
                    层间位移角曲线
                  </span>
                </div>
              </template>
              <div ref="displacementChartRef" class="chart-container"></div>
            </el-card>
          </el-col>

          <!-- 风荷载分布图表 -->
          <el-col :xs="24" :sm="12" :md="12" class="chart-col">
            <el-card class="chart-card chinese-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>
                    <i class="iconfont icon-fengli" style="margin-right: 8px; color: #8b4513"></i>
                    风荷载分布图表
                  </span>
                </div>
              </template>
              <div ref="windLoadChartRef" class="chart-container"></div>
            </el-card>
          </el-col>

          <!-- 斗拱阻尼对比图 -->
          <el-col :xs="24" :sm="12" :md="12" class="chart-col">
            <el-card class="chart-card chinese-card" shadow="never">
              <template #header>
                <div class="card-header">
                  <span>
                    <i class="iconfont icon-biaoge" style="margin-right: 8px; color: #8b4513"></i>
                    斗拱阻尼对比图
                  </span>
                </div>
              </template>
              <div ref="dampingChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- 右侧Tab -->
      <el-col :xs="24" :sm="8" :md="8">
        <el-card class="tab-card chinese-card" shadow="never">
          <el-tabs v-model="activeTab" class="mechanics-tabs" @tab-change="handleTabChange">
            <el-tab-pane label="抗震分析" name="earthquake">
              <div class="tab-content">
                <h3 class="layer-title">抗震核心原理</h3>
                <ul class="layer-list">
                  <li>· 柔性结构：以柔克刚</li>
                  <li>· 暗层斜撑：耗能减震</li>
                  <li>· 榫卯节点：转动耗能</li>
                  <li>· 台基隔震：缓冲地震波</li>
                </ul>
                <div class="strength-box">
                  <label>地震强度：</label>
                  <el-slider v-model="earthquakeLevel" :min="1" :max="5" :step="1" />
                  <div class="strength-text">当前等级：{{ earthquakeLevel }} 级</div>
                </div>
                <div class="status-box">
                  <h4>📊 古塔状态</h4>
                  <p>{{ earthquakeStatus }}</p>
                </div>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">8.0</div>
                    <div class="stat-label">抗震烈度(级)</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">1000+</div>
                    <div class="stat-label">历经地震(次)</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="抗风分析" name="wind">
              <div class="tab-content">
                <h3 class="layer-title">抗风核心原理</h3>
                <ul class="layer-list">
                  <li>· 重檐结构：分散风压</li>
                  <li>· 叉柱造：整体稳定性</li>
                  <li>· 斗栱层：缓冲风荷载</li>
                  <li>· 筒体结构：抗扭刚度大</li>
                </ul>
                <div class="strength-box">
                  <label>风力等级：</label>
                  <el-slider v-model="windLevel" :min="1" :max="5" :step="1" />
                  <div class="strength-text">当前等级：{{ windLevel }} 级</div>
                </div>
                <div class="status-box">
                  <h4>📊 古塔状态</h4>
                  <p>{{ windStatus }}</p>
                </div>
                <div class="layer-stats">
                  <div class="stat-item">
                    <div class="stat-num">12</div>
                    <div class="stat-label">抗风等级(级)</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-num">67.31</div>
                    <div class="stat-label">塔高(米)</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="材料特性" name="material">
              <div class="tab-content">
                <h3 class="layer-title">木材力学特性</h3>
                <ul class="layer-list">
                  <li>· 山西落叶松：强度高</li>
                  <li>· 顺纹抗压：性能优异</li>
                  <li>· 韧性好：延性耗能</li>
                  <li>· 耐久性：千年不腐</li>
                </ul>
                <el-button
                  class="chinese-btn primary"
                  size="small"
                  style="width: 100%; margin-top: 16px"
                >
                  <i class="iconfont icon-biaoge" style="margin-right: 4px"></i>查看材料参数表
                </el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="抗震原理" name="principle">
              <div class="tab-content">
                <h3 class="layer-title">抗震原理详解</h3>
                <div class="principle-content">
                  <h4>1. 柔性结构体系</h4>
                  <p>应县木塔采用柔性结构设计，柱子不是刚性固定，而是允许轻微摆动，以柔克刚，消耗地震能量。</p>
                  <h4>2. 斗拱耗能机制</h4>
                  <p>斗拱通过摩擦和错动消耗地震能量，是木塔抗震的核心部件，被称为"天然减震器"。</p>
                  <h4>3. 榫卯节点设计</h4>
                  <p>榫卯节点允许一定程度的转动，在地震时起到耗能作用，同时保持结构的整体性。</p>
                  <h4>4. 台基隔震效果</h4>
                  <p>台基采用夯土和石材建造，具有一定的弹性，能够缓冲地震波的传递。</p>
                  <h4>5. 多层结构优势</h4>
                  <p>木塔的多层结构使得地震能量在传递过程中被层层消耗，减少对顶层的影响。</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    </div>

    <!-- AI报告组件 -->
    <AIChatBox v-if="showAIChat" @close="showAIChat = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, nextTick } from 'vue'
import * as echarts from 'echarts'
import Scene3D from '@/components/Scene3D.vue'
import AIChatBox from '@/components/AIChatBox.vue'

const activeTab = ref('earthquake')
const modelLoaded = ref(false)
const isRunning = ref(false)
const earthquakeLevel = ref(2)
const windLevel = ref(2)
const scene3dRef = ref<InstanceType<typeof Scene3D> | null>(null)
const showAIChat = ref(false)

// 图表引用
const periodChartRef = ref<HTMLElement | null>(null)
const displacementChartRef = ref<HTMLElement | null>(null)
const windLoadChartRef = ref<HTMLElement | null>(null)
const dampingChartRef = ref<HTMLElement | null>(null)

// 图表实例
let periodChart: echarts.ECharts | null = null
let displacementChart: echarts.ECharts | null = null
let windLoadChart: echarts.ECharts | null = null
let dampingChart: echarts.ECharts | null = null

// 力学页专属：悬浮提示配置
const tooltip = reactive({
  show: false,
  x: 0,
  y: 0,
  name: '',
  desc: ''
})

// 部件：抗震/抗风 简短作用映射表
const partActionMap = {
  Column: {
    earthquake: '柔性摆动，耗散地震能量',
    wind: '稳定支撑，抵御风荷载'
  },
  DouGong: {
    earthquake: '摩擦错动，核心抗震部件',
    wind: '缓冲风压，柔性抗风'
  },
  Bracing: {
    earthquake: '传递水平力，圈梁加固',
    wind: '整体拉结，提升抗扭刚度'
  },
  Wall: {
    earthquake: '不承重，墙倒屋不塌',
    wind: '围护结构，不影响抗风'
  },
  Windows: {
    earthquake: '装饰构件，无抗震作用',
    wind: '通风构件，降低风阻'
  },
  Door: {
    earthquake: '装饰构件，无抗震作用',
    wind: '封闭构件，不影响抗风'
  }
}

// 计算状态
const earthquakeStatus = computed(() => {
  const map = {
    1: '轻微晃动，斗拱正常工作，结构完全稳定',
    2: '小幅摆动，柱子柔性减震，无任何损伤',
    3: '中等震动，榫卯转动耗能，结构安全',
    4: '剧烈晃动，斗拱充分耗能，主体结构完好',
    5: '极限震动，木塔以柔克刚，屹立不倒'
  }
  return map[earthquakeLevel.value as keyof typeof map]
})
const windStatus = computed(() => {
  const map = {
    1: '微风摆动，结构平稳',
    2: '和风摇曳，斗拱缓冲风压',
    3: '大风摆动，整体稳定',
    4: '烈风震动，柔性结构抵御荷载',
    5: '暴风考验，木塔抗风性能拉满'
  }
  return map[windLevel.value as keyof typeof map]
})

// 初始化自振周期图表
const initPeriodChart = () => {
  if (!periodChartRef.value) return
  periodChart = echarts.init(periodChartRef.value)
  const option = {
    title: {
      text: '自振周期',
      left: 'center',
      textStyle: {
        color: '#8b4513',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['第一阶', '第二阶', '第三阶'],
      axisLabel: {
        color: '#6d4c41'
      }
    },
    yAxis: {
      type: 'value',
      name: '周期 (s)',
      nameTextStyle: {
        color: '#6d4c41'
      },
      axisLabel: {
        color: '#6d4c41'
      }
    },
    series: [{
      data: [1.853, 1.724, 1.195],
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#9d2933' },
          { offset: 1, color: '#c0392b' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#6d4c41'
      }
    }]
  }
  periodChart.setOption(option)
}

// 初始化层间位移角曲线
const initDisplacementChart = () => {
  if (!displacementChartRef.value) return
  displacementChart = echarts.init(displacementChartRef.value)
  const option = {
    title: {
      text: '层间位移角曲线',
      left: 'center',
      textStyle: {
        color: '#8b4513',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1层', '2层', '3层', '4层', '5层'],
      axisLabel: {
        color: '#6d4c41'
      }
    },
    yAxis: {
      type: 'value',
      name: '位移角',
      nameTextStyle: {
        color: '#6d4c41'
      },
      axisLabel: {
        color: '#6d4c41',
        formatter: '{value}'
      }
    },
    series: [{
      data: [1/500, 1/450, 1/400, 1/350, 1/300],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#8b4513'
      },
      lineStyle: {
        width: 3
      },
      symbol: 'circle',
      symbolSize: 8
    }]
  }
  displacementChart.setOption(option)
}

// 初始化风荷载分布图表
const initWindLoadChart = () => {
  if (!windLoadChartRef.value) return
  windLoadChart = echarts.init(windLoadChartRef.value)
  const option = {
    title: {
      text: '风荷载分布',
      left: 'center',
      textStyle: {
        color: '#8b4513',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['剪力 (kN)'],
      top: 30,
      textStyle: {
        color: '#6d4c41'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['5层底', '5层檐口', '5层楼面', '底层地面'],
      axisLabel: {
        color: '#6d4c41',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '剪力 (kN)',
      nameTextStyle: {
        color: '#6d4c41'
      },
      axisLabel: {
        color: '#6d4c41'
      }
    },
    series: [{
      name: '剪力 (kN)',
      data: [3.49, 5.53, 23.46, 1695.42],
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3498db' },
          { offset: 1, color: '#2980b9' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#6d4c41'
      }
    }]
  }
  windLoadChart.setOption(option)
}

// 初始化斗拱阻尼对比图
const initDampingChart = () => {
  if (!dampingChartRef.value) return
  dampingChart = echarts.init(dampingChartRef.value)
  const option = {
    title: {
      text: '斗拱阻尼比与其他结构对比',
      left: 'center',
      textStyle: {
        color: '#8b4513',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['阻尼比'],
      top: 30,
      textStyle: {
        color: '#6d4c41'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['斗拱', '钢筋混凝土结构', '钢结构', '砌体结构'],
      axisLabel: {
        color: '#6d4c41',
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '阻尼比',
      nameTextStyle: {
        color: '#6d4c41'
      },
      axisLabel: {
        color: '#6d4c41',
        formatter: '{value}'
      }
    },
    series: [{
      name: '阻尼比',
      data: [0.191, 0.05, 0.02, 0.03],
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#9b59b6' },
          { offset: 1, color: '#8e44ad' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#6d4c41'
      }
    }]
  }
  dampingChart.setOption(option)
}

// 处理窗口 resize
const handleResize = () => {
  periodChart?.resize()
  displacementChart?.resize()
  windLoadChart?.resize()
  dampingChart?.resize()
}

// 处理模型悬浮事件
const handlePartHover = (data: any) => {
  if (!data.name || !data.partType) {
    tooltip.show = false
    return
  }
  tooltip.name = data.name === '梁枋' ? '屋檐' : data.name
  tooltip.desc =
    partActionMap[data.partType as keyof typeof partActionMap]?.[activeTab.value] || '力学作用未知'
  tooltip.show = true
}

// 鼠标跟随
const updateTooltipPos = (e: MouseEvent) => {
  tooltip.x = e.offsetX + 15
  tooltip.y = e.offsetY + 15
}

// 鼠标离开隐藏
const hideTooltip = () => {
  tooltip.show = false
}

// Tab切换
const handleTabChange = () => {
  if (scene3dRef.value) {
    scene3dRef.value.stopEarthquakeTest()
    scene3dRef.value.stopWindTest()
  }
  isRunning.value = false
  tooltip.show = false
}

// 启停模拟
const handleSimulation = () => {
  if (!scene3dRef.value) return
  if (!isRunning.value) {
    isRunning.value = true
    activeTab.value === 'earthquake'
      ? scene3dRef.value.startEarthquakeTest(earthquakeLevel.value)
      : scene3dRef.value.startWindTest(windLevel.value)
  } else {
    isRunning.value = false
    activeTab.value === 'earthquake'
      ? scene3dRef.value.stopEarthquakeTest()
      : scene3dRef.value.stopWindTest()
  }
}

// 打开AI报告
const openAIChat = () => {
  showAIChat.value = true
}

// 处理模型加载完成事件
const handleModelLoaded = () => {
  modelLoaded.value = true
}

onMounted(() => {
  nextTick(() => {
    initPeriodChart()
    initDisplacementChart()
    initWindLoadChart()
    initDampingChart()
    window.addEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
/* 原有样式全部保留 */
.mechanics-page {
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

.mechanics-page::before {
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
  margin: 0 0 12px 0;
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
  align-items: stretch;
}

.canvas-card {
  width: 100%;
  border-radius: 20px;
  margin-bottom: 32px;
  height: 50%;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  min-height: 700px;
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

.canvas-mount {
  width: 100%;
  height: 100%;
  position: relative;
}

.tab-card {
  width: 100%;
  border-radius: 20px;
  margin-bottom: 32px;
  height: 50%;
  display: flex;
  flex-direction: column;
}

.mechanics-tabs {
  width: 100%;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mechanics-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

.mechanics-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.mechanics-tabs :deep(.el-tabs__nav-wrap) {
  border-bottom: 1px dashed #e6c890;
}

.mechanics-tabs :deep(.el-tabs__item) {
  color: #6d4c41;
  font-size: 18px;
  font-weight: 600;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.mechanics-tabs :deep(.el-tabs__item.is-active) {
  color: #8b4513;
  font-weight: 700;
  font-size: 20px;
}

.mechanics-tabs :deep(.el-tabs__active-bar) {
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
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  transition: all 0.3s ease;
}

.layer-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
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

.strength-box {
  margin: 24px 0;
  padding: 20px;
  background: #f9f5e9;
  border-radius: 16px;
  border: 1px solid #e6c890;
  transition: all 0.3s ease;
}

.strength-box label {
  font-size: 18px;
  color: #8b4513;
  font-weight: 700;
  margin-bottom: 12px;
  display: block;
  transition: all 0.3s ease;
}

.strength-text {
  text-align: center;
  margin-top: 12px;
  font-size: 16px;
  color: #6d4c41;
  font-weight: 600;
  transition: all 0.3s ease;
}

.status-box {
  margin: 20px 0;
  padding: 20px;
  background: #fff5e6;
  border-radius: 16px;
  border-left: 4px solid #8b4513;
  transition: all 0.3s ease;
}

.status-box h4 {
  margin: 0 0 12px 0;
  color: #8b4513;
  font-size: 20px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.status-box p {
  margin: 0;
  color: #6d4c41;
  line-height: 1.6;
  font-size: 16px;
  transition: all 0.3s ease;
}

.layer-stats {
  display: flex;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px dashed #e6c890;
  transition: all 0.3s ease;
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
  margin-bottom: 8px;
  font-family: 'SimHei', serif;
  transition: all 0.3s ease;
}

.stat-label {
  font-size: 16px;
  color: #6d4c41;
  transition: all 0.3s ease;
}

.chinese-btn {
  border-radius: 12px;
  font-family: 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
  font-size: 18px;
  padding: 12px 24px;
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

/* ====================================== */
/* 力学页专属悬浮提示样式 */
/* ====================================== */
.mech-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fff8e6, #f9f5e9);
  border: 1px solid #d4b886;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
  pointer-events: none;
  animation: tooltipFade 0.2s ease;
  min-width: 180px;
}

.tooltip-name {
  font-size: 15px;
  font-weight: 600;
  color: #8b4513;
  margin-bottom: 4px;
  font-family: 'Microsoft YaHei', serif;
}

.tooltip-desc {
  font-size: 13px;
  color: #6d4c41;
  line-height: 1.4;
}

@keyframes tooltipFade {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====================================== */
/* 图表区域新增样式 - 使四个图表宽度对齐 */
/* ====================================== */
.charts-row {
  width: 100%;
  margin: 0 !important;
}

.chart-col {
  margin-bottom: 16px;
}

.chart-card {
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 280px;
}

/* 抗震原理内容样式 */
.principle-content {
  padding: 10px 0;
}

.principle-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #8b4513;
  margin: 16px 0 8px 0;
  font-family: 'Microsoft YaHei', serif;
}

.principle-content p {
  font-size: 14px;
  color: #6d4c41;
  line-height: 1.6;
  margin: 0 0 12px 0;
  text-align: justify;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .mechanics-page {
    padding: 40px 5%;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
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
    min-height: 400px;
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
  
  .status-box h4 {
    font-size: 18px;
  }
  
  .status-box p {
    font-size: 14px;
  }
  
  .chart-container {
    height: 220px;
  }
  
  .chart-col {
    margin-bottom: 12px;
  }
}

@media (max-width: 1200px) {
  .canvas-container {
    height: 500px;
    min-height: 500px;
  }
  
  .action-title h2 {
    font-size: 32px;
  }
  
  .action-title p {
    font-size: 18px;
  }
}
</style>