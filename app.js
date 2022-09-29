const express = require("express")
const utils = require("./utils/generate_file.js")
const bodyParser = require('body-parser');
const fs = require("fs")

const app = express()

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
    const { size } = req.body

    if (!size) {
        return res.status(400).json({ error: "unspecified size" })
    }

    await utils.generate_file(size)

    res.send({ message: "File successfuly generated", url: `/download?size=${size}` })
})

app.get("/download", (req, res) => {
    const { size } = req.query

    if (!size) {
        return res.status(400).json({ error: "unspecified size" })
    }
    try {
        if (fs.existsSync(`./generated_files/${size}`)) {
            return res.download(`./generated_files/${size}`)
        }
        return res.status(400).json({ error: "file does not exist" })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

app.listen(3003, () => {
    console.log("server running")
})
