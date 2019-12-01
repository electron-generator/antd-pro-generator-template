// 引入electron并创建一个Browserwindow
// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');
const url = require('url');

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

function createWindow() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // details.requestHeaders['User-Agent'] = 'MyAgent';
    // details.requestHeaders.Origin = null;
    // details.requestHeaders.Referer = null;
    callback({ requestHeaders: details.requestHeaders });
  });
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 578,
    webPreferences: {
      nodeIntegration: true,
      plugins: true,
    },
  });

  const fileUrl = url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(fileUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', () => {
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);
  createWindow();
});

// 所有窗口关闭时退出应用.
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

// let template = [];
