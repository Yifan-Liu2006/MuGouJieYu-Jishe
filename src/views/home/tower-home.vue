<template>
  <div class="tower-home-page">
    <div class="page-scale-container">
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

      <!-- 1. 英雄区（Hero Section） -->
      <div class="hero-section">
        <div class="hero-layout">
          <!-- 左侧文字 -->
          <div class="hero-left">
            <div class="hero-text-content">
              <h1 class="hero-title">木构解语</h1>
              <h2 class="hero-subtitle">应县木塔三维交互式结构分析与工艺科普平台</h2>
              <p class="hero-tagline">千年木塔，抗震奇迹</p>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-label">总高度：</span>
                <span class="stat-number">67.31米</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">始建：</span>
                <span class="stat-number">1056年</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">斗拱：</span>
                <span class="stat-number">54种</span>
              </div>
            </div>

            <div class="hero-buttons">
              <router-link to="/tower" class="cta-button primary">
                <i class="iconfont icon-kongjian" style="margin-right: 8px"></i>
                进入探索
              </router-link>
              <router-link to="/walkthrough" class="cta-button primary">
                <i class="iconfont icon-eye" style="margin-right: 8px"></i>
                第一视角观赏
              </router-link>
              <router-link to="/summary" class="cta-button primary">
                <i class="iconfont icon-arch" style="margin-right: 8px"></i>
                古建筑精选
              </router-link>
            </div>
          </div>

          <!-- 右侧：3D堆叠左右轮播图（中间主图+左右次图） -->
          <div class="hero-right">
            <div class="stack-carousel">
              <!-- 左侧次图 -->
              <img
                :src="carouselImages[prevIndex]"
                alt="应县木塔"
                class="carousel-img slide-prev"
                @click.stop="openPreview"
              />
              <!-- 中间主图 -->
              <img
                :src="carouselImages[currentSlide]"
                alt="应县木塔"
                class="carousel-img slide-active"
                @click.stop="openPreview"
              />
              <!-- 右侧次图 -->
              <img
                :src="carouselImages[nextIndex]"
                alt="应县木塔"
                class="carousel-img slide-next"
                @click.stop="openPreview"
              />
              <!-- 左右滑动按钮 -->
              <div class="carousel-controls">
                <button class="carousel-btn prev-btn" @click="prevSlide">
                  ←
                </button>
                <button class="carousel-btn next-btn" @click="nextSlide">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图片放大预览组件 -->
      <el-image-viewer
        v-if="previewVisible"
        :url-list="carouselImages"
        :initial-index="currentSlide"
        @close="previewVisible = false"
      />

      <!-- 2. 探索木塔（3D Preview Section） -->
      <div class="preview-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="iconfont icon-kongjian" style="margin-right: 12px; color: #8b4513"></i>
            探索木塔
          </h2>
          <p class="section-subtitle">通过3D交互，探索木塔的每一个细节</p>
        </div>
        <div class="preview-content">
          <div class="preview-3d" ref="previewRef">
            <div class="preview-placeholder" v-if="!previewLoaded">
              <div class="loading-spinner"></div>
              <p class="placeholder-text">加载3D模型中...</p>
            </div>
          </div>
          <div class="preview-info">
            <div class="info-card">
              <h3 class="info-title">交互指南</h3>
              <ul class="info-list">
                <li><span class="info-icon">🖱️</span> 鼠标拖拽旋转视角</li>
                <li><span class="info-icon">🖱️</span> 右键平移场景</li>
                <li><span class="info-icon">🖱️</span> 滚轮缩放大小</li>
              </ul>
            </div>
            <div class="preview-cta-container">
              <router-link to="/tower" class="preview-cta primary">
                进入完整3D体验
                <i class="iconfont icon-arrow-right" style="margin-left: 10px"></i>
              </router-link>
              <router-link to="/walkthrough" class="preview-cta secondary">
                第一视角观赏
                <i class="iconfont icon-eye" style="margin-left: 10px"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 结构之美（Feature Cards Section） -->
      <div class="feature-section">
        <h2 class="section-title">
          <i class="iconfont icon-jiegou" style="margin-right: 12px; color: #8b4513"></i>
          结构之美
        </h2>
        <div class="feature-cards">
          <router-link to="/tower/structure" class="feature-card" style="background-image: url('/images/m10.JPG'); background-size: cover; background-position: center;">
            <h3 class="card-title">结构分析</h3>
            <p class="card-desc">柱子·斗拱·梁枋·墙体</p>
            <el-button class="card-btn">
              <span>查看详情</span>
              <i class="iconfont icon-you" style="margin-left: 8px"></i>
            </el-button>
          </router-link>
          <router-link to="/tower/mechanics" class="feature-card" style="background-image: url('/images/dougong3.JPG'); background-size: cover; background-position: center;">
            <h3 class="card-title">力学分析</h3>
            <p class="card-desc">抗震·抗风·阻尼·模态</p>
            <el-button class="card-btn">
              <span>查看详情</span>
              <i class="iconfont icon-you" style="margin-left: 8px"></i>
            </el-button>
          </router-link>
          <router-link to="/tower/decoration" class="feature-card" style="background-image: url('/images/ceiling2.JPG'); background-size: cover; background-position: center;">
            <h3 class="card-title">装饰工艺</h3>
            <p class="card-desc">彩绘·匾额·佛像·斗拱细节</p>
            <el-button class="card-btn">
              <span>查看详情</span>
              <i class="iconfont icon-you" style="margin-left: 8px"></i>
            </el-button>
          </router-link>
          <router-link to="/education" class="feature-card" style="background-image: url('/images/paibian3.JPG'); background-size: cover; background-position: center;">
            <h3 class="card-title">教育科普</h3>
            <p class="card-desc">斗拱拼装游戏与知识问答</p>
            <el-button class="card-btn">
              <span>开始学习</span>
              <i class="iconfont icon-you" style="margin-left: 8px"></i>
            </el-button>
          </router-link>
        </div>
      </div>

      <!-- 4. 数字木塔（Data Cards Section） -->
      <div class="data-section">
        <h2 class="section-title">
          <i class="iconfont icon-shuju" style="margin-right: 12px; color: #8b4513"></i>
          数字木塔
        </h2>
        <div class="data-cards-wrapper">
          <div class="data-cards-track">
            <div class="data-cards">
              <div v-for="(card, index) in dataCards" :key="'original-' + index" class="data-card">
                <div class="card-icon">{{ card.icon }}</div>
                <div class="card-value">{{ card.value }}</div>
                <div class="card-unit">{{ card.unit }}</div>
                <div class="card-label">{{ card.label }}</div>
              </div>
            </div>
            <div class="data-cards">
              <div v-for="(card, index) in dataCards" :key="'copy-' + index" class="data-card">
                <div class="card-icon">{{ card.icon }}</div>
                <div class="card-value">{{ card.value }}</div>
                <div class="card-unit">{{ card.unit }}</div>
                <div class="card-label">{{ card.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. 千年传奇（Timeline Section） -->
      <div class="timeline-section">
        <h2 class="section-title">
          <i class="iconfont icon-time" style="margin-right: 12px; color: #8b4513"></i>
          千年传奇
        </h2>
        <div class="timeline-container">
          <div class="timeline-track-wrapper">
            <div class="timeline-track">
              <div
                v-for="(event, index) in timelineEvents"
                :key="index"
                class="timeline-node"
                @click="openEventDetail(event)"
              >
                <div class="node-dot"></div>
                <div class="node-content">
                  <div class="node-year">{{ event.year }}</div>
                  <div class="node-title">{{ event.title }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="timeline-cta">
            <router-link to="/history" class="timeline-cta-button">
              查看完整历史
              <i class="iconfont icon-arrow-right" style="margin-left: 8px"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 6. 抗震之谜（Seismic Section） -->
      <div class="seismic-section">
        <h2 class="section-title">
          <i class="iconfont icon-dizhen" style="margin-right: 12px; color: #8b4513"></i>
          抗震之谜
        </h2>
        <div class="seismic-content">
          <router-link to="/tower/mechanics" class="seismic-cta">
            了解抗震原理
            <i class="iconfont icon-arrow-right" style="margin-left: 8px"></i>
          </router-link>
          <div class="seismic-highlight">
            <p>历经7级以上地震多次，依然屹立千年</p>
          </div>
          <div class="earthquake-list">
            <div class="earthquake-item">
              <div class="earthquake-year">1303年</div>
              <div class="earthquake-name">洪洞地震</div>
              <div class="earthquake-level">8.0级</div>
              <div class="earthquake-result">✓ 木塔完好</div>
            </div>
            <div class="earthquake-item">
              <div class="earthquake-year">1626年</div>
              <div class="earthquake-name">灵丘地震</div>
              <div class="earthquake-level">7.0级</div>
              <div class="earthquake-result">✓ 木塔完好</div>
            </div>
            <div class="earthquake-item">
              <div class="earthquake-year">1683年</div>
              <div class="earthquake-name">原平地震</div>
              <div class="earthquake-level">7.0级</div>
              <div class="earthquake-result">✓ 木塔完好</div>
            </div>
            <div class="earthquake-item">
              <div class="earthquake-year">1926年</div>
              <div class="earthquake-name">军阀炮击</div>
              <div class="earthquake-level">—</div>
              <div class="earthquake-result">✓ 木塔屹立</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. 数据与研究（Data & Research Section） -->
      <div class="research-section">
        <h2 class="section-title">
          <i class="iconfont icon-yuyan" style="margin-right: 12px; color: #8b4513"></i>
          数据与研究
        </h2>
        <div class="research-content">
          <div class="stats-grid">
            <div class="research-stat">
              <div class="stat-value">20+</div>
              <div class="stat-desc">论文引用</div>
            </div>
            <div class="research-stat">
              <div class="stat-value">500+</div>
              <div class="stat-desc">数字化档案</div>
            </div>
            <div class="research-stat">
              <div class="stat-value">170万</div>
              <div class="stat-desc">模型面数</div>
            </div>
            <div class="research-stat">
              <div class="stat-value">15%</div>
              <div class="stat-desc">高精度覆盖率</div>
            </div>
          </div>
          <div class="reference-list">
            <h3 class="reference-title">参考文献</h3>
            <ul class="reference-items">
              <li class="reference-item">应县木塔抗震性能研究</li>
              <li class="reference-item">应县木塔风荷载分析</li>
              <li class="reference-item">中国古代建筑史</li>
              <li class="reference-item">营造法式解读</li>
              <li class="reference-item">应县木塔保护修缮工程报告</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="footer">
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">数据来源</a>
          <a href="#">帮助</a>
        </div>
        <div class="footer-copyright">
          © 2024 应县木塔数字孪生与交互平台 |
          数据来源：《应县木塔抗震性能研究》《应县木塔风荷载分析》《中国古代建筑史》及公开学术论文
        </div>
      </div>

      <!-- 事件详情模态框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="selectedEvent?.title"
        width="600px"
        class="event-dialog"
      >
        <div class="event-detail">
          <div class="event-year-badge">{{ selectedEvent?.year }}</div>
          <div class="event-description">{{ selectedEvent?.description }}</div>
        </div>
      </el-dialog>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const router = useRouter()

// 轮播图配置
const currentSlide = ref(0)
const carouselImages = ref([
  '/images/all.JPG',
  '/images/bihua1.JPG',
  '/images/ceiling2.JPG',
  '/images/dougong1.JPG',
  '/images/f2.JPG',
  '/images/f3.JPG',
  '/images/f8.JPG',
  '/images/m5.JPG',
  '/images/m10.JPG',
  '/images/m14.JPG',
  '/images/paibian1.JPG',
  '/images/paibian3.JPG'
])
let carouselTimer: any = null

// 计算 上一张/下一张 索引（堆叠轮播核心）
const prevIndex = computed(() => {
  return (currentSlide.value - 1 + carouselImages.value.length) % carouselImages.value.length
})
const nextIndex = computed(() => {
  return (currentSlide.value + 1) % carouselImages.value.length
})

// 图片放大预览
const previewVisible = ref(false)
const openPreview = () => {
  previewVisible.value = true
}

// 左右滑动功能
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselImages.value.length) % carouselImages.value.length
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
}

// 自动轮播
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.value.length
  }, 3500)
}

