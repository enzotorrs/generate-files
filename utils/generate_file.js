const { exec } = require('child_process');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

async function generate_file(size){
    await execPromise(`dd if=/dev/zero of=${appDir}/generated_files/${size} bs=1M count=${size}`)
}

function execPromise(command) {
    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout.trim());
        });
    });
}

module.exports = {generate_file}

