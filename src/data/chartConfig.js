/**
 * ECharts 图表配置模块
 * 提供统一的主题配色、通用配置及各类图表的 option 生成函数
 * 所有图表数据均内嵌在配置函数中
 */

// ==================== 主题配色 ====================

/**
 * 读取 CSS 变量返回图表配色方案
 * 优先从 DOM 获取 CSS 变量，获取失败时返回默认值
 * @returns {Object} 配色对象
 */
export function getThemeColors() {
  const style = getComputedStyle(document.documentElement)
  const get = (varName, fallback) => {
    const val = style.getPropertyValue(varName)?.trim()
    return val || fallback
  }

  return {
    primary: get('--primary', '#3B82F6'),
    success: get('--success', '#10B981'),
    warning: get('--warning', '#F59E0B'),
    danger: get('--danger', '#EF4444'),
    info: get('--info', '#06B6D4'),
    purple: get('--purple', '#8B5CF6'),
    pink: get('--pink', '#EC4899'),
    orange: get('--orange', '#F97316'),
    // 图表专用色板
    palette: [
      get('--primary', '#3B82F6'),
      get('--success', '#10B981'),
      get('--warning', '#F59E0B'),
      get('--danger', '#EF4444'),
      get('--info', '#06B6D4'),
      get('--purple', '#8B5CF6'),
      get('--pink', '#EC4899'),
      get('--orange', '#F97316'),
    ],
    // 文字与背景
    textPrimary: get('--text-primary', '#1F2937'),
    textSecondary: get('--text-secondary', '#6B7280'),
    textMuted: get('--text-muted', '#9CA3AF'),
    border: get('--border', '#E5E7EB'),
    bg: get('--bg', '#FFFFFF'),
    bgLight: get('--bg-light', '#F9FAFB'),
  }
}

// ==================== 通用配置 ====================

/**
 * 返回通用 tooltip 配置
 * @returns {Object} tooltip 配置对象
 */
export function getCommonTooltip() {
  return {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    textStyle: { color: '#374151', fontSize: 13 },
    axisPointer: {
      type: 'shadow',
      shadowStyle: { color: 'rgba(59,130,246,0.06)' },
    },
  }
}

/**
 * 返回通用坐标轴配置
 * @param {string} [unit=''] 数值单位
 * @returns {Object} 包含 xAxis 和 yAxis 的配置
 */
export function getAxisConfig(unit = '') {
  const colors = getThemeColors()
  return {
    xAxis: {
      type: 'category',
      axisLine: { lineStyle: { color: colors.border } },
      axisTick: { show: false },
      axisLabel: { color: colors.textSecondary, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      name: unit,
      nameTextStyle: { color: colors.textMuted, fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' } },
      axisLabel: { color: colors.textSecondary, fontSize: 12 },
    },
  }
}

// ==================== 图表配置函数 ====================

/**
 * 月度销售趋势 - 柱状+折线混合图
 * 展示 2026 年 1-6 月销售额与订单数量
 */
export function getSalesTrendOption() {
  const colors = getThemeColors()
  const { xAxis, yAxis } = getAxisConfig('万元')

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['销售额', '订单数'],
      right: 20,
      top: 10,
      textStyle: { color: colors.textSecondary },
    },
    grid: { left: 60, right: 60, top: 50, bottom: 30 },
    xAxis: { ...xAxis, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: [yAxis, { ...yAxis, name: '单', splitLine: { show: false } }],
    series: [
      {
        name: '销售额',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: 28,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.primary },
              { offset: 1, color: '#93C5FD' },
            ],
          },
        },
        data: [31.8, 40.72, 26.48, 45.75, 39.56, 35.19],
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.warning },
        itemStyle: { color: colors.warning },
        data: [2, 2, 2, 2, 2, 2],
      },
    ],
  }
}

/**
 * 订单状态饼图
 * 展示各状态订单占比：草稿、已确认、已完成、已取消
 */
