const config = require('config');

const io = require('../socket')
const { generateFile } = require("../utils/generateFile")
const { logger } = require('../utils/logger')
const { validateGenerateRoute } = require("../utils/validate");
const { getProgressPercent } = require("../utils/generateFile/getProgressPercent");

exports.generate = (req, res) => {
    const { size, file_name, socketId } = req.body
    logger(`new file request received ${size} ${file_name} ${socketId}`)

    const { error, message, status } = validateGenerateRoute(req.body)

    if (error) {
        return res.status(status).json({ message: message })
    }

    generateFile(size, file_name,
        // on progress
        (data) => {
            const stringData = data.toString()
            const percent = getProgressPercent(stringData, size)
            io.to(socketId).emit("progress", { "percent": percent })
            logger(`onProgess event trigged for ${socketId} socket ${percent}%`)
        },
        // on finish
        () => {
            io.to(socketId).emit("finish_process", { "error": false, "url": `/${file_name}` })
            logger(`onFinish event trigged for ${socketId} socket`)
        },
        // on Error
        () => {
            io.to(socketId).emit("finish_process", { "error": true })
            logger(`onError event trigged for ${socketId} socket`)
        })

    res.send({ message: message })
}
