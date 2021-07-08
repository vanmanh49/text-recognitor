const { ipcRenderer } = require("electron");

const imgSource = document.getElementById("img-source");
const textPannel = document.getElementById("recognited-text");
const btnRecognite = document.getElementById("btn-recognite");
const progressBar = document.getElementById("progress");

ipcRenderer.on("file-selected", (evt, args) => {
  if (args && args.length === 1) {
      
    imgSource.classList.remove(["hide"]);
    btnRecognite.classList.remove(["hide"]);
    imgSource.src = args[0];
    textPannel.classList.add(["hide"]);

    btnRecognite.addEventListener("click", () => {
      textPannel.classList.add(["hide"]);
      progressBar.classList.remove(["hide"]);
      btnRecognite.classList.add(["disabled"]);
      ipcRenderer.send("recognite-text", imgSource.src);
    });
  }
});

ipcRenderer.on("receive-recognited-text", (evt, text) => {
  textPannel.classList.remove(["hide"]);
  textPannel.innerText = text;
  progressBar.classList.add(["hide"]);
  btnRecognite.classList.remove(["disabled"]);
});