export function getOrderStatusOption() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}单 ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: colors.textSecondary },
    },
    color: [colors.primary, colors.warning, colors.success, colors.danger],
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: colors.textSecondary,
          fontSize: 12,
        },
        emphasis: {
          label: { fontSize: 16, fontWeight: 'bold' },
        },
        data: [
          { value: 2, name: '草稿' },
          { value: 4, name: '已确认' },
          { value: 4, name: '已完成' },
          { value: 1, name: '已取消' },
        ],
      },
    ],
  }
}

/**
 * 产品销售排行 - 横向柱状图
 * 展示销售额前 8 的产品排名
 */
export function getTopProductsOption() {
  const colors = getThemeColors()

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 140, right: 40, top: 20, bottom: 30 },
    xAxis: {
      type: 'value',
      name: '万元',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' } },
      axisLabel: { color: colors.textSecondary },
    },
    yAxis: {
      type: 'category',
      data: [
        'PLC控制器 S7-1200',
        '精密行星减速机 PLE-80',
        '伺服电机驱动器 1.5kW',
        '液压缸 HOB-63/35',
        '深沟球轴承 6205',
        '高强度合金螺栓 M16',
        '碳钢焊接弯头 DN80',
        '304不锈钢六角螺母',
      ].reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: colors.textSecondary, fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        barWidth: 18,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: colors.success },
              { offset: 1, color: '#6EE7B7' },
            ],
          },
        },
        data: [8.52, 15.6, 13.44, 19.04, 20.65, 20.48, 12.6, 11.2].reverse(),
      },
    ],
  }
}

/**
 * 仓库库存分布图
 * 展示各类别产品的库存总量
 */
export function getStockDistOption() {
  const colors = getThemeColors()

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
    },
    legend: {
      data: ['实际库存', '虚拟库存', '安全库存'],
      bottom: 10,
      textStyle: { color: colors.textSecondary },
    },
    grid: { left: 60, right: 30, top: 20, bottom: 50 },
    xAxis: { ...getAxisConfig().xAxis, data: ['紧固件', '轴承', '传动件', '电气元件', '液压件', '型材', '气动件', '管件'] },
    yAxis: { ...getAxisConfig().yAxis, name: '件' },
    series: [
      {
        name: '实际库存',
        type: 'bar',
        stack: 'total',
        barWidth: 32,
        itemStyle: { color: colors.primary, borderRadius: [0, 0, 0, 0] },
        data: [21200, 420, 28, 83, 38, 560, 150, 240],
      },
      {
        name: '虚拟库存',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: colors.warning },
        data: [7050, 180, 12, 38, 22, 210, 65, 95],
      },
      {
        name: '安全库存',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: colors.danger, borderRadius: [4, 4, 0, 0] },
        data: [3500, 200, 10, 30, 15, 100, 50, 80],
      },
    ],
  }
}

/**
 * 库存周转率折线图
 * 展示 2026 年 1-6 月库存周转率变化趋势
 */
export function getTurnoverOption() {
  const colors = getThemeColors()
  const { xAxis, yAxis } = getAxisConfig('次/月')

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
    },
    grid: { left: 60, right: 30, top: 30, bottom: 30 },
    xAxis: { ...xAxis, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { ...yAxis, min: 0, max: 6 },
    series: [
      {
        type: 'line',
        name: '周转率',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: { width: 3, color: colors.purple },
        itemStyle: { color: colors.purple, borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139,92,246,0.3)' },
              { offset: 1, color: 'rgba(139,92,246,0.02)' },
            ],
          },
        },
        data: [2.8, 3.2, 3.5, 4.1, 3.8, 4.5],
      },
      {
        type: 'line',
        name: '行业均值',
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: { width: 2, color: colors.textMuted, type: 'dashed' },
        itemStyle: { color: colors.textMuted },
        data: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
      },
    ],
  }
}

/**
 * 收款趋势柱状图
 * 展示 2026 年 1-6 月收款金额与应收金额对比
 */
