const config = require('config')

const util = require('util')
const exec = util.promisify(require('child_process').exec);
const { existsSync, mkdirsync, unlinkSync } = require('fs')
const { dirname } = require('path');

const appDir = dirname(require.main.filename);

async function generate_file(size, fileName) {
    const generatedFilesFolder = `${appDir}/generated_files`
    if (!existsSync(generatedFilesFolder)) {
        mkdirsync(generatedFilesFolder)
    }
    await exec(`dd if=/dev/zero of="${generatedFilesFolder}/${fileName}" bs=1M count=${size}`)
    setTimeout(() => {
        unlinkSync(`${generatedFilesFolder}/${fileName}`)
    }, config.get('eraseFileAfterMiliseconds'))
}

module.exports = { generate_file }

