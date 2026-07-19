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
const gap = 16;
const bgScale = scale * 0.9;
const bgOpacity = 0.3;

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

openSidebar();

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

showPage(componentsPage);

function showPage(page) {
  allPages.forEach(page => page.style.display = "none");

  page.style.display = "flex"
}

