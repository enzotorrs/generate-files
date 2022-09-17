const express = require("express")
const utils = require("./utils/generate_file.js")
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
    const { size } = req.body

    if(!size){
        return res.status(400).json({error: "unspecified size"})
    }

    await utils.generate_file(size)

    res.send("file generate successfully")
})

app.get("/download", (req, res) => {
    const { size } = req.query

    if(!size){
        return res.status(400).json({error: "unspecified size"})
    }

    res.download(`./generated_files/${size}`)
})

app.listen(3003, () => {
    console.log("server running")
})
