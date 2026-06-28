# ERP 销售与库存管理系统

基于 **Vue 3 + Vite + Vue Router + Pinia + ECharts** 的现代化前端工程项目。

## 项目简介

本系统是一个 **ERP（企业资源计划）销售与库存管理系统** 的前端展示项目，涵盖了从销售订单创建、库存管理、发货确认到财务收款开票的完整业务流程。系统基于 Odoo ERP 架构设计，实现了销售、库存、财务三大核心模块的联动。

### 功能模块

| 模块 | 说明 |
|------|------|
| 仪表盘 | 销售额/订单/库存预警/应收账款 KPI，月度趋势图，订单状态分布，产品排行，活动时间线 |
| 销售订单 | 订单工作流步骤条，新建/确认/查看订单，状态筛选，产品行动态管理 |
| 库存管理 | 仓库库存分布图，周转率趋势，产品库存清单，低库存预警标记 |
| 客户管理 | 客户列表（联系人、电话、邮箱），新建客户，累计金额统计 |
| 财务管理 | 收款趋势，发票管理（已付/部分/待付），新建发票，收款操作 |
| 数据报表 | 品类销售占比，月度利润趋势，客户贡献度排名 |
| 业务流程 | 订单确认流程、发货确认流程、收款对账流程的可视化流程图 |

## 技术栈

- **Vue 3** — Composition API + `<script setup>` 语法
- **Vite** — 快速构建工具，支持 HMR 热更新
- **Vue Router 4** — 路由管理，懒加载，路由守卫
- **Pinia** — 状态管理，组合式 API 风格
- **ECharts** — 数据可视化图表库

## 项目结构

```
erp-system/
├── public/                  # 静态资源
├── src/
│   ├── assets/              # 项目资源文件
│   ├── components/          # 公共组件
│   │   ├── common/          # 通用 UI 组件
│   │   │   ├── AppModal.vue     # 弹窗组件
│   │   │   ├── AppTable.vue     # 表格组件
│   │   │   ├── AppToast.vue     # Toast 通知组件
│   │   │   ├── StatCard.vue     # 统计卡片组件
│   │   │   └── StatusBadge.vue  # 状态标签组件
│   │   └── AppLayout.vue    # 全局布局组件（侧边栏+顶栏+内容区）
│   ├── data/                # 数据层
│   │   ├── mockData.js      # 模拟业务数据
│   │   └── chartConfig.js   # ECharts 图表配置
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── stores/              # Pinia 状态管理
│   │   ├── index.js         # Store 统一导出
│   │   ├── app.js           # 全局应用状态
│   │   ├── sales.js         # 销售订单 Store
│   │   ├── inventory.js     # 库存 Store
│   │   ├── customers.js     # 客户 Store
│   │   └── finance.js       # 财务 Store
│   ├── views/               # 页面视图组件
│   │   ├── DashboardView.vue    # 仪表盘
│   │   ├── SalesOrderView.vue   # 销售订单
│   │   ├── InventoryView.vue    # 库存管理
│   │   ├── CustomerView.vue     # 客户管理
│   │   ├── FinanceView.vue      # 财务管理
│   │   ├── ReportView.vue       # 数据报表
│   │   └── WorkflowView.vue     # 业务流程
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   └── style.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 项目配置
└── vite.config.js           # Vite 配置
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
cd erp-system
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://127.0.0.1:8080 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录，可部署到任意静态服务器。

### 预览构建结果

```bash
npm run preview
```

## 架构设计

### 数据库设计（ER 图）

本系统基于以下数据模型设计：

- **res_partner** — 客户/业务伙伴（id, name, email, phone）
- **sale_order** — 销售订单（id, name, date_order, partner_id, amount_total, state）
- **product_product** — 产品（id, name, default_code, list_price）
- **sale_order_line** — 订单明细行（id, order_id, product_id, product_uom_qty, price_unit, price_subtotal）

### 业务流程

1. **订单确认流程**：检查库存 → 充足则锁定虚拟库存 / 不足则触发 MTO 采购或提示错误 → 状态变更为 sale → 生成拣货单
2. **发货确认流程**：检查实际出库数量 → 更新库存和库位 → 计算成本价（FIFO/标准价） → 自动创建会计凭证
3. **收款对账流程**：录入付款凭证 → 匹配发票 → 金额一致/小于/大于分别处理 → 核销应收账款

### 模块依赖关系

```
base (核心模块)
├── product (产品物料)
│   ├── stock (库存)
│   │   └── sale_stock (销售库存联动)
│   └── sale (销售)
│       ├── sale_stock
│       └── account (财务会计)
└── res.partner (业务伙伴)
    ├── stock
    └── sale
```

## 课程设计说明

本项目为软件工程课程设计作品，展示了以下工程化实践：

- **组件化开发** — 可复用 UI 组件（Modal、Table、Toast、StatusBadge、StatCard）
- **状态管理** — Pinia 分模块 Store，统一数据流管理
- **路由管理** — 懒加载 + 路由守卫 + 动态标题
- **响应式设计** — 支持桌面端和移动端自适应布局
- **数据可视化** — ECharts 实现多维度业务图表
- **代码规范** — ESLint，统一中文注释，CSS 变量体系
