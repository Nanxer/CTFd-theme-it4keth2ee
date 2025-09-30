import Alpine from "alpinejs";
import dayjs from "dayjs";

import CTFd from "./index";

import { Modal, Tab, Tooltip } from "bootstrap";
import highlight from "./theme/highlight";

function addTargetBlank(html) {
  let dom = new DOMParser();
  let view = dom.parseFromString(html, "text/html");
  let links = view.querySelectorAll('a[href*="://"]');
  links.forEach(link => {
    link.setAttribute("target", "_blank");
  });
  return view.documentElement.outerHTML;
}

window.Alpine = Alpine;

Alpine.store("challenge", {
  data: {
    view: "",
  },
});

Alpine.data("Hint", () => ({
  id: null,
  html: null,

  async showHint(event) {
    if (event.target.open) {
      let response = await CTFd.pages.challenge.loadHint(this.id);

      // Hint has some kind of prerequisite or access prevention
      if (response.errors) {
        event.target.open = false;
        CTFd._functions.challenge.displayUnlockError(response);
        return;
      }
      let hint = response.data;
      if (hint.content) {
        this.html = addTargetBlank(hint.html);
      } else {
        let answer = await CTFd.pages.challenge.displayUnlock(this.id);
        if (answer) {
          let unlock = await CTFd.pages.challenge.loadUnlock(this.id);

          if (unlock.success) {
            let response = await CTFd.pages.challenge.loadHint(this.id);
            let hint = response.data;
            this.html = addTargetBlank(hint.html);
          } else {
            event.target.open = false;
            CTFd._functions.challenge.displayUnlockError(unlock);
          }
        } else {
          event.target.open = false;
        }
      }
    }
  },
}));

