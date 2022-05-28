// OS
const os = {
  appStack: [],
  apps: {
    notepad: {
      title: "Notepad",
      icon: "./assets/icons/app_notepad.svg",
      content: `<textarea></textarea>`,
      menu: {
        primary: [
          {
            label: "Open",
            function(source) {
              console.log(this.label);
            },
          },
          {
            label: "Save",
          },
        ],
        secondary: [
          {
            label: "Font-",
            icon: "./assets/shell/notepad/font_decrease.svg",
            function(source) {
              let fontSize = parseInt(
                window.getComputedStyle(
                  source.closest(".app_window").querySelector("textarea")
                ).fontSize
              );

              if (fontSize > 64) return;

              fontSize += 2;

              source
                .closest(".app_window")
                .querySelector("textarea").style.fontSize = fontSize + "px";
            },
          },
          {
            label: "Font+",
            icon: "./assets/shell/notepad/font_increase.svg",
            function(source) {
              let fontSize = parseInt(
                window.getComputedStyle(
                  source.closest(".app_window").querySelector("textarea")
                ).fontSize
              );

              if (fontSize < 12) return;

              fontSize -= 2;

              source
                .closest(".app_window")
                .querySelector("textarea").style.fontSize = fontSize + "px";
            },
          },
        ],
      },
    },
  },
};
