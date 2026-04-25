<template>
  <div class="home-page">
    <div class="content-container">
    <!-- AI悬浮框 -->
    <AIChatBox />

    <!-- 1. 顶部标题区域 -->
    <div class="banner-box">
      <h1 class="banner-title">
        <i
          class="iconfont icon-gufengwujianzhongguofengzhujian_huaban_huaban_huaban"
          style="margin-right: 12px; color: #c49346; animation: rotateIn 0.8s ease"
        ></i>
        中国古代建筑成就可视化交互拓展界面
      </h1>
      <p class="banner-desc"
        >传承千年营造技艺，解码古建营造智慧，沉浸式交互体验中国古代建筑的巅峰成就</p
      >
      <div class="banner-buttons">
        <router-link to="/" class="banner-btn primary">
          返回首页
          <i class="iconfont icon-arrow-left" style="margin-left: 8px"></i>
        </router-link>
      </div>
    </div>

    <!-- 2. 档案墙 (原位置5) -->
    <div class="wall-section">
      <h2 class="wall-title">
        <i class="iconfont icon-gujian" style="margin-right: 8px; color: #26a69a"></i>
        古建筑精选档案
      </h2>
      <div class="scroll-wall">
        <!-- 左箭头 -->
        <button class="scroll-btn left-btn" @click="scrollLeft">
          <i class="iconfont icon-zuo"></i>
        </button>
        <!-- 右箭头 -->
        <button class="scroll-btn right-btn" @click="scrollRight">
          <i class="iconfont icon-you"></i>
        </button>

        <div
          class="scroll-wrapper"
          ref="scrollWrapper"
          @mouseenter="stopAutoScroll"
          @mouseleave="startAutoScroll"
        >
          <div class="scroll-list">
            <div
              v-for="(item, index) in archiveList"
              :key="`first-${index}`"
              class="archive-card xiangyun-border"
              @click="handleArchiveClick(item, index)"
            >
              <div
                class="card-img"
                :style="{ backgroundImage: `url(${archiveImages[index]})` }"
              ></div>
              <div class="card-info">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
          <div class="scroll-list">
            <div
              v-for="(item, index) in archiveList"
              :key="`second-${index}`"
              class="archive-card xiangyun-border"
              @click="handleArchiveClick(item, index)"
            >
              <div
                class="card-img"
                :style="{ backgroundImage: `url(${archiveImages[index]})` }"
              ></div>
              <div class="card-info">
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 建筑详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedBuilding?.title"
      width="800px"
      class="building-dialog"
    >
      <div class="building-detail">
        <div class="detail-image">
          <img :src="selectedBuilding?.image" :alt="selectedBuilding?.title" />
        </div>
        <div class="detail-info">
          <div class="info-item">
            <span class="info-label">年代：</span>
            <span class="info-value">{{ selectedBuilding?.era }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">地点：</span>
            <span class="info-value">{{ selectedBuilding?.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">简介：</span>
            <p class="info-desc">{{ selectedBuilding?.description }}</p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 3. 地图+饼图 -->
    <div class="map-chart-container">
      <div class="map-panel">
        <el-card class="map-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i
                  class="iconfont icon-zhongguofengjianzhu"
                  style="margin-right: 8px; color: #26a69a"
                ></i>
                全国古建筑分布地图
              </span>
              <div class="map-controls">
                <el-button-group>
                  <el-button 
                    :type="mapMode === 'quantity' ? 'primary' : 'default'" 
                    size="small"
                    @click="switchMapMode('quantity')"
                  >
                    数量分布
                  </el-button>
                  <el-button 
                    :type="mapMode === 'type' ? 'primary' : 'default'" 
                    size="small"
                    @click="switchMapMode('type')"
                  >
                    类型分布
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div ref="mapRef" class="map-chart"></div>
        </el-card>
      </div>
      <div class="chart-panel">
        <el-card class="chart-card chinese-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>
                <i class="iconfont icon-fangzi-" style="margin-right: 8px; color: #26a69a"></i>
                古建筑分类占比
              </span>
            </div>
          </template>
          <div ref="roseRef" class="chart-container"></div>
        </el-card>
      </div>
    </div>

    <!-- 4. 朝代柱状图 -->
    <div class="bar-container">
      <el-card class="chart-card chinese-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>
              <i class="iconfont icon-gujian" style="margin-right: 8px; color: #26a69a"></i>
              现存古建筑朝代分布
            </span>
          </div>
        </template>
        <div ref="barRef" class="chart-container bar-chart"></div>
      </el-card>
    </div>

    <!-- 5. 核心亮点3连卡 (原位置2) -->
    <div class="stats-container">
      <div class="stats-card">
        <div class="stats-icon icon1">
          <i class="iconfont icon-zhongguofengjianzhu" style="font-size: 28px; color: #fff"></i>
        </div>
        <div class="stats-content">
          <div class="stats-num">5058</div>
          <div class="stats-label">全国重点文物保护单位</div>
        </div>
        <div class="stats-decoration"></div>
      </div>
      <div class="stats-card">
        <div class="stats-icon icon2">
          <i class="iconfont icon-fangzi-" style="font-size: 28px; color: #fff"></i>
        </div>
        <div class="stats-content">
          <div class="stats-num">1500+</div>
          <div class="stats-label">古建筑数字化档案</div>
        </div>
        <div class="stats-decoration"></div>
      </div>
      <div class="stats-card">
        <div class="stats-icon icon3">
          <i class="iconfont icon-gujian" style="font-size: 28px; color: #fff"></i>
        </div>
        <div class="stats-content">
          <div class="stats-num">40%</div>
          <div class="stats-label">高精度模型覆盖率</div>
        </div>
        <div class="stats-decoration"></div>
      </div>
    </div>

    <!-- 数据来源脚注 -->
    <div class="data-source">
      <p>数据来源：国家文物局、中国建筑学会、各省市文物保护单位</p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AIChatBox from '@/components/AIChatBox.vue'

const router = useRouter()
const mapRef = ref<HTMLDivElement | null>(null)
const roseRef = ref<HTMLDivElement | null>(null)
const barRef = ref<HTMLDivElement | null>(null)
// 滚动容器ref
const scrollWrapper = ref<HTMLDivElement | null>(null)

let mapChart: echarts.ECharts | null = null
let roseChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
// 自动滚动定时器
let autoScrollTimer: number | null = null

// 弹窗状态
const dialogVisible = ref(false)
const selectedBuilding = ref<any>(null)

// 地图模式
const mapMode = ref('quantity') // quantity: 数量分布, type: 类型分布

// 档案数据
const archiveList = [
  { title: '应县木塔', desc: '辽代·世界最高木构塔', isTower: true },
  { title: '故宫太和殿', desc: '明清·中国现存最大木构建筑', isTower: false },
  { title: '赵州桥', desc: '隋代·世界最早敞肩石拱桥', isTower: false },
  { title: '苏州拙政园', desc: '明代·中国四大名园', isTower: false },
  { title: '布达拉宫', desc: '唐代·世界海拔最高宫殿群', isTower: false },
  { title: '万里长城', desc: '秦汉-明·世界八大奇迹', isTower: false },
  { title: '悬空寺', desc: '北魏·建在悬崖上的千年古寺', isTower: false },
  { title: '大雁塔', desc: '唐代·玄奘藏经之塔', isTower: false },
  { title: '天坛祈年殿', desc: '明清·中国礼制建筑巅峰', isTower: false },
  { title: '福建土楼', desc: '宋元-清·世界文化遗产', isTower: false },
  { title: '丽江古城', desc: '宋末元初·世界文化遗产', isTower: false },
  { title: '晋祠圣母殿', desc: '宋代·中国古建典范', isTower: false }
]

// 本地图片路径
const archiveImages = [
  '/images/archive/1.jpg',
  '/images/archive/2.jpg',
  '/images/archive/3.jpg',
  '/images/archive/4.jpg',
  '/images/archive/5.jpg',
  '/images/archive/6.jpg',
  '/images/archive/7.jpg',
  '/images/archive/8.jpg',
  '/images/archive/9.jpg',
  '/images/archive/10.jpg',
  '/images/archive/11.jpg',
  '/images/archive/12.jpg'
]

// 建筑详情数据
const buildingDetails = [
  {
    title: '应县木塔',
    era: '辽1056年',
    location: '山西应县',
    description: '世界现存最高最古老木构塔式建筑，高67.31米。建于辽代清宁二年（1056年），金明昌六年（1195年）增修完毕。塔内供奉着两颗释迦牟尼佛牙舍利，是中国古代建筑的杰出代表。',
    image: '/images/archive/1.jpg'
  },
  {
    title: '故宫太和殿',
    era: '清',
    location: '北京',
    description: '中国现存最大单体木构，面阔11间，进深5间，建筑面积2377平方米，高26.92米。是明清两代皇帝举行大典的地方，体现了中国古代宫殿建筑的最高成就。',
    image: '/images/archive/2.jpg'
  },
  {
    title: '赵州桥',
    era: '隋代',
    location: '河北赵县',
    description: '世界最早敞肩石拱桥，由李春设计建造于隋代大业年间（605-618年）。桥长50.82米，跨径37.02米，是中国古代桥梁建筑的杰作。',
    image: '/images/archive/3.jpg'
  },
  {
    title: '苏州拙政园',
    era: '明代',
    location: '江苏苏州',
    description: '中国四大名园之一，始建于明代正德年间（1506-1521年）。占地面积约5.2公顷，以水为中心，亭台楼阁临水而建，是江南园林的代表作品。',
    image: '/images/archive/4.jpg'
  },
  {
    title: '布达拉宫',
    era: '唐代',
    location: '西藏拉萨',
    description: '世界海拔最高宫殿群，始建于唐代贞观年间（627-649年），是藏传佛教的圣地。宫殿高117米，东西长360米，是西藏最具代表性的建筑。',
    image: '/images/archive/5.jpg'
  },
  {
    title: '万里长城',
    era: '秦汉-明',
    location: '中国北部',
    description: '世界八大奇迹之一，是中国古代为防御北方游牧民族入侵而修建的军事防御工程。明长城全长约8851.8公里，是中国古代劳动人民智慧和勇气的象征。',
    image: '/images/archive/6.jpg'
  },
  {
    title: '悬空寺',
    era: '北魏',
    location: '山西浑源',
    description: '建在悬崖上的千年古寺，始建于北魏太和十五年（491年）。寺庙悬挂在恒山金龙峡西侧翠屏峰的半崖峭壁间，以奇、险、巧著称。',
    image: '/images/archive/7.jpg'
  },
  {
    title: '大雁塔',
    era: '唐代',
    location: '陕西西安',
    description: '唐代楼阁式砖塔，高64米，始建于唐永徽三年（652年），由玄奘法师主持修建，用于存放从印度取回的佛经。',
    image: '/images/archive/8.jpg'
  },
  {
    title: '天坛祈年殿',
    era: '明',
    location: '北京',
    description: '中国古代建筑美学巅峰，三重檐圆形建筑，高38米，直径32.72米。是明清两代皇帝祭天祈谷的场所，体现了中国古代天人合一的哲学思想。',
    image: '/images/archive/9.jpg'
  },
  {
    title: '福建土楼',
    era: '宋元-清',
    location: '福建南部',
    description: '世界文化遗产，是客家民居的典型代表。土楼以生土为主要建筑材料，具有防御功能，体现了客家人民的集体智慧和凝聚力。',
    image: '/images/archive/10.jpg'
  },
  {
    title: '丽江古城',
    era: '宋末元初',
    location: '云南丽江',
    description: '世界文化遗产，始建于宋末元初（13世纪后期）。古城依山傍水，布局自由，是中国为数不多的保存相当完好的少数民族古镇。',
    image: '/images/archive/11.jpg'
  },
  {
    title: '晋祠圣母殿',
    era: '宋',
    location: '山西太原',
    description: '宋代建筑代表，鱼沼飞梁为十字形桥梁孤例。圣母殿建于北宋天圣年间（1023-1032年），是晋祠的主体建筑，体现了宋代建筑的高超技艺。',
    image: '/images/archive/12.jpg'
  }
]

// 卡片点击
const handleArchiveClick = (item: any, index: number) => {
  console.log('点击档案卡片：', item.title)
  if (item.isTower) {
    router.push('/tower')
  } else {
    // 跳转到古建筑详情页面，使用正确的ID
    // 对应关系：index 0-11 对应 buildings 数组中的 id 2-13
    // 但是 buildings 数组的 id 是从 1 开始的，所以需要调整
    const buildingId = index + 2
    router.push(`/ancient-building/${buildingId}`)
  }
}

// 地图类型分布数据
const buildingTypeData = [
  { name: '楼阁殿堂', value: 45000, color: '#c49346' },
  { name: '古塔', value: 8500, color: '#26a69a' },
  { name: '园林', value: 6000, color: '#8d6e63' },
  { name: '桥梁', value: 19000, color: '#607d8b' },
  { name: '石窟寺', value: 24422, color: '#9c27b0' },
  { name: '城墙关隘', value: 24000, color: '#ff9800' },
  { name: '民居', value: 130000, color: '#795548' }
]

// 地图类型分布散点数据
const typeScatterData = [
  { name: '应县木塔', value: [113.1, 39.5], type: '古塔', itemStyle: { color: '#26a69a' } },
  { name: '故宫太和殿', value: [116.4, 39.9], type: '楼阁殿堂', itemStyle: { color: '#c49346' } },
  { name: '苏州拙政园', value: [120.6, 31.3], type: '园林', itemStyle: { color: '#8d6e63' } },
  { name: '赵州桥', value: [114.8, 37.7], type: '桥梁', itemStyle: { color: '#607d8b' } },
  { name: '布达拉宫', value: [91.1, 29.7], type: '楼阁殿堂', itemStyle: { color: '#c49346' } },
  { name: '悬空寺', value: [113.7, 39.7], type: '楼阁殿堂', itemStyle: { color: '#c49346' } },
  { name: '大雁塔', value: [108.9, 34.3], type: '古塔', itemStyle: { color: '#26a69a' } },
  { name: '天坛祈年殿', value: [116.4, 39.8], type: '楼阁殿堂', itemStyle: { color: '#c49346' } },
  { name: '福建土楼', value: [116.9, 24.5], type: '民居', itemStyle: { color: '#795548' } },
  { name: '丽江古城', value: [100.3, 26.8], type: '民居', itemStyle: { color: '#795548' } },
  { name: '晋祠圣母殿', value: [112.6, 37.8], type: '楼阁殿堂', itemStyle: { color: '#c49346' } }
]

// 切换地图模式
const switchMapMode = (mode: string) => {
  mapMode.value = mode
  initMapChart()
}

// ------------------- 滚动控制核心代码 -------------------
// 每次滚动的距离（卡片宽度+间距）
const SCROLL_STEP = 260
// 向左滚动
const scrollLeft = () => {
  if (!scrollWrapper.value) return
  scrollWrapper.value.scrollTo({
    left: scrollWrapper.value.scrollLeft - SCROLL_STEP,
    behavior: 'smooth'
  })
}
// 向右滚动
const scrollRight = () => {
  if (!scrollWrapper.value) return
  scrollWrapper.value.scrollTo({
    left: scrollWrapper.value.scrollLeft + SCROLL_STEP,
    behavior: 'smooth'
  })
}
// 开始自动滚动
const startAutoScroll = () => {
  if (autoScrollTimer) clearInterval(autoScrollTimer)
  autoScrollTimer = window.setInterval(() => {
    scrollRight()
    // 循环滚动：滚动到末尾后重置位置
    if (
      scrollWrapper.value &&
      scrollWrapper.value.scrollLeft >= scrollWrapper.value.scrollWidth / 2
    ) {
      scrollWrapper.value.scrollLeft = 0
    }
  }, 3000)
}
// 停止自动滚动
const stopAutoScroll = () => {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = null
  }
}
// --------------------------------------------------------

// 地图初始化
const initMapChart = async () => {
  if (!mapRef.value) {
    setTimeout(initMapChart, 200)
    return
  }
  if (mapChart) mapChart.dispose()
  mapChart = echarts.init(mapRef.value)

  try {
    const mapUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    const res = await fetch(mapUrl)
    if (!res.ok) throw new Error('地图数据请求失败')
    const mapJson = await res.json()
    echarts.registerMap('china', mapJson)

    let mapOption: any

    if (mapMode.value === 'quantity') {
      // 数量分布模式
      mapOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
              return `代表建筑：${params.name}`
            }
            return `${params.name}<br/>古建筑数量：${params.value} 处`
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          textStyle: { color: '#fff' }
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 30000,
          left: 20,
          bottom: 80,
          text: ['数量多', '数量少'],
          textStyle: { color: '#333', fontSize: 12 },
          calculable: true,
          inRange: { color: ['#f0f7ff', '#0052d9'] }
        },
        series: [
          {
            name: '古建筑数量',
            type: 'map',
            map: 'china',
            roam: true,
            scaleLimit: { min: 0.5, max: 2 },
            zoom: 0.9,
            layoutCenter: ['50%', '50%'],
            layoutSize: '85%',
            label: {
              show: true,
              fontSize: 10,
              color: '#333',
              formatter: (params: any) => {
                if (
                  params.scale < 1 &&
                  [
                    '澳门特别行政区',
                    '香港特别行政区',
                    '台湾省',
                    '上海市',
                    '北京市',
                    '天津市'
                  ].includes(params.name)
                ) {
                  return ''
                }
                return params.name
              }
            },
            itemStyle: { borderColor: '#999', borderWidth: 0.8, areaColor: '#f8f9fa' },
            emphasis: {
              label: { color: '#000', fontSize: 12, show: true },
              itemStyle: { areaColor: '#ffd591', borderColor: '#ff7d00', borderWidth: 1.2 }
            },
            data: [
              { name: '北京市', value: 1556 },
              { name: '山西省', value: 28027 },
              { name: '陕西省', value: 6702 },
              { name: '江苏省', value: 8643 },
              { name: '浙江省', value: 46214 },
              { name: '河南省', value: 23912 },
              { name: '河北省', value: 8637 },
              { name: '四川省', value: 17465 },
              { name: '云南省', value: 5531 },
              { name: '西藏自治区', value: 1543 },
              { name: '新疆维吾尔自治区', value: 172 },
              { name: '甘肃省', value: 1432 },
              { name: '内蒙古自治区', value: 452 },
              { name: '辽宁省', value: 795 },
              { name: '吉林省', value: 98 },
              { name: '黑龙江省', value: 126 },
              { name: '安徽省', value: 12097 },
              { name: '福建省', value: 20608 },
              { name: '江西省', value: 22022 },
              { name: '山东省', value: 6658 },
              { name: '湖北省', value: 7590 },
              { name: '湖南省', value: 6420 },
              { name: '广东省', value: 20566 },
              { name: '广西壮族自治区', value: 3602 },
              { name: '贵州省', value: 4853 },
              { name: '海南省', value: 1547 },
              { name: '台湾省', value: 1059 },
              { name: '上海市', value: 985 },
              { name: '重庆市', value: 4180 },
              { name: '天津市', value: 164 },
              { name: '香港特别行政区', value: 138 },
              { name: '澳门特别行政区', value: 159 },
              { name: '青海省', value: 819 }
            ]
          },
          {
            name: '代表建筑',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: 20,
            showEffectOn: 'render',
            rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
            itemStyle: { color: '#c49346', shadowBlur: 10, shadowColor: '#c49346' },
            data: []
          }
        ]
      }
    } else {
      // 类型分布模式
      mapOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
              return `建筑名称：${params.name}<br/>建筑类型：${params.data.type}`
            }
            return `${params.name}`
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          textStyle: { color: '#fff' }
        },
        legend: {
          orient: 'horizontal',
          bottom: 20,
          left: 'center',
          data: buildingTypeData.map(item => item.name),
          textStyle: { color: '#333', fontSize: 12 }
        },
        series: [
          {
            name: '建筑类型',
            type: 'map',
            map: 'china',
            roam: true,
            scaleLimit: { min: 0.5, max: 2 },
            zoom: 0.9,
            layoutCenter: ['50%', '50%'],
            layoutSize: '85%',
            label: {
              show: true,
              fontSize: 10,
              color: '#333',
              formatter: (params: any) => {
                if (
                  params.scale < 1 &&
                  [
                    '澳门特别行政区',
                    '香港特别行政区',
                    '台湾省',
                    '上海市',
                    '北京市',
                    '天津市'
                  ].includes(params.name)
                ) {
                  return ''
                }
                return params.name
              }
            },
            itemStyle: { borderColor: '#999', borderWidth: 0.8, areaColor: '#f8f9fa' },
            emphasis: {
              label: { color: '#000', fontSize: 12, show: true },
              itemStyle: { areaColor: '#ffd591', borderColor: '#ff7d00', borderWidth: 1.2 }
            }
          },
          {
            name: '代表建筑',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            symbolSize: 20,
            showEffectOn: 'render',
            rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
            data: typeScatterData
          }
        ]
      }
    }

    mapChart.setOption(mapOption)
    setTimeout(() => mapChart?.resize(), 300)
    window.addEventListener('resize', () => mapChart?.resize())
  } catch (err) {
    console.error('地图加载失败：', err)
  }
}

