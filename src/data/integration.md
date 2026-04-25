# 联调准备文档

## 数据文件说明

| 文件 | 用途 | 命名规则 |
|------|------|---------|
| `structure-descriptions.json` | 结构部件文案 | 部件ID: pillar-1-1, beam-2-1 等 |
| `decoration-descriptions.json` | 装饰工艺文案 | 板块: paint, carving 等 |
| `home-data.json` | 首页数据 | 地图点位、图表数据 |
| `mechanics-page.json` | 力学页文案 | 图例、按钮、说明 |
| `tips.json` | 全站提示语 | 按页面分类 |
| `faq.json` | AI常见问题 | 快捷回复 |

## API 接口

### DeepSeek（经云函数代理）
- 端点：`https://1419866445-kibp0xei1r.ap-guangzhou.tencentscf.com/`
- 方法：POST
- 参数：`{ "question": "用户问题" }` 或 `messages` 模式

## 3D模型部件命名规范

结构部件格式：`{类型}-{楼层}-{序号}`
- pillar-1-1：一层1号柱
- beam-2-3：二层3号梁
- dougong-3-2：三层2号斗拱

装饰部件格式：`{类型}-{位置}-{序号}`
- paint-floor-1：一层彩绘
- carve-door-1：一号门雕花

## 待办事项
- [ ] 同学A：将文案JSON集成到页面组件
- [ ] 同学B：确保3D模型命名与JSON部件ID一致
- [ ] 同学D：提供最终版力学数据JSON
