# 文案索引表（全量）

> 用途：给联调同学快速定位“某段文案在哪个文件/哪个字段”。

## 1) 首页（Home）

| 文件 | 顶层字段 | 说明 |
|------|----------|------|
| `home-data.json` | `mapPoints[]` | 首页地图点位（`name/lng/lat/link/description/disabled?`） |
| `home-data.json` | `roseChart` | 玫瑰图标题与数据 |
| `home-data.json` | `barChart` | 柱状图标题与数据 |
| `home-data.json` | `highlights[]` | 亮点卡片（`title/value/icon/description`） |
| `home-data.json` | `timeline[]` | 时间轴（`year/event/description`） |

## 2) 结构分析页（Structure）

| 文件 | 顶层字段 | 说明 |
|------|----------|------|
| `structure-descriptions.json` | `*` | 结构部件文案（按部件ID索引，例如 `pillar-1-1`） |

## 3) 装饰工艺页（Decoration）

| 文件 | 顶层字段 | 说明 |
|------|----------|------|
| `decoration-descriptions.json` | `paint` | 彩绘：`tabTitle/intro/parts` |
| `decoration-descriptions.json` | `carving` | 木雕：`tabTitle/intro/parts` |
| `decoration-descriptions.json` | `dougong_decor` | 斗拱装饰：`tabTitle/intro/parts` |
| `decoration-descriptions.json` | `plaque_statue` | 匾额与造像：`tabTitle/intro/parts` |

## 4) 力学分析页（Mechanics）

| 文件 | 顶层字段 | 说明 |
|------|----------|------|
| `mechanics-page.json` | `buttons` | 三个按钮文案 |
| `mechanics-page.json` | `tabs` | 地震工况tab文案 |
| `mechanics-page.json` | `legend` | 应力图例标题与分段 |
| `mechanics-page.json` | `earthquake` | 抗震说明与来源 |
| `mechanics-page.json` | `wind` | 抗风说明与来源 |
| `mechanics-page.json` | `professionalNotes` | 专业说明（应力/抗震/抗风/材料） |
| `mechanics-page.json` | `references[]` | 参考文献摘要 |
| `mechanics-page.json` | `tips` | 交互提示语 |

## 5) 全站提示/AI

| 文件 | 顶层字段 | 说明 |
|------|----------|------|
| `tips.json` | `*` | 全站提示语（按页面/模块分类） |
| `faq.json` | `*` | AI常见问题（快捷回复/引导） |

