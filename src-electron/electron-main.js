import { app, BrowserWindow, dialog } from 'electron'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { registerQuasarRuntime, resolveElectronAssetsPath } from '#q-app/electron/main'

const backendPort = process.env.BACKEND_PORT || '3000'
const backendUrl = `http://127.0.0.1:${backendPort}`
const backendRoot = import.meta.env.QUASAR_DEV
  ? path.resolve(process.cwd(), '..', 'api-liz-entrenamiento')
  : path.join(process.resourcesPath, 'api-liz-entrenamiento')
const backendEntry = path.join(backendRoot, 'src', 'server.js')
const uploadsDir = path.join(app.getPath('userData'), 'uploads')
let backendProcess

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })

const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${backendUrl}/health`)
    return response.ok
  } catch {
    return false
  }
}

const startBackend = async () => {
  if (await isBackendAvailable()) return

  backendProcess = spawn(process.execPath, [backendEntry], {
    cwd: backendRoot,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      PORT: backendPort,
      UPLOADS_DIR: uploadsDir,
    },
    stdio: 'inherit',
  })

  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await isBackendAvailable()) return
    await wait(500)
  }

  throw new Error(`No se pudo iniciar el backend en ${backendUrl}`)
}

async function createWindow() {
  /**
   * Initial window options
   */
  const mainWindow = new BrowserWindow({
    icon: resolveElectronAssetsPath('icons/icon.png'), // Windows and Linux
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.join(import.meta.dirname, 'electron-preload.cjs'),
    },
  })

  if (import.meta.env.QUASAR_DEV) {
    await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (import.meta.env.QUASAR_DEBUG) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }
}

void app.whenReady().then(() => {
  registerQuasarRuntime()
  startBackend()
    .then(createWindow)
    .catch((error) => {
      dialog.showErrorBox('No se pudo iniciar la aplicación', error.message)
      app.quit()
    })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('before-quit', () => {
  backendProcess?.kill()
})
