<template>
  <div class="ancient-building-detail">
    <div class="content-container">
    <!-- 顶部面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <el-breadcrumb separator="/" class="chinese-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="iconfont icon-shouye" style="margin-right: 4px"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/summary' }">
          <i class="iconfont icon-zhanshi" style="margin-right: 4px"></i>古建筑精选
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentBuilding.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <i class="iconfont icon-zhanshi" style="margin-right: 12px; color: #8b4513"></i>
        {{ currentBuilding.name }}
      </h1>
      <p class="page-subtitle">{{ currentBuilding.location }}</p>
    </div>

    <!-- 建筑详情 -->
    <div class="building-detail">
      <!-- 左侧图片 -->
      <div class="image-section">
        <div class="image-container">
          <img :src="currentBuilding.image" :alt="currentBuilding.name" class="building-image">
        </div>
        <div class="image-info">
          <p>建筑年代：{{ currentBuilding.year }}</p>
          <p>建筑类型：{{ currentBuilding.type }}</p>
          <p>保护级别：{{ currentBuilding.level }}</p>
        </div>
      </div>

      <!-- 右侧详情 -->
      <div class="info-section">
        <div class="info-content">
          <h2 class="section-title">
            <i class="iconfont icon-shijian" style="margin-right: 8px; color: #8b4513"></i>
            历史沿革
          </h2>
          <div class="history-content">
            {{ currentBuilding.history }}
          </div>

          <h2 class="section-title">
            <i class="iconfont icon-jiegou" style="margin-right: 8px; color: #8b4513"></i>
            结构特点
          </h2>
          <div class="structure-content">
            {{ currentBuilding.structure }}
          </div>

          <h2 class="section-title">
            <i class="iconfont icon-tezheng" style="margin-right: 8px; color: #8b4513"></i>
            建筑特色
          </h2>
          <div class="feature-content">
            {{ currentBuilding.features }}
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <el-button 
        @click="prevBuilding" 
        :disabled="currentIndex === 0"
        class="nav-button prev"
      >
        <i class="iconfont icon-arrow-left" style="margin-right: 8px"></i>
        上一个
      </el-button>
      <el-button 
        @click="nextBuilding" 
        :disabled="currentIndex === buildings.length - 1"
        class="nav-button next"
      >
        下一个
        <i class="iconfont icon-arrow-right" style="margin-left: 8px"></i>
      </el-button>
    </div>

    <!-- 返回按钮 -->
    <div class="back-container">
      <router-link to="/summary" class="back-button">
        <i class="iconfont icon-arrow-left" style="margin-right: 8px"></i>
        返回古建筑精选
      </router-link>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 古建筑数据
