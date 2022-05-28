// OS
const os = {
  appStack: [],
  apps: {
    notepad: {
      title: "Notepad",
      icon: "./assets/icons/app_notepad.svg",
      content: `<textarea spellcheck="false">The quick brown fox jumps over the lazy dog...</textarea>`,
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
            function(source) {
              let data = [];
              if (localStorage.getItem("notepad")) {
                data = [...JSON.parse(localStorage.getItem("notepad"))];
              }

              data.push({
                title: "Mon texte",
                content: source.querySelector("textarea").value,
              });

              localStorage.setItem("notepad", JSON.stringify(data));
            },
          },
        ],
        secondary: [
          {
            label: "Font-",
            icon: "./assets/shell/notepad/font_decrease.svg",
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
            label: "Font+",
            icon: "./assets/shell/notepad/font_increase.svg",
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
