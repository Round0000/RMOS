// Drag'n'drop

let dragged = false;
let currentlyDragged;
let draggedOffsetX;
let draggedOffsetY;

document.addEventListener("mousedown", (e) => {
  if (
    (e.target.matches(".app_window__header_head") ||
      e.target.closest(".app_window__header_head")) &&
    !e.target.closest("button")
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
  console.log(e);
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

  import(`./apps/${id}.js`)
    .then((module) => {
      const app = module.app;

      const appWindow = document.createElement("div");
      appWindow.classList.add("app_window");
      appWindow.dataset.appid = id;
      appWindow.dataset.maximized = true;
      appWindow.innerHTML = `
    <header class="app_window__header">
    <div class="app_window__header_head">
      <img class="icon" src="${app.icon}" alt="" />
      <span class="app_window__header_title">${app.title}</span>
      <div class="app_window__header_actions">
        <button data-action="minimize">
          <img class="icon" src="./assets/icons/app_minimize.svg" alt="" />
        </button>
        <button data-action="maximize">
          <img class="icon" src="./assets/icons/app_maximize.svg" alt="" />
        </button>
        <button data-action="restoresize" class="hidden">
          <img class="icon" src="./assets/icons/app_restoresize.svg" alt="" />
        </button>
        <button data-action="close">
          <img class="icon" src="./assets/icons/app_close.svg" alt="" />
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
            el.callback(appWindow);
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
            el.callback(appWindow);
          });
        });
      }

      if (app.footer) {
        const footer = os.components.appFooter({
          content: app.footer.content,
          appWindow: appWindow,
        });

        appWindow.append(footer);
        app.footer.callback({ appWindow, footer });
      }

      const stylesheet = document.createElement("link");
      stylesheet.setAttribute("rel", "stylesheet");
      fetch(`./assets/styles/apps/${id}.css`).then((res) => {
        stylesheet.setAttribute("href", `./assets/styles/apps/${id}.css`);
        document.querySelector("head").append(stylesheet);

        ui_ground.append(appWindow);

        os.appStack.push(id);
        os.activeApp = app.title;
        appWindow.dataset.state = "active";
        button.dataset.state = "active";
      });
    })
    .catch((err) => console.log(err));
}

ui_menu__list.addEventListener("click", (e) => {
  if (!e.target.matches(".menu__list_app")) return;

  if (e.target.closest('[data-state="default"]')) {
    launchApp(e.target);
  } else if (e.target.closest('[data-state="minimized"]')) {
    e.target.closest('[data-state="minimized"]').dataset.state = "active";
    ui_ground.querySelector(
      `[data-appid="${e.target.dataset.appid}"]`
    ).dataset.state = "active";
  }
});

ui_modal.addEventListener("close", () => {
  ui_modal.innerHTML = "";
});

ui_ground.addEventListener("click", (e) => {
  if (e.target.closest(".app_window__header_actions")) {
    const appWindow = e.target.closest(".app_window");

    if (e.target.closest('[data-action="minimize"]')) {
      appWindow.dataset.state = "minimized";
      ui_menu__list.querySelector(
        `[data-appid="${appWindow.dataset.appid}"]`
      ).dataset.state = "minimized";
    } else if (
      e.target.closest('[data-action="maximize"]') ||
      e.target.closest('[data-action="restoresize"]')
    ) {
      const maximized = appWindow.dataset.maximized === "true";
      appWindow.dataset.maximized = !maximized;
      e.target.parentElement
        .querySelector('[data-action="maximize"]')
        .classList.toggle("hidden");
      e.target.parentElement
        .querySelector('[data-action="restoresize"]')
        .classList.toggle("hidden");
    } else if (e.target.closest('[data-action="close"]')) {
      ui_menu__list.querySelector(
        `[data-appid="${appWindow.dataset.appid}"]`
      ).dataset.state = "default";
      appWindow.remove();
    }
  }
});

// Viewport height
document.body.style.height = window.visualViewport.height + "px";

launchApp(ui_menu.querySelector("button:last-of-type"));
//
