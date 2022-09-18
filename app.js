const express = require("express")
const utils = require("./utils/generate_file.js")
const bodyParser = require('body-parser');
const fs = require("fs")

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
    try {
        if(fs.existsSync(`./generated_files/${size}`)){
            return res.download(`./generated_files/${size}`)
        }
        return res.status(400).json({error: "file does not exist"})
    }
    catch(err) {
        return res.status(500).json({error: err.message})
    }
})

app.listen(3003, () => {
    console.log("server running")
})
