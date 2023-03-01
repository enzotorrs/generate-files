const express = require("express")
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');
const generateRouter = require('./routes/generateRouter')

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

app.use("/generate", generateRouter)

app.listen(config.get("serverPort"), () => {
    console.log(`server running in port: ${config.get("serverPort")}`)
})
