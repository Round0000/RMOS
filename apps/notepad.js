export var app = {
  title: "Notepad",
  icon: "./assets/icons/apps/app_notepad.svg",
  content: `<textarea spellcheck="false"></textarea>`,
  functions: {
    initNewDocument(source) {
      console.log(source)
      const textarea = source.querySelector("textarea");
      textarea.value = "";
      source.dataset.currentDocument = "";
      source.dataset.saveState = "clean";
      source.querySelector(".app_window__header_title").innerText = "Notepad";
      source.querySelector(
        "footer"
      ).innerHTML = `<span data-hook="chars-count">0</span> caractères / <span data-hook="words-count">0</span> mots`;
    },
  },
  menu: {
    primary: [
      {
        label: "Nouveau",
        callback(source) {
          if (source.dataset.saveState === "dirty") {
            ui_modal.append(
              os.components.modalAlert({
                text: "Votre document actuel comporte des changements non enregistrés.\n Continuer tout de même ?",
                callback(e) {
                  app.functions.initNewDocument(source);
                },
              })
            );
            ui_modal.showModal();
            ui_modal.querySelector(".btn_submit").focus();
          } else {
            app.functions.initNewDocument(source);
          }
        },
      },
      {
        label: "Ouvrir",
        callback(source) {
          if (source.dataset.saveState === "dirty") {
            ui_modal.append(
              os.components.modalAlert({
                text: "Votre document actuel comporte des changements non enregistrés.\n Continuer tout de même ?",
                callback(e) {
                  app.functions.initNewDocument(source);
                },
              })
            );
            ui_modal.showModal();
            ui_modal.querySelector(".btn_submit").focus();
          } else {
            app.functions.initNewDocument(source);
          }

          if (localStorage.getItem("notepad")) {
            let documents = [...JSON.parse(localStorage.getItem("notepad"))];
            documents.forEach((doc) => {
              doc.id = doc.createdAt;
              doc.date =
                doc.createdAt.slice(6, 8) +
                "/" +
                doc.createdAt.slice(4, 6) +
                " " +
                doc.createdAt.slice(8, 10) +
                ":" +
                doc.createdAt.slice(10, 12);
            });
            const modalFormList = os.components.modalFormList({
              source: source,
              arr: documents,
              labelText: "title",
            });

            modalFormList.querySelectorAll("label").forEach((label) => {
              const doc = documents.find(
                (doc) => doc.id === label.getAttribute("for")
              );
              const dateEl = document.createElement("span");
              dateEl.innerText = doc.date;
              dateEl.dataset.hook = "date";
              label.querySelector("span").dataset.hook = "title";
              label.append(dateEl);
            });

            const data = {
              formContent: modalFormList,
              callback(e) {
                const selected = documents.find(
                  (doc) => doc.createdAt === e.target.userinput.value
                );

                source.querySelector(".app_window__header_title").innerHTML = `
                    Notepad <span>${selected.title}</span>
                `;
                const textarea = source.querySelector("textarea");
                textarea.value = selected.content;
                source.dataset.currentDocument = selected.createdAt;

                source.querySelector('[data-hook="chars-count"]').innerText =
                  textarea.value.length;

                function updateWordsCount(str) {
                  return str.replaceAll(" ", "").length === 0
                    ? 0
                    : str.trim().split(/\s+/).length;
                }
                source.querySelector('[data-hook="words-count"]').innerText =
                  updateWordsCount(textarea.value);
              },
              text: "Sélectionnez le document à ouvrir.",
            };

            source.dataset.saveState = "clean";

            ui_modal.append(os.components.modalForm(data));
            ui_modal.showModal();
            ui_modal.querySelector(".btn_submit").focus();
          } else {
            ui_modal.innerHTML = `
                  <div id="ui_modal__content">
                    <p>Aucun document disponible.</p>
                    <div class="modal_actions">
                      <button class="btn_ok">OK</button>
                    </div>
                  </div>
                `;
            ui_modal.showModal();
            ui_modal.querySelector(".btn_ok").addEventListener("click", () => {
              ui_modal.close();
              ui_modal.innerHTML = "";
            });
          }
        },
      },
      {
        label: "Enregistrer",
        callback(source) {
          let docs = [];
          if (localStorage.getItem("notepad")) {
            docs = [...JSON.parse(localStorage.getItem("notepad"))];
          }

          if (source.dataset.currentDocument) {
            docs.find(
              (doc) => doc.createdAt === source.dataset.currentDocument
            ).content = source.querySelector("textarea").value;
            localStorage.setItem("notepad", JSON.stringify(docs));
            source.dataset.saveState = "clean";
          } else {
            const data = {
              formContent: os.components.modalFormInput({
                type: "text",
                placeholder: "Titre",
                maxlength: 42,
              }),
              callback(e) {
                const docObj = {
                  createdAt: os.functions.getFormattedDate(
                    new Date(),
                    "YYYYMMDDhhmmss"
                  ),
                  title: e.target.userinput.value.trim() || "Sans titre",
                  content: source.querySelector("textarea").value,
                };
                docs.push(docObj);

                localStorage.setItem("notepad", JSON.stringify(docs));

                source.dataset.currentDocument = docObj.createdAt;
                source.querySelector(".app_window__header_title").innerHTML = `
                        Notepad <span>${e.target.userinput.value.trim()}</span>
                    `;

                source.dataset.saveState = "clean";
              },
              text: "Donnez un titre à votre document.",
            };

            ui_modal.append(os.components.modalForm(data));
            ui_modal.showModal();
          }
        },
      },
    ],
    secondary: [
      {
        label: "Font",
        icon: "./assets/icons/apps/notepad/font_family.svg",
        callback(source) {
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
              source.querySelector("textarea").style.fontFamily = fontInOS.code;
            });
          });

          const data = {
            formContent: modalFormList,
            callback(e) {
              source.querySelector("textarea").style.fontFamily = os.fonts.find(
                (font) => font.id === e.target.userinput.value
              ).code;
            },
            text: "Sélectionnez la police d'écriture.",
          };

          ui_modal.append(os.components.modalForm(data));
          ui_modal.showModal();
        },
      },
      {
        label: "Zoom +",
        icon: "./assets/icons/apps/notepad/zoom_in.svg",
        callback(source) {
          let fontSize = parseInt(
            window.getComputedStyle(source.querySelector("textarea")).fontSize
          );

          if (fontSize > 64) return;

          fontSize += 2;

          source.querySelector("textarea").style.fontSize = fontSize + "px";
        },
      },
      {
        label: "Zoom -",
        icon: "./assets/icons/apps/notepad/zoom_out.svg",
        callback(source) {
          let fontSize = parseInt(
            window.getComputedStyle(source.querySelector("textarea")).fontSize
          );

          if (fontSize < 12) return;

          fontSize -= 2;

          source.querySelector("textarea").style.fontSize = fontSize + "px";
        },
      },
    ],
  },
  footer: {
    content: `
    	<span data-hook="chars-count">0</span> caractères / <span data-hook="words-count">0</span> mots
    `,
    callback(data) {
      const textarea = data.appWindow.querySelector("textarea");
      function updateCharsCount() {
        data.footer.querySelector('[data-hook="chars-count"]').innerText =
          textarea.value.length;
      }
      function updateWordsCount(str) {
        return str.replaceAll(" ", "").length === 0
          ? 0
          : str.trim().split(/\s+/).length;
      }
      textarea.addEventListener("keyup", (e) => {
        data.appWindow.dataset.saveState = "dirty";
        updateCharsCount();
        data.footer.querySelector('[data-hook="words-count"]').innerText =
          updateWordsCount(e.target.value);
      });
    },
  },
};
