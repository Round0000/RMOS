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
          name: "userinput",
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
    modalFormInput(data) {
      const input = document.createElement("input");
      Object.assign(input, {
        type: data.type,
        name: "userinput",
        placeholder: data.placeholder || "",
        spellcheck: false,
        minlength: data.minlength || "",
        maxlength: data.maxlength || "",
        max: data.max || "",
        min: data.min || "",
      });

      return input;
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
      modal_actions__cancel.innerText = "Annuler";
      modal_actions.append(modal_actions__cancel);
      modal_actions__cancel.addEventListener("click", () => {
        ui_modal.close();
      });
      const modal_actions__submit = document.createElement("button");
      modal_actions__submit.classList.add("btn_submit");
      modal_actions__submit.type = "submit";
      modal_actions__submit.innerText = "Confirmer";
      modal_actions.append(modal_actions__submit);
      form.append(data.formContent, modal_actions);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!e.target.userinput.value) return;

        data.callback(e);

        ui_modal.close();
      });
      modal_content.append(p, form);

      return modal_content;
    },
    appFooter(data) {
      const footer = document.createElement("footer");
      footer.classList.add("app_window__footer");
      footer.innerHTML = data.template;
      data.init();
      return footer;
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
    getFormattedDate(date, format) {
      const YYYY = date.getFullYear().toString();
      const MM = (date.getMonth() + 1).toString().padStart(2, "0");
      const DD = date.getDate().toString().padStart(2, "0");
      const hh = date.getHours().toString().padStart(2, "0");
      const mm = date.getMinutes().toString().padStart(2, "0");
      const ss = date.getSeconds().toString().padStart(2, "0");

      format = format.replace("YYYY", YYYY);
      format = format.replace("MM", MM);
      format = format.replace("DD", DD);
      format = format.replace("hh", hh);
      format = format.replace("mm", mm);
      format = format.replace("ss", ss);

      return format;
    },
    updateClock() {
      const now = new Date();
      ui_menu__clock_date.innerText = os.functions.getFormattedDate(
        now,
        "DD/MM"
      );
      ui_menu__clock_time.innerText = os.functions.getFormattedDate(
        now,
        "hh:mm"
      );
    },
  },
};

//
os.functions.updateClock();
setInterval(() => {
  os.functions.updateClock();
}, 1000);
