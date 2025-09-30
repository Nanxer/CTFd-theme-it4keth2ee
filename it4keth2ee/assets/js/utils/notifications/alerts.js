import Alpine from "alpinejs";
import CTFd from "../../index";

export default () => {
  Alpine.store("modal", { title: "", html: "" });

  CTFd._functions.events.eventAlert = data => {
    Alpine.store("modal", data);
    const modalElement = document.querySelector("[x-ref='modal']");
    modalElement.style.display = 'block';
    
    // 设置关闭事件处理器
    const handleClose = () => {
      modalElement.style.display = 'none';
      CTFd._functions.events.eventRead(data.id);
      
      // 清理事件监听器
      modalElement.removeEventListener('click', handleModalClick);
      document.removeEventListener('keydown', handleEscKey);
      
      const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"], .btn-close, .close, button[aria-label*="close"], button[title*="close"]');
      closeButtons.forEach(button => {
        button.removeEventListener('click', handleClose);
      });
    };
    
    // 点击模态窗口外部关闭
    const handleModalClick = (event) => {
      if (event.target === modalElement) {
        handleClose();
      }
    };
    modalElement.addEventListener('click', handleModalClick);
    
    // 添加ESC键关闭功能
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    
    // 为关闭按钮添加事件监听器
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"], .btn-close, .close, button[aria-label*="close"], button[title*="close"]');
    closeButtons.forEach(button => {
      button.removeAttribute('data-bs-dismiss');
      const isCloseButton = button.classList.contains('btn-close') || 
                           button.classList.contains('close') ||
                           button.getAttribute('aria-label')?.toLowerCase().includes('close') ||
                           button.getAttribute('title')?.toLowerCase().includes('close') ||
                           button.textContent?.trim().toLowerCase() === '×' ||
                           button.textContent?.trim().toLowerCase() === 'close';
      
      if (isCloseButton) {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          handleClose();
        });
      }
    });
  };
};