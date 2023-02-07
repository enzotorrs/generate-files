const express = require("express")
const utils = require("./utils/generate_file.js")
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const config = require('config')

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

if (process.env.NODE_ENV === "development") {
    app.use(express.static('generated_files/'));
}

app.post("/generate", async (req, res) => {
    const { size, file_name, socketId } = req.body

    if (!size) {
        return res.status(400).json({ error: "unspecified size" })
    }

    if (!file_name) {
        return res.status(400).json({ error: "unspecified file_name" })
    }

    if(!socketId){
        return res.status(400).json({ error: "unspecified socketId" })
    }

    utils.generate_file(size, file_name)
        .then(() => {
            io.to(socketId).emit("finish_process", { "error": false, "url": `/${file_name}` })
        })
        .catch(() => {
            io.to(socketId).emit("finish_process", { "error": true })
        })

    res.send({ message: "File is being generated" })
})

app.listen(config.get("serverPort"), () => {
    console.log("server running")
})
