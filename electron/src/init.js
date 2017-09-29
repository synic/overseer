import { app, BrowserWindow } from 'electron';

const electron = require('electron');
const ipc = require('electron').ipcMain;
const mtg = require('mtgsdk');

const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 800;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

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
    frame: false,
    title: 'Overseer',
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // set always on top, floating
  mainWindow.setAlwaysOnTop(true, 'floating');

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

ipc.on('search-begin', (event, keywords) => {
  mtg.card.where({ name: keywords }).then((cards) => {
    ipc.send('search-complete', cards);
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// vim: set sts=2 ts=2 sw=2 :