export function getPaymentOption() {
  const colors = getThemeColors()
  const { xAxis, yAxis } = getAxisConfig('万元')

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
    },
    legend: {
      data: ['应收金额', '实收金额'],
      right: 20,
      top: 10,
      textStyle: { color: colors.textSecondary },
    },
    grid: { left: 60, right: 30, top: 50, bottom: 30 },
    xAxis: { ...xAxis, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis,
    series: [
      {
        name: '应收金额',
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: colors.info,
        },
        data: [31.8, 40.72, 26.48, 45.75, 39.56, 35.19],
      },
      {
        name: '实收金额',
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: colors.success,
        },
        data: [31.8, 40.72, 12.8, 9.0, 0, 7.6],
      },
    ],
  }
}

/**
 * 发票状态饼图
 * 展示已付清、部分付款、待付款的发票数量占比
 */
export function getInvoiceStatusOption() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}张 ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: colors.textSecondary },
    },
    color: [colors.success, colors.warning, colors.danger],
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['40%', '50%'],
        roseType: false,
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: colors.textSecondary,
          fontSize: 12,
        },
        emphasis: {
          label: { fontSize: 16, fontWeight: 'bold' },
        },
        data: [
          { value: 4, name: '已付清' },
          { value: 3, name: '部分付款' },
          { value: 3, name: '待付款' },
        ],
      },
    ],
  }
}

/**
 * 品类销售占比玫瑰图
 * 展示各品类销售额在总销售额中的占比（南丁格尔玫瑰图）
 */
export function getCategoryOption() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}万元 ({d}%)' },
    legend: {
      bottom: 10,
      textStyle: { color: colors.textSecondary },
    },
    color: colors.palette,
    series: [
      {
        type: 'pie',
        radius: ['20%', '65%'],
        center: ['50%', '45%'],
        roseType: 'area',
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: colors.textSecondary,
          fontSize: 11,
        },
        itemStyle: {
          borderRadius: 6,
        },
        data: [
          { value: 31.68, name: '紧固件' },
          { value: 20.65, name: '轴承' },
          { value: 15.60, name: '传动件' },
          { value: 21.97, name: '电气元件' },
          { value: 19.04, name: '液压件' },
          { value: 10.68, name: '型材' },
          { value: 7.04, name: '气动件' },
          { value: 12.60, name: '管件' },
        ],
      },
    ],
  }
}

/**
 * 利润趋势柱状+折线图
 * 展示 2026 年 1-6 月毛利润与毛利率走势
 */
export function getProfitOption() {
  const colors = getThemeColors()
  const { xAxis, yAxis } = getAxisConfig('万元')

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['毛利润', '毛利率'],
      right: 20,
      top: 10,
      textStyle: { color: colors.textSecondary },
    },
    grid: { left: 60, right: 60, top: 50, bottom: 30 },
    xAxis: { ...xAxis, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: [
      yAxis,
      { ...yAxis, name: '%', min: 0, max: 40, splitLine: { show: false } },
    ],
    series: [
      {
        name: '毛利润',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: 28,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors.success },
              { offset: 1, color: '#A7F3D0' },
            ],
          },
        },
        data: [5.73, 7.93, 4.65, 8.69, 7.12, 6.34],
      },
      {
        name: '毛利率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: colors.orange },
        itemStyle: { color: colors.orange },
        data: [18.0, 19.5, 17.6, 19.0, 18.0, 18.0],
      },
    ],
  }
}

/**
 * 客户排名横向柱状图
 * 展示累计采购金额前 8 的客户排名
 */
