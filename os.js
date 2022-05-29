const os = {
  appStack: [],
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
      icon: "./assets/icons/app_notepad.svg",
      content: `<textarea spellcheck="false">The quick brown fox jumps over the lazy dog...</textarea>`,
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

                const docList = document.createElement("fieldset");
                data.forEach((doc) => {
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
                    <span>${doc.title}</span>
                    <span>${
                      doc.createdAt.slice(6, 8) +
                      "/" +
                      doc.createdAt.slice(4, 6) +
                      " " +
                      doc.createdAt.slice(8, 10) +
                      ":" +
                      doc.createdAt.slice(10, 12)
                    }</span>
                  `;
                  docList.append(input, label);
                });
                ui_modal__content
                  .querySelector("fieldset.list")
                  .append(docList);
              } else {
                ui_modal__content.innerHTML = `<p>Aucun document disponible.</p>
                  <div class="modal_actions">
                    <button class="btn_ok">OK</button>
                  </div>
                  `;
                ui_modal
                  .querySelector(".btn_ok")
                  .addEventListener("click", () => {
                    ui_modal.close();
                    ui_modal__content.innerHTML = "";
                  });
              }

              ui_modal.showModal();

              ui_modal
                .querySelector(".btn_cancel")
                .addEventListener("click", (e) => {
                  ui_modal.close();
                });

              ui_modal.querySelector("form").addEventListener("submit", (e) => {
                e.preventDefault();

                if (!e.target.document.value) return;

                const selected = data.find(
                  (doc) => doc.createdAt === e.target.document.value
                );

                source.querySelector(".app_window__header_title").innerHTML = `
                    Notepad <span>${selected.title}</span>
                `;
                source.querySelector("textarea").value = selected.content;
                source.dataset.currentDocument = selected.createdAt;

                ui_modal.close();
                ui_modal__content.innerHTML = "";
              });
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
                      title: e.target.title.value || "Sans titre",
                      content: source.querySelector("textarea").value,
                    });

                    localStorage.setItem("notepad", JSON.stringify(data));

                    ui_modal.close();
                    ui_modal__content.innerHTML = "";
                  });
              }
            },
          },
        ],
        secondary: [
          {
            label: "Zoom +",
            icon: "./assets/shell/notepad/zoom_in.svg",
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
            icon: "./assets/shell/notepad/zoom_out.svg",
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
