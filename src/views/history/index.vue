<template>
  <div class="history-page">
    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tower' }">
          <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-time" style="margin-right: 4px"></i>千年传奇
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="iconfont icon-time" style="margin-right: 12px; color: #8b4513"></i>
        千年传奇：应县木塔的九段历史
      </h1>
      <p class="page-subtitle">从辽代皇家敕建到现代数字永生，见证木塔近千年的风雨历程</p>
    </div>

    <!-- 历史时间轴 -->
    <div class="timeline-container">
      <div class="timeline-track">
        <div 
          v-for="(event, index) in timelineEvents" 
          :key="index"
          class="timeline-item"
          :class="{ 'active': activeIndex >= index }"
          :style="{ animationDelay: `${index * 0.3}s` }"
        >
          <div class="timeline-year">{{ event.year }}</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ event.title }}</h3>
            <p class="timeline-description">{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 回到首页按钮 -->
    <div class="back-container">
      <router-link to="/" class="back-button">
        <i class="iconfont icon-arrow-left" style="margin-right: 8px"></i>
        返回首页
      </router-link>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 时间轴事件数据
const timelineEvents = [
  {
    year: '1056年',
    title: '辽代皇家的“空中佛殿”',
    description: '辽清宁二年，由辽兴宗耶律宗真敕建，是为了纪念其母萧太后家族故里。这座高达65.84米的木塔，在当时的塞北荒原上如擎天巨柱。它不仅是佛宫寺的核心，更兼具军事瞭望功能。全塔没用一根铁钉，仅靠54种、480朵斗拱卯榫咬合，将上万立方米木材紧密相连。初建时的它，通体涂金，供奉着佛牙舍利，是辽代佛教与皇家威仪的巅峰之作。'
  },
  {
    year: '1195年',
    title: '金代的“完美收官”',
    description: '金明昌六年，木塔迎来第一次大规模增修。这次修缮重点在于佛像的重塑与布局完善。工匠们在第四层增设了“华严三圣”佛像群，在第五层构建了密教曼荼罗坛场。这次修缮让木塔的宗教内涵更加丰富，外观形制也基本定型，从此确立了它“五层六檐、八角九层”的千古身姿。'
  },
  {
    year: '1303年',
    title: '洪洞大地震的“生死考验”',
    description: '这一年，山西洪洞发生8级大地震，史载“山崩泉涌，坏舍千万”。震中距应县虽远，但木塔所在地遭遇了极高烈度的震动。然而，木塔凭借独特的“筒中筒”结构和暗层斜撑的“柔性”机制，不仅未倒，仅受微损。这场地震让世人见识了中国古建“以柔克刚”的惊人抗震能力，木塔也因此被记录为古代木结构抗震的“活教材”。'
  },
  {
    year: '1626年',
    title: '灵丘强震后的“岁月修茸”',
    description: '山西灵丘发生7级强震，木塔虽距震中较近，却依然坚挺。震后，木塔表面出现些许裂缝与构件松动。明朝官方并未急于大修，而是在随后的岁月里，由地方乡绅与僧人适时进行了“补苴罅漏”的维护。这种顺其自然、修旧如旧的理念，保留了木塔历经风雨后的沧桑质感，也避免了过度干预对文物本体的伤害。'
  },
  {
    year: '1683年',
    title: '原平地震的“轻微震颤”',
    description: '原平发生7级地震，木塔再次经受住了考验。据记载，当时塔身仅“微有晃动”，塔檐风铃作响。这次地震让木塔的结构损伤进一步累积，虽然未造成结构性崩塌，但为清代中后期的局部修缮埋下了伏笔。木塔仿佛一位历经沧桑的老者，在一次次大地的颤抖中，默默消化着伤痛。'
  },
  {
    year: '1933年',
    title: '梁思成的“学术救赎”',
    description: '这是木塔命运的转折点。时任中国营造学社研究员的梁思成，慕名来到应县。他与莫宗江等人在艰苦的条件下，耗时6天，徒手攀爬，详细测绘了木塔的每一根立柱、每一朵斗拱。更惊险的是，梁思成曾冒着雷暴与风雪，徒手攀上塔顶铁刹测绘数据。这次测绘不仅留下了《营造法式》般的珍贵图纸，更让这座沉睡千年的国宝，重新走入了中国现代建筑史学的视野。'
  },
  {
    year: '1961年',
    title: '国宝身份的“官方认证”',
    description: '3月4日，国务院公布第一批全国重点文物保护单位名单，应县木塔赫然在列。这意味着它从一座民间古塔，上升为国家级文化遗产。国家的重视，为木塔后续的科学保护奠定了法律与资源基础，结束了长期以来缺乏系统管理的状态，标志着木塔保护进入了规范化、制度化的新时代。'
  },
  {
    year: '2012年',
    title: '告别漏雨的“结构抢险”',
    description: '针对木塔长期漏雨导致木构件腐朽的顽疾，文物部门启动了针对性的屋面保养工程。工匠们身系绳索，在高空对破损瓦片进行修补，彻底解决了“水患”这一威胁木塔寿命的最大杀手。这次修缮没有大拆大建，而是通过精准的“微创”处理，为木塔筑起了一道防水屏障，极大延长了构件的使用寿命。'
  },
  {
    year: '2024年',
    title: '数字永生的“未来守护”',
    description: '联想集团与清华大学合作启动“智慧应县木塔”项目，利用AI、空间计算和神经辐射场（NeRF）技术，为木塔建立高精度数字孪生体。通过无人机与360度相机的全景扫描，超过1500万面片的素材被采集，构建出虚拟的“数字木塔”。这不仅让因结构危险无法登塔的游客，能通过VR沉浸式体验古建之美，更为木塔留下了一份永不磨灭的“数字基因”，开启了科技守护文化遗产的新篇章。'
  }
]

// 激活的索引，用于控制动画效果
const activeIndex = ref(-1)

// 生命周期
onMounted(() => {
  // 滚动时激活对应项
  const handleScroll = () => {
    const items = document.querySelectorAll('.timeline-item')
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
        activeIndex.value = index
      }
    })
  }

  // 初始检查
  handleScroll()
  
  // 监听滚动
  window.addEventListener('scroll', handleScroll)
  
  // 自动滚动动画
  const interval = setInterval(() => {
    if (activeIndex.value < timelineEvents.length - 1) {
      activeIndex.value++
      // 滚动到当前项
      const currentItem = document.querySelectorAll('.timeline-item')[activeIndex.value]
      if (currentItem) {
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } else {
      clearInterval(interval)
    }
  }, 3000)
})
</script>