export function getCustomerRankOption() {
  const colors = getThemeColors()

  return {
    tooltip: {
      ...getCommonTooltip(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 140, right: 50, top: 10, bottom: 30 },
    xAxis: {
      type: 'value',
      name: '万元',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.border, type: 'dashed' } },
      axisLabel: { color: colors.textSecondary },
    },
    yAxis: {
      type: 'category',
      data: [
        '中联重工集团',
        '武汉钢铁配套设备厂',
        '广州恒力液压科技',
        '华东精密机械有限公司',
        '天津北方阀门集团',
        '深圳鑫达电子科技',
        '重庆长江机械配件厂',
        '上海博瑞自动化',
      ].reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: colors.textSecondary, fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color(params) {
            const colorList = [
              colors.primary,
              colors.success,
              colors.warning,
              colors.danger,
              colors.info,
              colors.purple,
              colors.pink,
              colors.orange,
            ]
            return colorList[params.dataIndex % colorList.length]
          },
        },
        data: [
          215.0, 168.0, 142.0, 128.6, 92.0, 95.6, 64.0, 73.5,
        ].reverse(),
      },
    ],
  }
}

/**
 * 订单确认流程图 - graph 类型
 * 展示销售订单从创建到确认的审批流程
 */
export function getFlow1Option() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', backgroundColor: '#fff', borderColor: colors.border, textStyle: { color: colors.textPrimary, fontSize: 13 } },
    animation: false,
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        draggable: true,
        label: {
          show: true,
          fontSize: 12,
          color: '#fff',
          fontWeight: 600,
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 10],
        edgeLabel: {
          show: true,
          fontSize: 11,
          formatter: '{c}',
          color: colors.textSecondary,
        },
        lineStyle: {
          color: colors.border,
          width: 2,
          curveness: 0.15,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
        data: [
          { name: '创建订单', x: 80, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.primary, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' } },
          { name: '价格审核', x: 250, y: 80, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.warning, shadowBlur: 6, shadowColor: 'rgba(245,158,11,0.3)' } },
          { name: '库存确认', x: 250, y: 280, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.info, shadowBlur: 6, shadowColor: 'rgba(6,182,212,0.3)' } },
          { name: '信用检查', x: 420, y: 180, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.purple, shadowBlur: 6, shadowColor: 'rgba(139,92,246,0.3)' } },
          { name: '主管审批', x: 570, y: 80, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.orange, shadowBlur: 6, shadowColor: 'rgba(249,115,22,0.3)' } },
          { name: '确认订单', x: 570, y: 280, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.success, shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.3)' } },
          { name: '下达生产', x: 740, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.danger, shadowBlur: 6, shadowColor: 'rgba(239,68,68,0.3)' } },
        ],
        links: [
          { source: '创建订单', target: '价格审核', value: '' },
          { source: '创建订单', target: '库存确认', value: '' },
          { source: '价格审核', target: '信用检查', value: '通过', lineStyle: { color: colors.success } },
          { source: '库存确认', target: '信用检查', value: '通过', lineStyle: { color: colors.success } },
          { source: '信用检查', target: '主管审批', value: '信用达标' },
          { source: '信用检查', target: '确认订单', value: '小额免审', lineStyle: { color: colors.success } },
          { source: '主管审批', target: '确认订单', value: '审批通过', lineStyle: { color: colors.success } },
          { source: '确认订单', target: '下达生产', value: '', lineStyle: { color: colors.primary } },
        ],
      },
    ],
  }
}

/**
 * 发货确认流程图 - graph 类型
 * 展示从订单确认到发货完成的业务流程
 */
