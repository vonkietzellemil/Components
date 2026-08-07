const AppEl = document.getElementById("App");
const AppContent = document.getElementById("AppContent");
const pagesContainer = document.getElementById("pagesContainer");

const sidebar = document.getElementById("sidebar");
const allPages = document.querySelectorAll(".page");

const componentsPage = document.getElementById("componentsPage");


const pagesBackground = document.getElementById("pagesBackground");
const overlay = document.getElementById("pageOverlay");

import { state } from "../core/state.js"

import { pageConfigs } from "../configs/pageConfigHandler.js"

import { settingsPage } from "../pageTemplates/settings.js";
import { listsPage } from "../pageTemplates/lists.js";
import { listPage } from "../pageTemplates/list.js";

const pageTypes = {
  settings: settingsPage,
  lists: listsPage,
  list: listPage
};
// ========================================================
// App:
//  Pages
//  Sheets
//  Gestures
// ========================================================

export const VIEWS = {
  root: {
    parent: {
     view: "root",
     id: null,
    },
    
    page: pageConfigs.lists.root,
  },

  archive: {
    page: {
      type: "lists",
      getParams() {
        return {
          title: "Archive",
        };
      },
    },
  },
  deleted: {
    page: {
      type: "lists",
      getParams() {
        return {
          title: "Trash",
        };
      },
    },
  },


  singleList: {
    page: {
      type: "list",
      getParams() {
        return {
          title: "Single List",
        };
      },
    },
  },
};