const buildings = [
  {
    id: 1,
    name: '应县木塔',
    location: '山西省朔州市应县',
    year: '辽代清宁二年（1056年）',
    type: '木构佛塔',
    level: '全国重点文物保护单位',
    image: '/images/archive/1.jpg',
    history: '应县木塔，全称佛宫寺释迦塔，建于辽代清宁二年（1056年），是中国现存最高、最古老的木构建筑之一。木塔由辽兴宗耶律宗真敕建，是为了纪念其母萧太后家族故里。初建时的木塔，通体涂金，供奉着佛牙舍利，是辽代佛教与皇家威仪的巅峰之作。金明昌六年（1195年），木塔迎来第一次大规模增修，重点在于佛像的重塑与布局完善。此后，木塔历经多次地震考验，依然屹立不倒，展现了中国古代木结构建筑的卓越成就。',
    structure: '应县木塔为八角形，五层六檐，明五暗四，共九层，总高67.31米。全塔没用一根铁钉，仅靠54种、480朵斗拱卯榫咬合，将上万立方米木材紧密相连。木塔采用"筒中筒"结构，由外槽、内槽和中心柱组成，这种结构具有良好的抗震性能。塔内各层均有佛像，其中第四层增设了"华严三圣"佛像群，第五层构建了密教曼荼罗坛场。木塔的斗拱结构复杂多样，是中国古代建筑斗拱艺术的集大成者。',
    features: '应县木塔的主要特色包括：1. 全木结构，无钉无铆，靠斗拱和榫卯连接；2. 54种斗拱类型，被誉为"斗拱博物馆"；3. 独特的"筒中筒"结构，具有卓越的抗震性能；4. 精美的佛教造像和壁画；5. 千年不倒的传奇历史，历经多次地震仍屹立不倒。木塔不仅是中国古代建筑的杰作，也是世界木结构建筑的典范，展示了中国古代工匠的智慧和技艺。'
  },
  {
    id: 2,
    name: '故宫太和殿',
    location: '北京市东城区',
    year: '明代永乐十八年（1420年）',
    type: '宫殿建筑',
    level: '世界文化遗产',
    image: '/images/archive/2.jpg',
    history: '故宫太和殿，又称金銮殿，是故宫的正殿，建于明代永乐十八年（1420年），是明清两代皇帝举行大典的地方。太和殿是中国现存最大的木质结构古建筑，体现了中国古代宫殿建筑的最高成就。太和殿历经多次重建，现存建筑为清代康熙三十四年（1695年）重建后的样式。',
    structure: '太和殿面阔11间，进深5间，建筑面积2377平方米，高26.92米，连同台基通高35.05米。殿内有沥粉金漆木柱和精致的蟠龙藻井，殿中间是封建皇权的象征——金漆雕龙宝座。太和殿的建筑设计严格遵循封建礼制，体现了中国古代"天人合一"的思想，是中国古代宫殿建筑的杰出代表。',
    features: '太和殿的主要特色包括：1. 宏大的规模和严谨的布局，体现了中国古代皇家建筑的威严和等级制度；2. 精美的建筑装饰，包括彩绘、雕刻、琉璃瓦等；3. 独特的建筑工艺，如榫卯结构、斗拱系统等；4. 深厚的历史文化内涵，是中国古代封建皇权的象征；5. 精湛的建筑技术，体现了中国古代工匠的智慧和技艺。'
  },
  {
    id: 3,
    name: '赵州桥',
    location: '河北省石家庄市赵县',
    year: '隋代大业年间（605-618年）',
    type: '石拱桥',
    level: '全国重点文物保护单位',
    image: '/images/archive/3.jpg',
    history: '赵州桥，原名安济桥，是世界上现存最早、保存最好的巨大石拱桥，由隋朝工匠李春设计建造于大业年间（605-618年）。赵州桥是中国古代桥梁建筑的杰作，也是世界桥梁史上的重要里程碑。赵州桥历经多次修缮，现存建筑为明代修缮后的样式。',
    structure: '赵州桥长50.82米，跨径37.02米，桥高7.23米，是一座单孔敞肩石拱桥。赵州桥的设计巧妙，采用了"敞肩拱"结构，即在大拱两端各设两个小拱，这种结构不仅减轻了桥身重量，还增加了泄洪能力。赵州桥的建筑设计充分考虑了力学原理，体现了中国古代桥梁建筑的卓越成就。',
    features: '赵州桥的主要特色包括：1. 世界上最早的敞肩石拱桥，比欧洲同类桥梁早了1200多年；2. 独特的"敞肩拱"结构，具有良好的力学性能；3. 精美的雕刻装饰，包括龙、兽等图案；4. 悠久的历史，历经1400多年仍然屹立不倒；5. 精湛的建筑技术，体现了中国古代工匠的智慧和技艺。'
  },
  {
    id: 4,
    name: '苏州拙政园',
    location: '江苏省苏州市姑苏区',
    year: '明代正德年间（1506-1521年）',
    type: '古典园林',
    level: '世界文化遗产',
    image: '/images/archive/4.jpg',
    history: '苏州拙政园，始建于明代正德年间（1506-1521年），是中国四大名园之一，也是江南古典园林的代表作品。拙政园由明代御史王献臣创建，后历经多次易主和修缮，现存建筑为清代修缮后的样式。拙政园是中国古典园林艺术的杰作，也是世界文化遗产中的瑰宝。',
    structure: '拙政园占地面积约5.2公顷，以水为中心，亭台楼阁临水而建，形成了"池广树茂"的特色。拙政园的建筑布局分为东、中、西三部分，其中中部是拙政园的精华所在，包括远香堂、香洲、荷风四面亭等建筑。拙政园的建筑设计融合了中国传统园林艺术的精华，体现了"虽由人作，宛自天开"的造园理念。',
    features: '拙政园的主要特色包括：1. 以水为中心的布局，体现了江南水乡的特色；2. 精美的建筑装饰，包括彩绘、雕刻、匾额等；3. 丰富的文化内涵，包括历史典故、文学艺术等；4. 巧妙的空间布局，营造出"步移景异"的效果；5. 精湛的造园技艺，体现了中国古代园林艺术的最高成就。'
  },
  {
    id: 5,
    name: '布达拉宫',
    location: '西藏自治区拉萨市城关区',
    year: '唐代贞观年间（627-649年）',
    type: '宫殿建筑',
    level: '世界文化遗产',
    image: '/images/archive/5.jpg',
    history: '布达拉宫，始建于唐代贞观年间（627-649年），是藏传佛教的圣地，也是世界上海拔最高的宫殿群。布达拉宫由松赞干布为迎娶文成公主而建，后历经多次扩建和修缮，现存建筑为清代修缮后的样式。布达拉宫是西藏最具代表性的建筑，也是世界文化遗产中的瑰宝。',
    structure: '布达拉宫占地面积约36万平方米，建筑面积约13万平方米，由红宫和白宫两部分组成。红宫是宗教活动场所，白宫是达赖喇嘛的居所。布达拉宫的建筑设计融合了藏族和汉族的建筑风格，体现了藏汉文化的交流与融合。布达拉宫的建筑结构坚固，能够抵御高原的恶劣气候。',
    features: '布达拉宫的主要特色包括：1. 世界上海拔最高的宫殿群，海拔3700米；2. 独特的建筑风格，融合了藏族和汉族的建筑元素；3. 丰富的文化内涵，是藏传佛教的圣地；4. 精美的建筑装饰，包括彩绘、雕刻、壁画等；5. 悠久的历史，见证了藏汉文化的交流与融合。'
  },
  {
    id: 6,
    name: '万里长城',
    location: '中国北部',
    year: '春秋战国时期至今',
    type: '防御工程',
    level: '世界文化遗产',
    image: '/images/archive/6.jpg',
    history: '长城是中国古代为防御北方游牧民族入侵而修建的防御工程，始建于春秋战国时期，秦统一六国后，秦始皇连接和修缮了战国时期的长城，形成了万里长城的基础。汉代、明代等朝代都对长城进行了大规模的修缮和扩建，其中明代是长城修建的鼎盛时期。长城不仅是中国古代军事防御体系的重要组成部分，也是中国古代劳动人民智慧和勇气的象征。',
    structure: '长城的建筑结构主要包括城墙、敌楼、关隘、烽火台等部分。城墙是长城的主体，一般由砖石或夯土筑成，高度在3-8米之间。敌楼是城墙上的防御建筑，用于士兵驻守和存放武器。关隘是长城上的重要通道，通常建在交通要道上，是长城防御体系的重要节点。烽火台是长城上的通讯设施，用于传递军情。长城的建筑设计充分考虑了地形和防御需要，体现了中国古代军事工程的卓越成就。',
    features: '长城的主要特色包括：1. 宏大的规模，总长度超过21000公里；2. 独特的建筑形式，适应不同地形地貌；3. 完善的防御体系，包括城墙、敌楼、关隘、烽火台等；4. 丰富的历史文化内涵，见证了中国古代边疆防御的历史；5. 壮丽的自然景观，与周围环境融为一体。长城不仅是中国古代军事工程的杰作，也是世界文化遗产中的瑰宝，被誉为"世界第八大奇迹"。'
  },
  {
    id: 7,
    name: '悬空寺',
    location: '山西省大同市浑源县',
    year: '北魏太和十五年（491年）',
    type: '佛教建筑',
    level: '全国重点文物保护单位',
    image: '/images/archive/7.jpg',
    history: '悬空寺，始建于北魏太和十五年（491年），是中国现存最著名的悬空建筑之一，也是世界上罕见的佛、道、儒三教合一的寺庙。悬空寺建在恒山金龙峡西侧翠屏峰的半崖峭壁间，以奇、险、巧著称。悬空寺历经多次修缮，现存建筑为明清修缮后的样式。',
    structure: '悬空寺共有殿阁40间，利用力学原理半插飞梁为基，巧借岩石暗托，梁柱上下一体，廊栏左右相连，曲折出奇，虚实相生。悬空寺的建筑设计巧妙地利用了悬崖的自然条件，体现了中国古代建筑的卓越成就。悬空寺的建筑结构坚固，能够抵御地震等自然灾害。',
    features: '悬空寺的主要特色包括：1. 建在悬崖上的独特建筑形式，被誉为"悬空寺，半天高，三根马尾空中吊"；2. 佛、道、儒三教合一的文化内涵；3. 巧妙的建筑设计，利用力学原理保持平衡；4. 精美的建筑装饰，包括彩绘、雕刻、壁画等；5. 悠久的历史，历经1500多年仍然屹立不倒。'
  },
  {
    id: 8,
    name: '大雁塔',
    location: '陕西省西安市雁塔区',
    year: '唐代永徽三年（652年）',
    type: '佛塔',
    level: '全国重点文物保护单位',
    image: '/images/archive/8.jpg',
    history: '大雁塔，全称大慈恩寺塔，建于唐代永徽三年（652年），由玄奘法师主持修建，用于存放从印度取回的佛经。大雁塔是唐代楼阁式砖塔的代表作品，也是西安的标志性建筑之一。大雁塔历经多次修缮，现存建筑为明代修缮后的样式。',
    structure: '大雁塔高64米，共7层，平面呈方形，底层边长25米。大雁塔的建筑设计采用了唐代楼阁式砖塔的典型样式，塔身由下往上逐渐收分，形成优美的轮廓。大雁塔的建筑结构坚固，能够抵御地震等自然灾害。塔内有楼梯可盘旋而上，每层都有门窗，可俯瞰西安城景。',
    features: '大雁塔的主要特色包括：1. 唐代楼阁式砖塔的代表作品，体现了唐代建筑的风格；2. 与玄奘法师的历史关联，具有重要的文化意义；3. 精美的建筑装饰，包括彩绘、雕刻等；4. 悠久的历史，见证了唐代佛教的繁荣；5. 独特的建筑结构，体现了中国古代建筑的卓越成就。'
  },
  {
    id: 9,
    name: '天坛祈年殿',
    location: '北京市东城区',
    year: '明代永乐十八年（1420年）',
    type: '祭祀建筑',
    level: '世界文化遗产',
    image: '/images/archive/9.jpg',
    history: '天坛祈年殿，建于明代永乐十八年（1420年），是明清两代皇帝祭天祈谷的场所。祈年殿是天坛的主体建筑，也是中国古代礼制建筑的杰出代表。祈年殿历经多次重建，现存建筑为清代光绪十五年（1889年）重建后的样式。',
    structure: '祈年殿是一座圆形建筑，高38米，直径32.72米，三重檐圆形屋顶，象征天圆地方。祈年殿的建筑设计严格遵循封建礼制，体现了中国古代"天人合一"的思想。祈年殿的建筑结构独特，不用大梁长檩及铁钉，全靠28根木柱和36根枋桷支撑，是中国古代建筑的杰作。',
    features: '祈年殿的主要特色包括：1. 独特的圆形建筑形式，象征天圆地方；2. 精美的建筑装饰，包括彩绘、雕刻、匾额等；3. 深厚的历史文化内涵，是中国古代祭祀文化的重要见证；4. 精湛的建筑技术，体现了中国古代工匠的智慧和技艺；5. 与天坛其他建筑一起，构成了完整的祭祀体系。'
  },
  {
    id: 10,
    name: '福建土楼',
    location: '福建省龙岩市、漳州市',
    year: '宋元时期至今',
    type: '民居建筑',
    level: '世界文化遗产',
    image: '/images/archive/10.jpg',
    history: '福建土楼，是客家民居的典型代表，始建于宋元时期，明清时期达到鼎盛。福建土楼是中国传统民居建筑的杰作，也是世界上独一无二的大型民居形式。福建土楼以生土为主要建筑材料，具有防御功能，体现了客家人民的集体智慧和凝聚力。',
    structure: '福建土楼的建筑结构主要包括圆形、方形、矩形等多种形式，其中以圆形土楼最为著名。土楼一般由外墙、内院、房间等部分组成，外墙厚达1-2米，能够抵御外敌入侵和自然灾害。土楼的建筑设计充分考虑了防御和居住的需要，体现了中国古代民居建筑的卓越成就。',
    features: '福建土楼的主要特色包括：1. 独特的建筑形式，以生土为主要建筑材料；2. 完善的防御功能，能够抵御外敌入侵和自然灾害；3. 丰富的文化内涵，体现了客家人民的集体智慧和凝聚力；4. 精美的建筑装饰，包括彩绘、雕刻等；5. 悠久的历史，见证了客家人民的迁徙和发展。'
  },
  {
    id: 11,
    name: '丽江古城',
    location: '云南省丽江市古城区',
    year: '宋末元初（13世纪后期）',
    type: '古城',
    level: '世界文化遗产',
    image: '/images/archive/11.jpg',
    history: '丽江古城，又名大研镇，始建于宋末元初（13世纪后期），是中国为数不多的保存相当完好的少数民族古镇。丽江古城是纳西族的聚居地，也是纳西族文化的重要载体。丽江古城历经多次修缮，现存建筑为明清时期的样式。',
    structure: '丽江古城占地面积约3.8平方公里，以四方街为中心，街巷依山傍水，布局自由灵活。丽江古城的建筑风格融合了纳西族、汉族、藏族等多个民族的建筑元素，体现了多民族文化的交流与融合。丽江古城的水系发达，被誉为"东方威尼斯"。',
    features: '丽江古城的主要特色包括：1. 依山傍水的布局，体现了纳西族的生活智慧；2. 独特的建筑风格，融合了多个民族的建筑元素；3. 发达的水系，被誉为"东方威尼斯"；4. 丰富的文化内涵，是纳西族文化的重要载体；5. 悠久的历史，见证了多民族文化的交流与融合。'
  },
  {
    id: 12,
    name: '晋祠圣母殿',
    location: '山西省太原市晋源区',
    year: '北宋天圣年间（1023-1032年）',
    type: '祠庙建筑',
    level: '全国重点文物保护单位',
    image: '/images/archive/12.jpg',
    history: '晋祠圣母殿，建于北宋天圣年间（1023-1032年），是晋祠的主体建筑，也是中国宋代建筑的杰出代表。圣母殿供奉着唐叔虞之母邑姜，是晋祠最具价值的建筑之一。圣母殿历经多次修缮，现存建筑基本保持了宋代的风格。',
    structure: '圣母殿面阔七间，进深六间，重檐歇山顶，殿高19米。殿内有43尊宋代彩塑，其中侍女像33尊，姿态各异，形象生动，是中国古代彩塑的杰作。圣母殿前有鱼沼飞梁，是中国古代桥梁建筑的孤例。圣母殿的建筑设计体现了宋代建筑的风格，是中国古代建筑的杰作。',
    features: '圣母殿的主要特色包括：1. 宋代建筑的杰出代表，体现了宋代建筑的风格；2. 精美的宋代彩塑，是中国古代彩塑的杰作；3. 鱼沼飞梁，是中国古代桥梁建筑的孤例；4. 深厚的历史文化内涵，是晋祠的核心建筑；5. 精湛的建筑技术，体现了中国古代工匠的智慧和技艺。'
  }
]