// 3D预览相关
const previewRef = ref<HTMLElement | null>(null)
const previewLoaded = ref(false)

let previewScene: THREE.Scene | null = null
let previewCamera: THREE.PerspectiveCamera | null = null
let previewRenderer: THREE.WebGLRenderer | null = null
let previewControls: OrbitControls | null = null
let previewModel: any = null
let previewClock: any = null
let previewCleanup: (() => void) | null = null

// 数字木塔数据
const dataCards = [
  { icon: '📏', value: '67.31', unit: '米', label: '总高度' },
  { icon: '🏛️', value: '54', unit: '种', label: '斗拱类型' },
  { icon: '🔩', value: '3000+', unit: '个', label: '构件数量' },
  { icon: '🌲', value: '32', unit: '根', label: '柱子数量' },
  { icon: '🏠', value: '2.8', unit: '米', label: '最大出檐' },
  { icon: '📈', value: '1.853', unit: '秒', label: '自振周期' },
  { icon: '💻', value: '170', unit: '万', label: '模型面数' },
  { icon: '📁', value: '500+', unit: '个', label: '数字化档案' }
]

// 时间轴事件数据
const timelineEvents = [
  {
    year: '1056年',
    title: '辽代皇家的“空中佛殿”',
    description:
      '辽清宁二年，由辽兴宗耶律宗真敕建，是为了纪念其母萧太后家族故里。这座高达65.84米的木塔，在当时的塞北荒原上如擎天巨柱。它不仅是佛宫寺的核心，更兼具军事瞭望功能。全塔没用一根铁钉，仅靠54种、480朵斗拱卯榫咬合，将上万立方米木材紧密相连。初建时的它，通体涂金，供奉着佛牙舍利，是辽代佛教与皇家威仪的巅峰之作。'
  },
  {
    year: '1195年',
    title: '金代的“完美收官”',
    description:
      '金明昌六年，木塔迎来第一次大规模增修。这次修缮重点在于佛像的重塑与布局完善。工匠们在第四层增设了“华严三圣”佛像群，在第五层构建了密教曼荼罗坛场。这次修缮让木塔的宗教内涵更加丰富，外观形制也基本定型，从此确立了它“五层六檐、八角九层”的千古身姿。'
  },
  {
    year: '1303年',
    title: '洪洞大地震的“生死考验”',
    description:
      '这一年，山西洪洞发生8级大地震，史载“山崩泉涌，坏舍千万”。震中距应县虽远，但木塔所在地遭遇了极高烈度的震动。然而，木塔凭借独特的“筒中筒”结构和暗层斜撑的“柔性”机制，不仅未倒，仅受微损。这场地震让世人见识了中国古建“以柔克刚”的惊人抗震能力，木塔也因此被记录为古代木结构抗震的“活教材”。'
  },
  {
    year: '1626年',
    title: '灵丘强震后的“岁月修茸”',
    description:
      '山西灵丘发生7级强震，木塔虽距震中较近，却依然坚挺。震后，木塔表面出现些许裂缝与构件松动。明朝官方并未急于大修，而是在随后的岁月里，由地方乡绅与僧人适时进行了“补苴罅漏”的维护。这种顺其自然、修旧如旧的理念，保留了木塔历经风雨后的沧桑质感，也避免了过度干预对文物本体的伤害。'
  },
  {
    year: '1683年',
    title: '原平地震的“轻微震颤”',
    description:
      '原平发生7级地震，木塔再次经受住了考验。据记载，当时塔身仅“微有晃动”，塔檐风铃作响。这次地震让木塔的结构损伤进一步累积，虽然未造成结构性崩塌，但为清代中后期的局部修缮埋下了伏笔。木塔仿佛一位历经沧桑的老者，在一次次大地的颤抖中，默默消化着伤痛。'
  },
  {
    year: '1933年',
    title: '梁思成的“学术救赎”',
    description:
      '这是木塔命运的转折点。时任中国营造学社研究员的梁思成，慕名来到应县。他与莫宗江等人在艰苦的条件下，耗时6天，徒手攀爬，详细测绘了木塔的每一根立柱、每一朵斗拱。更惊险的是，梁思成曾冒着雷暴与风雪，徒手攀上塔顶铁刹测绘数据。这次测绘不仅留下了《营造法式》般的珍贵图纸，更让这座沉睡千年的国宝，重新走入了中国现代建筑史学的视野。'
  },
  {
    year: '1961年',
    title: '国宝身份的“官方认证”',
    description:
      '3月4日，国务院公布第一批全国重点文物保护单位名单，应县木塔赫然在列。这意味着它从一座民间古塔，上升为国家级文化遗产。国家的重视，为木塔后续的科学保护奠定了法律与资源基础，结束了长期以来缺乏系统管理的状态，标志着木塔保护进入了规范化、制度化的新时代。'
  },
  {
    year: '2012年',
    title: '告别漏雨的“结构抢险”',
    description:
      '针对木塔长期漏雨导致木构件腐朽的顽疾，文物部门启动了针对性的屋面保养工程。工匠们身系绳索，在高空对破损瓦片进行修补，彻底解决了“水患”这一威胁木塔寿命的最大杀手。这次修缮没有大拆大建，而是通过精准的“微创”处理，为木塔筑起了一道防水屏障，极大延长了构件的使用寿命。'
  },
  {
    year: '2024年',
    title: '数字永生的“未来守护”',
    description:
      '联想集团与清华大学合作启动“智慧应县木塔”项目，利用AI、空间计算和神经辐射场（NeRF）技术，为木塔建立高精度数字孪生体。通过无人机与360度相机的全景扫描，超过1500万面片的素材被采集，构建出虚拟的“数字木塔”。这不仅让因结构危险无法登塔的游客，能通过VR沉浸式体验古建之美，更为木塔留下了一份永不磨灭的“数字基因”，开启了科技守护文化遗产的新篇章。'
  }
]