export function getFlow2Option() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', backgroundColor: '#fff', borderColor: colors.border, textStyle: { color: colors.textPrimary, fontSize: 13 } },
    animation: false,
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        draggable: true,
        label: {
          show: true,
          fontSize: 12,
          color: '#fff',
          fontWeight: 600,
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 10],
        edgeLabel: {
          show: true,
          fontSize: 11,
          formatter: '{c}',
          color: colors.textSecondary,
        },
        lineStyle: {
          color: colors.border,
          width: 2,
          curveness: 0.15,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
        data: [
          { name: '确认订单', x: 80, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.primary, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' } },
          { name: '备货拣货', x: 240, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.info, shadowBlur: 6, shadowColor: 'rgba(6,182,212,0.3)' } },
          { name: '质检检验', x: 400, y: 80, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.warning, shadowBlur: 6, shadowColor: 'rgba(245,158,11,0.3)' } },
          { name: '包装打包', x: 400, y: 280, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.purple, shadowBlur: 6, shadowColor: 'rgba(139,92,246,0.3)' } },
          { name: '物流分配', x: 560, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.orange, shadowBlur: 6, shadowColor: 'rgba(249,115,22,0.3)' } },
          { name: '发货出库', x: 700, y: 80, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.success, shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.3)' } },
          { name: '客户签收', x: 700, y: 280, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.danger, shadowBlur: 6, shadowColor: 'rgba(239,68,68,0.3)' } },
        ],
        links: [
          { source: '确认订单', target: '备货拣货', value: '', lineStyle: { color: colors.primary } },
          { source: '备货拣货', target: '质检检验', value: '' },
          { source: '备货拣货', target: '包装打包', value: '' },
          { source: '质检检验', target: '物流分配', value: '合格', lineStyle: { color: colors.success } },
          { source: '包装打包', target: '物流分配', value: '' },
          { source: '物流分配', target: '发货出库', value: '安排车辆', lineStyle: { color: colors.success } },
          { source: '发货出库', target: '客户签收', value: '签收回单' },
        ],
      },
    ],
  }
}

/**
 * 收款对账流程图 - graph 类型
 * 展示从发票开具到收款完成的财务流程
 */
export function getFlow3Option() {
  const colors = getThemeColors()

  return {
    tooltip: { trigger: 'item', backgroundColor: '#fff', borderColor: colors.border, textStyle: { color: colors.textPrimary, fontSize: 13 } },
    animation: false,
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        draggable: true,
        label: {
          show: true,
          fontSize: 12,
          color: '#fff',
          fontWeight: 600,
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 10],
        edgeLabel: {
          show: true,
          fontSize: 11,
          formatter: '{c}',
          color: colors.textSecondary,
        },
        lineStyle: {
          color: colors.border,
          width: 2,
          curveness: 0.15,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
        data: [
          { name: '开具发票', x: 80, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.primary, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' } },
          { name: '发送账单', x: 240, y: 80, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.info, shadowBlur: 6, shadowColor: 'rgba(6,182,212,0.3)' } },
          { name: '客户确认', x: 240, y: 280, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.warning, shadowBlur: 6, shadowColor: 'rgba(245,158,11,0.3)' } },
          { name: '到期提醒', x: 420, y: 180, symbol: 'diamond', symbolSize: [60, 60], itemStyle: { color: colors.orange, shadowBlur: 6, shadowColor: 'rgba(249,115,22,0.3)' } },
          { name: '客户付款', x: 580, y: 80, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.success, shadowBlur: 6, shadowColor: 'rgba(16,185,129,0.3)' } },
          { name: '财务核销', x: 580, y: 280, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.purple, shadowBlur: 6, shadowColor: 'rgba(139,92,246,0.3)' } },
          { name: '账单结清', x: 740, y: 180, symbol: 'roundRect', symbolSize: [90, 44], itemStyle: { color: colors.danger, shadowBlur: 6, shadowColor: 'rgba(239,68,68,0.3)' } },
        ],
        links: [
          { source: '开具发票', target: '发送账单', value: '', lineStyle: { color: colors.primary } },
          { source: '发送账单', target: '客户确认', value: '账单核对' },
          { source: '客户确认', target: '到期提醒', value: '已确认', lineStyle: { color: colors.success } },
          { source: '到期提醒', target: '客户付款', value: '到期通知' },
          { source: '到期提醒', target: '财务核销', value: '超期催收', lineStyle: { color: colors.danger } },
          { source: '客户付款', target: '账单结清', value: '银行到账', lineStyle: { color: colors.success } },
          { source: '财务核销', target: '账单结清', value: '核销完成' },
        ],
      },
    ],
  }
}
