<template>
  <div class="decoration-page">
    <!-- AI悬浮框 -->
    <AIChatBox />

    <div class="content-container">
    <!-- 顶部面包屑导航（国风样式） -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tower' }">
          <i class="iconfont icon-ta" style="margin-right: 4px"></i>应县木塔
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="iconfont icon-gongyi" style="margin-right: 4px"></i>装饰工艺
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 顶部操作栏（国风卡片） -->
    <el-card class="action-card chinese-card" shadow="never">
      <div class="action-bar">
        <div class="action-title">
          <h2>应县木塔装饰工艺</h2>
          <p>赏析千年古建的装饰艺术与文化内涵</p>
        </div>
        <div class="action-btns">
          <el-button class="chinese-btn primary" size="default" @click="handleARExperience">
            <i class="iconfont icon-ar" style="margin-right: 4px"></i>AR装饰体验
          </el-button>
          <el-button class="chinese-btn plain" size="default" @click="handleDownloadAtlas">
            <i class="iconfont icon-xiazai" style="margin-right: 4px"></i>下载装饰图鉴
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 核心布局：3D模型 + 图片展示 + 知识科普 -->
    <div class="main-container">
      <!-- 图片分类标签 -->
      <div class="category-tabs">
        <el-tabs v-model="activeCategory" class="decoration-tabs" @tab-change="handleCategoryChange">
          <el-tab-pane label="斗拱细节" name="dougong">
          </el-tab-pane>
          <el-tab-pane label="彩绘纹样" name="paint">
          </el-tab-pane>
          <el-tab-pane label="匾额" name="plaque">
          </el-tab-pane>
          <el-tab-pane label="佛像" name="buddha">
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 布局切换 -->
      <div :class="activeCategory === 'paint' ? 'two-column-layout' : 'three-column-layout'">
        <!-- 左侧：3D模型展示 -->
        <div class="left-column" v-if="activeCategory !== 'paint'">
          <el-card class="model-card chinese-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>
                  <i class="iconfont icon-3d" style="margin-right: 8px; color: #8b4513"></i>
                  3D模型展示
                </span>
                <div class="model-selector">
                  <!-- 斗拱模型选择 -->
                  <el-select v-if="activeCategory === 'dougong'" v-model="selectedModel" @change="loadSelectedModel" size="default">
                    <el-option label="斗拱模型1" value="DouGong1.glb"></el-option>
                    <el-option label="斗拱模型2" value="DouGong2.glb"></el-option>
                    <el-option label="斗拱模型3" value="DouGong3.glb"></el-option>
                  </el-select>
                  <!-- 匾额模型选择 -->
                  <el-select v-if="activeCategory === 'plaque'" v-model="selectedModel" @change="loadSelectedModel" size="default">
                    <el-option label="释迦塔匾额" value="ShiJiaTa.glb"></el-option>
                    <el-option label="天下奇观匾额" value="TianXiaQiGuan.glb"></el-option>
                    <el-option label="万古观瞻匾额" value="WanGu.glb"></el-option>
                    <el-option label="天柱地轴匾额" value="TianZhuDiZhou.glb"></el-option>
                  </el-select>
                  <!-- 佛像模型选择 -->
                  <el-select v-if="activeCategory === 'buddha'" v-model="selectedModel" @change="loadSelectedModel" size="default">
                    <el-option label="一层佛像" value="FoXiang_floor1.glb"></el-option>
                    <el-option label="二层佛像" value="FoXiang_Floor2blend.glb"></el-option>
                    <el-option label="三层佛像" value="FoXiang_Floor3.glb"></el-option>
                  </el-select>
                </div>
              </div>
            </template>
            <div class="model-container">
              <div ref="modelContainer" class="model-canvas"></div>
              <div v-if="isModelLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>模型正在加载中</p>
              </div>
              <div class="model-controls">
                <p class="control-tip">🖱️ 鼠标拖拽旋转 | 滚轮缩放 | 右键平移</p>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 中间：现实照片展示 -->
        <div class="middle-column">
          <el-card class="gallery-card chinese-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>
                  <i class="iconfont icon-gongyi" style="margin-right: 8px; color: #8b4513"></i>
                  现实照片展示
                </span>
              </div>
            </template>
            <div class="image-grid">
              <div
                v-for="item in currentCategoryImages"
                :key="item.id"
                class="image-item"
                @click="handleImageClick(item)"
              >
                <div class="image-wrapper">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="grid-image"
                    @error="handleImageError"
                    @load="handleImageLoad"
                  />
                  <div class="image-overlay">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：知识科普 -->
        <div class="right-column">
          <el-card class="intro-card chinese-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>
                  <i class="iconfont icon-wenzhang" style="margin-right: 8px; color: #8b4513"></i>
                  知识科普
                </span>
              </div>
            </template>
            <div class="intro-content">
              <h3>{{ currentCategoryIntro.title }}</h3>
              <p>{{ currentCategoryIntro.content }}</p>
              <div v-if="currentCategoryDetails" class="category-details">
                <h4>相关知识</h4>
                <ul>
                  <li v-for="(detail, index) in currentCategoryDetails" :key="index">{{ detail }}</li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 图片放大弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="selectedImage?.title"
        width="80%"
        class="image-dialog"
      >
        <div class="dialog-content">
          <img
            :src="selectedImage?.image"
            :alt="selectedImage?.title"
            class="dialog-image"
          />
          <div class="dialog-info">
            <h4>{{ selectedImage?.title }}</h4>
            <p>{{ selectedImage?.desc }}</p>
            <p class="dialog-detail">{{ selectedImage?.detail }}</p>
          </div>
        </div>
      </el-dialog>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import AIChatBox from '@/components/AIChatBox.vue'

