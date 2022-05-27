// Drag'n'drop

let dragged = false;
let currentlyDragged;
let draggedOffsetX;
let draggedOffsetY;

document.addEventListener("mousedown", (e) => {
  if (
    e.target.matches(".app_window__header_head") ||
    e.target.closest(".app_window__header_head")
  ) {
    dragged = true;
    currentlyDragged = e.target.closest(".app_window");
    draggedOffsetX = e.offsetX;
    draggedOffsetY = e.offsetY;
  }
});

document.addEventListener("mouseup", (e) => {
  dragged = false;
});

document.addEventListener("mousemove", (e) => {
  if (!dragged) return;

  dragndrop(currentlyDragged, e);
});

function dragndrop(el, e) {
  if (el.getBoundingClientRect().left <= 0) {
    el.style.left = "0";
  } else {
    el.style.left = e.pageX - draggedOffsetX + "px";
    el.style.top = e.pageY - draggedOffsetY + "px";
  }
  if (el.getBoundingClientRect().top <= 0) {
    el.style.top = "0";
  } else {
    el.style.left = e.pageX - draggedOffsetX + "px";
    el.style.top = e.pageY - draggedOffsetY + "px";
  }
}



// Launch app
function launchApp(appTitle) {
  const appWindow = document.createElement("div");
  appWindow.classList.add("app_window");
  appWindow.innerHTML = `
    <header class="app_window__header">
    <div class="app_window__header_head">
      <img class="icon" src="${os.apps[appTitle].icon}" alt="" />
      <span class="app_window__header_title">${os.apps[appTitle].title}</span>
      <div class="app_window__header_actions">
        <button>
          <img class="icon" src="./assets/shell/app_reduce.svg" alt="" />
        </button>
        <button>
          <img class="icon" src="./assets/shell/app_maximize.svg" alt="" />
        </button>
        <button>
          <img class="icon" src="./assets/shell/app_close.svg" alt="" />
        </button>
      </div>
    </div>
    <ul class="app_window__header_menu"></ul>
    </header>
    <section class="app_window__main">${os.apps[appTitle].content}</section>
    `;

  if (os.apps[appTitle].menu) {
    os.apps[appTitle].menu.forEach((el) => {
      const menuItem = document.createElement("li");
      menuItem.innerHTML = `
                <button>${el.label}</button>
            `;

      appWindow.querySelector(".app_window__header_menu").append(menuItem);
    });
  }

  ui_ground.append(appWindow);
}

ui_menu__list.addEventListener("click", (e) => {
  if (!e.target.matches(".menu__list_app button")) return;

  launchApp(e.target.dataset.apptitle);
});