// 饼图初始化
const initRoseChart = () => {
  if (!roseRef.value) return
  if (roseChart) roseChart.dispose()
  roseChart = echarts.init(roseRef.value)
  const roseOption = {
    tooltip: { trigger: 'item', formatter: '{b}<br/>数量：{c} 处<br/>占比：{d}%' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 11 } },
    series: [
      {
        name: '古建筑分类',
        type: 'pie',
        radius: ['20%', '70%'],
        center: ['50%', '45%'],
        roseType: 'radius',
        itemStyle: { borderRadius: 8 },
        label: {
          show: true,
          fontSize: 10,
          formatter: '{b}\n{d}%'
        },
        color: ['#c49346', '#26a69a', '#8d6e63', '#607d8b', '#9c27b0', '#ff9800', '#795548'],
        data: [
          { value: 45000, name: '楼阁殿堂' },
          { value: 8500, name: '古塔' },
          { value: 6000, name: '园林' },
          { value: 19000, name: '桥梁' },
          { value: 24422, name: '石窟寺' },
          { value: 24000, name: '城墙关隘' },
          { value: 130000, name: '民居' }
        ]
      }
    ]
  }
  roseChart.setOption(roseOption)
  setTimeout(() => roseChart?.resize(), 200)
  window.addEventListener('resize', () => roseChart?.resize())
}

