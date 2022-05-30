const os = {
  appStack: [],
  components: {
    modalFormList(data) {
      const list = document.createElement("fieldset");
      list.classList.add("modal_form_list");
      data.arr.forEach((el) => {
        const item = document.createElement("div");
        const input = document.createElement("input");
        Object.assign(input, {
          type: "radio",
          name: "selection",
          id: el.id,
          value: el.id,
        });

        const label = document.createElement("label");
        label.setAttribute("for", input.id);

        label.innerHTML = `<span>${el[data.labelText]}</span>`;

        item.append(input, label);

        list.append(item);
      });
      return list;
    },
    modalForm(data) {
      const modal_content = document.createElement("div");
      modal_content.id = "ui_modal__content";
      const p = document.createElement("p");
      p.innerText = data.text;
      const form = document.createElement("form");
      const modal_actions = document.createElement("div");
      modal_actions.classList.add("modal_actions");
      const modal_actions__cancel = document.createElement("button");
      modal_actions__cancel.classList.add("btn_cancel");
      modal_actions__cancel.type = "button";
      modal_actions__cancel.addEventListener("click", () => {
        ui_modal.close();
        modal_content.remove();
      });
      const modal_actions__submit = document.createElement("button");
      modal_actions__submit.classList.add("btn_submit");
      modal_actions__cancel.type = "submit";
      form.append(data.formList, modal_actions);
      modal_content.append(p, form);

      return modal_content;
    },
  },
  fonts: [
    {
      name: "Fira Sans",
      code: "'Fira Sans', sans-serif",
      id: "fira_sans",
    },
    {
      name: "Fira Mono",
      code: "'Fira Mono', sans-serif",
      id: "fira_mono",
    },
    {
      name: "Roboto Slab",
      code: "'Roboto Slab', sans-serif",
      id: "roboto_slab",
    },
    {
      name: "Lora",
      code: "'Lora', serif",
      id: "lora",
    },
    {
      name: "Montserrat",
      code: "'Montserrat', sans-serif",
      id: "montserrat",
    },
    {
      name: "Roboto Condensed",
      code: "'Roboto Condensed', sans-serif",
      id: "roboto_condensed",
    },
  ],
  functions: {
    updateClock() {
      const now = new Date();
      ui_menu__clock_date.innerText = getFormattedDate(now, "DD/MM");
      ui_menu__clock_time.innerText = getFormattedDate(now, "hh:mm");
    },
  },
  apps: {
    notepad: {
      title: "Notepad",
      icon: "./assets/icons/apps/app_notepad.svg",
      content: `<textarea spellcheck="false"></textarea>`,
      menu: {
        primary: [
          {
            label: "Ouvrir",
            function(source) {
              let data = [];
              if (localStorage.getItem("notepad")) {
                ui_modal__content.innerHTML = `
                <p>Sélectionnez un document à ouvrir.</p>
                <form>
                  <fieldset class="list"></fieldset>
                  <div class="modal_actions">
                    <button type="button" class="btn_cancel">Annuler</button>
                    <button type="submit" class="btn_submit">Confirmer</button>
                  </div>
                </form>
                `;

                data = [...JSON.parse(localStorage.getItem("notepad"))];

                const docList =
                  ui_modal__content.querySelector(".modal_form_list");
                data.forEach((doc) => {
                  const item = document.createElement("div");
                  const input = document.createElement("input");
                  Object.assign(input, {
                    type: "radio",
                    name: "document",
                    id: doc.createdAt,
                    value: doc.createdAt,
                  });
                  const label = document.createElement("label");
                  label.setAttribute("for", input.id);
                  label.innerHTML = `
                    <span data-hook="title">${doc.title}</span>
                    <span data-hook="date">${
                      doc.createdAt.slice(6, 8) +
                      "/" +
                      doc.createdAt.slice(4, 6) +
                      " " +
                      doc.createdAt.slice(8, 10) +
                      ":" +
                      doc.createdAt.slice(10, 12)
                    }</span>
                  `;
                  item.append(input, label);
                  docList.append(item);
                });

                ui_modal.showModal();

                ui_modal
                  .querySelector(".btn_cancel")
                  .addEventListener("click", (e) => {
                    ui_modal.close();
                  });

                ui_modal
                  .querySelector("form")
                  .addEventListener("submit", (e) => {
                    e.preventDefault();

                    if (!e.target.document.value) return;

                    const selected = data.find(
                      (doc) => doc.createdAt === e.target.document.value
                    );

                    source.querySelector(
                      ".app_window__header_title"
                    ).innerHTML = `
                    Notepad <span>${selected.title}</span>
                `;
                    source.querySelector("textarea").value = selected.content;
                    source.dataset.currentDocument = selected.createdAt;

                    ui_modal.close();
                    ui_modal__content.innerHTML = "";
                  });
              } else {
                ui_modal__content.innerHTML = `<p>Aucun document disponible.</p>
                <div class="modal_actions">
                  <button class="btn_ok">OK</button>
                </div>
                `;
                ui_modal.showModal();
                ui_modal
                  .querySelector(".btn_ok")
                  .addEventListener("click", () => {
                    ui_modal.close();
                    ui_modal__content.innerHTML = "";
                  });
              }
            },
          },
          {
            label: "Enregistrer",
            function(source) {
              let data = [];
              if (localStorage.getItem("notepad")) {
                data = [...JSON.parse(localStorage.getItem("notepad"))];
              }

              if (source.dataset.currentDocument) {
                data.find(
                  (doc) => doc.createdAt === source.dataset.currentDocument
                ).content = source.querySelector("textarea").value;
                localStorage.setItem("notepad", JSON.stringify(data));
              } else {
                ui_modal__content.innerHTML = `
                <p>Donnez un titre à votre document.</p>
                <form>
                  <input
                    name="title"
                    type="text"
                    placeholder="Titre"
                    spellcheck="false"
                    maxlength="42"
                  />
                  <div class="modal_actions">
                    <button type="button" class="btn_cancel">Annuler</button>
                    <button type="submit" class="btn_submit">Confirmer</button>
                  </div>
                </form>
                `;

                ui_modal.showModal();

                ui_modal
                  .querySelector(".btn_cancel")
                  .addEventListener("click", (e) => {
                    ui_modal.close();
                  });

                ui_modal
                  .querySelector("form")
                  .addEventListener("submit", (e) => {
                    e.preventDefault();

                    data.push({
                      createdAt: getFormattedDate(new Date(), "YYYYMMDDhhmmss"),
                      title: e.target.title.value.trim() || "Sans titre",
                      content: source.querySelector("textarea").value,
                    });

                    localStorage.setItem("notepad", JSON.stringify(data));

                    source.querySelector(
                      ".app_window__header_title"
                    ).innerHTML = `
                    Notepad <span>${e.target.title.value.trim()}</span>
                `;

                    ui_modal.close();
                    ui_modal__content.innerHTML = "";
                  });
              }
            },
          },
        ],
        secondary: [
          {
            label: "Font",
            icon: "./assets/icons/apps/notepad/font_family.svg",
            function(source) {
              const modalFormList = os.components.modalFormList({
                source: source,
                arr: os.fonts,
                labelText: "name",
              });

              modalFormList.querySelectorAll("label").forEach((label) => {
                const fontInOS = os.fonts.find(
                  (item) => item.id === label.getAttribute("for")
                );

                label.style.fontFamily = fontInOS.code;
                label.parentElement.addEventListener("click", (e) => {
                  source.querySelector("textarea").style.fontFamily =
                    fontInOS.code;
                });
              });

              ui_modal__content.querySelector("form").prepend(modalFormList);

              ui_modal
                .querySelector(".btn_cancel")
                .addEventListener("click", (e) => {
                  ui_modal.close();
                });

              ui_modal.querySelector("form").addEventListener("submit", (e) => {
                e.preventDefault();

                if (!e.target.selection.value) return;

                source.querySelector("textarea").style.fontFamily =
                  os.fonts.find(
                    (font) => font.id === e.target.selection.value
                  ).code;

                ui_modal.close();
                ui_modal__content.innerHTML = "";
              });

              ui_modal.append(modalForm());
              ui_modal.showModal();
            },
          },
          {
            label: "Zoom +",
            icon: "./assets/icons/apps/notepad/zoom_in.svg",
            function(source) {
              let fontSize = parseInt(
                window.getComputedStyle(source.querySelector("textarea"))
                  .fontSize
              );

              if (fontSize > 64) return;

              fontSize += 2;

              source.querySelector("textarea").style.fontSize = fontSize + "px";
            },
          },
          {
            label: "Zoom -",
            icon: "./assets/icons/apps/notepad/zoom_out.svg",
            function(source) {
              let fontSize = parseInt(
                window.getComputedStyle(source.querySelector("textarea"))
                  .fontSize
              );

              if (fontSize < 12) return;

              fontSize -= 2;

              source.querySelector("textarea").style.fontSize = fontSize + "px";
            },
          },
        ],
      },
    },
  },
};

//
os.functions.updateClock();
setInterval(() => {
  os.functions.updateClock();
}, 1000);
