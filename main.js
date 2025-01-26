const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { optimize } = require('svgo')

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 550,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'SVG', extensions: ['svg'] }]
    })
    return result.filePaths
})

ipcMain.handle('select-save-directory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    return result.filePaths[0]
})

ipcMain.handle('optimize-svg-files', async (event, files, options, saveDir) => {
    const results = []

    for (const file of files) {
        try {
            const svg = await fs.readFile(file, 'utf8')
            const fileName = path.basename(file)
            const originalSize = Buffer.byteLength(svg, 'utf8') / 1024

            const svgoConfig = {
                plugins: [
                    ...(options.removeComments ? [
                        'removeDoctype',
                        'removeXMLProcInst',
                        'removeComments',
                        'removeStyleElement',
                        {
                            name: 'removeAttrs',
                            params: {
                                attrs: ['class', 'data-name', 'style', 'id']
                            }
                        }
                    ] : []),
                    ...(options.removeMetadata ? [
                        'removeMetadata',
                        'removeEditorsNSData',
                        'removeTitle'
                    ] : []),
                    ...(options.removeEmptyAttrs ? [
                        'cleanupAttrs',
                        'removeEmptyAttrs',
                        'removeEmptyContainers',
                        'removeUselessDefs'
                    ] : []),
                    ...(options.mergePaths ? [
                        'mergePaths',
                        'convertPathData',
                        'cleanupIds'
                    ] : [])
                ]
            }

            const result = optimize(svg, svgoConfig)
            const optimizedSize = Buffer.byteLength(result.data, 'utf8') / 1024
            const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1)

            await fs.writeFile(
                path.join(saveDir, `optimized_${fileName}`),
                result.data
            )

            results.push({
                file: fileName,
                success: true,
                originalSize: originalSize.toFixed(1),
                optimizedSize: optimizedSize.toFixed(1),
                savings
            })
        } catch (error) {
            results.push({
                file: path.basename(file),
                success: false,
                error: error.message
            })
        }
    }

    return results
})