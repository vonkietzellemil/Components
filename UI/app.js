const App = document.getElementById("App");
const pagesContainer = document.getElementById("pagesContainer");

const sidebar = document.getElementById("sidebar");
let sidebarIsOpen = false;
const allPages = document.querySelectorAll(".page");

const mainTestPage = document.getElementById("mainTestPage");
const componentsPage = document.getElementById("componentsPage");




const pagesBackground = document.getElementById("pagesBackground");
const overlay = document.getElementById("pageOverlay");

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


let startX = 0;
let dragging = false;

overlay.addEventListener("pointerdown", e => {
  dragging = true;
  startX = e.clientX;
});

overlay.addEventListener("pointermove", e => {
  if (!dragging) return;

  const delta = e.clientX - startX;

  if (delta < 0) {
    const sidebarWidth = sidebar.clientWidth;

    const progress = Math.max(
      0,
      Math.min(1, (sidebarWidth + delta) / sidebarWidth)
    );

    pagesContainer.style.transform =`
      translateX(${getPageOffset() * progress}px)
      scale(${1 + progress * (scale - 1)})
    `;
    // rotateY(${-rotate * progress}deg)
    pagesContainer.style.borderRadius = borderRadius * progress + "px";


    const opacity = progress * bgOpacity;

    pagesBackground.style.transform = `
      translateX(${getBackgroundOffset() * progress}px)
      scale(${1 + progress * (bgScale - 1)})
    `;

    pagesBackground.style.opacity = opacity;
  }
});

overlay.addEventListener("pointerup", finishDrag);
overlay.addEventListener("pointercancel", finishDrag);

function finishDrag(e) {
  if (!dragging) return;

  dragging = false;

  const delta = e.clientX - startX;

  if (delta < -sidebar.clientWidth * 0.3) {
    closeSidebar();
  } else {
    openSidebar(); // snap back open
  }
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
    showPage(document.querySelector("#" + option.dataset.page));
    closeSidebar();
  });
});






let isTransitioning = false;

function pushPage(pageEl) {
    if (isTransitioning) return;

    isTransitioning = true;

    stack.push(pageEl);
    // animation...

    setTimeout(() => {
        isTransitioning = false;
    }, 300);
}

function popPage() {
  stack.pop();
}

const stack = [];

showPage(componentsPage);

function showPage(page) {
  allPages.forEach(page => page.style.display = "none");

  page.style.display = "flex"

  pushPage(page);
}



const pages = {
  mainTestPage: {
    title: "Title",
  },
}


function createPage ({
 title,
}) {
  const newPage = document.createElement("div");
  newPage.classList.add("page");

  newPage.innerHTML = `
    <div class="page-header">
          
      <h2 class="title">${title}</h2>
      
      <div class="searchbar-container">
        <button class="open-sidebar-button button icon-button" onclick="deletePage()">
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

    <button class="button icon-button liquid-glass floating-action-button">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
    </button>
  `;

  pagesContainer.appendChild(newPage);


  const currentPage = stack[stack.length - 1];

  currentPage.classList.add("page-behind");
  newPage.classList.add("page-enter");

  requestAnimationFrame(() => {
    currentPage.classList.add("page-behind");
    newPage.classList.add("page-enter-active");
  });
  
  pushPage(newPage);
}


function deletePage() {
  const currentPage = stack[stack.length - 1];
  const previousPage = stack[stack.length - 2];

  currentPage.classList.add("page-exit-active");
  previousPage.classList.add("page-return");


  setTimeout(() => {
    previousPage.classList.remove(
      "page-behind",
      "page-return"
    );
  }, 300);

  currentPage.addEventListener("transitionend", () => {
    currentPage.remove();
  }, { once: true });
}



















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