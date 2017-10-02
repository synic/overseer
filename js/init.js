import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron';
import { addMenu } from './mainmenu.js';

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
  // for a floating modal window, we need to create a parent window, even
  // though we aren't planning on displaying it.
  let p = new BrowserWindow({ show: false, center: true });

  const mainWindowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    parent: p,
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
    'skip-taskbar': true,
    frame: false,
    title: 'Overseer',
    titleBarStyle: 'hidden',
    icon: `${__dirname}/../icon.png`,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  // set always on top, floating
  mainWindow.setAlwaysOnTop(true, 'floating');

  mainWindowState.manage(mainWindow);

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
  // create the main window
  createWindow();

  // create the system tray icon
  tray = new Tray(`${__dirname}/../images/trayicon.png`);
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

  // include system menu
  addMenu();
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
