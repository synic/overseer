import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron';

const ipc = require('electron').ipcMain;
const windowStateKeeper = require('electron-window-state');

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let tray = null;

const createWindow = () => {
  const mainWindowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    parent: new BrowserWindow({ show: false }),
    modal: true,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    alwaysOnTop: true,
    minimizable: false,
    darkTheme: true,
    show: false,
    backgroundColor: '#666a73',
    skipTaskbar: process.platform !== 'darwin',
    frame: process.platform === 'darwin',
    title: 'Overseer',
    titleBarStyle: 'hidden',
    icon: `${__dirname}/../assets/img/icon.png`,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindowState.manage(mainWindow);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (mainWindow.parent) {
      mainWindow.parent.close();
    }
    mainWindow = null;
  });
};

const shouldQuit = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
  return true;
});

if (shouldQuit) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // create the main window
  createWindow();

  // create the system tray icon
  tray = new Tray(`${__dirname}/../assets/img/trayicon.png`);
  const contextMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click: () => { app.quit(); },
  }]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Overseer');
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  // global keyboard shortcuts
  globalShortcut.register('Control+Alt+M', () => {
    if (mainWindow === null) {
      createWindow();
    }

    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

ipc.on('application-exit', () => {
  app.quit();
});

ipc.on('mainwindow-hide', () => {
  mainWindow.hide();
});

ipc.on('mainwindow-debug', () => {
  mainWindow.webContents.openDevTools();
});

// vim: set sts=2 ts=2 sw=2 :
