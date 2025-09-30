import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

// 左侧边栏交互功能
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.cyber-sidebar');
  const sidebarToggle = document.querySelector('.cyber-sidebar-toggle');
  const mainContent = document.querySelector('.cyber-main');
  
  // 移动端侧边栏切换
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      // 添加按钮点击动画
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      sidebar.classList.toggle('active');
      sidebarToggle.classList.toggle('active');
      
      // 添加侧边栏动画
      if (sidebar.classList.contains('active')) {
        sidebar.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
      } else {
        sidebar.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';
      }
    });
    
    // 点击侧边栏外部关闭
    document.addEventListener('click', function(event) {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(event.target) && 
          !sidebarToggle.contains(event.target)) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        sidebar.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';
      }
    });
  }
  
  // 菜单项点击效果
  const menuLinks = document.querySelectorAll('.cyber-menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      // 添加点击反馈动画
      this.style.transform = 'translateX(10px)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
      
      // 移动端点击后自动关闭侧边栏
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('active');
        if (sidebarToggle) {
          sidebarToggle.classList.remove('active');
        }
        sidebar.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';
      }
    });
  });
  
  // 窗口大小变化时的响应式处理
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sidebar) {
      sidebar.classList.remove('active');
      if (sidebarToggle) {
        sidebarToggle.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  });
  
  // 键盘快捷键支持
  document.addEventListener('keydown', function(event) {
    // ESC键关闭侧边栏
    if (event.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      if (sidebarToggle) {
        sidebarToggle.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
    
    // Ctrl/Cmd + M 切换侧边栏
    if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
      event.preventDefault();
      if (sidebarToggle && sidebar) {
        sidebarToggle.click();
      }
    }
  });
});

Alpine.start();