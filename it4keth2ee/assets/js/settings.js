import Alpine from "alpinejs";
import { serializeJSON } from "@ctfdio/ctfd-js/forms";

import CTFd from "./index";
import { copyToClipboard } from "./utils/clipboard";

window.Alpine = Alpine;

Alpine.data("SettingsForm", () => ({
  success: null,
  error: null,
  initial: null,
  errors: [],

  init() {
    this.initial = serializeJSON(this.$el);
  },

  async updateProfile() {
    this.success = null;
    this.error = null;
    this.errors = [];

    let data = serializeJSON(this.$el, this.initial, true);

    // Process fields[id] to fields: {}
    data.fields = [];
    for (const property in data) {
      if (property.match(/fields\[\d+\]/)) {
        let field = {};
        let id = parseInt(property.slice(7, -1));
        field["field_id"] = id;
        field["value"] = data[property];
        data.fields.push(field);
        delete data[property];
      }
    }

    // Send API request
    const response = await CTFd.pages.settings.updateSettings(data);
    if (response.success) {
      this.success = true;
      this.error = false;

      setTimeout(() => {
        this.success = null;
        this.error = null;
      }, 3000);
    } else {
      this.success = false;
      this.error = true;

      Object.keys(response.errors).map(error => {
        const error_msg = response.errors[error];
        this.errors.push(error_msg);
      });
    }
  },
}));

Alpine.data("TokensForm", () => ({
  token: null,

  async generateToken() {
    const data = serializeJSON(this.$el);

    if (!data.expiration) {
      delete data.expiration;
    }
    const response = await CTFd.pages.settings.generateToken(data);
    this.token = response.data.value;

    const modalElement = this.$refs.tokenModal;
    modalElement.style.display = 'block';
    this.setupModalCloseHandlers(modalElement);
  },

  copyToken() {
    copyToClipboard(this.$refs.token);
  },

  setupModalCloseHandlers(modalElement) {
    // 点击模态窗口外部关闭
    const handleModalClick = (event) => {
      if (event.target === modalElement) {
        this.closeModal(modalElement);
      }
    };
    modalElement.addEventListener('click', handleModalClick);

    // 添加ESC键关闭功能
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        this.closeModal(modalElement);
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
          this.closeModal(modalElement);
        });
      }
    });

    // 保存事件处理器以便后续清理
    modalElement._closeHandlers = {
      modalClick: handleModalClick,
      escKey: handleEscKey,
      closeButtons: closeButtons
    };
  },

  closeModal(modalElement) {
    modalElement.style.display = 'none';
    
    // 清理事件监听器
    if (modalElement._closeHandlers) {
      modalElement.removeEventListener('click', modalElement._closeHandlers.modalClick);
      document.removeEventListener('keydown', modalElement._closeHandlers.escKey);
      
      modalElement._closeHandlers.closeButtons.forEach(button => {
        button.removeEventListener('click', this.closeModal);
      });
      
      delete modalElement._closeHandlers;
    }
  },
}));

Alpine.data("Tokens", () => ({
  selectedTokenId: null,

  async deleteTokenModal(tokenId) {
    this.selectedTokenId = tokenId;
    const modalElement = this.$refs.confirmModal;
    modalElement.style.display = 'block';
    this.setupModalCloseHandlers(modalElement);
  },

  async deleteSelectedToken() {
    await CTFd.pages.settings.deleteToken(this.selectedTokenId);
    const $token = this.$refs[`token-${this.selectedTokenId}`];

    if ($token) {
      $token.remove();
    }
    
    // 关闭确认模态窗口
    const modalElement = this.$refs.confirmModal;
    this.closeModal(modalElement);
  },

  setupModalCloseHandlers(modalElement) {
    // 点击模态窗口外部关闭
    const handleModalClick = (event) => {
      if (event.target === modalElement) {
        this.closeModal(modalElement);
      }
    };
    modalElement.addEventListener('click', handleModalClick);

    // 添加ESC键关闭功能
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        this.closeModal(modalElement);
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
          this.closeModal(modalElement);
        });
      }
    });

    // 保存事件处理器以便后续清理
    modalElement._closeHandlers = {
      modalClick: handleModalClick,
      escKey: handleEscKey,
      closeButtons: closeButtons
    };
  },

  closeModal(modalElement) {
    modalElement.style.display = 'none';
    
    // 清理事件监听器
    if (modalElement._closeHandlers) {
      modalElement.removeEventListener('click', modalElement._closeHandlers.modalClick);
      document.removeEventListener('keydown', modalElement._closeHandlers.escKey);
      
      modalElement._closeHandlers.closeButtons.forEach(button => {
        button.removeEventListener('click', this.closeModal);
      });
      
      delete modalElement._closeHandlers;
    }
  },
}));

Alpine.start();