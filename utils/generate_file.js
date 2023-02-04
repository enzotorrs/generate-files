const util = require('util')
const exec = util.promisify(require('child_process').exec);
const { dirname } = require('path');
const { existsSync, mkdirsync} = require('fs')

const appDir = dirname(require.main.filename);

async function generate_file(size, fileName) {
    const generatedFilesFolder = `${appDir}/generated_files`
    if(!existsSync(generatedFilesFolder)){
        mkdirsync(generatedFilesFolder)
    }
    await exec(`dd if=/dev/zero of="${generatedFilesFolder}/${fileName}" bs=1M count=${size}`)
}

module.exports = { generate_file }