// 柱状图初始化
const initBarChart = () => {
  if (!barRef.value) return
  if (barChart) barChart.dispose()
  barChart = echarts.init(barRef.value)
  const barOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['秦汉', '魏晋', '隋唐', '宋', '元', '明', '清'],
      axisLabel: { fontSize: 11 }
    },
    yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
    series: [
      {
        name: '现存古建筑数量',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#26a69a' },
            { offset: 1, color: '#004d40' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          color: '#333'
        },
        data: [15, 12, 110, 347, 93, 580, 812]
      }
    ]
  }
  barChart.setOption(barOption)
  setTimeout(() => barChart?.resize(), 200)
  window.addEventListener('resize', () => barChart?.resize())
}

onMounted(() => {
  initMapChart()
  initRoseChart()
  initBarChart()
  startAutoScroll() // 启动自动滚动
})

onUnmounted(() => {
  mapChart?.dispose()
  roseChart?.dispose()
  barChart?.dispose()
  stopAutoScroll() // 清除定时器
  window.removeEventListener('resize', () => mapChart?.resize())
  window.removeEventListener('resize', () => roseChart?.resize())
  window.removeEventListener('resize', () => barChart?.resize())
})
</script>

<style scoped>
/* 强制显示背景：单层、无复杂叠加、遮罩弱化 */
.home-page {
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

/* 遮罩调得极淡 */
.home-page::before {
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

/* 顶部标题栏：古风卷轴样式 */
.banner-box {
  width: 100%;
  text-align: center;
  margin-bottom: 80px;
  padding: 60px 0;
  background: linear-gradient(to right, #f5e8d0, #f9f0e0, #f5e8d0);
  border: 2px solid #b98c58;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(185, 140, 88, 0.15);
  position: relative;
  transition: all 0.3s ease;
}

.banner-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(185, 140, 88, 0.2);
}
/* 移除标题两侧的图片 */
.banner-box::before,
.banner-box::after {
  content: '';
  display: none;
}
.banner-title {
  font-size: 64px;
  font-weight: 800;
  margin: 0 0 24px 0;
  line-height: 1.2;
  color: #8b4513;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SimHei', 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
}
.banner-desc {
  font-size: 24px;
  color: #6d4c41;
  margin: 0 auto 32px;
  max-width: 900px;
  line-height: 1.8;
  transition: all 0.3s ease;
}

/* 顶部按钮区域 */
.banner-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.banner-btn.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.banner-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
}

.banner-btn.secondary {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  color: #8b4513;
  border: 1px solid #e6c890;
  box-shadow: 0 4px 12px rgba(196, 147, 70, 0.1);
}

.banner-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(196, 147, 70, 0.2);
  border-color: #d4b17a;
}

