import { app, BrowserWindow, globalShortcut, Menu, Tray } from 'electron';

const electron = require('electron');
const ipc = require('electron').ipcMain;
const windowStateKeeper = require('electron-window-state');

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;
const IMAGE_FOLDER = `${__dirname}/../../assets/img`;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require( // eslint-disable-line global-require
  'electron-squirrel-startup')) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let tray = null;

const createWindow = () => {
  const bounds = electron.screen.getPrimaryDisplay().bounds;
  const xCoord = bounds.x + ((bounds.width - WINDOW_WIDTH) / 2);
  const yCoord = bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2);

  const mainWindowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    parent: process.platform !== 'darwin' ? new BrowserWindow({ show: false }) : null,
    modal: true,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x === undefined ? xCoord : mainWindowState.x,
    y: mainWindowState.y === undefined ? yCoord : mainWindowState.y,
    alwaysOnTop: true,
    minimizable: false,
    closable: true,
    maximizable: false,
    fullscreenable: false,
    darkTheme: true,
    show: false,
    backgroundColor: '#666a73',
    skipTaskbar: process.platform !== 'darwin',
    frame: false,
    title: 'Overseer',
    autoHideMenuBar: false,
    icon: `${__dirname}/../../assets/img/icon.png`,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  // open the developer tools
  // mainWindow.webContents.openDevTools();

  // manage window state (width, height, x, y)
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
  let trayImage = `${IMAGE_FOLDER}/tray/iconTemplate.png`;

  if (process.platform === 'win32') {
    trayImage = `${IMAGE_FOLDER}/tray/icon.ico`;
  } else if (process.platform === 'linux') {
    trayImage = `${IMAGE_FOLDER}/tray/icon.png`;
  }

  tray = new Tray(trayImage);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => { app.quit(); },
    },
  ]);

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

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();

      // tell the main window to focus and select text in the search box
      mainWindow.webContents.send('focus-search');
    }
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
