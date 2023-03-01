const { spawn } = require('node:child_process');

function dd(fileSize, filePath, onProgress, onError, onFinish) {
    const dd = spawn('dd',
        ['if=/dev/zero',
            `of=${filePath}`,
            'bs=1M',
            `count=${fileSize}`,
            'status=progress'])

    dd.stderr.on('data', onProgress)
    dd.on('close', onFinish)
    dd.on('error', onError)
}

module.exports = { dd }