// 模态框状态
const dialogVisible = ref(false)
const selectedEvent = ref<any>(null)

// 打开事件详情
const openEventDetail = (event: any) => {
  selectedEvent.value = event
  dialogVisible.value = true
}

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path)
}

// 初始化3D预览
const initPreview = (): (() => void) | null => {
  if (!previewRef.value) return null

  const container = previewRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  previewScene = new THREE.Scene()
  previewScene.background = new THREE.Color(0xf9f5e9)
  previewScene.fog = new THREE.FogExp2(0xf9f5e9, 0.003)

  previewCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  previewCamera.position.set(8, 6, 12)

  previewRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  previewRenderer.setPixelRatio(window.devicePixelRatio)
  previewRenderer.setSize(width, height)
  previewRenderer.shadowMap.enabled = true
  previewRenderer.shadowMap.type = THREE.PCFSoftShadowMap
  previewRenderer.setClearColor(0xf9f5e9)
  container.appendChild(previewRenderer.domElement)

  previewControls = new OrbitControls(previewCamera, previewRenderer.domElement)
  previewControls.enableDamping = true
  previewControls.dampingFactor = 0.05
  previewControls.target.set(0, 3.5, 0)
  previewControls.enableRotate = true
  previewControls.enableZoom = true
  previewControls.enablePan = true
  previewControls.zoomSpeed = 1.0
  previewControls.minDistance = 5
  previewControls.maxDistance = 50

  previewScene.add(new THREE.AmbientLight(0xffffff, 1.5))
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5)
  mainLight.position.set(5, 10, 7)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  previewScene.add(mainLight)
  const backLight = new THREE.DirectionalLight(0xffffff, 1.0)
  backLight.position.set(-3, 2, -5)
  previewScene.add(backLight)
  const fillLight = new THREE.PointLight(0xffffff, 0.8)
  fillLight.position.set(0, 1, 0)
  previewScene.add(fillLight)

  const gridHelper = new THREE.GridHelper(100, 20, 0x8b6914, 0xd2b48c)
  gridHelper.position.y = -0.1
  if (gridHelper.material) {
    const material = gridHelper.material as THREE.Material
    material.transparent = true
    material.opacity = 0.4
  }
  previewScene.add(gridHelper)

  const groundPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    })
  )
  groundPlane.rotation.x = -Math.PI / 2
  groundPlane.position.y = -0.05
  groundPlane.receiveShadow = true
  previewScene.add(groundPlane)

  previewClock = new THREE.Clock()

  const animate = () => {
    requestAnimationFrame(animate)
    if (previewControls) previewControls.update()
    if (previewRenderer && previewScene && previewCamera)
      previewRenderer.render(previewScene, previewCamera)
  }
  animate()

  const handleResize = () => {
    if (!previewRef.value || !previewCamera || !previewRenderer) return
    const newWidth = previewRef.value.clientWidth
    const newHeight = previewRef.value.clientHeight
    previewCamera.aspect = newWidth / newHeight
    previewCamera.updateProjectionMatrix()
    previewRenderer.setSize(newWidth, newHeight)
  }
  window.addEventListener('resize', handleResize)

  loadPreviewModel()

  return function cleanup() {
    window.removeEventListener('resize', handleResize)
    if (previewRenderer) previewRenderer.dispose()
    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }
}