// 当前建筑索引
const currentIndex = ref(0)

// 当前建筑
const currentBuilding = computed(() => {
  return buildings[currentIndex.value]
})

// 上一个建筑
const prevBuilding = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 下一个建筑
const nextBuilding = () => {
  if (currentIndex.value < buildings.length - 1) {
    currentIndex.value++
  }
}

// 生命周期
onMounted(() => {
  // 从路由参数中获取建筑ID
  const id = route.params.id
  if (id) {
    const index = buildings.findIndex(building => building.id === Number(id))
    if (index !== -1) {
      currentIndex.value = index
    }
  }
})
</script>

<style scoped>
/* 页面基础样式 */
.ancient-building-detail {
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
.ancient-building-detail::before {
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

/* 建筑详情 */
.building-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 80px;
}

/* 左侧图片 */
.image-section {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border-radius: 24px;
  border: 2px solid #e6c890;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  display: flex;
  flex-direction: column;
  gap: 32px;
  transition: all 0.3s ease;
}

.image-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
}

.image-container {
  width: 100%;
  height: 480px;
  overflow: hidden;
  border-radius: 16px;
  border: 2px solid #e6c890;
  transition: all 0.3s ease;
}

.building-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .building-image {
  transform: scale(1.05);
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-info p {
  font-size: 18px;
  color: #6d4c41;
  margin: 0;
  line-height: 1.6;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

/* 右侧详情 */
.info-section {
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  border-radius: 24px;
  border: 2px solid #e6c890;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  transition: all 0.3s ease;
}

.info-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 通用板块标题 */
.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #8b4513;
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid #8b4513;
  display: flex;
  align-items: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
  transition: all 0.3s ease;
}

/* 内容区域 */
.history-content,
.structure-content,
.feature-content {
  font-size: 18px;
  color: #6d4c41;
  line-height: 1.8;
  text-align: justify;
  transition: all 0.3s ease;
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  gap: 24px;
}

.nav-button {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.nav-button.prev {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.nav-button.next {
  background: linear-gradient(135deg, #9d2933, #c0392b);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(157, 41, 51, 0.3);
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(157, 41, 51, 0.4);
  background: linear-gradient(135deg, #802028, #a03025);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 返回按钮 */
.back-container {
  text-align: center;
  margin-bottom: 60px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: linear-gradient(145deg, #ffffff, #f8f2e4);
  color: #8b4513;
  text-decoration: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s ease;
  border: 2px solid #e6c890;
  box-shadow: 0 8px 24px rgba(196, 147, 70, 0.15);
  font-family: 'Microsoft YaHei', 'SimHei', serif;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(196, 147, 70, 0.25);
  border-color: #d4b17a;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .building-detail {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ancient-building-detail {
    padding: 16px 16px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .image-container {
    height: 300px;
  }
  
  .image-section,
  .info-section {
    padding: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .history-content,
  .structure-content,
  .feature-content {
    font-size: 14px;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .nav-button {
    width: 100%;
  }
}
</style>