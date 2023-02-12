const express = require("express")
const utils = require("./utils/generate_file")
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const config = require('config');
const { getProgressPercent } = require("./utils/generate_file/get_progress_percent");
const {logger } = require('./utils/logger')
const morgan = require('morgan')

const io = new Server(config.get('socketServerPort'), {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
})

const app = express()

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.use(morgan('tiny'))

if (process.env.NODE_ENV === "development") {
    app.use(express.static('generated_files/'));
}

app.post("/generate", async (req, res) => {
    const { size, file_name, socketId } = req.body
    logger(`new file request received ${size} ${file_name} ${socketId}`)

    if (!size) {
        logger("size not especified in request")
        return res.status(400).json({ error: "unspecified size" })
    }

    if (!file_name) {
        logger("file name not especified in request")
        return res.status(400).json({ error: "unspecified file_name" })
    }

    if (!socketId) {
        logger("socket id not especified in request")
        return res.status(400).json({ error: "unspecified socketId" })
    }

    utils.generate_file(size, file_name,
        // on progress
        (data) => {
            const stringData = data.toString()
            const percent = getProgressPercent(stringData, size)
            io.to(socketId).emit("progress", { "percent": percent})
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

    res.send({ message: "File is being generated" })
})

app.listen(config.get("serverPort"), () => {
    console.log(`server running in port: ${config.get("serverPort")}`)
})
