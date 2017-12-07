/* eslint-env node */
/* eslint no-console: "error" */
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  Tray,
} = require('electron');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

const electron = require('electron');
const ipc = require('electron').ipcMain;
const windowStateKeeper = require('electron-window-state');

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;
const IMAGE_FOLDER = `${__static}/icons`;

let mainWindow = null;
let tray = null;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
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
    icon: `${IMAGE_FOLDER}/icon.png`,
  });

  // load the application page
  mainWindow.loadURL(winURL);

  // manage window state (width, height, x, y)
  mainWindowState.manage(mainWindow);

  // If a loading operation goes wrong, we'll send Electron back to
  // Ember App entry point
  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(winURL);
  });

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (mainWindow.parent) {
      mainWindow.parent.close();
    }
    mainWindow = null;
  });

  if (process.env.EMBER_ENV === 'development' && process.env.DEBUG === '1') {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', () => {
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers

ipc.on('application-cmd-exit', () => {
  app.quit();
});

ipc.on('application-cmd-hide', () => {
  mainWindow.hide();
});

ipc.on('application-cmd-debug', () => {
  mainWindow.webContents.openDevTools();
});
