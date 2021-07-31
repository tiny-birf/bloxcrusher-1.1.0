//require('update-electron-app')()

const { app, BrowserWindow, ipcMain, dialog, session, autoUpdater } = require('electron');
const isDEV = false;

//const fs = require('fs');

let win = null;
let loginWin = null;
/*
let apppath = null;
try {
	apppath = __dirname.split('app.asar')[0] + 'app.asar';
} catch(e) {}*/

/*try {
	fs.unlinkSync(tmpInstaller);
} catch(e) {
	console.log(e);
}*/

/*const server = 'https://bloxcrusher.com'
const url = `${server}/update/win/${app.getVersion()}`
console.log(url);

autoUpdater.setFeedURL({ url });

setInterval(() => {
	autoUpdater.checkForUpdates();
}, 60000);

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
});*/

function createDialogBox(type = 'none', icon = '', title = '', message = '', detail = '') {
	//console.log('hi', win);
	//if(win) {
		dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
			type: type,
			buttons: [],
			defaultId: 0,
			icon: icon,
			title: title,
			message: message,
			detail: detail,
			cancelId: 0,
			noLink: false,
			normalizeAccessKeys: false,
		}).then(box => {
			console.log('Alert closed');
		}).catch(err => {
			console.log(err);
		});
	//}
}

ipcMain.on('show-alert-box', (event, arg) => {
	if(arg) createDialogBox(arg.type, arg.icon, arg.title, arg.message, arg.description);
});

ipcMain.on('exitWindow', (event, arg) => {
	let window = BrowserWindow.getFocusedWindow();
	window.close();
});

ipcMain.on('minimizeWindow', (event, arg) => {
	let window = BrowserWindow.getFocusedWindow();
	window.minimize();
	
});

ipcMain.on('openDash', (event, arg) => {
	let window = BrowserWindow.getFocusedWindow();
	createDashboard();
	if(loginWin){
		loginWin.close();
	}
});

ipcMain.on('loginSuccess', (event, arg) => {
	let window = BrowserWindow.getFocusedWindow();
	if(!loginWin){
		createWindow();
	}
	if(win){
		win.close();
	}
});

function createWindow() {
	loginWin = new BrowserWindow({
		width: 950,
        height: 526,
        minWidth: 950,
        minHeight: 526,
        closable: true,
        center: true,
        type: "tool",
		frame: false,
		transparent: true,
        titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	loginWin.setResizable(false);
	loginWin.removeMenu();
	loginWin.loadFile('src/html/index.html');
	if(isDEV) loginWin.webContents.openDevTools();
	
	loginWin.on('closed', () => {
		loginWin = null;
	});
}

function createDashboard() {
	win = new BrowserWindow({
		width: 500,
        height: 320,
        minWidth: 500,
        minHeight: 320,
        closable: true,
        center: true,
        type: "tool",
		frame: false,
		transparent: true,
        titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	win.setResizable(false);
	win.removeMenu();
	win.loadFile('src/html/login.html');
	if(isDEV) win.webContents.openDevTools();
	
	win.on('closed', () => {
		win = null;
	});
}



app.whenReady().then(() => {
	createDashboard();
	
	session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
		details.requestHeaders['User-Agent'] = 'BloxCrusher/1.0.0 SysWoW72';
		callback({ cancel: false, requestHeaders: details.requestHeaders });
	});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (win === null) {
		createDashboard();
	}
});