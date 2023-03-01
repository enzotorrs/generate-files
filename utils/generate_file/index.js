const config = require('config')

const { dd } = require('./dd.js')

const { existsSync, mkdirSync, unlinkSync } = require('fs')
const { dirname } = require('path');
const { logger } = require('../logger/index.js');

const appDir = dirname(require.main.filename);

async function generate_file(size, fileName, onProgress, onFinish, onError) {
    const generatedFilesFolder = `${appDir}/generated_files`
    if (!existsSync(generatedFilesFolder)) {
        mkdirSync(generatedFilesFolder)
    }

    const filePath = `${generatedFilesFolder}/${fileName}`

    dd(size, filePath, onProgress, onError, onFinish)

    eraseFileAfterMiliseconds(config.get("eraseFileAfterMiliseconds"), filePath)
}

function eraseFileAfterMiliseconds(miliseconds, filePath) {
    setTimeout(() => {
        unlinkSync(filePath)
        logger(`${filePath} has been deleted`)
    }, miliseconds)
}

module.exports = { generate_file }
