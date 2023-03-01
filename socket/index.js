const config = require('config');
const { Server } = require("socket.io");

const io = new Server(config.get('socketServerPort'), {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
})

module.exports = io