// 装饰工艺图片数据
const decorationImages = {
  dougong: {
    'DouGong1.glb': [
      {
        id: 1,
        title: '斗拱模型1',
        desc: '基础斗拱结构',
        detail: '这是应县木塔中最基础的斗拱结构，展示了斗拱的基本组成部分和连接方式。斗拱由斗、拱、昂等部件组成，通过精密的榫卯结构连接，无需一钉一铆。',
        image: '/images/dougong3.JPG'
      }
    ],
    'DouGong2.glb': [
      {
        id: 2,
        title: '斗拱模型2',
        desc: '转角斗拱结构',
        detail: '这是应县木塔中的转角斗拱，采用45度斜拱设计，增强了结构稳定性，形成了独特的装饰效果。转角斗拱是木塔斗拱艺术的精华，展现了辽代工匠的精湛技艺。',
        image: '/images/dougong2.JPG'
      }
    ],
    'DouGong3.glb': [
      {
        id: 3,
        title: '斗拱模型3',
        desc: '复杂斗拱结构',
        detail: '这是应县木塔中较为复杂的斗拱结构，展示了辽代工匠的精湛技艺和斗拱的多样性。复杂斗拱结构不仅具有结构功能，还起到了重要的装饰作用。',
        image: '/images/decoration/dougong3.jpg'
      }
    ]
  },
  paint: [
    {
      id: 4,
      title: '一层壁画',
      desc: '辽代说法图，色彩鲜艳',
      detail: '一层内槽墙壁画是应县木塔彩绘的代表作。壁画高约3米，总长约20米，描绘了释迦牟尼说法场景。画面采用沥粉贴金工艺，色彩以朱红、石绿、石青为主，展现了辽代绘画艺术的高超水平。',
      image: '/images/decoration/paint-floor-1.jpg'
    },
    {
      id: 5,
      title: '二层飞天壁画',
      desc: '衣带飘动，栩栩如生',
      detail: '二层壁画以飞天为主题，飞天手持琵琶、箜篌等乐器，衣带飘动，栩栩如生，展现了辽代绘画艺术的高超水平。这些壁画不仅装饰了木塔，也反映了辽代的宗教信仰和艺术风格。',
      image: '/images/decoration/paint-floor-2.jpg'
    },
    {
      id: 6,
      title: '三层天花板壁画',
      desc: '莲花云纹，色彩绚丽',
      detail: '三层天花板彩绘是应县木塔保存最完好的彩绘之一。中央为圆形藻井，绘有莲花图案；四周为方形方格，绘有云纹、飞天花鸟。这些彩绘采用传统工艺制作，色彩鲜艳，保存完好。',
      image: '/images/ceiling2.JPG'
    }
  ],
  plaque: {
    'ShiJiaTa.glb': [
      {
        id: 7,
        title: '释迦塔匾额',
        desc: '明成祖朱棣题写',
        detail: '「释迦塔」匾额悬挂于塔身三层，为明成祖朱棣于永乐年间题写。匾长2.5米，宽1.2米，红底金字，是应县木塔最珍贵的匾额之一。朱棣亲笔题字，字体雄浑有力，为木塔增添了庄严的氛围。',
        image: '/images/decoration/ShiJiaTa.jpg'
      }
    ],
    'TianXiaQiGuan.glb': [
      {
        id: 8,
        title: '天下奇观匾额',
        desc: '清代官员题写',
        detail: '「天下奇观」匾额悬挂于木塔顶层，为清代官员于乾隆年间题写。匾长3米，宽1.5米，黑底金字，字体端庄大气，体现了木塔作为天下奇观的地位。该匾额是木塔历史的重要见证，展现了木塔在清代的崇高地位。',
        image: '/images/decoration/TianXiaQiGuan.JPG'
      }
    ],
    'WanGu.glb': [
      {
        id: 9,
        title: '万古观瞻匾额',
        desc: '寓意木塔万古长存，供人瞻仰',
        detail: '「万古观瞻」匾额悬挂于木塔中层，字体苍劲有力，表达了人们对木塔能够万古长存的美好祝愿。该匾额为清代书法家所题，展现了中国传统书法的魅力，供后人瞻仰。',
        image: '/images/decoration/WanGuGuanZhan.JPG'
      }
    ],
    'TianZhuDiZhou.glb': [
      {
        id: 10,
        title: '天柱地轴匾额',
        desc: '寓意木塔如天柱地轴般稳固',
        detail: '「天柱地轴」匾额悬挂于木塔底层，寓意木塔如天柱地轴般稳固。该匾额为明代官员所题，字体刚劲有力，展现了木塔的建筑精神和文化内涵，是木塔历史的重要见证。',
        image: '/images/decoration/TianZhuDiZhou.jpg'
      }
    ]
  },
  buddha: {
    'FoXiang_floor1.glb': [
      {
        id: 11,
        title: '一层释迦牟尼像',
        desc: '高11米，辽代彩塑',
        detail: '一层释迦牟尼像是应县木塔最大的造像。像高11米，为辽代彩塑，面容饱满，衣纹流畅。佛像两侧有胁侍菩萨像，共同构成「一佛二菩萨」布局。这尊佛像不仅是宗教艺术的珍品，也是研究辽代雕塑艺术的重要实物资料。',
        image: '/images/decoration/fo4.png'
      }
    ],
    'FoXiang_Floor2blend.glb': [
      {
        id: 12,
        title: '二层佛像',
        desc: '精美的辽代彩塑',
        detail: '二层佛像同样为辽代彩塑，工艺精湛，展现了辽代佛教艺术的高超水平。佛像造型优美，细节丰富，是辽代雕塑艺术的杰出代表。',
        image: '/images/decoration/fo5.png'
      }
    ],
    'FoXiang_Floor3.glb': [
      {
        id: 13,
        title: '三层佛像',
        desc: '独特的佛教造像',
        detail: '三层佛像具有独特的艺术风格，反映了辽代佛教艺术的多样性和创新性。佛像造型庄重，工艺精细，展现了辽代工匠的高超技艺。',
        image: '/images/f8.JPG'
      }
    ]
  }
}

