// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const { createWorker } = require("tesseract.js");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  async function loadImageFromLocal() {
    const fileObj = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Image", extensions: ["png", "jpg", "bmp", "pbm"] }],
    });
    if (!fileObj.canceled) {
      mainWindow.webContents.send("file-selected", fileObj.filePaths);
    }
  }

  const appMenuTemplate = [
    {
      label: "Load Image",
      accelerator: "CmdOrCtrl+O",
      click: loadImageFromLocal,
    },
    {
      label: "Exit",
      click: function () {
        app.quit();
      },
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenuTemplate));
}

ipcMain.on("recognite-text", (evt, imgSrc) => {
  const imgSrcPath = imgSrc.substring("file:///".length);
  const worker = createWorker({
    gzip: false,
    langPath: "./",
    cacheMethod: "readOnly",
    // logger: (m) => console.log(m),
    // errorHandler: (e) => console.log(e),
  });
  (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imgSrcPath);
    evt.sender.send("receive-recognited-text", text);
    await worker.terminate();
  })();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
