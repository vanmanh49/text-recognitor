// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
document.addEventListener("DOMContentLoaded", () => {
  const imgSource = document.getElementById("img-source");
  const textPannel = document.getElementById("recognited-text");
  const btnRecognite = document.getElementById("btn-recognite");
  const progressBar = document.getElementById("progress");

  imgSource.classList.add(["hide"]);
  textPannel.classList.add(["hide"]);
  btnRecognite.classList.add(["hide"]);
  progressBar.classList.add(["hide"]);
});