// 工艺介绍文字
const categoryIntro = {
  dougong: {
    'DouGong1.glb': {
      title: '斗拱模型1',
      content: '这是应县木塔中最基础的斗拱结构，展示了斗拱的基本组成部分和连接方式。斗拱由斗、拱、昂等部件组成，通过精密的榫卯结构连接，无需一钉一铆。斗拱不仅具有结构功能，还起到了重要的装饰作用，是中国古代建筑的重要特征。'
    },
    'DouGong2.glb': {
      title: '斗拱模型2',
      content: '这是应县木塔中的转角斗拱，采用45度斜拱设计，增强了结构稳定性，形成了独特的装饰效果。转角斗拱是木塔斗拱艺术的精华，展现了辽代工匠的精湛技艺。这种斗拱设计不仅解决了结构问题，也创造了美观的视觉效果。'
    },
    'DouGong3.glb': {
      title: '斗拱模型3',
      content: '这是应县木塔中较为复杂的斗拱结构，展示了辽代工匠的精湛技艺和斗拱的多样性。复杂斗拱结构不仅具有结构功能，还起到了重要的装饰作用。这种斗拱设计体现了辽代建筑的高超水平，是中国古代建筑的重要遗产。'
    }
  },
  paint: {
    title: '彩绘工艺',
    content: '应县木塔彩绘主要分布在内槽墙壁、天花板和梁枋上。辽代原绘以朱红、石绿为主色调，内容包括佛像、飞天、缠枝莲等。彩绘采用沥粉贴金工艺，色彩鲜艳，保存完好。这些彩绘不仅装饰了木塔，也反映了辽代的艺术风格和宗教信仰。'
  },
  plaque: {
    'ShiJiaTa.glb': {
      title: '释迦塔匾额',
      content: '「释迦塔」匾额悬挂于塔身三层，为明成祖朱棣于永乐年间（1403-1424年）题写。匾长2.5米，宽1.2米，红底金字，是应县木塔最珍贵的匾额之一。朱棣作为明朝开国皇帝朱元璋的第四子，通过靖难之役夺取皇位，他亲笔题字，字体雄浑有力，为木塔增添了庄严的氛围。该匾额不仅是书法艺术的珍品，也是木塔与明代皇室关系的重要历史见证。'
    },
    'TianXiaQiGuan.glb': {
      title: '天下奇观匾额',
      content: '「天下奇观」匾额悬挂于木塔顶层，为清代官员于乾隆年间（1736-1795年）题写。匾长3米，宽1.5米，黑底金字，字体端庄大气，体现了木塔作为天下奇观的地位。该匾额采用传统工艺制作，经过精心雕刻和髹漆，具有很高的艺术价值。它是木塔历史的重要见证，展现了木塔在清代的崇高地位，也反映了当时人们对木塔建筑成就的高度评价。'
    },
    'WanGu.glb': {
      title: '万古观瞻匾额',
      content: '「万古观瞻」匾额悬挂于木塔中层，为清代著名书法家所题。字体苍劲有力，表达了人们对木塔能够万古长存的美好祝愿。该匾额采用优质木材制作，经过特殊处理，至今保存完好。它不仅是书法艺术的珍品，也是木塔历史的重要见证，供后人瞻仰和研究。'
    },
    'TianZhuDiZhou.glb': {
      title: '天柱地轴匾额',
      content: '「天柱地轴」匾额悬挂于木塔底层，为明代官员所题。字体刚劲有力，寓意木塔如天柱地轴般稳固。该匾额展现了木塔的建筑精神和文化内涵，体现了古代工匠对木塔结构稳定性的自信。它是木塔历史的重要见证，也是中国传统建筑文化的重要组成部分。'
    }
  },
  buddha: {
    'FoXiang_floor1.glb': {
      title: '一层释迦牟尼像',
      content: '一层释迦牟尼像是应县木塔最大的造像。像高11米，为辽代彩塑，面容饱满，衣纹流畅。佛像两侧有胁侍菩萨像，共同构成「一佛二菩萨」布局。'
    },
    'FoXiang_Floor2blend.glb': {
      title: '二层佛像',
      content: '二层佛像同样为辽代彩塑，工艺精湛，展现了辽代佛教艺术的高超水平。佛像造型优美，细节丰富，是辽代雕塑艺术的杰出代表。'
    },
    'FoXiang_Floor3.glb': {
      title: '三层佛像',
      content: '三层佛像具有独特的艺术风格，反映了辽代佛教艺术的多样性和创新性。佛像造型庄重，工艺精细，展现了辽代工匠的高超技艺。'
    }
  }
}

