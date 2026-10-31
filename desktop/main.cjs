// SPDX-License-Identifier: AGPL-3.0-only
// Serves the Vite build over app:// (not file://) so module workers, wasm and fetch work as on the web.
const { app, BrowserWindow, protocol, net, shell, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const { pathToFileURL } = require('node:url')

const root = app.isPackaged ? path.join(process.resourcesPath, 'web') : path.join(__dirname, '..', 'dist')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } },
])

app.whenReady().then(() => {
  protocol.handle('app', (req) => {
    const rel = decodeURIComponent(new URL(req.url).pathname)
    let file = path.normalize(path.join(root, rel))
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html')
    return net.fetch(pathToFileURL(file).toString())
  })

  const win = new BrowserWindow({ width: 1400, height: 900, autoHideMenuBar: true })
  // External links open in the real browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('app://')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // The page blocks unload while there are unsaved changes; a browser asks, Electron silently refuses to close.
  win.webContents.on('will-prevent-unload', (event) => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      title: 'ScanRuler',
      buttons: ['Close without saving', 'Cancel'],
      defaultId: 1,
      cancelId: 1,
      message: 'You have unsaved changes.',
      detail: 'Close ScanRuler anyway?',
    })
    if (choice === 0) event.preventDefault()
  })
  win.loadURL('app://scanruler/')
})

app.on('window-all-closed', () => app.quit())