Alpine.data("Challenge", () => ({
  id: null,
  next_id: null,
  submission: "",
  tab: null,
  solves: [],
  submissions: [],
  solution: null,
  response: null,
  share_url: null,
  max_attempts: 0,
  attempts: 0,
  ratingValue: 0,
  selectedRating: 0,
  ratingReview: "",
  ratingSubmitted: false,

  async init() {
    highlight();
  },

  getStyles() {
    let styles = {
      "modal-dialog": true,
    };
    try {
      let size = CTFd.config.themeSettings.challenge_window_size;
      switch (size) {
        case "sm":
          styles["modal-sm"] = true;
          break;
        case "lg":
          styles["modal-lg"] = true;
          break;
        case "xl":
          styles["modal-xl"] = true;
          break;
        default:
          break;
      }
    } catch (error) {
      // Ignore errors with challenge window size
      console.log("Error processing challenge_window_size");
      console.log(error);
    }
    return styles;
  },

  async init() {
    highlight();
  },

  async showChallenge() {
    new Tab(this.$el).show();
  },

  async showSolves() {
    this.solves = await CTFd.pages.challenge.loadSolves(this.id);
    this.solves.forEach(solve => {
      solve.date = dayjs(solve.date).format("MMMM Do, h:mm:ss A");
      return solve;
    });
    new Tab(this.$el).show();
  },

  async showSubmissions() {
    let response = await CTFd.pages.users.userSubmissions("me", this.id);
    this.submissions = response.data;
    this.submissions.forEach(s => {
      s.date = dayjs(s.date).format("MMMM Do, h:mm:ss A");
      return s;
    });
    new Tab(this.$el).show();
  },

  getSolutionId() {
    let data = Alpine.store("challenge").data;
    return data.solution_id;
  },

  async showSolution() {
    let solution_id = this.getSolutionId();
    CTFd._functions.challenge.displaySolution = solution => {
      this.solution = solution.html;
      new Tab(this.$el).show();
    };
    await CTFd.pages.challenge.displaySolution(solution_id);
  },

  getNextId() {
    let data = Alpine.store("challenge").data;
    return data.next_id;
  },

  async nextChallenge() {
    const modalElement = document.querySelector("[x-ref='challengeWindow']");
    
    // 隐藏自定义模态窗口
    modalElement.style.display = 'none';
    
    // 清理全局关闭函数和事件监听器
    if (window.closeChallengeModal) {
      // 清理事件监听器
      document.removeEventListener('keydown', window.handleEscKey);
      modalElement.removeEventListener('click', window.handleModalClick);
      
      // 清理关闭按钮事件
      if (window.closeButtons) {
        window.closeButtons.forEach(button => {
          button.removeEventListener('click', window.closeChallengeModal);
        });
      }
      
      // 清理全局变量
      delete window.closeChallengeModal;
      delete window.handleEscKey;
      delete window.handleModalClick;
      delete window.closeButtons;
    }
    
    // Dispatch load-challenge event to call loadChallenge in the ChallengeBoard
    Alpine.nextTick(() => {
      this.$dispatch("load-challenge", this.getNextId());
    });
  },

  async getShareUrl() {
    let body = {
      type: "solve",
      challenge_id: this.id,
    };
    const response = await CTFd.fetch("/api/v1/shares", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const url = data["data"]["url"];
    this.share_url = url;
  },

  copyShareUrl() {
    navigator.clipboard.writeText(this.share_url);
    let t = Tooltip.getOrCreateInstance(this.$el);
    t.enable();
    t.show();
    setTimeout(() => {
      t.hide();
      t.disable();
    }, 2000);
  },

  async submitChallenge() {
    this.response = await CTFd.pages.challenge.submitChallenge(
      this.id,
      this.submission,
    );

    await this.renderSubmissionResponse();
  },

  async renderSubmissionResponse() {
    if (this.response.data.status === "correct") {
      this.submission = "";
    }

    // Increment attempts counter
    if (
      this.max_attempts > 0 &&
      this.response.data.status != "already_solved" &&
      this.response.data.status != "ratelimited"
    ) {
      this.attempts += 1;
    }

    // Dispatch load-challenges event to call loadChallenges in the ChallengeBoard
    this.$dispatch("load-challenges");
  },

  async submitRating() {
    const response = await CTFd.pages.challenge.submitRating(
      this.id,
      this.selectedRating,
      this.ratingReview,
    );
    if (response.value) {
      this.ratingValue = this.selectedRating;
      this.ratingSubmitted = true;
    } else {
      alert("Error submitting rating");
    }
  },
}));

Alpine.data("ChallengeBoard", () => ({
  loaded: false,
  challenges: [],
  challenge: null,

  async init() {
    this.challenges = await CTFd.pages.challenges.getChallenges();
    this.loaded = true;

    if (window.location.hash) {
      let chalHash = decodeURIComponent(window.location.hash.substring(1));
      let idx = chalHash.lastIndexOf("-");
      if (idx >= 0) {
        let pieces = [chalHash.slice(0, idx), chalHash.slice(idx + 1)];
        let id = pieces[1];
        await this.loadChallenge(id);
      }
    }
  },

  getCategories() {
    const categories = [];

    this.challenges.forEach(challenge => {
      const { category } = challenge;

      if (!categories.includes(category)) {
        categories.push(category);
      }
    });

    try {
      const f = CTFd.config.themeSettings.challenge_category_order;
      if (f) {
        const getSort = new Function(`return (${f})`);
        categories.sort(getSort());
      }
    } catch (error) {
      // Ignore errors with theme category sorting
      console.log("Error running challenge_category_order function");
      console.log(error);
    }

    return categories;
  },

  getChallenges(category) {
    let challenges = this.challenges;

    if (category !== null) {
      challenges = this.challenges.filter(challenge => challenge.category === category);
    }

    try {
      const f = CTFd.config.themeSettings.challenge_order;
      if (f) {
        const getSort = new Function(`return (${f})`);
        challenges.sort(getSort());
      }
    } catch (error) {
      // Ignore errors with theme challenge sorting
      console.log("Error running challenge_order function");
      console.log(error);
    }

    return challenges;
  },

  async loadChallenges() {
    this.challenges = await CTFd.pages.challenges.getChallenges();
  },

  async loadChallenge(challengeId) {
    await CTFd.pages.challenge.displayChallenge(challengeId, challenge => {
      challenge.data.view = addTargetBlank(challenge.data.view);
      Alpine.store("challenge").data = challenge.data;

      // nextTick is required here because we're working in a callback
      Alpine.nextTick(() => {
        const modalElement = document.querySelector("[x-ref='challengeWindow']");
        
        // 显示自定义模态窗口
        modalElement.style.display = 'block';
        
        // 创建全局关闭函数
        window.closeChallengeModal = function() {
          modalElement.style.display = 'none';
          history.replaceState(null, null, " ");
          
          // 清理事件监听器
          document.removeEventListener('keydown', window.handleEscKey);
          modalElement.removeEventListener('click', window.handleModalClick);
          
          // 清理关闭按钮事件
          if (window.closeButtons) {
            window.closeButtons.forEach(button => {
              button.removeEventListener('click', window.closeChallengeModal);
            });
          }
        };
        
        // 点击模态窗口外部关闭
        window.handleModalClick = function(event) {
          if (event.target === modalElement) {
            window.closeChallengeModal();
          }
        };
        modalElement.addEventListener('click', window.handleModalClick);
        
        // 添加ESC键关闭功能
        window.handleEscKey = function(event) {
          if (event.key === 'Escape') {
            window.closeChallengeModal();
          }
        };
        document.addEventListener('keydown', window.handleEscKey);
        
        // 为模态窗口内的关闭按钮添加事件监听器
        const setupCloseButtons = () => {
          // 只查找明确的关闭按钮，避免影响功能性按钮
          const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"], .btn-close, .close, button[aria-label*="close"], button[title*="close"]');
          window.closeButtons = closeButtons;
          
          closeButtons.forEach(button => {
            // 只移除关闭相关的属性，不影响其他功能
            button.removeAttribute('data-bs-dismiss');
            
            // 检查是否是真正的关闭按钮（通过类名、属性或文本内容判断）
            const isCloseButton = button.classList.contains('btn-close') || 
                                 button.classList.contains('close') ||
                                 button.getAttribute('aria-label')?.toLowerCase().includes('close') ||
                                 button.getAttribute('title')?.toLowerCase().includes('close') ||
                                 button.textContent?.trim().toLowerCase() === '×' ||
                                 button.textContent?.trim().toLowerCase() === 'close';
            
            if (isCloseButton) {
              // 只对明确的关闭按钮添加事件
              button.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.closeChallengeModal();
              });
            }
          });
        };
        
        // 立即设置关闭按钮
        setupCloseButtons();
        
        // 延迟再次检查，确保动态内容已加载
        setTimeout(setupCloseButtons, 200);
        
        history.replaceState(null, null, `#${challenge.data.name}-${challengeId}`);
      });
    });
  },
}));

Alpine.start();