const App = document.getElementById("App");
const pagesContainer = document.getElementById("pagesContainer");

const sidebar = document.getElementById("sidebar");
let sidebarIsOpen = false;
const allPages = document.querySelectorAll(".page");

const mainTestPage = document.getElementById("mainTestPage");
const componentsPage = document.getElementById("componentsPage");




const pagesBackground = document.getElementById("pagesBackground");
const overlay = document.getElementById("pageOverlay");





// ========================================================
// Push/Pop Pages
// ========================================================

const pagesManager = {
  stack: [],
  getCurrentPage() { return this.stack[this.stack.length - 1]; },
  getPreviousPage() { return this.stack[this.stack.length - 2]; },
  isTransitioning: false,

  createPage ({
    title,
  }) {
    const newPage = document.createElement("div");
    newPage.classList.add("page");

    newPage.innerHTML = `
      <div class="page-header">
            
        <h2 class="title">${title + this.stack.length}</h2>
        
        <div class="searchbar-container">
          <button class="open-sidebar-button button icon-button" onclick="pagesManager.pop()">
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

      <button class="button icon-button liquid-glass floating-action-button" onclick="pagesManager.push( createPage({ title: 'Page' }) )">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </button>
    `;

    return newPage;
  },

  push(pageEl, animation=true) {  
    if (this.isTransitioning) return;

    pagesContainer.appendChild(pageEl);


    const currentPage = this.getCurrentPage();
    
    this.stack.push(pageEl);
    if (!currentPage) return;

    this.isTransitioning = true;

    currentPage.classList.add("page-behind");

    if (!animation) return;

    pageEl.classList.add("page-enter");

    requestAnimationFrame(() => {
      currentPage && currentPage.classList.add("page-behind");
      pageEl.classList.add("page-enter-active");
    });

    setTimeout(() => {
      this.isTransitioning = false;

      pageEl.classList.remove("page-enter", "page-enter-active");
    }, 300);
  },

  pop(animation=true) {

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const currentPage = this.getCurrentPage();
    const previousPage = this.getPreviousPage();

    currentPage.style.transform = "";
    previousPage.style.transform = "";
    
    if (!animation) return;

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
      isTransitioning = false;
    }, 300);
  },

  snapBack() {
    const currentPage = this.getCurrentPage();
    const previousPage = this.getPreviousPage();

    currentPage.style.transform = "";

    // pagesBackground.style.opacity = "0";
    // pagesBackground.style.transform =
    //   `translateX(0) scale(${bgScale})`;

    // overlay.classList.remove("open");
  },
};

const pages = {
  mainTestPage: {
    title: "Title",
  },
}


showPage(componentsPage);

function showPage(page) {
  allPages.forEach(page => page.style.display = "none");

  page.style.display = "flex";

  pagesManager.push(page);
}






// ========================================================
// Bottom Sheet
// ========================================================
const bottomSheetManager = {
  stack: [],
  getCurrentSheet() { return this.stack[this.stack.length - 1]; },
  getPreviousSheet() { return this.stack[this.stack.length - 2]; },
  isTransitioning: false,

  createBottomSheet ({
    title,
  }) {
    const newSheet = document.createElement("div");
    newSheet.classList.add("sheet", "hidden");

    newSheet.innerHTML = `
      
      <div class="sheet__backdrop"></div>


      <div class="sheet__content">

        <div class="sheet__handle"></div>

          <h2>
            ${title}
          </h2>

          <p>
            Content...
          </p>

          <button class="button button--secondary">Cancel</button>

        </div>
      </div>
    `;

    newSheet.addEventListener("click", e => {
      this.pop();
    });

    this.addDragPhysics(newSheet);

    return newSheet;
  },

  addDragPhysics(sheetEl) {
    const handle = sheetEl.querySelector(".sheet__handle");
    const backdrop = sheetEl.querySelector(".sheet__backdrop");
    const content = sheetEl.querySelector(".sheet__content");
    if (!handle) return;

    let startY = 0;
    let currentY = 0;
    let velocity = 0;
    let lastY = 0;
    let lastTime = 0;
    let dragging = false;

    const maxDragDistance = 300;

    handle.addEventListener("pointerdown", (e) => {
      dragging = true;
      startY = e.clientY;
      lastY = e.clientY;
      lastTime = performance.now();

      sheetEl.style.transition = "none";
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;

      const now = performance.now();
      const dy = e.clientY - lastY;
      const dt = now - lastTime;

      velocity = dy / dt;

      lastY = e.clientY;
      lastTime = now;

      currentY = Math.max(0, e.clientY - startY);

      const dragProgress = Math.min(1, currentY / maxDragDistance);

      console.log(dragProgress)

      content.style.transform = `translateY(${currentY}px)`;
      backdrop.style.opacity = 1 - dragProgress;
    });

    handle.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;

      const shouldClose = currentY > 140 || velocity > 0.9;

      if (shouldClose) {
        console.log("closing")
        this.pop();
      } else {
        content.style.transform = "translateY(0)";
        backdrop.style.opacity = `1`;
      }
    });
  },

  push(sheetEl) {  
    if (this.isTransitioning) return;

    document.body.appendChild(sheetEl);
    
    this.stack.push(sheetEl);

    this.isTransitioning = true;

    // currentPage.classList.add("page-behind");

    requestAnimationFrame(() => {
      sheetEl.classList.remove("hidden");
    });

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  },

  pop() {

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const currentSheet = this.getCurrentSheet();

    currentSheet.querySelector(".sheet__content").style.transform = "translateY(100%)";
    // currentSheet.classList.add("hidden");

    setTimeout(() => {
      currentSheet.remove();
      this.stack.pop();
      this.isTransitioning = false;
    }, 400);
  },

  snapBack() {
    const currentPage = this.getCurrentPage();
    const previousPage = this.getPreviousPage();

    currentPage.style.transform = "";

    // pagesBackground.style.opacity = "0";
    // pagesBackground.style.transform =
    //   `translateX(0) scale(${bgScale})`;

    // overlay.classList.remove("open");
  },
};