// 分类详情知识
const categoryDetails = {
  dougong: {
    'DouGong1.glb': [
      '基础斗拱由斗、拱、昂等基本部件组成',
      '通过精密的榫卯结构连接，无需一钉一铆',
      '主要功能是分散屋顶重量，传递到柱子',
      '是中国古代建筑特有的结构构件',
      '斗拱不仅具有结构功能，还起到重要的装饰作用',
      '体现了中国古代工匠的智慧和技艺'
    ],
    'DouGong2.glb': [
      '转角斗拱采用45度斜拱设计',
      '增强了结构稳定性，形成独特的装饰效果',
      '是应县木塔斗拱艺术的精华',
      '展现了辽代工匠的精湛技艺',
      '转角斗拱设计复杂，需要高超的木工技艺',
      '是中国古代建筑中斗拱艺术的杰出代表'
    ],
    'DouGong3.glb': [
      '复杂斗拱结构展示了斗拱的多样性',
      '不仅具有结构功能，还起到装饰作用',
      '反映了辽代建筑的高超技艺',
      '是中国古代建筑的重要遗产',
      '复杂斗拱结构体现了辽代建筑的创新精神',
      '为研究中国古代建筑提供了重要实物资料'
    ]
  },
  paint: [
    '辽代彩绘以朱红、石绿、石青为主色调，色彩鲜艳',
    '沥粉贴金工艺是中国传统绘画技法，使画面更加立体',
    '壁画内容多为佛教故事和飞天形象，反映了当时的宗教信仰',
    '彩绘不仅装饰了木塔，也为研究辽代艺术提供了重要资料'
  ],
  plaque: {
    'ShiJiaTa.glb': [
      '「释迦塔」匾额由明成祖朱棣于永乐年间题写',
      '匾长2.5米，宽1.2米，红底金字，制作精美',
      '是应县木塔最珍贵的匾额之一，具有极高的历史价值',
      '朱棣作为明朝第三位皇帝，亲笔题字，书法雄浑有力',
      '该匾额见证了木塔与明代皇室的密切关系',
      '字体采用楷体，结构严谨，笔力雄健，展现了明代书法的风格'
    ],
    'TianXiaQiGuan.glb': [
      '「天下奇观」匾额由清代官员于乾隆年间题写',
      '匾长3米，宽1.5米，黑底金字，气势恢宏',
      '悬挂于木塔顶层，是木塔的标志性匾额之一',
      '字体端庄大气，体现了木塔作为天下奇观的地位',
      '采用传统匾额制作工艺，经过精心雕刻和髹漆',
      '该匾额反映了清代对木塔建筑成就的高度评价'
    ],
    'WanGu.glb': [
      '「万古观瞻」匾额由清代著名书法家所题',
      '字体苍劲有力，表达了人们对木塔万古长存的美好祝愿',
      '采用优质木材制作，经过特殊处理，至今保存完好',
      '供后人瞻仰，是书法艺术的珍品',
      '反映了木塔在历史上的重要地位和文化价值',
      '字体采用行书，流畅自然，展现了中国传统书法的魅力'
    ],
    'TianZhuDiZhou.glb': [
      '「天柱地轴」匾额由明代官员所题',
      '字体刚劲有力，寓意木塔如天柱地轴般稳固',
      '展现了木塔的建筑精神和文化内涵',
      '体现了古代工匠对木塔结构稳定性的自信',
      '是木塔历史的重要见证，也是中国传统建筑文化的重要组成部分',
      '字体采用隶书，古朴典雅，具有很高的艺术价值'
    ]
  },
  buddha: {
    'FoXiang_floor1.glb': [
      '一层释迦牟尼像高11米，是木塔内最大的造像',
      '为辽代彩塑，面容饱满，衣纹流畅',
      '佛像两侧有胁侍菩萨像，共同构成「一佛二菩萨」布局',
      '是研究辽代雕塑艺术的重要实物资料'
    ],
    'FoXiang_Floor2blend.glb': [
      '二层佛像同样为辽代彩塑，工艺精湛',
      '展现了辽代佛教艺术的高超水平',
      '佛像造型优美，细节丰富',
      '是辽代雕塑艺术的杰出代表'
    ],
    'FoXiang_Floor3.glb': [
      '三层佛像具有独特的艺术风格',
      '反映了辽代佛教艺术的多样性和创新性',
      '佛像造型庄重，工艺精细',
      '展现了辽代工匠的高超技艺'
    ]
  }
}