<style scoped>
/* 页面基础样式 */
.history-page {
  width: 100%;
  margin: 0;
  padding: 60px 5%;
  box-sizing: border-box;
  background-image: url('/images/m1.JPG');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #f9f5e9;
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
.history-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(249, 245, 233, 0.85);
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
  background: rgba(249, 245, 233, 0.8);
  border-radius: 24px;
  border: 2px solid rgba(185, 140, 88, 0.5);
  box-shadow: 0 12px 30px rgba(185, 140, 88, 0.1);
  transition: all 0.3s ease;
}

.page-header:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(185, 140, 88, 0.3);
}

.page-title {
  font-size: 56px;
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

/* 时间轴容器 */
.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0;
  background: rgba(249, 245, 233, 0.7);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.timeline-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.15);
}

.timeline-track {
  position: relative;
  padding-left: 80px;
}

/* 时间轴轨迹线 */
.timeline-track::before {
  content: '';
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #8b4513, #d4b17a);
}

/* 时间轴项 */
.timeline-item {
  position: relative;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  animation: slideIn 0.8s ease forwards;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 年份 */
.timeline-year {
  position: absolute;
  left: -80px;
  top: 0;
  font-size: 28px;
  font-weight: 700;
  color: #8b4513;
  background: rgba(249, 245, 233, 0.8);
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid rgba(230, 200, 144, 0.5);
  box-shadow: 0 2px 8px rgba(185, 140, 88, 0.1);
}

/* 时间轴点 */
.timeline-dot {
  position: absolute;
  left: -80px;
  top: 40px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b4513;
  transform: translateX(30px);
  border: 4px solid #f9f5e9;
  box-shadow: 0 0 0 2px #8b4513;
}

/* 内容 */
.timeline-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(230, 200, 144, 0.5);
  padding: 32px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.1);
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-content {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

/* 标题 */
.timeline-title {
  font-size: 24px;
  font-weight: 600;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

/* 描述 */
.timeline-description {
  font-size: 18px;
  color: #6d4c41;
  line-height: 1.6;
  margin: 0;
  font-family: 'Microsoft YaHei', serif;
}

/* 激活状态 */
.timeline-item.active .timeline-content {
  border-color: #8b4513;
  box-shadow: 0 12px 32px rgba(139, 69, 19, 0.3);
}

.timeline-item.active .timeline-dot {
  background: #9d2933;
  box-shadow: 0 0 0 4px rgba(157, 41, 51, 0.3);
}

/* 回到首页按钮 */
.back-container {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 40px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  background: linear-gradient(135deg, #9d2933, #c0392b);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
  background: linear-gradient(135deg, #802028, #a03025);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .history-page {
    padding: 16px 16px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .timeline-track {
    padding-left: 60px;
  }
  
  .timeline-year {
    left: -60px;
    font-size: 18px;
  }
  
  .timeline-dot {
    left: -60px;
    transform: translateX(20px);
  }
  
  .timeline-content {
    padding: 24px;
  }
  
  .timeline-title {
    font-size: 18px;
  }
  
  .timeline-description {
    font-size: 14px;
  }
}
</style>