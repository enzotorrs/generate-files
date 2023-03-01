const config = require('config');
const { Server } = require("socket.io");
const io = new Server(config.get('socketServerPort'), {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
})
const { generate_file } = require("../utils/generate_file")
const { logger } = require('../utils/logger')
const { validateGenerateRoute } = require("../utils/validate");
const { getProgressPercent } = require("../utils/generate_file/get_progress_percent");
exports.generate = (req, res) => {
    const { size, file_name, socketId } = req.body
    logger(`new file request received ${size} ${file_name} ${socketId}`)

    const { error, message, status } = validateGenerateRoute(req.body)

    if (error) {
        return res.status(status).json({ message: message })
    }

    generate_file(size, file_name,
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