// 加载预览模型
const loadPreviewModel = async () => {
  if (!previewScene) return
  const modelPaths = [
    '/Ming5.glb',
    './Ming5.glb',
    '/public/Ming5.glb',
    '/models/Ming5.glb',
    '/static/Ming5.glb',
    '/src/assets/Ming5.glb'
  ]
  for (const path of modelPaths) {
    try {
      const loader = new GLTFLoader()
      loader.load(
        path,
        (gltf) => {
          const loadedModel = gltf.scene
          const box = new THREE.Box3().setFromObject(loadedModel)
          const size = box.getSize(new THREE.Vector3())
          const center = box.getCenter(new THREE.Vector3())
          const targetHeight = 15
          const scale = targetHeight / size.y
          loadedModel.scale.setScalar(scale)
          const modelBottom = center.y - size.y / 2
          const groundLevel = 0
          const distanceToGround = groundLevel - modelBottom * scale
          loadedModel.position.x = -center.x * scale
          loadedModel.position.z = -center.z * scale
          loadedModel.position.y = distanceToGround
          loadedModel.traverse((child) => {
            if (child && (child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh
              mesh.castShadow = true
              mesh.receiveShadow = true
            }
          })
          previewScene?.add(loadedModel)
          previewModel = loadedModel
          previewLoaded.value = true
        },
        () => {},
        () => {}
      )
      await new Promise((resolve) => setTimeout(resolve, 2000))
      if (previewModel) break
    } catch (error) {
      // 修复ESLint空块错误
      console.warn('模型加载失败，使用替代模型')
    }
  }
  if (!previewModel) createPreviewFallbackModel()
}

// 创建预览替代模型
const createPreviewFallbackModel = () => {
  if (!previewScene) return
  const group = new THREE.Group()
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 3, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.3 })
  )
  tower.position.y = 5
  tower.castShadow = true
  group.add(tower)
  const top = new THREE.Mesh(
    new THREE.ConeGeometry(2, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })
  )
  top.position.y = 11.5
  top.castShadow = true
  group.add(top)
  for (let i = 1; i <= 5; i++) {
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2 + i * 0.1, 2.2 + i * 0.1, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.4 })
    )
    floor.position.y = i * 2
    floor.castShadow = true
    group.add(floor)
  }
  previewScene.add(group)
  previewModel = group
  previewLoaded.value = true
}

