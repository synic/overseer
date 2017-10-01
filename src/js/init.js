import { app, BrowserWindow, Tray } from 'electron';

const electron = require('electron');
const ipc = require('electron').ipcMain;

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
  let p = new BrowserWindow({ show: false, center: true });
  const bounds = electron.screen.getPrimaryDisplay().bounds;
  const xCoord = bounds.x + ((bounds.width - WINDOW_WIDTH) / 2);
  const yCoord = bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    parent: p,
    modal: true,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    x: xCoord,
    y: yCoord,
    alwaysOnTop: true,
    minimizable: false,
    darkTheme: true,
    show: false,
    backgroundColor: '#666',
    frame: false,
    title: 'Overseer',
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // set always on top, floating
  mainWindow.setAlwaysOnTop(true, 'floating');

  // only show the window when it's rendered everything
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    p.close();
    p = null;
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
  createWindow();
  const imgloc = `${__dirname}/../images/icon.png`;
  tray = new Tray(imgloc);
  tray.setToolTip('Overseer');
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
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

// vim: set sts=2 ts=2 sw=2 :
