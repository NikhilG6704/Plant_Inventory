const { app, BrowserWindow, dialog } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

let backendProcess;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));

  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar.unpacked", "backend")
    : path.join(__dirname, "../backend");

  console.log("Backend Path:", backendPath);

  backendProcess = spawn("npm", ["start"], {
    cwd: backendPath,
    shell: true,
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });

  backendProcess.on("exit", (code) => {
    console.log("Backend exited with code:", code);
  });
}

function setupAutoUpdater() {
  autoUpdater.logger = log;

  autoUpdater.logger.transports.file.level = "info";

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for updates...");
  });

  autoUpdater.on("update-available", () => {
    console.log("Update available");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("No updates available");
  });

  autoUpdater.on("error", (err) => {
    console.error("Update Error:", err);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    console.log(`Download Speed: ${progressObj.bytesPerSecond}`);
    console.log(`Downloaded: ${progressObj.percent.toFixed(2)}%`);
  });

  autoUpdater.on("update-downloaded", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      buttons: ["Restart Now", "Later"],
      defaultId: 0,
      cancelId: 1,
      title: "Update Ready",
      message: "A new version has been downloaded. Restart now to install it?",
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  startBackend();

  setTimeout(() => {
    createWindow();

    if (app.isPackaged) {
      setupAutoUpdater();
    }
  }, 3000);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
