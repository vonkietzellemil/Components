const AppEl = document.getElementById("App");
const AppContent = document.getElementById("AppContent");
const pagesContainer = document.getElementById("pagesContainer");

const sidebar = document.getElementById("sidebar");
const allPages = document.querySelectorAll(".page");

const componentsPage = document.getElementById("componentsPage");


const pagesBackground = document.getElementById("pagesBackground");
const overlay = document.getElementById("pageOverlay");


import { App } from "./core/app.js";
import { state } from "./core/state.js"

function initiate() {
  // App.pages.newPage({ page: App.pages.configs.lists.root, animation: false });

  App.pages.push(componentsPage, false);

  const item = document.querySelector(".list-item");

  item.addEventListener("click", () => {
    App.pages.newPage({ page: App.pages.configs.list.root });
  });
  

  // ========================================================
  // enable swipe for pages go back
  // ========================================================

  App.gestures.enableDrag({
    handle: pagesContainer,

    direction: "horizontal",

    getElementsToAnimate() {
      return [
      App.pages.top(),
      App.pages.prev?.()
      ]
    },

    condition() {
      if (App.pages.stack.length >= 2) {
        return false;
      } else {
        return true;
      }
    },

    onMove({ dx }) {
      if (dx <= 0) return;

      const progress = Math.min(
        1,
        dx / window.innerWidth
      );

      App.pages.top().style.transform =
        `translateX(${dx}px)`;

      if(!App.pages.prev()) return;

      App.pages.prev().style.transform =
        `translateX(${-50 + progress * 50}px)`;
    },

    onThresholdCrossed({ dx }) {
      if (dx > 0) {
        App.pages.pop();
      }
    },

    onThresholdNotCrossed() {
      App.pages.snapBack();
    }
  });


  // ========================================================
  // Sidebar logic
  // ========================================================

  // const rotate = 25;

  const borderRadius = 20;
  const scale = 0.75;
  const gap = 20;
  const bgScale = scale * 0.9;
  const bgOpacity = 0.6;

  App.gestures.enableDrag({
    handle: pagesContainer,

    direction: "horizontal",

    getElementsToAnimate() {
      return [
        pagesContainer,
        pagesBackground,
      ]
    },

    condition(e) {
      if (state.sidebarIsOpen || App.pages.stack.length <= 1) {
        return false;
      } else {
        return true;
      }
    },

    onMove({ dx }) {
      const sidebarWidth = sidebar.clientWidth;

      const startProgress = state.sidebarIsOpen ? 1 : 0;

      const progress = Math.max(
        0,
        Math.min(1, startProgress + dx / sidebarWidth)
      );

      updateSidebarProgress(progress);
    },

    onThresholdCrossed({ dx }) {
      if (dx > 0) {
        openSidebar();
      } else {
        closeSidebar();
      }
    },

    onThresholdNotCrossed() {
      state.sidebarIsOpen
        ? openSidebar()
        : closeSidebar();
    }
  });

  overlay.addEventListener("click", () => {
    closeSidebar();
  });

  function getBackgroundOffset() {
    const lostLeft = pagesContainer.clientWidth * (1 - bgScale) / 2;
    return sidebar.clientWidth - lostLeft;
  }

  function getPageOffset() {
    const W = pagesContainer.clientWidth;

    const lostLeft = W * (1 - scale) / 2;

    const bgOffset = getBackgroundOffset();
    const pageOffset = sidebar.clientWidth - lostLeft + gap;
    return pageOffset;
  }

  allPages.forEach(page => {
    page.querySelector(".page-header svg").addEventListener("click", e => {
      toggleSidebar();
    });
  });

  function toggleSidebar() {
    if (state.sidebarIsOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function updateSidebarProgress(progress) {
  
    pagesContainer.style.transform =`
      translateX(${getPageOffset() * progress}px)
      scale(${1 + progress * (scale - 1)})
    `;

    pagesContainer.style.borderRadius = borderRadius * progress + "px";


    const opacity = progress * bgOpacity;

    pagesBackground.style.transform = `
      translateX(${getBackgroundOffset() * progress}px)
      scale(${1 + progress * (bgScale - 1)})
    `;

    pagesBackground.style.opacity = opacity;
  }

  function openSidebar() {
    state.sidebarIsOpen = true;

    pagesContainer.style.transform =
      `translateX(${getPageOffset()}px) scale(${scale})`;
  // rotateY(-${rotate}deg)
    pagesContainer.style.borderRadius = "20px";
    

    pagesBackground.style.opacity = "1";
    pagesBackground.style.transform =
      `translateX(${getBackgroundOffset()}px) scale(${bgScale})`;

    overlay.classList.add("open");
  }

  function closeSidebar() {
    state.sidebarIsOpen = false;

    pagesContainer.style.transform = "";
    pagesContainer.style.borderRadius = "";

    pagesBackground.style.opacity = "0";
    pagesBackground.style.transform =
      `translateX(0) scale(${bgScale})`;

    overlay.classList.remove("open");
  }


  sidebar.querySelectorAll(".sidebar-nav-option").forEach(option => {
    option.addEventListener("click", () => {
      App.pages.stack.length = 0;

      sidebar.querySelectorAll(".sidebar-nav-option").forEach(option => option.classList.remove("active"));
      option.classList.add("active");

      closeSidebar();
      
      App.pages.newPage({ page: App.pages.configs[option.dataset.pagetype][option.dataset.pageconfig], animation: false });
    });
  });


  sidebar.querySelector(".sidebar-action[data-action='support']").addEventListener("click", e => {
    
    sidebar.querySelectorAll(".sidebar-nav-option").forEach(option => option.classList.remove("active"));
    e.target.classList.add("active");

    App.sheets.push(
      App.sheets.newSheet({ title: "Contact Support", content: "" })
    );
    
  });
}








document.addEventListener("DOMContentLoaded", () => {
  initiate();
});