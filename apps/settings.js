export const app = {
  title: "Settings",
  icon: "./assets/icons/apps/app_settings.svg",
  content: `
    <img src="./assets/icons/apps/app_settings.svg">
    <p>Bienvenue dans les Paramètres du Système. <span>Ce module est en cours d'élaboration.</span></p>
  `,
  functions: {
    initNewDocument(source) {
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
  menu: {},
  footer: {
    content: "",
    callback(data) {},
  },
};
