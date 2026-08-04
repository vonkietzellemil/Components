const AppEl = document.getElementById("App");
const AppContent = document.getElementById("AppContent");
const pagesContainer = document.getElementById("pagesContainer");

const sidebar = document.getElementById("sidebar");
let sidebarIsOpen = false;
const allPages = document.querySelectorAll(".page");

const mainTestPage = document.getElementById("mainTestPage");
const componentsPage = document.getElementById("componentsPage");




const pagesBackground = document.getElementById("pagesBackground");
const overlay = document.getElementById("pageOverlay");


// ========================================================
// Push/Pop Pages      Sheets
// ========================================================

const VIEWS = {
  root: {
    page: {
      type: "lists",
      getParams() {
        return {
          title: "Lists App",

          createBottomSheetContent: sheets.list,
        };
      },
    },
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

const App = {
  pages: {
    types: {
      listBase({
        title,
      }) {
        const page = `
            <div class="page-header">
                  
              <h2 class="title">${title}</h2>
              
              <div class="searchbar-container">
                <button class="open-sidebar-button button icon-button" onclick="App.pages.pop()">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
                </button>
                <input class="input searchbar" placeholder="Search">
              </div>
            </div>

            <div class="floating-actions-menu liquid-glass">
              <button class="button icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-440v-287L217-624l-57-56 200-200 200 200-57 56-103-103v287h-80ZM600-80 400-280l57-56 103 103v-287h80v287l103-103 57 56L600-80Z"/></svg>
              </button>

              <button class="button icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>
              </button>

              <button class="button icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/></svg>
              </button>

              <button class="button icon-button">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
              </button>
            </div>

            <button class="button icon-button liquid-glass floating-action-button" onclick="
              
            ">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </button>
          `;

          return page;
      },

      lists: {
        getInnerHTML(params) {
          return App.pages.types.listBase({
            ...params,
          });
        }
      },

      list: {
        getInnerHTML(params) {
          return App.pages.types.listBase({
            ...params,
          });
        }
      },

      settings: {
        getInnerHTML({ sections }) {

          return `
            <div class="page-header">
                  
              <h2 class="title">Settings</h2>
              
              <div class="searchbar-container">
                <button class="open-sidebar-button button icon-button" onclick="App.pages.pop()">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
                </button>
                <input class="input searchbar" placeholder="Search">
              </div>
            </div>

            ${sections.map(section => `
              <section class="settings-section">

                <h2>${section.title}</h2>

                ${section.items.map(item => `
                  <div class="settings-item" 
                      data-setting-id="${item.id}"
                      data-setting-type="${item.type}">

                    <div class="setting-info">

                      <span class="setting-icon">
                        ${item.icon ?? ""}
                      </span>

                      <div>
                        <h3>${item.title}</h3>
                        <p>${item.description ?? ""}</p>
                      </div>

                    </div>


                    <div class="setting-control">

                      ${this.renderControl(item)}

                    </div>

                  </div>
                `).join("")}

              </section>
            `).join("")}
          `;
        },

        renderControl(item) {

          switch(item.type) {

            case "toggle":
              return `

                <label class="switch">

                  <input type="checkbox" data-id="${item.id}" ${item.value ? "checked" : ""}>

                  <span></span>

                </label>
              `;


            case "select":
              return `
                <select 
                  class="select"
                  data-id="${item.id}"
                >
                  
                  ${item.options.map(option => `
                    <option 
                      value="${option}"
                      ${option === item.value ? "selected" : ""}
                    >
                      ${option}
                    </option>
                  `).join("")}

                </select>
              `;


            case "link":
              return `
                <span class="setting-link">
                  ›
                </span>
              `;


            default:
              return "";
          }
        }
      }
    },
    stack: [],
    top() { return this.stack[this.stack.length - 1]; },
    prev() { return this.stack[this.stack.length - 2]; },
    isTransitioning: false,

    newPage(page) {

      return App.pages.createPage(page.type, page.getParams());
    },
    createPage(pageType, params, animation=true) {
      const newPage = document.createElement("div");
      newPage.classList.add("page");

      const pageHTML = this.types[pageType].getInnerHTML(params);
      newPage.innerHTML = pageHTML;

      pagesContainer.appendChild(newPage);

      this.push(newPage, animation);
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

    createBottomSheet ({
      title,
      content,
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

      if (!sidebarIsOpen) {
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

      if (!sidebarIsOpen) {
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
      console.log(handle)
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


const settingsConfig = {
  type: "settings",
  getParams() {
    return {
      sections: [
        {
          title: "Appearance",
          items: [
            {
              id: "darkMode",
              icon: "🌙",
              title: "Dark mode",
              description: "Use a darker color theme",
              type: "toggle",
              value: false
            },
            {
              id: "language",
              icon: "🌍",
              title: "Language",
              description: "Choose your app language",
              type: "select",
              options: [
                "English",
                "German",
                "French"
              ],
              value: "English"
            }
          ]
        },

        {
          title: "Notifications",
          items: [
            {
              id: "pushNotifications",
              icon: "🔔",
              title: "Push notifications",
              description: "Receive updates from the app",
              type: "toggle",
              value: true
            }
          ]
        },

        {
          title: "Account",
          items: [
            {
              id: "profile",
              icon: "👤",
              title: "Profile",
              description: "Manage your profile",
              type: "link",
              action() {
                console.log("Open profile");
              }
            }
          ]
        }
      ]
    }
  }
}

showPage(mainTestPage);

function showPage(page) {
  allPages.forEach(page => page.style.display = "none");

  page.style.display = "flex";

  App.pages.push(page, false);
}



// App.sheets.push( App.sheets.createBottomSheet({ title: 'Create List', content: sheets.list }) )


function isAnyInputFocused() { return ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName); }



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
    if (sidebarIsOpen || App.pages.stack.length <= 1) {
      return false;
    } else {
      return true;
    }
  },

  onMove({ dx }) {
    const sidebarWidth = sidebar.clientWidth;

    const startProgress = sidebarIsOpen ? 1 : 0;

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
    sidebarIsOpen
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
  if (sidebarIsOpen) {
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
  sidebarIsOpen = true;

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
  sidebarIsOpen = false;

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

    showPage(document.querySelector("#" + option.dataset.page));
    closeSidebar();
  });
});





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