// 模型文件路径
const modelFiles = {
  dougong: {
    'dougong1': 'DouGong1.glb',
    'dougong2': 'DouGong2.glb',
    'dougong3': 'DouGong3.glb'
  },
  plaque: {
    'ShiJiaTa': 'ShiJiaTa.glb',
    'TianXiaQiGuan': 'TianXiaQiGuan.glb',
    'WanGu': 'WanGu.glb',
    'TianZhuDiZhou': 'TianZhuDiZhou.glb'
  },
  buddha: {
    'floor1': 'FoXiang_floor1.glb',
    'floor2': 'FoXiang_Floor2blend.glb',
    'floor3': 'FoXiang_Floor3.glb'
  }
}

// 基础状态
const activeCategory = ref('dougong')
const isLoading = ref(false)
const dialogVisible = ref(false)
const selectedImage = ref(null)
const isModelLoading = ref(false)
const modelContainer = ref(null)
const selectedModel = ref('DouGong1.glb')

// 3D场景相关
let scene = null
let camera = null
let renderer = null
let controls = null
let model = null
let animationId = null

// 计算属性
const currentCategoryImages = computed(() => {
  if (activeCategory.value === 'paint') {
    return decorationImages[activeCategory.value]
  }
  return decorationImages[activeCategory.value][selectedModel.value] || []
})

const currentCategoryIntro = computed(() => {
  if (activeCategory.value === 'paint') {
    return categoryIntro[activeCategory.value]
  }
  return categoryIntro[activeCategory.value][selectedModel.value] || categoryIntro[activeCategory.value]
})

const currentCategoryDetails = computed(() => {
  if (activeCategory.value === 'paint') {
    return categoryDetails[activeCategory.value]
  }
  return categoryDetails[activeCategory.value][selectedModel.value] || categoryDetails[activeCategory.value]
})

// 图片加载处理
const handleImageLoad = () => {
  isLoading.value = false
}
const handleImageError = (e) => {
  console.error('图片加载失败', e.target.src)
  e.target.src = '/images/placeholder.jpg'
  isLoading.value = false
}

// 初始化3D场景
const init3DScene = () => {
  if (!modelContainer.value) return

  console.log('初始化3D场景')

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f5e9)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, modelContainer.value.clientWidth / modelContainer.value.clientHeight, 0.1, 1000)
  camera.position.z = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight)
  modelContainer.value.appendChild(renderer.domElement)

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)

  // 加载模型
  loadModel()

  // 开始动画循环
  animate()
}