/* 统计卡片 */
.stats-container {
  width: 100%;
  display: flex;
  gap: 24px;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.stats-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}
.stats-card {
  flex: 1;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border-radius: 20px;
  border: 1px solid #e6c890;
  box-shadow:
    0 6px 12px rgba(230, 200, 144, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  padding: 32px 28px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.stats-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, transparent, #d4b17a80, transparent);
  border-radius: 0 0 20px 20px;
}
.stats-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 32px rgba(196, 147, 70, 0.2);
  border-color: #d4b17a;
}
.stats-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
.icon1 {
  background: linear-gradient(135deg, #9d2933, #c0392b);
}
.icon2 {
  background: linear-gradient(135deg, #1e8883, #26a69a);
}
.icon3 {
  background: linear-gradient(135deg, #e67e22, #f39c12);
}
.stats-content {
  flex: 1;
  min-width: 0;
}
.stats-num {
  font-size: 48px;
  font-weight: 700;
  color: #8b4513;
  line-height: 1.2;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.stats-label {
  font-size: 18px;
  color: #795548;
  transition: all 0.3s ease;
}

/* 地图+饼图 */
.map-chart-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 24px;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.map-chart-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}
.map-panel {
  width: 68%;
  flex-shrink: 0;
}
.chart-panel {
  width: 32%;
  flex-shrink: 0;
}
.map-card,
.chart-card {
  width: 100%;
  border-radius: 20px;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e0d5c0;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 0 0 4px rgba(249, 245, 233, 0.5);
  transition: all 0.3s ease;
}

.map-card:hover,
.chart-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(249, 245, 233, 0.8);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #8b4513;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e6c890;
  transition: all 0.3s ease;
}
.header-tip {
  font-size: 13px;
  color: #a1887f;
  font-weight: 400;
}

.map-controls {
  display: flex;
  align-items: center;
  .el-button-group {
    .el-button {
      border-radius: 4px;
      font-size: 12px;
      padding: 4px 12px;
      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &.el-button--primary {
        background: linear-gradient(135deg, #9d2933, #c0392b);
        border-color: #9d2933;
      }
    }
  }
}
.map-chart {
  width: 100%;
  height: 520px;
  overflow: hidden;
  border-radius: 8px;
  background: #f9f5e9;
  border: 1px solid #e0d5c0;
}
.chart-container {
  width: 100%;
  height: 320px;
  background: #f9f5e9;
  border-radius: 8px;
  border: 1px solid #e0d5c0;
}
.bar-container {
  width: 100%;
  margin-bottom: 32px;
}
.bar-chart {
  height: 300px;
}

/* 档案墙 - 核心修改样式 */
.wall-section {
  width: 100%;
  margin-top: 32px;
  margin-bottom: 32px;
}
.wall-title {
  font-size: 26px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid #c49346;
  display: flex;
  align-items: center;
}
.scroll-wall {
  width: 100%;
  position: relative; /* 箭头定位父级 */
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(to right, #f5e8d0, #f9f0e0);
  border: 1px solid #e6c890;
  box-shadow: 0 6px 15px rgba(185, 140, 88, 0.1);
  padding: 20px 10px;
}
/* 滚动容器 - 取消CSS动画，改为横向滚动 */
.scroll-wrapper {
  display: flex;
  overflow-x: hidden;
  scrollbar-width: none;
  gap: 20px;
  padding: 10px 0;
}
.scroll-wrapper::-webkit-scrollbar {
  display: none;
}
.scroll-list {
  display: flex;
  gap: 20px;
  width: max-content;
  flex-shrink: 0;
}

/* 透明箭头按钮样式 */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15); /* 半透明背景 */
  color: #8b4513;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
}
.left-btn {
  left: 16px;
}
.right-btn {
  right: 16px;
}
.scroll-btn:hover {
  background: rgba(196, 147, 70, 0.3);
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

.archive-card {
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0d5c0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}
.archive-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #c49346;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  opacity: 0.7;
}
.archive-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(196, 147, 70, 0.2);
  border-color: #d4b17a;
}
.card-img {
  width: 100%;
  height: 160px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
}
.archive-card:hover .card-img {
  transform: scale(1.05);
  filter: brightness(1.05);
}
.card-info {
  padding: 18px;
}
.card-title {
  font-size: 19px;
  font-weight: 600;
  color: #8b4513;
  margin: 0 0 6px 0;
}
.card-desc {
  font-size: 14px;
  color: #795548;
  margin: 0;
}

@media (max-width: 1200px) {
  .map-chart-container {
    flex-direction: column;
  }
  .map-panel,
  .chart-panel {
    width: 100%;
  }
  .stats-container {
    flex-direction: column;
  }
}

/* 建筑详情弹窗样式 */
.building-dialog {
  .el-dialog__header {
    background: linear-gradient(135deg, #f5e8d0, #f9f0e0);
    border-bottom: 1px solid #e6c890;
  }
  .el-dialog__title {
    color: #8b4513;
    font-size: 20px;
    font-weight: 600;
  }
  .el-dialog__body {
    padding: 24px;
  }
}

.building-detail {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.detail-image {
  flex-shrink: 0;
  width: 300px;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e0d5c0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.detail-info {
  flex: 1;
  min-width: 0;
}

.info-item {
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  display: inline-block;
  width: 60px;
  font-weight: 600;
  color: #8b4513;
}

.info-value {
  color: #6d4c41;
  font-size: 16px;
}

.info-desc {
  margin: 8px 0 0 60px;
  color: #6d4c41;
  line-height: 1.6;
  text-align: justify;
}

@media (max-width: 768px) {
  .building-detail {
    flex-direction: column;
  }
  .detail-image {
    width: 100%;
    height: 200px;
  }
  .info-desc {
    margin-left: 0;
  }
}

/* 数据来源脚注样式 */
.data-source {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed #e6c890;
  text-align: center;
  font-size: 14px;
  color: #a1887f;
  p {
    margin: 0;
  }
}
</style>