// 生命周期
onMounted(() => {
  startCarousel()
  previewCleanup = initPreview()
})

onUnmounted(() => {
  if (carouselTimer) clearInterval(carouselTimer)
  if (previewCleanup) previewCleanup()
})
</script>

<style scoped>
/* 页面基础样式 */
.tower-home-page {
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
.tower-home-page::before {
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

/* 英雄区核心样式 */
.hero-section {
  margin-bottom: 80px;
}

.hero-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 28px 40px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(245, 232, 208, 0.9));
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  height: 500px;
}

.hero-left {
  flex: 0。95;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.hero-text-content {
  margin-bottom: 24px;
}

.hero-right {
  flex: 1.05;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ====================== 3D堆叠轮播核心样式 ====================== */
.stack-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  cursor: pointer;
}

.carousel-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  max-height: 400px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 中间主图（最大、最前） */
.slide-active {
  z-index: 3;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

/* 左侧次图（缩小、靠左、靠后） */
.slide-prev {
  z-index: 2;
  transform: translate(-75%, -50%) scale(0.85);
  opacity: 0.8;
}

/* 右侧次图（缩小、靠右、靠后） */
.slide-next {
  z-index: 2;
  transform: translate(-25%, -50%) scale(0.85);
  opacity: 0.8;
}
/* ============================================================== */

.hero-title {
  font-size: 56px;
  line-height: 1.1;
  color: #8b4513;
  margin: 0 0 10px 0;
  font-weight: 800;
  letter-spacing: 4px;
}

.hero-subtitle {
  font-size: 24px;
  color: #795548;
  margin: 0 0 12px 0;
  font-weight: 500;
  line-height: 1.4;
}

.hero-tagline {
  font-size: 20px;
  color: #a1887f;
  margin: 0;
  font-style: italic;
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 320px;
}

.stat-label {
  font-size: 18px;
  color: #8d6e63;
  font-weight: 500;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: #8b4513;
  line-height: 1;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(157, 41, 51, 0.25);
}

.cta-button.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: white;
}

.cta-button:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(157, 41, 51, 0.35);
}

