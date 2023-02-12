const { logger } = require('../logger')
const config = require('config')

function validateGenerateRoute({ size, file_name, socketId }) {
    if (!size) {
        logger("size not especified in request")
        return { error: true, message: "unspecified size", status: 400 }
    }

    if (!file_name) {
        logger("file name not especified in request")
        return { error: true, message: "unspecified file_name", status: 400 }
    }

    if (!socketId) {
        logger("socket id not especified in request")
        return { error: true, message: "unspecified socketId", status: 400 }
    }

    return { error: false, message: "file is being generated", status: 200 }
}

module.exports = { validateGenerateRoute }
