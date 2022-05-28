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
function launchApp(button) {
  const id = button.dataset.appid;

  if (!os.apps[id]) {
    console.log("App not found...");
    return;
  }

  const app = os.apps[id];

  const appWindow = document.createElement("div");
  appWindow.classList.add("app_window");
  appWindow.dataset.id = id;
  appWindow.innerHTML = `
    <header class="app_window__header">
    <div class="app_window__header_head">
      <img class="icon" src="${app.icon}" alt="" />
      <span class="app_window__header_title">${app.title}</span>
      <div class="app_window__header_actions">
        <button>
          <img class="icon" src="./assets/shell/app_minimize.svg" alt="" />
        </button>
        <button>
          <img class="icon" src="./assets/shell/app_maximize.svg" alt="" />
        </button>
        <button>
          <img class="icon" src="./assets/shell/app_close.svg" alt="" />
        </button>
      </div>
    </div>
    <div class="app_window__header_menu">
        <div class="app_window__header_menu_primary"></div>
        <div class="app_window__header_menu_secondary"></div>
    </div>
    </header>
    <section class="app_window__main">${app.content}</section>
    `;

  if (app.menu.primary) {
    app.menu.primary.forEach((el) => {
      const menuItem = document.createElement("button");
      if (el.icon) {
        menuItem.innerHTML = `<img
        class="icon"
        src="${el.icon}"
        alt=""
      />`;
      } else {
        menuItem.innerText = el.label;
      }
      appWindow
        .querySelector(".app_window__header_menu_primary")
        .append(menuItem);
      menuItem.addEventListener("click", (e) => {
        el.function(menuItem);
      });
    });
  }

  if (app.menu.secondary) {
    app.menu.secondary.forEach((el) => {
      const menuItem = document.createElement("button");
      if (el.icon) {
        menuItem.innerHTML = `<img
        class="icon"
        src="${el.icon}"
        alt=""
      />`;
      } else {
        menuItem.innerText = el.label;
      }
      appWindow
        .querySelector(".app_window__header_menu_secondary")
        .append(menuItem);
      menuItem.addEventListener("click", (e) => {
        el.function(menuItem);
      });
    });
  }

  ui_ground.append(appWindow);

  os.appStack.push(app.title);
  os.activeApp = app.title;
  appWindow.dataset.state = "active";
  button.dataset.state = "active";
}

ui_menu__list.addEventListener("click", (e) => {
  if (!e.target.matches(".menu__list_app")) return;

  launchApp(e.target);
});

launchApp(ui_menu.querySelector("li:last-of-type"));
