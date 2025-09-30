/**
 * 赛博朋克风格图表主题配置
 * 为CTFd图表提供赛博朋克风格的视觉效果
 */

import * as echarts from "echarts/core";

// 赛博朋克主题配置
export const cyberpunkTheme = {
  color: [
    '#00ffff', // 青色
    '#ff00ff', // 品红色
    '#00ff00', // 绿色
    '#ffff00', // 黄色
    '#ff6600', // 橙色
    '#9900ff', // 紫色
    '#ff0066', // 粉色
    '#00ff99', // 青绿色
  ],
  
  backgroundColor: 'rgba(10, 10, 20, 0.9)',
  
  textStyle: {
    color: '#ffffff',
    fontFamily: 'Courier New, monospace',
    fontSize: 12,
  },
  
  title: {
    textStyle: {
      color: '#00ffff',
      fontSize: 18,
      fontWeight: 'bold',
      textShadow: '0 0 10px #00ffff',
    },
    subtextStyle: {
      color: '#cccccc',
      fontSize: 14,
    },
  },
  
  legend: {
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
    },
    itemGap: 15,
    itemWidth: 25,
    itemHeight: 14,
  },
  
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#00ffff',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
    },
    axisPointer: {
      lineStyle: {
        color: '#00ffff',
        width: 1,
      },
      crossStyle: {
        color: '#00ffff',
        width: 1,
      },
    },
  },
  
  grid: {
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderWidth: 1,
  },
  
  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.5)',
        width: 2,
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.3)',
        width: 1,
      },
    },
    axisLabel: {
      color: '#cccccc',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.1)',
        width: 1,
        type: 'dashed',
      },
    },
  },
  
  yAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.5)',
        width: 2,
      },
    },
    axisTick: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.3)',
        width: 1,
      },
    },
    axisLabel: {
      color: '#cccccc',
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 255, 255, 0.1)',
        width: 1,
        type: 'dashed',
      },
    },
  },
  
  line: {
    itemStyle: {
      borderWidth: 2,
      borderColor: '#ffffff',
    },
    lineStyle: {
      width: 3,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)',
    },
    areaStyle: {
      opacity: 0.3,
    },
    emphasis: {
      lineStyle: {
        width: 4,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 255, 255, 0.8)',
      },
    },
  },
  
  bar: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#ffffff',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 255, 255, 0.5)',
      },
    },
  },
  
  pie: {
    itemStyle: {
      borderWidth: 2,
      borderColor: 'rgba(10, 10, 20, 0.8)',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 15,
        shadowColor: 'rgba(0, 255, 255, 0.5)',
      },
    },
  },
  
  scatter: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#ffffff',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 255, 255, 0.5)',
      },
    },
  },
};

// 注册赛博朋克主题
echarts.registerTheme('cyberpunk', cyberpunkTheme);

/**
 * 创建赛博朋克风格的图表容器
 * @param {string} containerId - 容器ID
 * @returns {HTMLElement} - 创建的容器元素
 */
export function createCyberChartContainer(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // 添加赛博朋克样式类
  container.classList.add('cyber-graph-container');
  
  // 添加加载动画
  const loadingHtml = `
    <div class="cyber-graph-loading">
      <i class="fas fa-sync fa-spin fa-2x"></i>
      <span>数据加载中...</span>
    </div>
  `;
  
  container.innerHTML = loadingHtml;
  
  return container;
}

/**
 * 初始化赛博朋克风格的图表
 * @param {string} containerId - 容器ID
 * @param {Object} option - ECharts配置选项
 * @returns {Object} - ECharts实例
 */
export function initCyberChart(containerId, option) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // 清除加载动画
  container.innerHTML = '';
  
  // 初始化图表
  const chart = echarts.init(container, 'cyberpunk');
  
  // 应用配置
  chart.setOption({
    ...option,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  });
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    chart.resize();
  });
  
  // 添加鼠标悬停效果
  chart.on('mouseover', (params) => {
    chart.dispatchAction({
      type: 'highlight',
      dataIndex: params.dataIndex,
      seriesIndex: params.seriesIndex,
    });
  });
  
  chart.on('mouseout', (params) => {
    chart.dispatchAction({
      type: 'downplay',
      dataIndex: params.dataIndex,
      seriesIndex: params.seriesIndex,
    });
  });
  
  return chart;
}

/**
 * 创建赛博朋克风格的进度条
 * @param {string} containerId - 容器ID
 * @param {number} value - 当前值
 * @param {number} max - 最大值
 * @param {string} type - 类型（success/fail）
 */
export function createCyberProgressBar(containerId, value, max, type = 'success') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const percentage = Math.round((value / max) * 100);
  
  const progressHtml = `
    <div class="cyber-progress-container">
      <div class="cyber-progress-bar">
        <div class="cyber-progress-fill ${type}" style="width: ${percentage}%"></div>
      </div>
      <div class="cyber-progress-labels">
        <span class="cyber-progress-label ${type}">
          <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
          ${value} / ${max}
        </span>
        <span class="cyber-progress-label">${percentage}%</span>
      </div>
    </div>
  `;
  
  container.innerHTML = progressHtml;
}

/**
 * 创建分类分布图表
 * @param {string} containerId - 容器ID
 * @param {Array} categories - 分类数据
 */
export function createCategoryBreakdown(containerId, categories) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.classList.add('cyber-category-breakdown');
  
  const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff6600', '#9900ff', '#ff0066', '#00ff99'];
  
  const itemsHtml = categories.map((category, index) => {
    const color = colors[index % colors.length];
    return `
      <div class="cyber-category-item">
        <div class="cyber-category-color" style="background-color: ${color}"></div>
        <span class="cyber-category-name">${category.name}</span>
        <span class="cyber-category-percent">${category.percentage}%</span>
      </div>
    `;
  }).join('');
  
  container.innerHTML = itemsHtml;
}

// 导出默认配置
export default {
  cyberpunkTheme,
  createCyberChartContainer,
  initCyberChart,
  createCyberProgressBar,
  createCategoryBreakdown,
};