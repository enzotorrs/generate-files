const express = require('express')
const router = express.Router()

const { generate } = require('../controllers/generateController.js')

router.post("/", generate)

module.exports = router
