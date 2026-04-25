import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 完全不用Layout，直接引用页面，彻底解决找不到文件的问题
// 加上 TypeScript 类型定义：RouteRecordRaw
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/tower-home.vue'),
    meta: {
      title: '应县木塔'
    }
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '古建筑精选'
    }
  },
  {
    path: '/tower',
    name: 'Tower',
    component: () => import('@/views/tower/index.vue'),
    meta: { title: '应县木塔' }
  },
  {
    path: '/tower/structure',
    name: 'Structure',
    component: () => import('@/views/tower/structure/index.vue'),
    meta: { title: '结构分析' }
  },
  {
    path: '/tower/structure/detail',
    name: 'StructureDetail',
    component: () => import('@/views/tower/structure/detail/index.vue'),
    meta: { title: '拆解详情' }
  },
  {
    path: '/tower/mechanics',
    name: 'Mechanics',
    component: () => import('@/views/tower/mechanics/index.vue'),
    meta: { title: '力学分析' }
  },
  {
    path: '/tower/decoration',
    name: 'Decoration',
    component: () => import('@/views/tower/decoration/index.vue'),
    meta: { title: '装饰工艺' }
  },
  {
    path: '/walkthrough',
    name: 'walkthrough',
    component: () => import('@/views/WalkThrough.vue'),
    meta: {
      title: '第一人称漫游'
    }
  },
  {
    path: '/education',
    name: 'education',
    component: () => import('@/views/EducationCenter.vue'),
    meta: {
      title: '教育科普'
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/history/index.vue'),
    meta: {
      title: '千年传奇'
    }
  },
  {
    path: '/walkthrough/ming5',
    name: 'walkthrough-ming5',
    component: () => import('@/views/walkthrough/Ming5.vue'),
    meta: {
      title: '第一人称漫游 - 明五层'
    }
  },
  {
    path: '/walkthrough/an4',
    name: 'walkthrough-an4',
    component: () => import('@/views/walkthrough/An4.vue'),
    meta: {
      title: '第一人称漫游 - 暗四层'
    }
  },
  {
    path: '/ancient-building/:id',
    name: 'ancient-building-detail',
    component: () => import('@/views/ancient-building/detail.vue'),
    meta: {
      title: '古建筑详情'
    }
  },
  // ========== 【新增】敬请期待页面路由 ==========
  {
    path: '/coming-soon',
    name: 'ComingSoon',
    component: () => import('@/views/coming-soon/index.vue'),
    meta: { title: '尽请期待' }
  },
  // ========== 【修改】兜底路由：跳转到敬请期待页面 ==========
  { path: '/:pathMatch(.*)*', redirect: '/coming-soon' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