export const App = {
  pages: {
    types: pageTypes,
    configs: pageConfigs,
    stack: [],
    top() { return this.stack[this.stack.length - 1]; },
    prev() { return this.stack[this.stack.length - 2]; },
    isTransitioning: false,

    newPage({ page, container=pagesContainer, animation=true }) {

      return App.pages.createPage({ pageType: page.type, params: page.getParams(), container, animation });
    },
   
    createPage({ pageType, params, container, animation=true }) {

      const newPage = document.createElement("div");
      newPage.classList.add("page");


      const page = this.types[pageType];


      newPage.innerHTML = page.getInnerHTML(params);


      pagesContainer.appendChild(newPage);


      this.push(newPage, animation);


      if (page.init) {
        page.init({
          page: newPage,
          params
        });
      }


      return newPage;
    },

    push(pageEl, animation=true) { 

      this.stack.push(pageEl);

      const previousPage = this.prev();

      previousPage?.classList.add("page-behind");

      if (!animation) return;
      this.isTransitioning = true;

      pageEl.classList.add("page-enter");
      
      requestAnimationFrame(() => {
        pageEl.classList.add("page-enter-active");
      });

      setTimeout(() => {
        this.isTransitioning = false;

        pageEl.classList.remove("page-enter", "page-enter-active");
      }, 300);
    },

    pop(animation=true) {

      if (this.isTransitioning) return;

      const currentPage = this.top();
      const previousPage = this.prev();

      currentPage.style.transform = "";
      previousPage.style.transform = "";
      
      if (animation) {
        this.isTransitioning = true;

        currentPage.classList.add("page-exit-active");
        previousPage.classList.add("page-return");

        setTimeout(() => {
          previousPage.classList.remove(
            "page-behind",
            "page-return"
          );
        }, 300);

        setTimeout(() => {
          currentPage.remove();
          this.stack.pop();
          this.isTransitioning = false;
        }, 300);
      } else {
        currentPage.remove();
        this.stack.pop();
      }
      
    },

    snapBack() {
      const currentPage = this.top();
      const previousPage = this.prev();

      currentPage.style.transform = "";
      previousPage.style.transform = "";

      currentPage.classList.add("page-enter-active")
      previousPage.classList.add("page-behind")

      setTimeout(() => {
        currentPage.classList.remove("page-enter-active")
      }, 300);
    },
  },

  sheets: {
    stack: [],
    top() { return this.stack[this.stack.length - 1]; },
    prev() { return this.stack[this.stack.length - 2]; },

    newSheet({
      title,
      content,
      animation=false
    }) {
      return App.sheets.createBottomSheet({
        title,
        content,
      }, animation);
    },

    createBottomSheet ({
      title,
      content,
      animation
    }) {
      const newSheet = document.createElement("div");
      newSheet.classList.add("sheet__wrapper", "hidden");

      newSheet.innerHTML = `
        
        <div class="sheet__backdrop"></div>


        <div class="sheet">

          <div class="sheet__handle"></div>

            <h2>
              ${title}
            </h2>

            <div class="sheet__content">${content || "content..."}</div>

            <button class="button button--secondary">Cancel</button>

          </div>
        </div>
      `;

      newSheet.querySelector(".sheet__backdrop").addEventListener("click", e => {
        this.pop();
      });

      this.push(newSheet, animation);

      return newSheet;
    },

    push(sheetEl) {

      document.body.appendChild(sheetEl);

      const backdrop = sheetEl.querySelector(".sheet__backdrop");
      const sheet = sheetEl.querySelector(".sheet");

      App.gestures.enableDrag({
        handle: sheet,
        direction: "vertical",
        deadzone: 10,
        thresholdDistance: 100,
        thresholdVelocity: 0.9,

        getElementsToAnimate() {
          return [
            backdrop,
            sheet
          ];
        },

        onMove({
          event: e,
          dx,
          dy,
          startX,
          startY,
        }) {
          if (dy <= 0) return;
          sheet.style.transform = `translateY(${dy}px)`;
          backdrop.style.opacity = 1 - 0;
        },
        onThresholdCrossed() {
          App.sheets.pop();
        },
        onThresholdNotCrossed() {
          App.sheets.snapBack();
        },
      });

      this.stack.push(sheetEl);

      const depth = App.sheets.stack.length;
      const scale = Math.max(0.92, 1 - depth * 0.04);

      if (!state.sidebarIsOpen) {
        console.log(state.sidebarIsOpen)
        AppContent.style.transform = `scale(${scale})`;
      }

      requestAnimationFrame(() => {
        sheetEl.classList.remove("hidden");
      });

      setTimeout(() => {
      }, 300);
    },

    pop() {
      const currentSheet = this.top();
      this.remove(currentSheet);
    },

    remove(sheetEl) {
      sheetEl.classList.add("hidden");
      sheetEl.querySelector(".sheet").style.transform = "translateY(100%)";

      AppContent.style.transform = `scale(1)`;

      setTimeout(() => {
        sheetEl.remove();
        this.stack.pop();
      }, 400);
    },

    snapBack() {
      const currentSheet = this.top();

      const depth = App.sheets.stack.length;
      const scale = Math.max(0.92, 1 - depth * 0.04);

      if (!state.sidebarIsOpen) {
        AppContent.style.transform = `scale(${scale})`;
      }

      currentSheet.querySelector(".sheet").style.transform = "";
    },
  },

  gestures: {
    enableDrag({
      handle,
      direction = "horizontal",
      deadzone = 10,
      thresholdDistance = 100,
      thresholdVelocity = 0.9,

      condition,

      getElementsToAnimate = () => { return [] },

      onStart,
      onMove,
      onEnd,
      onThresholdCrossed,
      onThresholdNotCrossed,
    }) {
      let pointerDown = false;
      let dragging = false;

      let startX = 0;
      let startY = 0;

      let dragDirection = null;

      let animatedElements = [];

      let velocity = 0;
      let lastPos = 0;
      let lastTime = 0;

      const originalTransitions = new Map();

      handle.addEventListener("pointerdown", e => {
        if (!condition?.(e) === false) return;
        pointerDown = true;
        dragging = false;

        startX = e.clientX;
        startY = e.clientY;

        dragDirection = null;

        originalTransitions.clear();

        animatedElements = getElementsToAnimate();

        animatedElements.forEach(el => {
          if (!el) return;

          originalTransitions.set(el, el.style.transition);
          el.style.transition = "none";
        });

        handle.setPointerCapture(e.pointerId);
        
        lastPos =
          direction === "horizontal"
            ? e.clientX
            : e.clientY;

        lastTime = performance.now();
        velocity = 0;

        onStart?.(e);
      });

      handle.addEventListener("pointermove", e => {
        if (!pointerDown) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (dragDirection === null) {
          if (Math.hypot(dx, dy) < deadzone) return;

          dragDirection =
            Math.abs(dx) > Math.abs(dy)
              ? "horizontal"
              : "vertical";
        }

        if (dragDirection !== direction) return;

        dragging = true;


        const currentPos =
          direction === "horizontal"
            ? e.clientX
            : e.clientY;

        const now = performance.now();

        const deltaPos = currentPos - lastPos;
        const deltaTime = now - lastTime;

        if (deltaTime > 0) {
          velocity = deltaPos / deltaTime;
        }

        lastPos = currentPos;
        lastTime = now;


        onMove?.({
          event: e,
          dx,
          dy,
          startX,
          startY,
        });
      });

      function finishDrag(e) {
        if (!pointerDown) return;

        pointerDown = false;

        // Restore transitions BEFORE callbacks trigger animations
        animatedElements.forEach(el => {
          if (!el) return;
          el.style.transition =
            originalTransitions.get(el) ?? "";
        });

        if (!dragging) {
          onEnd?.({ event: e, dx: 0, dy: 0 });
          return;
        }

        if (handle.hasPointerCapture(e.pointerId)) {
          handle.releasePointerCapture(e.pointerId);
        }

        requestAnimationFrame(() => {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;

          const distance =
            direction === "horizontal"
              ? dx
              : dy;

          const crossedDistance =
            Math.abs(distance) >= thresholdDistance;

          const crossedVelocity =
            Math.abs(velocity) >= thresholdVelocity;

          if (crossedDistance || crossedVelocity) {
            onThresholdCrossed?.({
              event: e,
              dx,
              dy,
              velocity,
              crossedDistance,
              crossedVelocity,
            });
          } else {
            onThresholdNotCrossed?.({
              event: e,
              dx,
              dy,
              velocity,
            });
          }


          onEnd?.({ event: e, dx, dy });
        });

        dragging = false;
      }

      handle.addEventListener("pointerup", finishDrag);
      handle.addEventListener("pointercancel", finishDrag);
    },
  },
};