/* 通用板块标题 */
.section-title {
  font-size: 42px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 16px 0;
  padding-left: 16px;
  border-left: 5px solid #8b4513;
  display: flex;
  align-items: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.section-header {
  margin-bottom: 48px;
}

.section-subtitle {
  font-size: 20px;
  color: #795548;
  margin: 0;
  padding-left: 21px;
}

/* 时间轴 */
.timeline-section {
  width: 100%;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
}

.timeline-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.timeline-container {
  position: relative;
}

.timeline-track-wrapper {
  overflow-x: hidden;
  padding: 30px 20px;
}

.timeline-track {
  display: flex;
  gap: 60px;
  min-width: max-content;
  padding: 0 40px;
  position: relative;
  animation: timelineAutoScroll 40s linear infinite alternate;
}

@keyframes timelineAutoScroll {
  100% {
    transform: translateX(0);
  }
  0% {
    transform: translateX(calc(-100% + 1200px));
  }
}

.timeline-track:hover {
  animation-play-state: paused;
}

.timeline-track::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #8b4513, #d7a856, #8b4513);
  border-radius: 2px;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  position: relative;
  z-index: 2;
}

.timeline-node:hover {
  transform: translateY(-8px);
}

.timeline-cta {
  text-align: center;
  margin-top: 40px;
}

.timeline-cta-button {
  display: inline-block;
  padding: 14px 28px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(157, 41, 51, 0.3);
}

.timeline-cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(157, 41, 51, 0.4);
  background: linear-gradient(135deg, #802028, #a03025);
}

.node-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #8b4513;
  margin-bottom: 16px;
  position: relative;
  border: 4px solid #f9f5e9;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  transition: all 0.3s ease;
}

.timeline-node:hover .node-dot {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.5);
}

.node-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffd700;
}

.node-content {
  text-align: center;
}

.node-year {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin-bottom: 8px;
}

.node-title {
  font-size: 17px;
  color: #6d4c41;
  line-height: 1.4;
  max-width: 160px;
}

/* 数字木塔 */
.data-section {
  width: 100%;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;
}

.data-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.data-cards-wrapper {
  overflow: hidden;
  padding: 10px 0;
}

.data-cards-track {
  display: flex;
  width: fit-content;
  animation: scrollData 40s linear infinite;
  gap: 28px;
}

.data-cards-track:hover {
  animation-play-state: paused;
}

@keyframes scrollData {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 28px));
  }
}

