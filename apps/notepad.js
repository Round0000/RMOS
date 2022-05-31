export const app = {
  title: "Notepad",
  icon: "./assets/icons/apps/app_notepad.svg",
  content: `<textarea spellcheck="false"></textarea>`,
  menu: {
    primary: [
      {
        label: "Ouvrir",
        callback(source) {
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
              formList: modalFormList,
              callback(e) {
                const selected = documents.find(
                  (doc) => doc.createdAt === e.target.selection.value
                );

                source.querySelector(".app_window__header_title").innerHTML = `
                    Notepad <span>${selected.title}</span>
                `;
                source.querySelector("textarea").value = selected.content;
                source.dataset.currentDocument = selected.createdAt;
              },
              text: "Sélectionnez le document à ouvrir.",
            };

            ui_modal.append(os.components.modalForm(data));
            ui_modal.showModal();
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
              ui_modal__content.remove();
            });
          }
        },
      },
      {
        label: "Enregistrer",
        callback(source) {
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
            ui_modal.innerHTML = `
                <div id="ui_modal__content">
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
                </div>
                `;

            ui_modal.showModal();

            ui_modal
              .querySelector(".btn_cancel")
              .addEventListener("click", (e) => {
                ui_modal.close();
              });

            ui_modal.querySelector("form").addEventListener("submit", (e) => {
              e.preventDefault();

              const docObj = {
                createdAt: getFormattedDate(new Date(), "YYYYMMDDhhmmss"),
                title: e.target.title.value.trim() || "Sans titre",
                content: source.querySelector("textarea").value,
              };
              data.push(docObj);

              localStorage.setItem("notepad", JSON.stringify(data));

              source.dataset.currentDocument = docObj.createdAt;
              source.querySelector(".app_window__header_title").innerHTML = `
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
            formList: modalFormList,
            callback(e) {
              source.querySelector("textarea").style.fontFamily = os.fonts.find(
                (font) => font.id === e.target.selection.value
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
};
