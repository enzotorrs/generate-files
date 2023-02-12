const config = require('config')

const { dd } = require('./dd.js')

const { existsSync, mkdirsync, unlinkSync } = require('fs')
const { dirname } = require('path');

const appDir = dirname(require.main.filename);

async function generate_file(size, fileName, onProgress, onFinish, onError) {
    const generatedFilesFolder = `${appDir}/generated_files`
    if (!existsSync(generatedFilesFolder)) {
        mkdirsync(generatedFilesFolder)
    }

    const filePath = `${generatedFilesFolder}/${fileName}`

    dd(size, filePath, onProgress, onError, onFinish)

    eraseFileAfterMiliseconds(config.get("eraseFileAfterMiliseconds"))
}

function eraseFileAfterMiliseconds(miliseconds) {
    setTimeout(() => {
        unlinkSync(`${generatedFilesFolder}/${fileName}`)
    }, miliseconds)
}

module.exports = { generate_file }