.data-cards {
  display: flex;
  gap: 28px;
  flex-shrink: 0;
}

.data-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.4s ease;
  cursor: pointer;
  min-width: 200px;
}

.data-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
  background: rgba(255, 255, 255, 0.95);
}

.card-icon {
  font-size: 52px;
  margin-bottom: 16px;
}

.card-value {
  font-size: 40px;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  color: #8b4513;
  margin-bottom: 8px;
}

.card-unit {
  font-size: 20px;
  color: #a1887f;
  margin-bottom: 12px;
}

.card-label {
  font-size: 19px;
  color: #6d4c41;
  font-weight: 500;
}

/* 抗震之谜 */
.seismic-section {
  width: 100%;
  margin-bottom: 80px;
  background-image: url('/images/tianxiaqiguan.JPG');
  background-size: cover;
  background-position: center;
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.seismic-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
  transition: all 0.3s ease;
}

.seismic-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.seismic-section:hover::after {
  background: rgba(0, 0, 0, 0.15);
}

.seismic-content {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.12);
  position: relative;
  z-index: 2;
}

.seismic-cta {
  position: absolute;
  top: 24px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 10;
}

.seismic-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(30, 136, 131, 0.35);
}

.seismic-highlight {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.seismic-highlight p {
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.earthquake-list {
  margin-bottom: 0;
}

.seismic-content .earthquake-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(4px) !important;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s ease;
}

.earthquake-item:hover {
  transform: translateX(8px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.3) !important;
}

.earthquake-year {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.earthquake-name {
  font-size: 20px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.earthquake-level {
  font-size: 22px;
  font-weight: 700;
  color: #ffcccc;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.earthquake-result {
  font-size: 20px;
  color: #ccffcc;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.seismic-section .section-title {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
}

/* 结构之美 */
.feature-section {
  width: 100%;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
}

.feature-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  min-width: 280px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #fff;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  transition: all 0.3s ease;
}

.feature-card:hover::after {
  background: rgba(0, 0, 0, 0.2);
}

.feature-card > * {
  position: relative;
  z-index: 2;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b4513, #a0522d);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.feature-card:hover::before {
  width: 80px;
  height: 80px;
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 24px 48px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
  background: rgba(255, 255, 255, 0.95);
}

.card-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5e8d0, #e6d5b8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.feature-card:hover .card-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(139, 69, 19, 0.2);
}

.feature-card .card-icon {
  font-size: 56px;
  margin-bottom: 0;
}

.feature-card .card-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 16px 0;
  text-align: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.feature-card .card-desc {
  font-size: 18px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0 0 32px 0;
  text-align: center;
  line-height: 1.6;
}

.feature-card .card-btn {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 12px 32px;
  font-size: 17px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.feature-card .card-btn:hover {
  background: linear-gradient(135deg, #802028, #a03025);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.35);
}

/* 探索木塔 */
.preview-section {
  width: 100%;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
}

.preview-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.preview-content {
  display: flex;
  gap: 48px;
  align-items: stretch;
  flex-wrap: wrap;
}

.preview-3d {
  flex: 1.3;
  min-width: 450px;
  height: 650px;
  border-radius: 24px;
  background: radial-gradient(circle, #fff, #f5e8d0);
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.preview-placeholder {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 70px;
  height: 70px;
  border: 4px solid rgba(139, 69, 19, 0.15);
  border-radius: 50%;
  border-top-color: #8b4513;
  animation: spin 1s infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.placeholder-text {
  font-size: 19px;
  color: #6d4c41;
  margin: 0;
  font-weight: 500;
}

.preview-info {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid #e6c890;
}

.info-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 24px 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px dashed #e0d5c0;
  font-size: 18px;
  color: #6d4c41;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 24px;
}

.preview-cta {
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.preview-cta.primary {
  background: linear-gradient(135deg, #9d2933, #c0392b);
}

.preview-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(230, 126, 34, 0.35);
}

.preview-cta.secondary {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  color: #8b4513;
  border: 2px solid #e6c890;
  box-shadow: 0 6px 20px rgba(196, 147, 70, 0.12);
}

.preview-cta.secondary:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.2);
  border-color: #d4b17a;
}

.preview-cta-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* 数据与研究 */
.research-section {
  width: 100%;
  margin-bottom: 80px;
  background: linear-gradient(145deg, #f5e8d0, #f9f0e0);
  padding: 50px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(196, 147, 70, 0.12);
  transition: all 0.3s ease;
}

.research-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(196, 147, 70, 0.18);
}

.research-content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stats-grid {
  flex: 1;
  min-width: 320px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.research-stat {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.research-stat:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(139, 69, 19, 0.15);
}

.stat-value {
  font-size: 40px;
  font-weight: 800;
  font-family: 'Orbitron', sans-serif;
  color: #8b4513;
  margin-bottom: 12px;
}

.stat-desc {
  font-size: 19px;
  color: #795548;
  font-weight: 500;
}

.reference-list {
  flex: 1;
  min-width: 320px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border-radius: 20px;
  border: 1px solid #e6c890;
  padding: 32px;
}

.reference-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 24px 0;
}

.reference-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reference-item {
  font-size: 18px;
  color: #6d4c41;
  margin-bottom: 16px;
  padding-left: 24px;
  position: relative;
  line-height: 1.6;
}

.reference-item::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: #8b4513;
  font-weight: bold;
  font-size: 14px;
}

/* 底部导航 */
.footer {
  width: 100%;
  margin-top: 80px;
  padding-top: 40px;
  border-top: 2px solid #e6c890;
  text-align: center;
}

.footer-links {
  margin-bottom: 20px;
}

.footer-links a {
  color: #8b4513;
  text-decoration: none;
  margin: 0 24px;
  font-size: 17px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #5d4037;
}

.footer-copyright {
  font-size: 15px;
  color: #795548;
  line-height: 1.8;
}

/* 事件详情模态框 */
.event-detail {
  padding: 10px 0;
}

.event-year-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #8b4513, #a0522d);
  color: white;
  font-size: 20px;
  font-weight: 700;
  border-radius: 20px;
  margin-bottom: 20px;
}

.event-description {
  font-size: 17px;
  color: #5d4037;
  line-height: 1.8;
}
.stack-carousel {
  position: relative;
  width: 100%;
  height: 450px;
  cursor: pointer;
  perspective: 1200px;
  transform-style: preserve-3d;
}
.carousel-img {
  position: absolute;
  top: 50%;
  left: 50%;
  object-fit: cover;
  width: 70%;
  height: 100%;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
  backface-visibility: hidden;
}
.slide-active {
  z-index: 3;
  transform: translate(-50%, -50%) translateZ(120px) scale(1);
  opacity: 1;
  filter: brightness(1.05);
}
.slide-prev {
  z-index: 2;
  transform: translate(-95%, -50%) rotateY(35deg) scale(0.82);
  opacity: 0.55;
  filter: blur(1px) brightness(0.75);
}

.slide-next {
  z-index: 2;
  transform: translate(-5%, -50%) rotateY(-35deg) scale(0.82);
  opacity: 0.55;
  filter: blur(1px) brightness(0.75);
}
.slide-active {
  animation: floatPulse 4s ease-in-out infinite;
}

@keyframes floatPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) translateZ(120px) scale(1);
  }
  50% {
    transform: translate(-50%, -52%) translateZ(130px) scale(1.02);
  }
}