const sheets = {
  list: `
    <div class="field">   

      <input
        class="input"
        placeholder="Name"
      />

    </div>


    <div class="field">

      <label>
        Options
      </label>

      <label class="switch">

        <input type="checkbox">

        <span></span>

      </label>

      <label class="switch">

        <input type="checkbox">

        <span></span>

      </label>

    </div>


    <div class="field">

      <label>
        Sort by
      </label>

      <div class="radio-group">
        <label class="radio">
          <input type="radio" name="theme" value="light" checked>
          <span class="radio__control"></span>
          <span>Manual</span>
        </label>

        <label class="radio">
          <input type="radio" name="theme" value="dark">
          <span class="radio__control"></span>
          <span>Alphabetic</span>
        </label>

        <label class="radio">
          <input type="radio" name="theme" value="system">
          <span class="radio__control"></span>
          <span>Newest first</span>
        </label>
      
      </div>

    </div>
  `,
};


function showPage(page) {
  allPages.forEach(page => page.style.display = "none");

  page.style.display = "flex";

  App.pages.push(page, false);
}


// setTimeout(() => openSidebar(), 200);

// App.sheets.push( App.sheets.createBottomSheet({ title: 'Create List', content: sheets.list }) )


function isAnyInputFocused() { return ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName); }



// ===================================
// Collapsing searchbar try
// ===================================

// .page-header.collapsed {
//   gap: 0;
// }

// .page-header.collapsed .open-sidebar-button {
//   transform: translateY(49px);
//   transition: transform 0.1s linear;
// }

// .page-header.collapsed .page-title h1 {
//   margin: 0;
//   margin-left: -42px;
//   transition: transform 0.1s linear;
// }

// .page-header.collapsed .searchbar {
//   height: 0;
//   border-width: 0;
//   padding-top: 0;
//   padding-bottom: 0;
//   overflow: hidden;
// }



// JavaScripts
// function center(rect) {
//   return {
//     x: rect.left + rect.width / 2,
//     y: rect.top + rect.height / 2
//   };
// }

// const header = document.querySelector(".page-header");
// const title = document.querySelector(".page-title h1");
// const icon = document.querySelector(".open-sidebar-button");
// const searchbar = document.querySelector(".searchbar");

// function measureLayout() {
//   const expanded = {
//     title: center(title.getBoundingClientRect()),
//     icon: center(icon.getBoundingClientRect()),
//     searchHeight: searchbar.offsetHeight
//   };

//   header.classList.add("collapsed");

//   const collapsed = {
//     title: center(title.getBoundingClientRect()),
//     icon: center(icon.getBoundingClientRect())
//   };

//   header.classList.remove("collapsed");

//   return { expanded, collapsed };
// }

// let layout = measureLayout();

// window.addEventListener("resize", () => {
//   layout = measureLayout();
// });

// const grid = document.querySelector("#grid");

// grid.addEventListener("scroll", () => {
//   const progress = Math.min(
//     grid.scrollTop / layout.expanded.searchHeight,
//     1
//   );

//   const titleDx =
//     layout.collapsed.title.x -
//     layout.expanded.title.x;

//   const titleDy =
//     layout.collapsed.title.y -
//     layout.expanded.title.y;

//   const iconDx =
//     layout.collapsed.icon.x -
//     layout.expanded.icon.x;

//   const iconDy =
//     layout.collapsed.icon.y -
//     layout.expanded.icon.y;

//   title.style.transform =
//     `translate(${titleDx * progress}px, ${titleDy * progress}px)`;

//   icon.style.transform =
//     `translate(${iconDx * progress}px, ${iconDy * progress}px)`;

//   searchbar.style.height =
//     `${layout.expanded.searchHeight * (1 - progress)}px`;

//   searchbar.style.opacity = 1 - progress;
// });
