"use strict";

/**
 * 强制使用黑夜模式
 * @returns {String} 始终返回'dark'
 */
function getPreferredTheme() {
  // 强制使用黑夜模式，忽略用户设置
  return "dark";
}

/**
 * 空函数，因为不再需要切换功能
 * @param {String} theme - 主题模式
 */
function showActiveTheme(theme) {
  // 不再显示主题切换图标
}

// 强制设置黑夜模式
let currentTheme = getPreferredTheme();
document.documentElement.setAttribute("data-bs-theme", currentTheme);

// 移除浏览器颜色方案变化的监听
// 不再需要响应系统主题变化

window.addEventListener("load", () => {
  // 移除主题切换按钮的事件监听
  // 不再需要主题切换功能
});