/* 轮播控制按钮 */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
}

.carousel-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: 24px;
  color: #8b4513;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.carousel-btn.prev-btn {
  left: 20px;
}

.carousel-btn.next-btn {
  right: 20px;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .hero-layout {
    flex-direction: column;
    gap: 40px;
    height: auto;
    padding: 30px 40px;
  }
  .hero-left {
    text-align: center;
    width: 100%;
  }
  .hero-stats {
    align-items: center;
    margin: 0 auto 24px;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-right {
    width: 100%;
  }
  .preview-content {
    flex-direction: column;
  }
  .preview-3d {
    width: 100%;
    min-width: auto;
  }
  .research-content {
    flex-direction: column;
  }
  .stats-grid {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-title {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .tower-home-page {
    padding: 24px 16px;
  }
  .hero-title {
    font-size: 40px;
    letter-spacing: 2px;
  }
  .hero-subtitle {
    font-size: 20px;
  }
  .section-title {
    font-size: 36px;
  }
  .earthquake-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .feature-cards {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .preview-3d {
    min-width: 100%;
    height: 500px;
  }
  .preview-info {
    min-width: 100%;
  }
  .seismic-cta {
    position: static;
    margin-bottom: 24px;
    display: inline-flex;
  }
  .hero-layout,
  .timeline-section,
  .data-section,
  .seismic-section,
  .feature-section,
  .preview-section,
  .research-section {
    padding: 30px 24px;
    border-radius: 20px;
  }
  @keyframes timelineAutoScroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-100% + 400px));
    }
  }
  /* 移动端轮播适配 */
  .slide-prev {
    transform: translate(-80%, -50%) scale(0.8);
  }
  .slide-next {
    transform: translate(-20%, -50%) scale(0.8);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 32px;
  }
  .hero-subtitle {
    font-size: 18px;
  }
  .section-title {
    font-size: 30px;
  }
  .seismic-highlight p {
    font-size: 26px;
  }
  .data-card {
    min-width: 180px;
    padding: 24px 20px;
  }
  .card-value {
    font-size: 36px;
  }
}
</style>
