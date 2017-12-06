/* eslint-env node */
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  protocol,
  Tray
} = require('electron');
const { dirname, join, resolve } = require('path');
const protocolServe = require('electron-protocol-serve');

const electron = require('electron');
const ipc = require('electron').ipcMain;
const windowStateKeeper = require('electron-window-state');

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;
const IMAGE_FOLDER = `${__dirname}/../ember/icons/img`;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require( // eslint-disable-line global-require
  'electron-squirrel-startup')) {
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let tray = null;

// Registering a protocol & schema to serve our Ember application
protocol.registerStandardSchemes(['serve'], { secure: true });
protocolServe({
  cwd: join(__dirname || resolve(dirname('')), '..', 'ember'),
  app,
  protocol,
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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

  const emberAppLocation = 'serve://dist';

  // Load the ember application using our custom protocol/scheme
  mainWindow.loadURL(emberAppLocation);

  // manage window state (width, height, x, y)
  mainWindowState.manage(mainWindow);

  // If a loading operation goes wrong, we'll send Electron back to
  // Ember App entry point
  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(emberAppLocation);
  });

  mainWindow.webContents.on('crashed', () => {
    console.log('Your Ember app (or other code) in ' +
      'the main window has crashed.');
    console.log('This is a serious issue that needs ' +
      'to be handled and/or debugged.');
  });

  mainWindow.on('unresponsive', () => {
    console.log('Your Ember app (or other code) has ' +
      'made the window unresponsive.');
  });

  mainWindow.on('responsive', () => {
    console.log('The main window has become responsive again.');
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

  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }
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

  mainWindow.webContents.openDevTools();
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

ipc.on('application-cmd-exit', () => {
  app.quit();
});

ipc.on('application-cmd-hide', () => {
  mainWindow.hide();
});

ipc.on('application-cmd-debug', () => {
  mainWindow.webContents.openDevTools();
});

// Handle an unhandled error in the main thread
//
// Note that 'uncaughtException' is a crude mechanism for exception handling
// intended to be used only as a last resort. The event should not be used as
// an equivalent to "On Error Resume Next". Unhandled exceptions inherently
// mean that an application is in an undefined state. Attempting to resume
// application code without properly recovering from the exception can cause
// additional unforeseen and unpredictable issues.
//
// Attempting to resume normally after an uncaught exception can be similar to
// pulling out of the power cord when upgrading a computer -- nine out of ten
// times nothing happens - but the 10th time, the system becomes corrupted.
//
// The correct use of 'uncaughtException' is to perform synchronous cleanup of
// allocated resources (e.g. file descriptors, handles, etc) before shutting
// down the process. It is not safe to resume normal operation after
// 'uncaughtException'.
process.on('uncaughtException', (err) => {
  console.log('An exception in the main thread was not handled.');
  console.log('This is a serious issue that needs ' +
    'to be handled and/or debugged.');
  console.log(`Exception: ${err}`);
});