bottomSheetManager.push(bottomSheetManager.createBottomSheet({ title: 'Hola die faldwee' }));


function isAnyInputFocused() { return ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName); }




// ========================================================
// Swipe to go back / Sidebar logic
// ========================================================

overlay.addEventListener("click", () => {
  closeSidebar();
});

// const rotate = 25;

const borderRadius = 20;
const scale = 0.75;
const gap = 20;
const bgScale = scale * 0.9;
const bgOpacity = 0.6;

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


let pointerDown = false;
let dragging = false;
let startX = 0;
let startY = 0;
let dragMode = 0;
let dragDirection = null; // null | "horizontal" | "vertical"

pagesContainer.addEventListener("pointerdown", e => {
  // Check for input  
  if (isAnyInputFocused()) {
    return; 
  }

  pointerDown = true;
  startX = e.clientX;
  startY = e.clientY;
  dragDirection = null;

  pagesContainer.setPointerCapture(e.pointerId);

  if (pagesManager.stack.length === 1) {
    dragMode = "sidebar";
  } else {
    dragMode = "popPage";
  }
});

pagesContainer.addEventListener("pointermove", e => {
  if (!pointerDown) return;

  const delta = e.clientX - startX;

  if (Math.abs(delta) > 10) {
    dragging = true;
  }

  if (!dragging) return;
  if (delta === 0) return;


  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (dragDirection === null) {
    if (Math.hypot(dx, dy) < 10) return;

    dragDirection =
      Math.abs(dx) > Math.abs(dy)
        ? "horizontal"
        : "vertical";
  }

  if (dragDirection === "vertical") {
    console.log("vertical")
    return; // let the browser scroll
  }

  e.preventDefault();  

  switch (dragMode) {
    case "sidebar":

      // Open / Close Sidebar
      const sidebarWidth = sidebar.clientWidth;
      const startProgress = sidebarIsOpen ? 1 : 0;

      const dragProgress = Math.max(
        0,
        Math.min(1, startProgress + delta / sidebarWidth)
      );

      pagesContainer.style.transform =`
        translateX(${getPageOffset() * dragProgress}px)
        scale(${1 + dragProgress * (scale - 1)})
      `;
      // rotateY(${-rotate * dragProgress}deg)
      pagesContainer.style.borderRadius = borderRadius * dragProgress + "px";


      const opacity = dragProgress * bgOpacity;

      pagesBackground.style.transform = `
        translateX(${getBackgroundOffset() * dragProgress}px)
        scale(${1 + dragProgress * (bgScale - 1)})
      `;

      pagesBackground.style.opacity = opacity;

      break;

    case "popPage":
      if (delta <= 0) return; // only allow right swipe

      const progress = Math.min(
        1,
        delta / window.innerWidth
      );

      const currentPage = pagesManager.getCurrentPage();

      currentPage.style.transform =
        `translateX(${delta}px)`;

      const previousPage = pagesManager.getPreviousPage();

      // Optional parallax
      previousPage.style.transform =
        `translateX(${-50 + progress * 50}px)`;
    
      break;
  }
});

function finishDrag(e) {
  if (!dragging) {
    pointerDown = false;
    return;
  }

  if (pagesContainer.hasPointerCapture(e.pointerId)) {
    pagesContainer.releasePointerCapture(e.pointerId);
  }

  pointerDown = false;
  dragging = false;

  const delta = e.clientX - startX;

  const threshold = window.innerWidth * 0.3;

  if (sidebarIsOpen) {
    
    const sidebarWidth = sidebar.clientWidth;

    const progress = Math.max(
      0,
      Math.min(1, (sidebarWidth + delta) / sidebarWidth)
    );

    if (progress > 0.5) {
      openSidebar();
    } else {
      closeSidebar();
    }

  } else if (pagesManager.stack.length === 1) {

    if (delta > threshold) {
      openSidebar();
    } else {
      closeSidebar();
    }

  } else {

    if (delta > threshold) {
      pagesManager.pop();
    } else {
      pagesManager.snapBack();
    }

  }
}

pagesContainer.addEventListener("pointerup", finishDrag);
pagesContainer.addEventListener("pointercancel", e => {
  console.log("pointercancel");
  finishDrag(e);
});





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
    stack.length = 0;

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