// 加载模型
const loadModel = () => {
  if (!scene) return

  isModelLoading.value = true

  const loader = new GLTFLoader()
  let modelPath = ''

  // 根据当前分类设置默认模型
  switch (activeCategory.value) {
    case 'dougong':
      selectedModel.value = 'DouGong1.glb'
      modelPath = '/DouGong1.glb'
      break
    case 'plaque':
      selectedModel.value = 'ShiJiaTa.glb'
      modelPath = '/ShiJiaTa.glb'
      break
    case 'buddha':
      selectedModel.value = 'FoXiang_floor1.glb'
      modelPath = '/FoXiang_floor1.glb'
      break
    default:
      return
  }

  console.log('加载模型:', modelPath)

  // 尝试加载模型
  loader.load(
    modelPath,
    (gltf) => {
      console.log('模型加载成功:', gltf)
      // 移除旧模型
      if (model) {
        scene.remove(model)
      }

      model = gltf.scene
      scene.add(model)

      // 自动调整模型大小和位置
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxSize = Math.max(size.x, size.y, size.z)
      const scale = 3 / maxSize
      model.scale.set(scale, scale, scale)

      // 居中模型
      box.setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.x -= center.x
      model.position.y -= center.y
      model.position.z -= center.z

      isModelLoading.value = false
    },
    (progress) => {
      // 加载进度
      console.log('加载进度:', progress)
    },
    (error) => {
      console.error('模型加载失败:', error)
      isModelLoading.value = false
      ElMessage.error('模型加载失败，显示备用模型')
      
      // 创建一个简单的备用几何体
      if (model) {
        scene.remove(model)
      }
      
      // 根据分类创建不同的备用模型
      let geometry
      if (activeCategory.value === 'plaque') {
        // 创建一个平板作为匾额备用模型
        geometry = new THREE.PlaneGeometry(3, 1.5)
      } else if (activeCategory.value === 'buddha') {
        // 创建一个圆柱体作为佛像备用模型
        geometry = new THREE.CylinderGeometry(1, 1, 3, 32)
      } else {
        // 默认立方体
        geometry = new THREE.BoxGeometry(2, 2, 2)
      }
      
      const material = new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: true })
      model = new THREE.Mesh(geometry, material)
      scene.add(model)
    }
  )
}

// 加载选中的模型
const loadSelectedModel = () => {
  if (!scene) return

  isModelLoading.value = true

  const loader = new GLTFLoader()
  const modelPath = `/${selectedModel.value}`

  console.log('加载选中模型:', modelPath)

  loader.load(
    modelPath,
    (gltf) => {
      console.log('模型加载成功:', gltf)
      // 移除旧模型
      if (model) {
        scene.remove(model)
      }

      model = gltf.scene
      scene.add(model)

      // 自动调整模型大小和位置
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxSize = Math.max(size.x, size.y, size.z)
      const scale = 3 / maxSize
      model.scale.set(scale, scale, scale)

      // 居中模型
      box.setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.x -= center.x
      model.position.y -= center.y
      model.position.z -= center.z

      isModelLoading.value = false
    },
    (progress) => {
      // 加载进度
      console.log('加载进度:', progress)
    },
    (error) => {
      console.error('模型加载失败:', error)
      isModelLoading.value = false
      ElMessage.error('模型加载失败，显示备用模型')
      
      // 创建一个简单的备用几何体
      if (model) {
        scene.remove(model)
      }
      
      // 创建一个立方体作为备用模型
      const geometry = new THREE.BoxGeometry(2, 2, 2)
      const material = new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: true })
      model = new THREE.Mesh(geometry, material)
      scene.add(model)
    }
  )
}

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

// 分类切换
const handleCategoryChange = () => {
  if (activeCategory.value !== 'paint') {
    // 延迟加载模型，确保DOM已更新
    setTimeout(() => {
      if (modelContainer.value && !scene) {
        init3DScene()
      } else if (scene) {
        loadModel()
      }
    }, 100)
  }
}

// 图片点击放大
const handleImageClick = (item) => {
  selectedImage.value = item
  dialogVisible.value = true
}

// 顶部按钮提示开发中
const handleARExperience = () => {
  ElMessage.info('该功能正在开发中...')
}
const handleDownloadAtlas = () => {
  ElMessage.info('该功能正在开发中...')
}

// 监听窗口大小变化
const handleResize = () => {
  if (camera && renderer && modelContainer.value) {
    camera.aspect = modelContainer.value.clientWidth / modelContainer.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(modelContainer.value.clientWidth, modelContainer.value.clientHeight)
  }
}

// 生命周期
onMounted(() => {
  if (activeCategory.value !== 'paint') {
    setTimeout(() => {
      init3DScene()
    }, 100)
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer && renderer.domElement) {
    if (modelContainer.value) {
      modelContainer.value.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
  if (model) {
    model.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
  window.removeEventListener('resize', handleResize)
})

// 监听分类变化
watch(activeCategory, () => {
  handleCategoryChange()
})
</script>

<style scoped>
.decoration-page {
  width: 100%;
  margin: 0;
  padding: 60px 5%;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f7f1e8 0%, #f3ebdf 100%);
  min-height: 100vh;
  animation: fadeIn 0.5s ease;
  position: relative;
  color: #5b3a29;
}

/* 内容容器 */
.content-container {
  width: min(1200px, 92%);
  margin: 0 auto;
}

.decoration-page::before {
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

.breadcrumb-wrapper {
  margin-bottom: 32px;
  font-size: 18px;
}
.chinese-breadcrumb {
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}
.chinese-breadcrumb :deep(.el-breadcrumb__item) {
  color: #6d4c41;
  font-size: 18px;
}
.chinese-breadcrumb :deep(.el-breadcrumb__item:last-child) {
  color: #8b4513;
  font-weight: 600;
  font-size: 20px;
}

.action-card {
  width: 100%;
  border-radius: 24px;
  margin-bottom: 32px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(160, 120, 80, 0.10);
  box-shadow: 0 10px 30px rgba(98, 63, 34, 0.08);
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d9b37b, transparent);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(98, 63, 34, 0.15);
}

.chinese-card {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(160, 120, 80, 0.10);
  box-shadow: 0 10px 30px rgba(98, 63, 34, 0.08);
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chinese-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d9b37b, transparent);
}

.intro-content {
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
}

.chinese-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(98, 63, 34, 0.15);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.action-title h2 {
  font-size: 40px;
  font-weight: 800;
  color: #8a4d22;
  margin: 0 0 12px 0;
  font-family: 'SimHei', 'Microsoft YaHei', serif;
  transition: all 0.3s ease;
  line-height: 1.2;
}

.action-title p {
  font-size: 18px;
  color: #7b6a5c;
  margin: 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

.chinese-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 999px;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(143, 61, 36, 0.22);
}

.chinese-btn.plain {
  border: 1px solid rgba(160, 120, 80, 0.2);
  color: #8a4d22;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 16px rgba(120, 80, 40, 0.1);
}

.chinese-btn.plain:hover {
  border-color: #9f4b2e;
  color: #9f4b2e;
  background: rgba(247, 241, 232, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(120, 80, 40, 0.15);
}

.chinese-btn.primary {
  background: linear-gradient(135deg, #b85c38, #8f3d24);
  border: none;
  color: #fff;
  box-shadow: 0 8px 18px rgba(143, 61, 36, 0.22);
}

.chinese-btn.primary:hover {
  background: linear-gradient(135deg, #a04b2c, #7d331e);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(143, 61, 36, 0.3);
}

.main-container {
  width: 100%;
}

.category-tabs {
  margin-bottom: 32px;
}

.decoration-tabs :deep(.el-tabs__item) {
  font-size: 20px;
  color: #6d4c41;
  font-weight: 600;
  padding: 0 32px;
  transition: all 0.3s ease;
}
.decoration-tabs :deep(.el-tabs__item.is-active) {
  color: #8b4513;
  font-weight: 700;
  font-size: 24px;
}
.decoration-tabs :deep(.el-tabs__active-bar) {
  background: #8b4513;
  height: 4px;
  transition: all 0.3s ease;
}

/* 三栏布局 */
.three-column-layout {
  display: flex;
  gap: 28px;
  width: 100%;
}

.left-column {
  flex: 1;
  min-width: 0;
}

.middle-column {
  flex: 1;
  min-width: 0;
}

.right-column {
  flex: 1;
  min-width: 0;
}

/* 彩绘纹样布局 - 两栏 */
.two-column-layout {
  display: flex;
  gap: 28px;
  width: 100%;
}

.two-column-layout .middle-column {
  flex: 1;
  min-width: 0;
}

.two-column-layout .right-column {
  flex: 1;
  min-width: 0;
}

/* 模型容器 */
.model-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(180deg, #fffdf9 0%, #fdfaf5 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(160, 120, 80, 0.1);
  box-shadow: 0 8px 24px rgba(120, 80, 40, 0.08);
  transition: all 0.3s ease;
}

.model-container:hover {
  box-shadow: 0 16px 32px rgba(120, 80, 40, 0.15);
}

.model-canvas {
  width: 100%;
  height: 100%;
}

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
  width: 80px;
  height: 80px;
  border: 4px solid rgba(139, 69, 19, 0.2);
  border-radius: 50%;
  border-top-color: #8b4513;
  animation: spin 1s infinite;
  margin: 0 auto 24px;
}

.loading-overlay p {
  font-size: 20px;
  color: #6d4c41;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.model-controls {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 5;
}

.control-tip {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  display: inline-block;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

/* 图片网格样式 */
.image-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
}

.image-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.image-item:hover {
  transform: translateY(-8px);
}

.image-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(98, 63, 34, 0.08);
  background: linear-gradient(180deg, #fffdf9 0%, #fdfaf5 100%);
  transition: all 0.35s ease;
  border: 1px solid rgba(160, 120, 80, 0.10);
  position: relative;
  overflow: hidden;
}

.image-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20px;
  right: 20px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d9b37b, transparent);
}

.image-wrapper:hover {
  box-shadow: 0 20px 40px rgba(98, 63, 34, 0.15);
}

.grid-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item:hover .grid-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 24px;
  transition: all 0.3s ease;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.image-overlay h4 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 700;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.image-overlay p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 工艺介绍样式 */
.intro-content {
  padding: 24px 0;
  flex: 1;
  overflow-y: auto;
}

.intro-content h3 {
  font-size: 30px;
  font-weight: 700;
  color: #8a4d22;
  margin: 0 0 20px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
  line-height: 1.3;
}

.intro-content p {
  font-size: 16px;
  color: #7b6a5c;
  line-height: 1.8;
  margin: 0 0 28px 0;
  text-align: justify;
  transition: all 0.3s ease;
}

.category-details h4 {
  font-size: 22px;
  font-weight: 700;
  color: #8a4d22;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.category-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-details li {
  font-size: 16px;
  color: #7b6a5c;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-left: 24px;
  position: relative;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.category-details li::before {
  content: '•';
  color: #9a5425;
  font-size: 20px;
  position: absolute;
  left: 0;
  top: -2px;
  font-weight: bold;
}

/* 图片放大弹窗样式 */
.image-dialog :deep(.el-dialog__header) {
  border-bottom: 1px dashed #e6c890;
  padding: 24px;
}

.image-dialog :deep(.el-dialog__title) {
  color: #8b4513;
  font-size: 28px;
  font-weight: 700;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.dialog-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 24px;
}

.dialog-image {
  max-width: 50%;
  max-height: 600px;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.dialog-info {
  flex: 1;
}

.dialog-info h4 {
  font-size: 24px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 16px 0;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.dialog-info p {
  font-size: 18px;
  color: #6d4c41;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

.dialog-detail {
  font-size: 18px;
  color: #6d4c41;
  line-height: 1.6;
  margin: 0;
  padding-top: 24px;
  border-top: 1px dashed #e6c890;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #8a4d22;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(160, 120, 80, 0.1);
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.model-selector {
  display: flex;
  align-items: center;
}

.model-selector .el-select {
  width: 180px;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.model-selector .el-select .el-input__inner {
  font-size: 16px;
  border-radius: 8px;
  border-color: #e6c890;
}

.model-selector .el-select .el-input__inner:focus {
  border-color: #8b4513;
  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
}

@media (max-width: 1200px) {
  .three-column-layout {
    grid-template-columns: 1fr 1fr;
  }
  
  .left-column {
    grid-column: 1;
    grid-row: 1;
  }
  
  .middle-column {
    grid-column: 2;
    grid-row: 1;
  }
  
  .right-column {
    grid-column: 1 / span 2;
    grid-row: 2;
  }
  
  .action-title h2 {
    font-size: 40px;
  }
  
  .action-title p {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .decoration-page {
    padding: 40px 5%;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
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
    font-size: 32px;
  }
  
  .action-title p {
    font-size: 18px;
  }
  
  .three-column-layout {
    grid-template-columns: 1fr;
  }
  
  .left-column,
  .middle-column,
  .right-column {
    grid-column: 1;
  }
  
  .left-column {
    grid-row: 1;
  }
  
  .middle-column {
    grid-row: 2;
  }
  
  .right-column {
    grid-row: 3;
  }
  
  .model-container {
    height: 400px;
  }
  
  .card-header {
    font-size: 24px;
  }
  
  .image-overlay h4 {
    font-size: 20px;
  }
  
  .image-overlay p {
    font-size: 16px;
  }
  
  .intro-content h3 {
    font-size: 28px;
  }
  
  .intro-content p {
    font-size: 16px;
  }
  
  .category-details h4 {
    font-size: 20px;
  }
  
  .category-details li {
    font-size: 16px;
  }
  
  .dialog-content {
    flex-direction: column;
  }
  
  .dialog-image {
    max-width: 100%;
    max-height: 400px;
  }
  
  .dialog-info h4 {
    font-size: 22px;
  }
  
  .dialog-info p {
    font-size: 16px;
  }
  
  .dialog-detail {
    font-size: 16px;
  }
}
</style>
